import React, { useState } from 'react';

export default function ApiWidget({ props, onChange }) {
  const [localProps, setLocalProps] = useState({
    ...props,
    env: props.env || [
      { key: 'API_KEY', value: 'wFWascascN' },
      { key: 'SERVER', value: 'pray' },
    ]
  });
  const [editing, setEditing] = useState(true);

  const handleChange = (key, value) => {
    const updated = { ...localProps, [key]: value };
    setLocalProps(updated);
    onChange(updated);
  };

  const replaceEnvInUrl = (url) => {
    let result = url;
    for (const pair of localProps.env) {
      result = result.replaceAll(`{${pair.key}}`, pair.value);
    }
    return result;
  };

  const sendRequest = async () => {
    try {
      const finalUrl = replaceEnvInUrl(localProps.url);
      const res = await fetch(finalUrl, {
        method: 'GET',
        headers: localProps.headers ? JSON.parse(localProps.headers) : {}
      });
      const text = await res.text();
      handleChange('result', text);
    } catch (e) {
      handleChange('result', '요청 실패: ' + e.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(localProps.result || '')
      .then(() => alert('복사 완료!'))
      .catch(() => alert('복사 실패'));
  };

  const updateEnv = (index, key, value) => {
    const updatedEnv = [...localProps.env];
    updatedEnv[index] = { ...updatedEnv[index], [key]: value };
    handleChange('env', updatedEnv);
  };

  const addEnv = () => {
    const updatedEnv = [...localProps.env, { key: '', value: '' }];
    handleChange('env', updatedEnv);
  };

  const deleteEnv = (index) => {
    const updatedEnv = localProps.env.filter((_, i) => i !== index);
    handleChange('env', updatedEnv);
  };

  return (
    <div className={`flex flex-col text-sm w-full transition-all duration-300 ${editing ? 'min-h-[400px]' : 'h-fit'}`}>
      <input
        className="border p-1 mb-1 rounded"
        placeholder="Request URL"
        value={localProps.url}
        onChange={e => handleChange('url', e.target.value)}
        disabled={!editing}
      />
      {editing && (
        <textarea
        className="border p-1 mb-1 rounded resize-none overflow-hidden"
        placeholder="Headers (JSON)"
        value={localProps.headers}
        onChange={e => handleChange('headers', e.target.value)}
        onInput={e => {
            const lineHeight = 20; // 줄당 픽셀 높이
            const minRows = 3;
            e.target.style.height = 'auto';
            e.target.style.height = Math.max(e.target.scrollHeight, lineHeight * minRows) + 'px';
        }}
        style={{ lineHeight: '20px', minHeight: '60px' }} // 최소 3줄 높이
        />
      )}
      <button
        onClick={sendRequest}
        className="bg-blue-500 text-white rounded p-1 hover:bg-blue-600"
      >
        요청 보내기
      </button>
      <div className="mt-1 bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap break-words max-w-full max-h-60 overflow-auto">
        {localProps.result}
      </div>
      <button
        onClick={copyToClipboard}
        className="mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded hover:bg-black"
      >
        📋 복사하기
      </button>

      {editing && (
        <>
          <table className="mt-2 text-xs border border-gray-300 rounded w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1 text-left">Key</th>
                <th className="border px-2 py-1 text-left">Value</th>
                <th className="border px-2 py-1 text-left">삭제</th>
              </tr>
            </thead>
            <tbody>
              {localProps.env.map((env, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">
                    <input
                      value={env.key}
                      onChange={(e) => updateEnv(index, 'key', e.target.value)}
                      className="w-full border px-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={env.value}
                      onChange={(e) => updateEnv(index, 'value', e.target.value)}
                      className="w-full border px-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => deleteEnv(index)}
                      className="text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addEnv}
            className="mt-1 text-xs text-blue-500 hover:underline self-start"
          >
            + 환경변수 추가
          </button>
        </>
      )}

      <button
        onClick={() => setEditing(!editing)}
        className="mt-2 bg-gray-300 text-black text-xs px-2 py-1 rounded hover:bg-gray-400 self-end"
      >
        {editing ? '✅ 완료' : '✏️ 수정'}
      </button>
    </div>
  );
}
