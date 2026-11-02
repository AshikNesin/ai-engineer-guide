// Pure cost math for the LLM cost calculator (unit-tested with node --test).
// Prices are USD per 1M tokens, as in data/models.json.

export const DAYS_PER_MONTH = 30;
// Providers whose official pricing pages list a 50% Batch API discount.
export const BATCH_PROVIDERS = new Set(["openai", "anthropic", "google", "mistral"]);

/**
 * Cost of one request.
 * @param {object} price  {input, output, cache_read}
 * @param {object} req    {input, output, cachedShare (0..1), batch (bool), provider}
 * Cached input is billed at the cache read price (or the input price when the
 * model has none). Returns null when the batch discount isn't available.
 */
export function requestCost(price, { input, output, cachedShare = 0, batch = false, provider = "" }) {
  if (price.input == null || price.output == null) return null;
  if (batch && !BATCH_PROVIDERS.has(provider)) return null;
  const cached = input * cachedShare;
  const fresh = input - cached;
  const cacheRate = price.cache_read ?? price.input;
  let usd = (fresh * price.input + cached * cacheRate + output * price.output) / 1e6;
  if (batch) usd *= 0.5;
  return usd;
}

export function monthlyCost(perRequest, requestsPerDay, days = DAYS_PER_MONTH) {
  if (perRequest == null) return null;
  return perRequest * requestsPerDay * days;
}

/**
 * Prompt caching for a prefix of `prefix` tokens reused `reads` times after it
 * is written once. Returns costs in USD and the break-even number of reads.
 * writeRate defaults to the input price (providers with automatic caching
 * charge no write premium).
 */
export function cachingCost(price, { prefix, reads, writeMultiplier = null }) {
  const input = price.input;
  const read = price.cache_read ?? input;
  const write = writeMultiplier != null ? input * writeMultiplier : (price.cache_write ?? input);
  const without = ((reads + 1) * prefix * input) / 1e6;
  const withCache = (prefix * write + reads * prefix * read) / 1e6;
  const saving = input - read;
  const breakEven = saving > 0 ? Math.max(0, Math.ceil((write - input) / saving)) : null;
  return { without, withCache, savings: without - withCache, breakEven, write, read };
}
