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
    <div className="glass rounded-lg p-6 mb-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-3">
        OpenAI API 키 설정
      </h3>

      <div className="space-y-4">
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={handleInputChange}
            placeholder="sk-..."
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm text-white placeholder-gray-400 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            {showKey ? '🙈' : '👁️'}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!apiKey.trim() || isStored}
            className="flex-1 glass-lavender text-white py-2 px-4 rounded-lg hover:bg-purple-600/30 disabled:bg-gray-700/50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none"
          >
            {isStored ? '저장됨' : '저장'}
          </button>

          {isStored && (
            <button
              onClick={handleClear}
              className="bg-red-500/20 border border-red-500/30 text-red-300 py-2 px-4 rounded-lg hover:bg-red-500/30 hover:text-red-200 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              삭제
            </button>
          )}
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <p>• API 키는 브라우저의 로컬 스토리지에 안전하게 저장됩니다</p>
          <p>• OpenAI API 키는 <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors duration-200">여기서</a> 발급받을 수 있습니다</p>
          <p>• API 키는 외부로 전송되지 않으며, OpenAI API 호출에만 사용됩니다</p>
        </div>
      </div>
    </div>
  );
}