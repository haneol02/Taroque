'use client';

import { useState, useEffect } from 'react';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

export default function ApiKeyInput({ onApiKeyChange }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isStored, setIsStored] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setIsStored(true);
      onApiKeyChange(storedKey);
    }
  }, [onApiKeyChange]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setIsStored(true);
      onApiKeyChange(apiKey.trim());
      alert('API 키가 저장되었습니다.');
    } else {
      alert('API 키를 입력해주세요.');
    }
  };

  const handleClear = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsStored(false);
    onApiKeyChange('');
    alert('API 키가 삭제되었습니다.');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setIsStored(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg shadow-lg mb-6 border border-purple-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        OpenAI API 키 설정
      </h3>

      <div className="space-y-4">
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={handleInputChange}
            placeholder="sk-..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showKey ? '🙈' : '👁️'}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!apiKey.trim() || isStored}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isStored ? '저장됨' : '저장'}
          </button>

          {isStored && (
            <button
              onClick={handleClear}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              삭제
            </button>
          )}
        </div>

        <div className="text-xs text-gray-600 space-y-1">
          <p>• API 키는 브라우저의 로컬 스토리지에 안전하게 저장됩니다</p>
          <p>• OpenAI API 키는 <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">여기서</a> 발급받을 수 있습니다</p>
          <p>• API 키는 외부로 전송되지 않으며, OpenAI API 호출에만 사용됩니다</p>
        </div>
      </div>
    </div>
  );
}