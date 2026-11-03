// Build a one-event iCalendar file (RFC 5545) for "Add to calendar".
// Uses the same UID and SEQUENCE as the subscription feed, so importing both
// doesn't create a duplicate event.
export function escapeText(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export function fold(line) {
  // Fold at 75 octets; continuation lines start with a space.
  const bytes = new TextEncoder();
  const out = [];
  let cur = "";
  let limit = 75;
  for (const ch of line) {
    if (bytes.encode(cur + ch).length > limit) {
      out.push(cur);
      cur = ch;
      limit = 74;
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.join("\r\n ");
}

const compact = (iso) => iso.replace(/-/g, "");

function nextDay(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + 1));
  return t.toISOString().slice(0, 10);
}

export function singleEventIcs({ uid, sequence = 0, date, title, description, url, now = new Date() }) {
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const alarm = (days) => [
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(`${title} in ${days} days`)}`,
    `TRIGGER:-P${days}D`,
    "END:VALARM",
  ];
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AIEngineerGuide//Model Retirements//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `SEQUENCE:${sequence}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(date)}`,
    `DTEND;VALUE=DATE:${compact(nextDay(date))}`,
    `SUMMARY:${escapeText(title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `URL:${url}`,
    "TRANSP:TRANSPARENT",
    ...alarm(30),
    ...alarm(7),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
