'use client';

import { useState, useEffect } from 'react';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  onModelChange?: (model: string) => void;
}

export default function ApiKeyInput({ onApiKeyChange, onValidationChange, onModelChange }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isStored, setIsStored] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    const storedVerified = localStorage.getItem('openai_api_key_verified');
    const storedModel = localStorage.getItem('openai_model');

    if (storedModel) {
      setSelectedModel(storedModel);
      if (onModelChange) {
        onModelChange(storedModel);
      }
    } else {
      if (onModelChange) {
        onModelChange('gpt-4o-mini');
      }
    }

    if (storedKey) {
      setApiKey(storedKey);
      setIsStored(true);
      setIsVerified(storedVerified === 'true');
      // 인증된 상태면 접힌 상태로, 인증 안됐으면 펼친 상태로
      setIsExpanded(storedVerified !== 'true');
      onApiKeyChange(storedKey);
      if (onValidationChange) {
        onValidationChange(storedVerified === 'true');
      }
    } else {
      // API 키가 없으면 펼친 상태로
      setIsExpanded(true);
    }
  }, [onApiKeyChange, onValidationChange, onModelChange]);

  const verifyApiKey = async (keyToVerify: string): Promise<boolean> => {
    setIsVerifying(true);
    setVerificationError('');

    try {
      const response = await fetch('/api/verify-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: keyToVerify }),
      });

      const result = await response.json();

      if (result.valid) {
        setIsVerified(true);
        localStorage.setItem('openai_api_key_verified', 'true');
        if (onValidationChange) {
          onValidationChange(true);
        }
        return true;
      } else {
        setIsVerified(false);
        setVerificationError(result.error || 'API 키 검증에 실패했습니다.');
        localStorage.setItem('openai_api_key_verified', 'false');
        if (onValidationChange) {
          onValidationChange(false);
        }
        return false;
      }
    } catch (error) {
      setIsVerified(false);
      setVerificationError('API 키 검증 중 오류가 발생했습니다.');
      localStorage.setItem('openai_api_key_verified', 'false');
      if (onValidationChange) {
        onValidationChange(false);
      }
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      alert('API 키를 입력해주세요.');
      return;
    }

    const isValid = await verifyApiKey(apiKey.trim());

    if (isValid) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setIsStored(true);
      onApiKeyChange(apiKey.trim());
      alert('API 키가 인증되고 저장되었습니다.');
    } else {
      alert('유효하지 않은 API 키입니다. 다시 확인해주세요.');
    }
  };

  const handleClear = () => {
    localStorage.removeItem('openai_api_key');
    localStorage.removeItem('openai_api_key_verified');
    setApiKey('');
    setIsStored(false);
    setIsVerified(false);
    setVerificationError('');
    onApiKeyChange('');
    if (onValidationChange) {
      onValidationChange(false);
    }
    alert('API 키가 삭제되었습니다.');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setIsStored(false);
    setIsVerified(false);
    setVerificationError('');
    if (onValidationChange) {
      onValidationChange(false);
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = e.target.value;
    setSelectedModel(model);
    localStorage.setItem('openai_model', model);
    if (onModelChange) {
      onModelChange(model);
    }
  };

  const models = [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (빠르고 저렴)', description: '가성비 최고' },
    { value: 'gpt-4o', label: 'GPT-4o (균형)', description: '속도와 품질의 균형' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (고품질)', description: '더 깊이 있는 해석' },
    { value: 'gpt-4', label: 'GPT-4 (최고품질)', description: '가장 정확한 해석' }
  ];

  return (
    <div className="glass rounded-lg mb-6 border border-white/10">
      {/* 헤더 - 항상 표시 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">
            OpenAI API 키 설정
          </h3>
          {isVerified && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              인증됨
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {/* 펼쳐진 내용 */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-white/10 pt-4">
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

        {/* GPT 모델 선택 */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">AI 모델 선택</label>
          <select
            value={selectedModel}
            onChange={handleModelChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm text-white transition-all duration-200"
          >
            {models.map((model) => (
              <option key={model.value} value={model.value} className="bg-slate-800">
                {model.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            {models.find(m => m.value === selectedModel)?.description}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!apiKey.trim() || isVerifying || (isStored && isVerified)}
            className="flex-1 glass-lavender text-white py-2 px-4 rounded-lg hover:bg-purple-600/30 disabled:bg-gray-700/50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none"
          >
            {isVerifying ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                검증 중...
              </div>
            ) : (isStored && isVerified) ? '인증 완료' : '저장 및 인증'}
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

        {isVerified && (
          <div className="text-sm text-green-400 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            API 키가 인증되었습니다
          </div>
        )}

        {verificationError && (
          <div className="text-sm text-red-400 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            {verificationError}
          </div>
        )}

          <div className="text-xs text-gray-400 space-y-1">
            <p>• API 키는 브라우저의 로컬 스토리지에 안전하게 저장됩니다</p>
            <p>• OpenAI API 키는 <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors duration-200">여기서</a> 발급받을 수 있습니다</p>
            <p>• API 키는 외부로 전송되지 않으며, OpenAI API 호출에만 사용됩니다</p>
          </div>
        </div>
      )}
    </div>
  );
}