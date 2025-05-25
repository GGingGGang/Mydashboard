import React from 'react';

export default function MemoWidget({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-full p-2 resize-none bg-yellow-100 rounded outline-none"
      placeholder="메모를 입력하세요..."
    />
  );
}
