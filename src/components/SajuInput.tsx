'use client';

import { useState } from 'react';
import { SajuInfo } from '@/types/tarot';

interface SajuInputProps {
  onSajuInfoChange: (sajuInfo: SajuInfo | null) => void;
}

export default function SajuInput({ onSajuInfoChange }: SajuInputProps) {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [isLunar, setIsLunar] = useState(false);
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleChange = () => {
    // 시간을 모르는 경우 기본값(12시 0분) 사용
    if (year && month && day) {
      const sajuInfo: SajuInfo = {
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        hour: timeUnknown ? 12 : (hour ? parseInt(hour) : 12),
        minute: timeUnknown ? 0 : (minute ? parseInt(minute) : 0),
        isLunar,
        gender
      };
      onSajuInfoChange(sajuInfo);
    } else {
      onSajuInfoChange(null);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setYear(value);
    setTimeout(handleChange, 0);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2);
    const numValue = parseInt(value);
    if (numValue > 12) value = '12';
    if (numValue < 1 && value.length === 2) value = '01';
    setMonth(value);
    setTimeout(handleChange, 0);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2);
    const numValue = parseInt(value);
    if (numValue > 31) value = '31';
    if (numValue < 1 && value.length === 2) value = '01';
    setDay(value);
    setTimeout(handleChange, 0);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2);
    const numValue = parseInt(value);
    if (numValue > 23) value = '23';
    setHour(value);
    setTimeout(handleChange, 0);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2);
    const numValue = parseInt(value);
    if (numValue > 59) value = '59';
    setMinute(value);
    setTimeout(handleChange, 0);
  };

  const handleLunarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLunar(e.target.checked);
    setTimeout(handleChange, 0);
  };

  const handleTimeUnknownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setTimeUnknown(checked);
    if (checked) {
      setHour('');
      setMinute('');
    }
    setTimeout(handleChange, 0);
  };

  const handleGenderChange = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender);
    setTimeout(handleChange, 0);
  };

  return (
    <div className="glass rounded-lg p-6 mb-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">
        생년월일시 입력
      </h3>

      <div className="space-y-4">
        {/* 생년월일 */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-300 mb-2">년도</label>
            <input
              type="text"
              inputMode="numeric"
              value={year}
              onChange={handleYearChange}
              placeholder="1990"
              maxLength={4}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm text-white placeholder-gray-400 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">월</label>
            <input
              type="text"
              inputMode="numeric"
              value={month}
              onChange={handleMonthChange}
              placeholder="01"
              maxLength={2}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm text-white placeholder-gray-400 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">일</label>
            <input
              type="text"
              inputMode="numeric"
              value={day}
              onChange={handleDayChange}
              placeholder="01"
              maxLength={2}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm text-white placeholder-gray-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* 시간을 모르겠어요 체크박스 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="timeUnknown"
            checked={timeUnknown}
            onChange={handleTimeUnknownChange}
            className="w-4 h-4 text-purple-600 bg-white/5 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
          />
          <label htmlFor="timeUnknown" className="ml-2 text-sm text-gray-300">
            태어난 시간을 모르겠어요
          </label>
        </div>

        {/* 시간 */}
        {!timeUnknown && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-2">시</label>
              <input
                type="text"
                inputMode="numeric"
                value={hour}
                onChange={handleHourChange}
                placeholder="14"
                maxLength={2}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm text-white placeholder-gray-400 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">분</label>
              <input
                type="text"
                inputMode="numeric"
                value={minute}
                onChange={handleMinuteChange}
                placeholder="30"
                maxLength={2}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm text-white placeholder-gray-400 transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* 음력/양력 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isLunar"
            checked={isLunar}
            onChange={handleLunarChange}
            className="w-4 h-4 text-purple-600 bg-white/5 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
          />
          <label htmlFor="isLunar" className="ml-2 text-sm text-gray-300">
            음력
          </label>
        </div>

        {/* 성별 */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">성별</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleGenderChange('male')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                gender === 'male'
                  ? 'glass-lavender text-white'
                  : 'bg-white/5 border border-white/20 text-gray-400 hover:bg-white/10'
              }`}
            >
              남성
            </button>
            <button
              type="button"
              onClick={() => handleGenderChange('female')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                gender === 'female'
                  ? 'glass-lavender text-white'
                  : 'bg-white/5 border border-white/20 text-gray-400 hover:bg-white/10'
              }`}
            >
              여성
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <p>• 년도는 4자리, 월/일은 2자리 숫자로 입력해주세요 (예: 1990년 01월 15일)</p>
          <p>• 태어난 시간을 모르시는 경우 체크박스를 선택하시면 정오(12시)를 기준으로 분석합니다</p>
          <p>• 음력 생일인 경우 &apos;음력&apos; 체크박스를 선택해주세요</p>
        </div>
      </div>
    </div>
  );
}
