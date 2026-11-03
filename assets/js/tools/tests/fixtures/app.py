import anthropic, openai

client = anthropic.Anthropic()
DEFAULT_MODEL = "claude-sonnet-4-5"  # alias of claude-sonnet-4-5-20250929
FAST = "claude-haiku-4-5-20251001"     # active: not on the calendar

def summarize(text):
    return client.messages.create(model=DEFAULT_MODEL, max_tokens=512,
                                  messages=[{"role": "user", "content": text}])

def classify(text):
    return openai.OpenAI().chat.completions.create(model="o3", messages=[{"role": "user", "content": text}])

BEDROCK = "anthropic.claude-3-5-sonnet-20240620-v1:0"
