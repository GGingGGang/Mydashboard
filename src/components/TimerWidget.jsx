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
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '12px',
      padding: '16px',
      width: '220px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h3>⏱ 타이머</h3>
      <div style={{ fontSize: '24px', marginBottom: '12px' }}>{formatTime(seconds)}</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setRunning(!running)}>
          {running ? '⏸ 일시정지' : '▶️ 시작'}
        </button>
        <button onClick={() => { setSeconds(0); setRunning(false); }}>
          🔁 리셋
        </button>
      </div>
    </div>
  );
}
