import Image from 'next/image';
import { TaroCard } from '@/types/tarot';

interface TarotCardProps {
  card?: TaroCard;
  isRevealed?: boolean;
  isReversed?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  showTooltip?: boolean;
  onClick?: () => void;
  className?: string;
  selectionNumber?: number;
}

export default function TarotCard({
  card,
  isRevealed = false,
  isReversed = false,
  isSelected = false,
  isDisabled = false,
  showTooltip = false,
  onClick,
  className = '',
  selectionNumber
}: TarotCardProps) {
  return (
    <div className={`relative group ${className}`}>
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`aspect-[3/5] rounded-lg transition-all duration-300 overflow-hidden w-full ${
          isSelected
            ? 'ring-2 ring-violet-400 scale-105 shadow-2xl shadow-violet-500/25'
            : isDisabled
            ? 'opacity-50 cursor-not-allowed'
            : onClick
            ? 'hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/10 cursor-pointer'
            : ''
        }`}
        style={{
          perspective: '1000px'
        }}
      >
        <div 
          className={`w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isRevealed ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          {/* 카드 앞면 (뒤집혔을 때 보임) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            {card && (
              <div className="w-full h-full relative">
                <div className={`w-full h-full relative ${isReversed ? 'transform rotate-180' : ''}`}>
                  <Image
                    src={card.imageUrl}
                    alt={card.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain rounded-lg"
                  />
                </div>
                {isReversed && (
                  <div className="absolute top-2 left-2 bg-red-600/35 backdrop-blur-sm text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    역방향
                  </div>
                )}
                {isSelected && selectionNumber && (
                  <div className="absolute top-2 right-2 glass-lavender text-white text-xs px-2 py-1 rounded-full shadow-lg min-w-[24px] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-semibold">
                    {selectionNumber}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* 카드 뒷면 (기본 상태에서 보임) */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div className="w-full h-full glass rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* 배경 패턴 */}
              <div className="absolute inset-0 opacity-15">
                <div className="w-full h-full bg-repeat" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238b5cf6' fill-opacity='0.2'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v-40c11.046 0 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E")`
                }} />
              </div>
              
              {/* 중앙 심볼 */}
              <div className="relative z-10 flex flex-col items-center">
                <svg className="w-8 h-8 text-violet-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                <div className="text-violet-300 text-xs font-medium tracking-wider">
                  Taroque
                </div>
              </div>
              
              {/* 테두리 장식 */}
              <div className="absolute inset-2 border border-white/20 rounded-md" />
              <div className="absolute inset-4 border border-white/10 rounded-sm" />
            </div>
          </div>
        </div>
      </button>

      {/* 호버 툴팁 */}
      {showTooltip && card && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 border border-violet-400/30 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-2xl">
          <div className="font-medium">{card.name}</div>
          <div className="text-gray-300">
            {card.suit === 'major' ? '메이저 아르카나' : `${card.suit} 수트`}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800"></div>
        </div>
      )}
      
      {/* 오픈된 카드 툴팁 */}
      {isRevealed && card && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 border border-violet-400/30 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-2xl">
          <div className="font-medium">{card.name} {isReversed ? '(역방향)' : ''}</div>
          <div className="text-gray-300">
            {card.suit === 'major' ? '메이저 아르카나' : `${card.suit} 수트`}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
}