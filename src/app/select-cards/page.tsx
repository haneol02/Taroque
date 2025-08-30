'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CardSelection } from '@/types/tarot';
import { cardPositions, tarotCards } from '@/lib/tarot-data';
import TarotCard from '@/components/TarotCard';

export default function SelectCardsPage() {
  const [question, setQuestion] = useState('');
  const [cardCount, setCardCount] = useState(3);
  const [positions, setPositions] = useState<string[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedQuestion = localStorage.getItem('userQuestion');
    if (!storedQuestion) {
      router.push('/chat');
      return;
    }

    setQuestion(storedQuestion);
    analyzeQuestion(storedQuestion);
  }, []);

  const analyzeQuestion = async (userQuestion: string) => {
    try {
      const response = await fetch('/api/analyze-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      const result = await response.json();
      setCardCount(result.cardCount);
      setPositions(result.positions);
    } catch (error) {
      console.error('Error analyzing question:', error);
      setCardCount(3);
      setPositions(cardPositions[3] || ['과거/원인', '현재 상황', '미래/조언']);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const [reversedCards, setReversedCards] = useState<boolean[]>([]);

  const handleCardClick = (cardIndex: number) => {
    if (selectedCards.includes(cardIndex) || selectedCards.length >= cardCount) {
      return;
    }
    const isReversed = Math.random() > 0.5;
    setSelectedCards([...selectedCards, cardIndex]);
    setReversedCards([...reversedCards, isReversed]);
  };

  const handleProceed = async () => {
    if (selectedCards.length !== cardCount) return;

    const cardSelections: CardSelection[] = selectedCards.map((cardId, index) => {
      const card = tarotCards[cardId];
      return {
        position: positions[index],
        cardId: card.id,
        cardName: card.name,
        isReversed: reversedCards[index]
      };
    });

    localStorage.setItem('selectedCards', JSON.stringify(cardSelections));
    localStorage.setItem('positions', JSON.stringify(positions));
    router.push('/result');
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-400 mx-auto mb-6"></div>
          <h2 className="text-xl font-light text-white mb-2">고민을 분석하고 있어요</h2>
          <p className="text-slate-400">잠시만 기다려주세요...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-white mb-4">
            {cardCount}장의 카드를 선택해주세요
          </h1>
          <p className="text-slate-400 mb-8 text-lg">
            마음이 이끄는 대로 카드를 골라보세요
          </p>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
            <p className="text-white text-sm mb-4 font-medium">선택 진행상황</p>
            <div className="flex justify-center gap-3 mb-4 flex-wrap">
              {positions.map((position, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCards.length > index
                      ? 'bg-slate-700 text-white border border-slate-600'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700'
                  }`}
                >
                  {position}
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-sm">
              {selectedCards.length}/{cardCount} 선택됨
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 mb-8">
          {Array.from({ length: 78 }, (_, index) => {
            const card = tarotCards[index];
            const isSelected = selectedCards.includes(index);
            const isDisabled = selectedCards.length >= cardCount && !isSelected;
            const selectedIndex = selectedCards.indexOf(index);
            const isReversed = selectedIndex !== -1 ? reversedCards[selectedIndex] : false;
            
            return (
              <TarotCard
                key={index}
                card={card}
                isRevealed={isSelected}
                isReversed={isReversed}
                isSelected={isSelected}
                isDisabled={isDisabled}
                showTooltip={false}
                onClick={() => handleCardClick(index)}
                selectionNumber={selectedIndex !== -1 ? selectedIndex + 1 : undefined}
              />
            );
          })}
        </div>

        {selectedCards.length > 0 && (
          <div className="text-center mb-12">
            <h3 className="text-xl font-light text-white mb-6">선택된 카드들</h3>
            <div className="flex justify-center gap-6 flex-wrap max-w-4xl mx-auto">
              {selectedCards.map((cardIndex, index) => {
                const card = tarotCards[cardIndex];
                const isReversed = reversedCards[index];
                
                return (
                  <div key={cardIndex} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <div className="text-slate-300 text-sm mb-3 text-center font-medium">{positions[index]}</div>
                    <div className="flex justify-center">
                      <TarotCard
                        card={card}
                        isRevealed={true}
                        isReversed={isReversed}
                        className="w-24"
                        selectionNumber={index + 1}
                      />
                    </div>
                    <div className="text-slate-400 text-xs mt-3 text-center">
                      {card.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedCards.length === cardCount && (
          <div className="text-center">
            <button
              onClick={handleProceed}
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 md:py-4 px-6 md:px-8 rounded-lg transition-all duration-200 border border-slate-700 hover:border-slate-600 text-sm md:text-base"
            >
              카드 해석 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}