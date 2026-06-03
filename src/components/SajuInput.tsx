'use client';

import { useState } from 'react';
import { SajuInfo } from '@/types/tarot';

interface SajuInputProps {
  onSajuInfoChange: (sajuInfo: SajuInfo | null) => void;
}

const inputClass = 'arcana-input w-full px-3 py-2 rounded-lg text-sm outline-none';
const labelClass = 'block text-xs font-medium tracking-wider mb-1.5';

export default function SajuInput({ onSajuInfoChange }: SajuInputProps) {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [isLunar, setIsLunar] = useState(false);
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const notify = (
    y = year, mo = month, d = day,
    h = hour, mi = minute,
    lunar = isLunar, unknown = timeUnknown, g = gender
  ) => {
    if (y && mo && d) {
      onSajuInfoChange({
        year: parseInt(y), month: parseInt(mo), day: parseInt(d),
        hour: unknown ? -1 : (h ? parseInt(h) : 12),
        minute: unknown ? 0 : (mi ? parseInt(mi) : 0),
        isLunar: lunar, gender: g,
      });
    } else {
      onSajuInfoChange(null);
    }
  };

  const cap = (val: string, max: number, digits: number) => {
    let v = val.replace(/\D/g, '').slice(0, digits);
    if (v.length === digits && parseInt(v) > max) v = String(max).padStart(digits, '0');
    return v;
  };

  return (
    <div className="arcana-panel rounded-xl p-5 mb-5">
      <h3 className="text-sm font-medium tracking-widest mb-5" style={{ color: 'rgba(212,175,55,0.75)' }}>
        ✦ &nbsp; 생년월일시 입력
      </h3>

      <div className="space-y-4">
        {/* 년·월·일 */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '년도', ph: '1990', maxLen: 4, val: year, setter: setYear, max: 2100 },
            { label: '월', ph: '01', maxLen: 2, val: month, setter: setMonth, max: 12 },
            { label: '일', ph: '01', maxLen: 2, val: day, setter: setDay, max: 31 },
          ].map(({ label, ph, maxLen, val, setter, max }) => (
            <div key={label}>
              <label className={labelClass} style={{ color: 'rgba(196,181,253,0.55)' }}>{label}</label>
              <input
                type="text" inputMode="numeric" placeholder={ph} maxLength={maxLen}
                value={val}
                onChange={(e) => {
                  const v = cap(e.target.value, max, maxLen);
                  setter(v);
                  setTimeout(() => notify(), 0);
                }}
                className={inputClass}
              />
            </div>
          ))}
        </div>

        {/* 시간 모름 체크 */}
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div
            onClick={() => { const next = !timeUnknown; setTimeUnknown(next); if (next) { setHour(''); setMinute(''); } setTimeout(() => notify(year, month, day, '', '', isLunar, !timeUnknown, gender), 0); }}
            className="w-4 h-4 rounded flex items-center justify-center transition-all"
            style={{
              background: timeUnknown ? 'rgba(139,92,246,0.6)' : 'rgba(8,6,20,0.7)',
              border: `1px solid ${timeUnknown ? 'rgba(196,181,253,0.5)' : 'rgba(212,175,55,0.2)'}`,
            }}
          >
            {timeUnknown && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>}
          </div>
          <span className="text-xs" style={{ color: 'rgba(148,163,184,0.65)' }}>태어난 시간을 모르겠어요</span>
        </label>

        {/* 시·분 */}
        {!timeUnknown && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '시', ph: '14', maxLen: 2, val: hour, setter: setHour, max: 23 },
              { label: '분', ph: '30', maxLen: 2, val: minute, setter: setMinute, max: 59 },
            ].map(({ label, ph, maxLen, val, setter, max }) => (
              <div key={label}>
                <label className={labelClass} style={{ color: 'rgba(196,181,253,0.55)' }}>{label}</label>
                <input
                  type="text" inputMode="numeric" placeholder={ph} maxLength={maxLen}
                  value={val}
                  onChange={(e) => {
                    const v = cap(e.target.value, max, maxLen);
                    setter(v);
                    setTimeout(() => notify(), 0);
                  }}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        )}

        {/* 음력 */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <div
            onClick={() => { const next = !isLunar; setIsLunar(next); setTimeout(() => notify(year, month, day, hour, minute, next, timeUnknown, gender), 0); }}
            className="w-4 h-4 rounded flex items-center justify-center transition-all"
            style={{
              background: isLunar ? 'rgba(139,92,246,0.6)' : 'rgba(8,6,20,0.7)',
              border: `1px solid ${isLunar ? 'rgba(196,181,253,0.5)' : 'rgba(212,175,55,0.2)'}`,
            }}
          >
            {isLunar && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>}
          </div>
          <span className="text-xs" style={{ color: 'rgba(148,163,184,0.65)' }}>음력 생년월일</span>
        </label>

        {/* 성별 */}
        <div>
          <label className={labelClass} style={{ color: 'rgba(196,181,253,0.55)' }}>성별</label>
          <div className="flex gap-2">
            {(['male', 'female'] as const).map((g) => (
              <button
                key={g} type="button"
                onClick={() => { setGender(g); setTimeout(() => notify(year, month, day, hour, minute, isLunar, timeUnknown, g), 0); }}
                className="flex-1 py-2 rounded-lg text-sm transition-all duration-200"
                style={{
                  background: gender === g ? 'rgba(139,92,246,0.3)' : 'rgba(8,6,20,0.5)',
                  border: `1px solid ${gender === g ? 'rgba(196,181,253,0.45)' : 'rgba(212,175,55,0.15)'}`,
                  color: gender === g ? 'rgba(255,255,255,0.9)' : 'rgba(148,163,184,0.55)',
                  boxShadow: gender === g ? '0 0 12px rgba(139,92,246,0.2)' : 'none',
                }}
              >
                {g === 'male' ? '남성' : '여성'}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs leading-relaxed" style={{ color: 'rgba(148,163,184,0.35)' }}>
          년도 4자리 · 월/일 2자리로 입력해주세요 (예: 1990 · 01 · 15)
        </p>
      </div>
    </div>
  );
}
