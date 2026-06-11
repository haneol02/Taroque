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

// ── 데스크톱 팬 파라미터
const CARD_W = 72;
const CARD_H = 120;
const FAN_X_SPAN = 1020;
const FAN_SAG = 90;        // 오른쪽 끝의 최대 상승 높이
const FAN_CONTAINER_H = 290; // fallback

// ── 모바일 원형 휠 파라미터
const MW = 92;    // 카드 너비 (더 크게)
const MH = 154;   // 카드 높이 3:5 비율
const WCH = 310;  // fallback 컨테이너 높이 (ResizeObserver가 실제값으로 교체)
// WR, cy는 containerH로 동적 계산 (하단 고정 아치)

// ── 선택 슬롯 팬 파라미터
const SLOT_CW = 52;
const SLOT_CH = 78;
const SLOT_OVERLAP = 38;  // 겹침 줄여 카드 간격 확보
const SLOT_MAX_ROT = 10;
const SLOT_PAD = 20;

function getCardFanStyle(index: number, total: number, containerH: number = FAN_CONTAINER_H) {
  const t = index / (total - 1);
  const x = (t - 0.5) * FAN_X_SPAN;
  // 오른쪽(t=1)이 가장 높은 단조 상승 아치
  const yUp = Math.sin(t * Math.PI / 2) * FAN_SAG;
  const rotation = (t - 0.5) * -26;
  return {
    left: `calc(50% + ${x}px - ${CARD_W / 2}px)`,
    top: `${containerH - CARD_H - 6 - yUp}px`,
    transform: `rotate(${rotation}deg)`,
    // 오른쪽 카드가 위에 겹치도록
    zIndex: Math.round(t * 80 + 10),
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
  const fanWrapRef = useRef<HTMLDivElement>(null);
  const [measuredFanH, setMeasuredFanH] = useState<number | null>(null);

  const selectionComplete = selections.length >= requiredCount;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleCardClick = (cardIndex: number) => {
    if (isSelected(cardIndex) || selectionComplete) return;
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
  const isDimmed = (idx: number) => selectionComplete && !isSelected(idx);

  // 팬/휠 높이를 측정 후 collapse 애니메이션에 사용
  useEffect(() => {
    if (selectionComplete && fanWrapRef.current && !measuredFanH) {
      setMeasuredFanH(fanWrapRef.current.offsetHeight);
    }
  }, [selectionComplete, measuredFanH]);

  const slotFanW = Math.max((requiredCount - 1) * SLOT_OVERLAP + SLOT_CW + SLOT_PAD * 2, 120);
  const slotFanH = SLOT_CH + 12;

  return (
    <div className="w-full h-full flex flex-col items-center gap-3">

      {/* ── 선택 슬롯 (팬 배치) ── */}
      <div className="shrink-0 flex flex-col items-center gap-1.5 px-4">
        <div className="relative" style={{ width: `${slotFanW}px`, height: `${slotFanH}px` }}>
          {positions.map((pos, i) => {
            const sel = selections[i];
            const actualCard = sel != null ? cards[sel.cardIndex] : null;
            const isLanding = landingSlot === i;
            const t = requiredCount > 1 ? i / (requiredCount - 1) : 0.5;
            const tCentered = t - 0.5;
            const tilt = tCentered * SLOT_MAX_ROT;
            const x = SLOT_PAD + i * SLOT_OVERLAP;
            const arcY = Math.abs(tCentered) * 8;
            return (
              <div
                key={i}
                className="absolute"
                title={pos}
                style={{
                  left: `${x}px`,
                  top: `${arcY}px`,
                  width: `${SLOT_CW}px`,
                  height: `${SLOT_CH}px`,
                  transform: `rotate(${tilt}deg)`,
                  transformOrigin: '50% 100%',
                  zIndex: actualCard ? 20 + i : i + 1,
                }}
              >
                {actualCard ? (
                  <div
                    className={`w-full h-full rounded-lg overflow-hidden border-2 ${isLanding ? 'card-slot-enter' : ''}`}
                    style={{
                      borderColor: 'rgba(212,175,55,0.65)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.55)',
                      '--card-rot': `${tilt}deg`,
                    } as React.CSSProperties}
                  >
                    <div className={`w-full h-full relative ${sel!.isReversed ? 'rotate-180' : ''}`}>
                      <Image src={actualCard.imageUrl} alt={actualCard.name} fill sizes="52px" className="object-contain" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center rounded-lg slot-empty"
                    style={{ background: 'rgba(139,92,246,0.04)' }}>
                    <span className="text-sm font-light"
                      style={{ color: 'rgba(196,181,253,0.3)', fontFamily: 'Georgia, serif' }}>
                      {i + 1}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 선택된 카드 이름 요약 */}
        {selections.length > 0 && (
          <p className="text-[11px] text-center leading-relaxed" style={{ color: 'rgba(185,200,225,0.72)', maxWidth: `${slotFanW + 40}px` }}>
            {selections.map((sel, i) => (
              <span key={i}>
                {i > 0 && <span style={{ color: 'rgba(212,175,55,0.3)' }}> · </span>}
                <span>{cards[sel.cardIndex].name}</span>
                {sel.isReversed && <span style={{ color: 'rgba(248,113,113,0.6)' }}>↑</span>}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* ── 진행 표시 ── */}
      {!selectionComplete && (
        <div className="shrink-0 flex items-center gap-2">
          <span style={{ color: 'rgba(212,175,55,0.4)' }} className="text-sm">⟡</span>
          <span className="text-sm tracking-widest" style={{ color: 'rgba(210,195,255,0.72)' }}>
            {selections.length} / {requiredCount} 선택됨
          </span>
          <span style={{ color: 'rgba(212,175,55,0.4)' }} className="text-sm">⟡</span>
        </div>
      )}

      {/* ── 카드 덱 ── */}
      <div
        ref={fanWrapRef}
        className="w-full overflow-hidden"
        style={{
          flex: selectionComplete ? '0 0 0px' : '1 1 0px',
          minHeight: 0,
          maxHeight: selectionComplete ? '0px' : (measuredFanH ? `${measuredFanH}px` : undefined),
          opacity: selectionComplete ? 0 : 1,
          transition: 'max-height 0.5s ease, opacity 0.4s ease',
        }}
      >
        {isMobile ? (
          <MobileCardWheel
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
      </div>

      {!selectionComplete && (
        <p className="shrink-0 text-xs tracking-widest" style={{ color: 'rgba(185,200,225,0.45)' }}>
          ✦ &nbsp; {isMobile ? '좌우로 돌려 카드를 탐색하고, 탭하여 선택하세요' : '카드를 선택하면 자동으로 다음 자리로 올라갑니다'} &nbsp; ✦
        </p>
      )}

      {/* ── 진행 버튼 ── */}
      {selectionComplete && (
        <div ref={proceedRef} className="shrink-0 mt-2">
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
  const [containerH, setContainerH] = useState(FAN_CONTAINER_H);
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const h = e.contentRect.height;
      if (h > 0) setContainerH(Math.floor(h));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={outerRef}
      className="relative w-full h-full overflow-x-auto overflow-y-visible fan-scroll"
    >
      <div className="relative h-full" style={{ minWidth: `${FAN_X_SPAN + CARD_W + 80}px` }}>
        <div className="absolute pointer-events-none" style={{
          left: '50%', bottom: '4px', transform: 'translateX(-50%)',
          width: '100px', height: '100px', borderRadius: '50%',
          border: '1px solid rgba(196,181,253,0.1)',
          boxShadow: '0 0 30px rgba(139,92,246,0.07)',
        }} />
        {shuffledIndices.map((cardIndex, displayIndex) => {
          const style = getCardFanStyle(displayIndex, shuffledIndices.length, containerH);
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

// ── 모바일 원형 휠 ────────────────────────────────────────────
function MobileCardWheel({
  shuffledIndices, onCardClick, isSelected, isDimmed, pickingIndex,
}: {
  shuffledIndices: number[];
  onCardClick: (i: number) => void;
  isSelected: (i: number) => boolean;
  isDimmed: (i: number) => boolean;
  pickingIndex: number | null;
}) {
  const [rotation, setRotation] = useState(0);
  const [containerW, setContainerW] = useState(375);
  const [containerH, setContainerH] = useState(WCH);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    lastX: number;
    velocity: number;
    moved: boolean;
  } | null>(null);
  const rafRef = useRef<number | null>(null);
  // 터치 핸들러에서 최신 wr을 참조하기 위한 ref
  const wrRef = useRef<number>(300);

  // 컨테이너 너비 감지
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerW(el.offsetWidth);
    const ro = new ResizeObserver(([e]) => {
      setContainerW(e.contentRect.width);
      if (e.contentRect.height > 0) setContainerH(e.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // passive:false 터치무브 (스크롤 방지)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: TouchEvent) => {
      if (dragRef.current?.moved && e.cancelable) e.preventDefault();
    };
    el.addEventListener('touchmove', handler, { passive: false });
    return () => el.removeEventListener('touchmove', handler);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    dragRef.current = {
      startX: e.touches[0].clientX,
      lastX: e.touches[0].clientX,
      velocity: 0,
      moved: false,
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current) return;
    const x = e.touches[0].clientX;
    const dx = x - dragRef.current.lastX;
    if (Math.abs(x - dragRef.current.startX) > 6) dragRef.current.moved = true;
    // 지수이동평균으로 속도 스무딩
    dragRef.current.velocity = dragRef.current.velocity * 0.65 + dx * 0.35;
    dragRef.current.lastX = x;
    const dRot = (dx / wrRef.current) * (180 / Math.PI);
    setRotation(r => r + dRot);
  };

  const onTouchEnd = () => {
    if (!dragRef.current) return;
    const wasDrag = dragRef.current.moved;
    let vel = dragRef.current.velocity * 2.8;
    dragRef.current = null;

    if (!wasDrag || Math.abs(vel) < 0.2) return;

    // 모멘텀 감속
    const decay = () => {
      vel *= 0.935;
      if (Math.abs(vel) < 0.12) return;
      const dRot = (vel / wrRef.current) * (180 / Math.PI);
      setRotation(r => r + dRot);
      rafRef.current = requestAnimationFrame(decay);
    };
    rafRef.current = requestAnimationFrame(decay);
  };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const cx = containerW / 2;
  // 하단 고정 아치: 원 중심이 화면 위쪽에, 카드가 화면 아래쪽에 모임
  // wr = 컨테이너 높이의 82%, 하단에 카드가 붙도록 cyB 계산
  const wr = Math.max(150, Math.min(420, containerH * 0.82));
  wrRef.current = wr;
  const cyB = containerH - Math.round(MH / 2) - Math.round(wr);
  const n = shuffledIndices.length;
  const angStep = 360 / n;

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {shuffledIndices.map((cardIndex, i) => {
        const angleDeg = ((rotation + i * angStep) % 360 + 360) % 360;
        // 0 = 하단 중앙, 양수 = 오른쪽, 음수 = 왼쪽
        const normAngle = angleDeg > 180 ? angleDeg - 360 : angleDeg;
        const distFromCenter = Math.abs(normAngle);

        // 시야 밖 카드 스킵 (성능)
        if (distFromCenter > 70) return null;

        const rad = (angleDeg * Math.PI) / 180;
        // 하단 아치: 중앙이 하단에, 측면이 위로 올라감
        const x = cx + wr * Math.sin(rad);
        const y = cyB + wr * Math.cos(rad);

        if (y - MH / 2 > containerH || y + MH / 2 < 0) return null;

        const selected = isSelected(cardIndex);
        const dimmed = isDimmed(cardIndex);
        const picking = pickingIndex === cardIndex;

        const t = Math.min(distFromCenter / 62, 1);
        const scale = 1 - t * 0.18;
        const alpha = selected ? 0 : dimmed ? 0.15 : 1 - t * 0.38;
        // 하단 아치 접선 방향: 왼쪽 카드는 우측으로, 오른쪽은 좌측으로
        const tilt = -normAngle * 0.85;

        return (
          <button
            key={i}
            onClick={() => {
              if (dragRef.current?.moved) return;
              onCardClick(cardIndex);
            }}
            disabled={dimmed || selected}
            className="absolute focus:outline-none"
            style={{
              left: `${x - MW / 2}px`,
              top: `${y - MH / 2}px`,
              width: `${MW}px`,
              height: `${MH}px`,
              transform: `rotate(${tilt}deg) scale(${scale})${picking ? ' translateY(-60px) scale(1.15)' : ''}`,
              opacity: alpha,
              zIndex: Math.round(100 - distFromCenter),
              transition: picking
                ? 'transform 0.15s ease-out, opacity 0.15s'
                : 'opacity 0.2s ease',
            }}
          >
            <MobileCardBack />
          </button>
        );
      })}

      {/* 중앙 기준선 */}
      <div className="absolute top-0 left-1/2 -translate-x-px w-px h-5 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.6), transparent)' }} />

      {/* 사이드 페이드 */}
      <div className="absolute inset-y-0 left-0 w-14 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(16,14,48,1) 25%, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-14 pointer-events-none"
        style={{ background: 'linear-gradient(to left, rgba(16,14,48,1) 25%, transparent)' }} />
      {/* 하단 페이드 */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(16,14,48,1), transparent)' }} />
    </div>
  );
}

// ── 카드 뒷면 (데스크톱) ──────────────────────────────────────
function FanCardBack() {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative select-none" style={{
      background: 'linear-gradient(160deg, #1c1640 0%, #13102e 50%, #0c0a1e 100%)',
      border: '1px solid rgba(212,175,55,0.4)',
      boxShadow: 'inset 0 0 10px rgba(139,92,246,0.06)',
    }}>
      <div className="absolute pointer-events-none" style={{ inset: '3px', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '5px' }} />
      {([
        [18, 15, 1.5], [52, 10, 1], [75, 28, 1], [28, 58, 1.5],
        [63, 50, 1], [85, 70, 1.5], [20, 80, 1], [58, 85, 1],
        [80, 15, 1], [10, 55, 1],
      ] as [number, number, number][]).map(([x, y, r], i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: `${x}%`, top: `${y}%`, width: `${r}px`, height: `${r}px`, background: 'rgba(212,175,55,0.65)' }} />
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
      <div className="absolute pointer-events-none" style={{ inset: '2px', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '4px' }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 42 52" className="w-5 h-7 opacity-80" fill="none">
          <path d="M23 9 C15 9 8 15.5 8 24 C8 32.5 15 39 23 39 C17 37 13 31 13 24 C13 17 17 11.5 23 9Z" fill="rgba(212,175,55,0.85)" />
          <circle cx="30" cy="14" r="1.3" fill="rgba(212,175,55,0.8)" />
          <circle cx="28" cy="31" r="1.1" fill="rgba(212,175,55,0.7)" />
          <path d="M31 7.5 L31.6 9.2 L33.4 9.2 L31.9 10.2 L32.5 12 L31 10.9 L29.5 12 L30.1 10.2 L28.6 9.2 L30.4 9.2 Z" fill="rgba(212,175,55,0.7)" />
        </svg>
      </div>
    </div>
  );
}
