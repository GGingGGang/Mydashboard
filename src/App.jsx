// App.jsx
import { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import {saveWidgets, loadWidgets, exportWidgets, importWidgets} from './utils/storage';
import MemoWidget from './components/MemoWidget';
import ApiWidget from './components/ApiWidget';
import TimerWidget from './components/TimerWidget';
import TextWidget from './components/TextWidget';
import LineWidget from './components/LineWidget'

export default function App() {
  const [widgets, setWidgets] = useState(loadWidgets());
  const [resizable, setResizable] = useState(true);
  const [draggable, setDraggable] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [deletable, setDeletable] = useState(true);

  { /* 위젯 관련 */}
  const addWidget = (type = {}, props = {}) => {
    const width = 
      type === 'line' ? 10 :
      280;
    const height =
      type === 'timer' ? 170 :
      type === 'api' ? 335 :
      type === 'line' ? 400 :
      200;
    // 초기 좌표
    let x = 20;
    let y = 20;

    // 충돌 체크 함수
    const isOverlapping = (x, y) => {
      return widgets.some(w => {
        const r1 = { x, y, w: width, h: height };
        const r2 = { x: w.x, y: w.y, w: w.width, h: w.height };

        return !(
          r1.x + r1.w < r2.x || // 왼쪽
          r1.x > r2.x + r2.w || // 오른쪽
          r1.y + r1.h < r2.y || // 위
          r1.y > r2.y + r2.h    // 아래
        );
      });
    };

    // // 충돌하지 않을 때까지 위치 이동 (간격 20px씩 아래로)
    // while (isOverlapping(x, y)) {
    //   y += 2;
    //   if (y > 1000) {
    //     x += 20;
    //     y = 20;
    //   }
    // }


  let found = false;
  let finalX = 0, finalY = 0;

  for (let y = 0; y <= window.innerHeight; y += 2) {
    for (let x = 0; x <= window.innerWidth; x += 2) {
      if (!isOverlapping(x, y)) {
        finalX = x;
        finalY = y;
        found = true;
        break;
      }
    }
    if (found) break;
  }

  const newWidget = {
    id: Date.now().toString(),
    type,
    x : finalX,
    y : finalY,
    width,
    height,
    props,
  };
    const updated = [...widgets, newWidget];
    setWidgets(updated);
    saveWidgets(updated);
  };
  const updateWidget = (id, newProps) => {
    const updated = widgets.map(widget =>
      widget.id === id ? { ...widget, ...newProps } : widget
    );
    setWidgets(updated);
    saveWidgets(updated);
  };
  const updateWidgetProps = (id, props) => {
    const updated = widgets.map(widget =>
      widget.id === id ? { ...widget, props } : widget
    );
    setWidgets(updated);
    saveWidgets(updated);
  };
  const deleteWidget = (id) => {
    const updated = widgets.filter(widget => widget.id !== id);
    setWidgets(updated);
    saveWidgets(updated);
  };
  const duplicateWidget = (id) => {
    const original = widgets.find(w => w.id === id);
    if (!original) return;
    const newWidget = {
      ...original,
      id: Date.now().toString(),
      x: original.x + 30,
      y: original.y + 30,
    };
    const updated = [...widgets, newWidget];
    setWidgets(updated);
    saveWidgets(updated);
  };

  useEffect(() => {
  const html = document.documentElement;
  if (darkMode) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <header className="p-4 text-sm font-bold border-b border-black/20 dark:border-white/40 bg-white dark:bg-gray-800 shadow space-y-3">
        {/* 1줄: 로고 + 기능 버튼 */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-black dark:text-white font-bold text-xl">
            🧩 MyDashBoard
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const blob = new Blob([exportWidgets()], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'mydashboard_widgets_backup.json';
                link.click();
              }}
              className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-3 py-1 rounded"
            >
              💾 백업
            </button>

            <label className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-3 py-1 rounded cursor-pointer">
              📂 불러오기
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const json = event.target.result;
                    const widgets = importWidgets(json);
                    if (widgets) setWidgets(widgets);
                  };
                  reader.readAsText(file);
                }}
              />
            </label>

            <button
              onClick={toggleDarkMode}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? '☀️ 라이트 모드' : '🌙 다크 모드'}
            </button>
          </div>
        </div>

        {/* 2줄: Add 버튼들 왼쪽 + 옵션 오른쪽 */}
        <div className="flex justify-between flex-wrap items-center gap-3">
          {/* 왼쪽 Add 버튼 */}
          <div className="flex gap-2 text-base font-normal">
            <button
              onClick={() => addWidget('memo', { content: '' })}
              className="bg-yellow-400 text-black px-3 py-1 rounded"
            >
              +Memo
            </button>
            <button
              onClick={() => addWidget('api', { url: '', headers: '', body: '', method: 'GET', result: '' })}
              className="bg-blue-500 text-black px-3 py-1 rounded"
            >
              +API
            </button>
            <button
              onClick={() => addWidget('timer')}
              className="bg-green-500 text-black px-3 py-1 rounded"
            >
              +Timer
            </button>
            <button
              onClick={() => addWidget('text', { content: '텍스트를 입력하세요' })}
              className="bg-purple-500 text-black px-3 py-1 rounded"
            >
              +Text
            </button>
            <button
              onClick={() => addWidget('line', { width: 200, height: 100 })}
              className="bg-pink-500 text-black px-3 py-1 rounded">+Line</button>

          </div>

          {/* 오른쪽 옵션 토글 */}
          <div className="flex items-center gap-4 text-sm text-black dark:text-white">
            <label className="flex items-center gap-1">
              🗑️ Deletable
              <input
                type="checkbox"
                checked={deletable}
                onChange={(e) => setDeletable(e.target.checked)}
              />
            </label>
            <label className="flex items-center gap-1">
              🔧 Resizable
              <input
                type="checkbox"
                checked={resizable}
                onChange={(e) => setResizable(e.target.checked)}
              />
            </label>
            <label className="flex items-center gap-1">
              🎯 Draggable
              <input
                type="checkbox"
                checked={draggable}
                onChange={(e) => setDraggable(e.target.checked)}
              />
            </label>
          </div>
        </div>
      </header>

      <main className="w-full h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 transition-colors duration-300 overflow-auto p-4 relative" id="canvas">
        {widgets.map(widget => (
          <Rnd
            key={widget.id}
            default={{
              x: widget.x,
              y: widget.y,
              width: widget.width,
              height: widget.height,
            }}
            bounds="parent"
            enableResizing={resizable}
            disableDragging={!draggable}
            onDragStop={(e, d) => {
              updateWidget(widget.id, { x: d.x, y: d.y });
            }}
            onResizeStop={(e, dir, ref, delta, position) => {
              updateWidget(widget.id, {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                ...position,
              });
            }}
            className={
              widget.type === 'text'
                ? `bg-transparent ${
                          resizable ? 'border border-black dark:border-white' : 'border-none'
                        } text-black dark:text-white shadow-none`
               : 'bg-yellow-200 dark:bg-gray-700 dark:text-white shadow rounded'
            }
          >


            <div className="relative w-full h-full">
              <div className="absolute top-1 right-1 flex gap-1 z-10">
                {/* <button
                  onClick={() => duplicateWidget(widget.id)}
                  className="text-xs px-1 bg-green-300 hover:bg-green-400 rounded"
                >
                  🧬
                </button> */}
                {deletable && (
                  <button
                    onClick={() => deleteWidget(widget.id)}
                    className="text-xs px-1 bg-red-300 hover:bg-red-400 rounded"
                  >
                    ❌
                  </button>
                )}
              </div>
              <div className="w-full h-full p-2 overflow-hidden">
                {widget.type === 'memo' && (
                  <MemoWidget
                    value={widget.props.content}
                    onChange={(content) =>
                      updateWidgetProps(widget.id, {
                        ...widget.props,
                        content,
                      })
                    }
                  />
                )}

                {widget.type === 'api' && (
                  <ApiWidget
                    props={widget.props}
                    onChange={(newProps) =>
                      updateWidgetProps(widget.id, newProps)
                    }
                  />
                )}
                {widget.type === 'text' && (
                  <TextWidget
                    value={widget.props.content}
                    onChange={(newContent) =>
                      updateWidgetProps(widget.id, {
                        ...widget.props,
                        content: newContent,
                      })
                    }
                  />
                )}
                {widget.type === 'timer' && <TimerWidget />}
                
              </div>
              {widget.type === 'line' && (
                  <LineWidget
                 />
                )}
            </div>
          </Rnd>
        ))}
      </main>
    </div>
  );
}
