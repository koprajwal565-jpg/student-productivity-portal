export function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDate(dateString, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!dateString || Number.isNaN(new Date(`${dateString}T00:00:00`).getTime())) return '—';
  return new Date(`${dateString}T00:00:00`).toLocaleDateString(undefined, options);
}

export function startOfWeek(date = new Date()) {
  const start = new Date(date);
  const day = start.getDay();
  start.setDate(start.getDate() - ((day + 6) % 7));
  start.setHours(0, 0, 0, 0);
  return start;
}

export function isValidDateString(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(`${value}T00:00:00`).getTime()) &&
    localDateString(new Date(`${value}T00:00:00`)) === value;
}
