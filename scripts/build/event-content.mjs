// Annual settings are deliberately separate from historical competition content.
export function eventValues(event) {
  const values = {};
  for (const field of ['competitionDate', 'fridayEventDate', 'registrationDeadline', 'selectionDate', 'paymentDeadline']) {
    const value = event[field];
    const date = new Date(`${value}T12:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== value) {
      throw new Error(`content/event.json: ${field} must be a valid YYYY-MM-DD date.`);
    }
    values[field] = date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'});
    values[`${field}WithWeekday`] = date.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'});
    const day = date.getUTCDate();
    const suffix = day >= 11 && day <= 13 ? 'th' : ({1: 'st', 2: 'nd', 3: 'rd'}[day % 10] ?? 'th');
    const month = date.toLocaleDateString('en-US', {month: 'long', timeZone: 'UTC'});
    values[`${field}Ordinal`] = `${month} ${day}${suffix}`;
    values[`${field}Year`] = date.getUTCFullYear();
  }
  values.year = event.competitionDate.slice(0, 4);
  if (typeof event.registrationOpen !== 'boolean') {
    throw new Error('content/event.json: registrationOpen must be true or false.');
  }
  for (const field of ['registrationUrl', 'paymentUrl']) {
    const url = event[field];
    const required = field === 'registrationUrl' && event.registrationOpen;
    if (url === '' && !required) {
      values[field] = '';
      continue;
    }
    const parsed = typeof url === 'string' ? URL.parse(url) : null;
    if (parsed?.protocol !== 'https:') {
      throw new Error(`content/event.json: ${field} must be a valid HTTPS URL${required ? '' : ' or blank'}.`);
    }
    values[field] = parsed.href;
  }
  values.registrationSummary = event.registrationOpen ? 'Registration is open!' : 'Registration is currently closed.';
  if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(event.contactEmail)) {
    throw new Error('content/event.json: contactEmail must be a valid email address.');
  }
  values.contactEmail = event.contactEmail;
  for (const field of ['teamFee', 'individualFee']) {
    if (!Number.isFinite(event[field]) || event[field] < 0) throw new Error(`content/event.json: ${field} must be a nonnegative number.`);
    values[field] = event[field].toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 2});
    values[`${field}WithoutTrailingZeros`] = event[field].toLocaleString('en-US', {style: 'currency', currency: 'USD', trailingZeroDisplay: 'stripIfInteger'});
  }
  return values;
}

export function renderEventContent(fragment, values) {
  return fragment.replace(/\{\{event\.([^}]+)\}\}/g, (_, key) => {
    if (!Object.hasOwn(values, key)) throw new Error(`Unknown event setting: {{event.${key}}}`);
    return String(values[key]).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#39;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  });
}
