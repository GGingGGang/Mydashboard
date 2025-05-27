import React from 'react';

export default function MemoWidget({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="메모를 입력하세요..."
      className="w-full h-full p-2 resize-none overflow-auto bg-yellow-100 dark:bg-gray-600 dark:text-white rounded outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm"
    />
  );
}
