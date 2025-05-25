const STORAGE_KEY = 'mydashboard_widgets';

export function saveWidgets(widgets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
}

export function loadWidgets() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load widgets:', err);
    return [];
  }
}