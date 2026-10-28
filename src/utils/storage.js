export const STORAGE_KEYS = {
  tasks: 'studyspace.tasks.v1',
  sessions: 'studyspace.sessions.v1',
  settings: 'studyspace.settings.v1',
};

const isTasks = (value) =>
  Array.isArray(value) &&
  value.every((task) =>
    task !== null &&
    typeof task === 'object' &&
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.subject === 'string' &&
    typeof task.dueDate === 'string' &&
    ['Low', 'Medium', 'High'].includes(task.priority) &&
    ['Pending', 'In Progress', 'Completed'].includes(task.status));
const isSessions = (value) =>
  Array.isArray(value) &&
  value.every((session) =>
    session !== null &&
    typeof session === 'object' &&
    typeof session.id === 'string' &&
    typeof session.subject === 'string' &&
    typeof session.date === 'string' &&
    typeof session.startTime === 'string' &&
    Number.isInteger(session.duration) &&
    typeof session.completed === 'boolean');
const isSettings = (value) =>
  value !== null &&
  typeof value === 'object' &&
  typeof value.name === 'string' &&
  (value.theme === 'light' || value.theme === 'dark');

export function readStoredValue(key, fallback, isValid) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return { value: fallback, corrupted: false };
    const value = JSON.parse(raw);
    if (!isValid(value)) return { value: fallback, corrupted: true };
    return { value, corrupted: false };
  } catch {
    return { value: fallback, corrupted: true };
  }
}

export function loadPortalData() {
  const tasks = readStoredValue(STORAGE_KEYS.tasks, [], isTasks);
  const sessions = readStoredValue(STORAGE_KEYS.sessions, [], isSessions);
  const settings = readStoredValue(
    STORAGE_KEYS.settings,
    { name: '', theme: 'light' },
    isSettings,
  );

  return {
    tasks: tasks.value,
    sessions: sessions.value,
    settings: settings.value,
    hadCorruptData: tasks.corrupted || sessions.corrupted || settings.corrupted,
  };
}

export function saveStoredValue(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function clearPortalData() {
  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
}
