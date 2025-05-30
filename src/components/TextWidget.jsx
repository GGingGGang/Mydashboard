import React, { useState } from 'react';

export default function TextWidget({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  const handleSave = () => {
    onChange(temp);
    setEditing(false);
  };

  return (
    <div className="w-full h-full p-1 text-sm text-black dark:text-white bg-transparent flex items-center justify-center">
      {editing ? (
        <textarea
          autoFocus
          className="w-full h-full bg-transparent outline-none resize-none text-center"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          onBlur={handleSave}
        />
      ) : (
        <div
          onDoubleClick={() => setEditing(true)}
          className="w-full h-full whitespace-pre-wrap break-words cursor-text text-center flex items-center justify-center"
        >
          {value}
        </div>
      )}
    </div>
  );
}
