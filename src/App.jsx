// App.jsx
import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { saveWidgets, loadWidgets } from './utils/storage';
import MemoWidget from './components/MemoWidget';
import ApiWidget from './components/ApiWidget';

export default function App() {
  const [widgets, setWidgets] = useState(loadWidgets());

  const addWidget = (type = 'memo', props = {}) => {
    const newWidget = {
      id: Date.now().toString(),
      type,
      x: 20,
      y: 20,
      width: 200,
      height: 150,
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

  return (
    <div className="w-screen h-screen bg-gray-100">
      <header className="p-4 text-xl font-bold border-b bg-white shadow flex justify-between">
        🧩 mydashboard.io
        <button
          onClick={() => addWidget('memo', { content: '' })}
          className="bg-yellow-400 px-3 py-1 rounded"
        >
          + Add Memo
        </button>
        <button
          onClick={() => addWidget('api', { url: '', headers: '', body: '', method: 'GET', result: '' })}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Add API
        </button>
        <button
          onClick={() => setShowApiModal(true)} // 모달을 열기 위한 state 설정 필요
          className="bg-purple-500 text-white px-3 py-1 rounded"
        >
          Req API
        </button>
      </header>

      <main className="w-full h-[calc(100vh-4rem)] bg-white overflow-hidden p-4 relative" id="canvas">
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
            className="bg-yellow-200 shadow rounded"
          >
            <div className="relative w-full h-full">
              <div className="absolute top-1 right-1 flex gap-1 z-10">
                <button
                  onClick={() => duplicateWidget(widget.id)}
                  className="text-xs px-1 bg-green-300 hover:bg-green-400 rounded"
                >
                  🧬
                </button>
                <button
                  onClick={() => deleteWidget(widget.id)}
                  className="text-xs px-1 bg-red-300 hover:bg-red-400 rounded"
                >
                  ❌
                </button>
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
              </div>
            </div>
          </Rnd>
        ))}
      </main>
    </div>
  );
}
