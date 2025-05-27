const STORAGE_KEY = 'mydashboard_widgets';

export function saveWidgets(widgets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
}

export function loadWidgets() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function exportWidgets() {
  return localStorage.getItem(STORAGE_KEY) || '[]';
}

export function importWidgets(json) {
  try {
    const widgets = JSON.parse(json);
    saveWidgets(widgets);
    return widgets;
  } catch (e) {
    alert('불러오기 실패: JSON 형식이 올바르지 않습니다.');
    return null;
  }
}