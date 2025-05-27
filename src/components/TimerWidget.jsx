import { useEffect, useState, useRef } from 'react';

export default function TimerWidget() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [running]);

  const formatTime = (totalSeconds) => {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-yellow-200 dark:bg-gray-700 text-black dark:text-white p-4 rounded-lg transition-colors duration-300">
      
      {/* 타이머 숫자 */}
      <div className="text-center text-5xl font-extrabold mt-4 mb-6 tracking-wide">
        {formatTime(seconds)}
      </div>

      {/* 버튼들 */}
      <div className="flex justify-between gap-2">
        <button
          onClick={() => setRunning(!running)}
          className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-gray-600 dark:text-white text-black rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-500"
        >
          {running ? '일시정지' : '시작'}
        </button>
        <button
          onClick={() => {
            setSeconds(0);
            setRunning(false);
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-gray-600 dark:text-white text-black rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-500"
        >
          리셋
        </button>
      </div>
    </div>
  );
}
