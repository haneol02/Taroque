'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { TaroCard } from '@/types/tarot';

interface CardDeckProps {
  shuffledIndices: number[];
  cards: TaroCard[];
  requiredCount: number;
  positions: string[];
  onProceed: (selections: Array<{ cardIndex: number; isReversed: boolean }>) => void;
  isProceedLoading?: boolean;
}

interface Selection {
  cardIndex: number;
  isReversed: boolean;
}

// 데스크톱 팬 파라미터
const CARD_W = 72;
const CARD_H = 120;
const FAN_X_SPAN = 1020;
const FAN_SAG = 48;
const FAN_CONTAINER_H = 260;

function getCardFanStyle(index: number, total: number) {
  const t = index / (total - 1);
  const x = (t - 0.5) * FAN_X_SPAN;
  const yUp = Math.sin(t * Math.PI) * FAN_SAG;
  const rotation = (t - 0.5) * -26;
  return {
    left: `calc(50% + ${x}px - ${CARD_W / 2}px)`,
    top: `${FAN_CONTAINER_H - CARD_H - 6 - yUp}px`,
    transform: `rotate(${rotation}deg)`,
    zIndex: Math.round(100 - Math.abs(t - 0.5) * 80),
  } as React.CSSProperties;
}

export default function CardDeck({
  shuffledIndices,
  cards,
  requiredCount,
  positions,
  onProceed,
  isProceedLoading = false,
}: CardDeckProps) {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [pickingIndex, setPickingIndex] = useState<number | null>(null);
  const [landingSlot, setLandingSlot] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const proceedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleCardClick = (cardIndex: number) => {
    if (isSelected(cardIndex) || selections.length >= requiredCount) return;
    const isReversed = Math.random() > 0.6;
    const slotIndex = selections.length;

    setPickingIndex(cardIndex);
    setTimeout(() => {
      setPickingIndex(null);
      setLandingSlot(slotIndex);
      setSelections(prev => [...prev, { cardIndex, isReversed }]);
      setTimeout(() => setLandingSlot(null), 500);
    }, 200);
  };

  const isSelected = (idx: number) => selections.some(s => s.cardIndex === idx);
  const isDimmed = (idx: number) => selections.length >= requiredCount && !isSelected(idx);

  useEffect(() => {
    if (selections.length === requiredCount) {
      setTimeout(() => {
        proceedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
  }, [selections.length, requiredCount]);

  return (
    <div className="w-full flex flex-col items-center gap-5">

      {/* ── 선택 슬롯 ── */}
      <div className="flex justify-center gap-3 md:gap-5 flex-wrap px-4">
        {positions.map((pos, i) => {
          const sel = selections[i];
          const actualCard = sel != null ? cards[sel.cardIndex] : null;
          const isLanding = landingSlot === i;

          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-medium tracking-wide" style={{ color: 'rgba(212,175,55,0.75)' }}>
                {pos}
              </span>
              <div
                style={{ width: `${CARD_W + 6}px`, height: `${CARD_H + 6}px` }}
                className={`relative rounded-xl transition-all duration-300 ${actualCard ? 'shadow-lg' : 'slot-empty'}`}
              >
                {actualCard ? (
                  <div
                    className={`w-full h-full rounded-xl overflow-hidden border-2 ${isLanding ? 'card-land' : ''}`}
                    style={{ borderColor: 'rgba(212,175,55,0.55)' }}
                  >
                    <div className={`w-full h-full relative ${sel!.isReversed ? 'rotate-180' : ''}`}>
                      <Image src={actualCard.imageUrl} alt={actualCard.name} fill sizes="78px" className="object-contain" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center rounded-xl"
                    style={{ background: 'rgba(139,92,246,0.05)' }}>
                    <span className="text-xl font-light" style={{ color: 'rgba(196,181,253,0.35)', fontFamily: 'Georgia, serif' }}>
                      {i + 1}
                    </span>
                  </div>
                )}
              </div>
              {actualCard && (
                <span className="text-xs text-gray-400 text-center leading-tight" style={{ maxWidth: `${CARD_W + 6}px` }}>
                  {actualCard.name}
                  {sel?.isReversed && <span className="text-rose-400/60"> ↑</span>}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── 진행 표시 ── */}
      <div className="flex items-center gap-2">
        <span style={{ color: 'rgba(212,175,55,0.4)' }} className="text-sm">⟡</span>
        <span className="text-sm tracking-widest" style={{ color: 'rgba(196,181,253,0.5)' }}>
          {selections.length} / {requiredCount} 선택됨
        </span>
        <span style={{ color: 'rgba(212,175,55,0.4)' }} className="text-sm">⟡</span>
      </div>

      {/* ── 카드 덱 (데스크톱: 팬 / 모바일: 그리드) ── */}
      {isMobile ? (
        <MobileCardGrid
          shuffledIndices={shuffledIndices}
          onCardClick={handleCardClick}
          isSelected={isSelected}
          isDimmed={isDimmed}
          pickingIndex={pickingIndex}
        />
      ) : (
        <DesktopFan
          shuffledIndices={shuffledIndices}
          onCardClick={handleCardClick}
          isSelected={isSelected}
          isDimmed={isDimmed}
          pickingIndex={pickingIndex}
        />
      )}

      <p className="text-xs tracking-widest" style={{ color: 'rgba(148,163,184,0.4)' }}>
        ✦ &nbsp; {isMobile ? '카드를 탭하여 선택하세요' : '카드를 선택하면 자동으로 다음 자리로 올라갑니다'} &nbsp; ✦
      </p>

      {/* ── 진행 버튼 ── */}
      {selections.length === requiredCount && (
        <div ref={proceedRef} className="mt-2">
          <button
            onClick={() => onProceed(selections)}
            disabled={isProceedLoading}
            className="arcana-btn inline-flex items-center gap-3 text-white font-medium py-3 px-10 rounded-full"
          >
            {isProceedLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                해석 준비 중...
              </>
            ) : (
              <>
                <span style={{ color: 'rgba(212,175,55,0.8)' }}>✦</span>
                카드 해석 보기
                <span style={{ color: 'rgba(212,175,55,0.8)' }}>✦</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ── 데스크톱 팬 ──────────────────────────────────────────────
function DesktopFan({
  shuffledIndices, onCardClick, isSelected, isDimmed, pickingIndex,
}: {
  shuffledIndices: number[];
  onCardClick: (i: number) => void;
  isSelected: (i: number) => boolean;
  isDimmed: (i: number) => boolean;
  pickingIndex: number | null;
}) {
  return (
    <div
      className="relative w-full overflow-x-auto overflow-y-visible fan-scroll"
      style={{ height: `${FAN_CONTAINER_H + 30}px` }}
    >
      <div className="relative h-full" style={{ minWidth: `${FAN_X_SPAN + CARD_W + 80}px` }}>
        <div
          className="absolute pointer-events-none"
          style={{
            left: '50%', bottom: '4px', transform: 'translateX(-50%)',
            width: '100px', height: '100px', borderRadius: '50%',
            border: '1px solid rgba(196,181,253,0.1)',
            boxShadow: '0 0 30px rgba(139,92,246,0.07)',
          }}
        />
        {shuffledIndices.map((cardIndex, displayIndex) => {
          const style = getCardFanStyle(displayIndex, shuffledIndices.length);
          const selected = isSelected(cardIndex);
          const dimmed = isDimmed(cardIndex);
          const picking = pickingIndex === cardIndex;

          return (
            <button
              key={displayIndex}
              onClick={() => onCardClick(cardIndex)}
              disabled={dimmed || selected}
              aria-label={`카드 ${displayIndex + 1}`}
              className={`absolute focus:outline-none
                ${picking ? 'deck-card-picking' : ''}
                ${selected ? 'deck-card-picked' : ''}
                ${dimmed ? 'deck-card-dimmed' : ''}
                ${!selected && !dimmed && !picking ? 'deck-card-hover' : ''}
              `}
              style={{ ...style, width: `${CARD_W}px`, height: `${CARD_H}px` }}
            >
              <FanCardBack />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── 모바일 그리드 ─────────────────────────────────────────────
function MobileCardGrid({
  shuffledIndices, onCardClick, isSelected, isDimmed, pickingIndex,
}: {
  shuffledIndices: number[];
  onCardClick: (i: number) => void;
  isSelected: (i: number) => boolean;
  isDimmed: (i: number) => boolean;
  pickingIndex: number | null;
}) {
  return (
    <div className="w-full overflow-y-auto mobile-card-scroll px-3" style={{ maxHeight: '52vh' }}>
      <div className="grid grid-cols-4 gap-2">
        {shuffledIndices.map((cardIndex, displayIndex) => {
          const selected = isSelected(cardIndex);
          const dimmed = isDimmed(cardIndex);
          const picking = pickingIndex === cardIndex;

          return (
            <button
              key={displayIndex}
              onClick={() => onCardClick(cardIndex)}
              disabled={dimmed || selected}
              aria-label={`카드 ${displayIndex + 1}`}
              className={`relative rounded-lg focus:outline-none
                ${picking ? 'deck-card-picking' : ''}
                ${selected ? 'deck-card-picked' : ''}
                ${dimmed ? 'deck-card-dimmed' : ''}
                ${!selected && !dimmed && !picking ? 'mobile-card-tap' : ''}
              `}
              style={{ aspectRatio: '3 / 5' }}
            >
              <MobileCardBack />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── 카드 뒷면 (데스크톱) ──────────────────────────────────────
function FanCardBack() {
  return (
    <div
      className="w-full h-full rounded-lg overflow-hidden relative select-none"
      style={{
        background: 'linear-gradient(160deg, #1c1640 0%, #13102e 50%, #0c0a1e 100%)',
        border: '1px solid rgba(212,175,55,0.4)',
        boxShadow: 'inset 0 0 10px rgba(139,92,246,0.06)',
      }}
    >
      <div className="absolute pointer-events-none" style={{ inset: '3px', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '5px' }} />
      {([
        [18, 15, 1.5], [52, 10, 1], [75, 28, 1], [28, 58, 1.5],
        [63, 50, 1], [85, 70, 1.5], [20, 80, 1], [58, 85, 1],
        [80, 15, 1], [10, 55, 1],
      ] as [number, number, number][]).map(([x, y, r], i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: `${x}%`, top: `${y}%`, width: `${r}px`, height: `${r}px`, background: 'rgba(212,175,55,0.65)' }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 42 52" className="w-8 h-10 opacity-85" fill="none">
          <path d="M23 9 C15 9 8 15.5 8 24 C8 32.5 15 39 23 39 C17 37 13 31 13 24 C13 17 17 11.5 23 9Z" fill="rgba(212,175,55,0.88)" />
          <circle cx="30" cy="14" r="1.3" fill="rgba(212,175,55,0.9)" />
          <circle cx="34" cy="23" r="0.9" fill="rgba(212,175,55,0.7)" />
          <circle cx="28" cy="31" r="1.1" fill="rgba(212,175,55,0.8)" />
          <circle cx="33" cy="35" r="0.7" fill="rgba(212,175,55,0.6)" />
          <path d="M31 7.5 L31.6 9.2 L33.4 9.2 L31.9 10.2 L32.5 12 L31 10.9 L29.5 12 L30.1 10.2 L28.6 9.2 L30.4 9.2 Z" fill="rgba(212,175,55,0.75)" />
        </svg>
      </div>
      {(['top-[4px] left-[4px]', 'top-[4px] right-[4px] rotate-90',
        'bottom-[4px] left-[4px] -rotate-90', 'bottom-[4px] right-[4px] rotate-180'] as const
      ).map((cls, i) => (
        <div key={i} className={`absolute ${cls} pointer-events-none opacity-60`}>
          <svg viewBox="0 0 10 10" className="w-2.5 h-2.5">
            <path d="M0 0 L3.5 0 L0 3.5 Z" fill="rgba(212,175,55,0.85)" />
          </svg>
        </div>
      ))}
    </div>
  );
}

// ── 카드 뒷면 (모바일, 간략화) ───────────────────────────────
function MobileCardBack() {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative select-none mobile-card-back">
      <div className="absolute pointer-events-none" style={{ inset: '2px', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '4px' }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 42 52" className="w-5 h-7 opacity-75" fill="none">
          <path d="M23 9 C15 9 8 15.5 8 24 C8 32.5 15 39 23 39 C17 37 13 31 13 24 C13 17 17 11.5 23 9Z" fill="rgba(212,175,55,0.85)" />
          <circle cx="30" cy="14" r="1.3" fill="rgba(212,175,55,0.8)" />
          <circle cx="28" cy="31" r="1.1" fill="rgba(212,175,55,0.7)" />
          <path d="M31 7.5 L31.6 9.2 L33.4 9.2 L31.9 10.2 L32.5 12 L31 10.9 L29.5 12 L30.1 10.2 L28.6 9.2 L30.4 9.2 Z" fill="rgba(212,175,55,0.7)" />
        </svg>
      </div>
    </div>
  );
}
