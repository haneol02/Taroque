'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CardSelection } from '@/types/tarot';
import { tarotCards } from '@/lib/tarot-data';
import TarotCard from '@/components/TarotCard';

export default function ResultPage() {
  const [question, setQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<CardSelection[]>([]);
  const [interpretation, setInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedQuestion = localStorage.getItem('userQuestion');
    const storedCards = localStorage.getItem('selectedCards');

    if (!storedQuestion || !storedCards) {
      router.push('/chat');
      return;
    }

    setQuestion(storedQuestion);
    const cards: CardSelection[] = JSON.parse(storedCards);
    setSelectedCards(cards);
    interpretCards(storedQuestion, cards);
  }, []);

  const interpretCards = async (userQuestion: string, cards: CardSelection[]) => {
    try {
      const response = await fetch('/api/interpret-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userQuestion,
          selectedCards: cards
        }),
      });

      const result = await response.json();
      setInterpretation(result.interpretation);
    } catch (error) {
      console.error('Error interpreting cards:', error);
      setInterpretation('해석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCardInfo = (cardId: number) => {
    return tarotCards.find(card => card.id === cardId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-400 mx-auto mb-6"></div>
          <h2 className="text-xl font-light text-white mb-2">카드를 해석하고 있어요</h2>
          <p className="text-slate-400">잠시만 기다려주세요...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-light text-white mb-6">
              리딩 결과
            </h1>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 max-w-3xl mx-auto">
              <p className="text-slate-300 text-lg leading-relaxed">
                <span className="text-white font-medium">질문:</span> {question}
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl">
            {selectedCards.map((card, index) => {
              const cardInfo = getCardInfo(card.cardId);
              return (
                <div key={index} className="text-center h-full">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 h-full flex flex-col">
                    <h3 className="text-slate-300 text-sm font-medium mb-4">
                      {card.position}
                    </h3>
                    <div className="mb-4">
                      <TarotCard
                        card={cardInfo}
                        isRevealed={true}
                        isReversed={card.isReversed}
                        className="w-full max-w-[140px] mx-auto"
                      />
                    </div>
                    <div className="text-white text-sm font-medium mb-3">
                      {cardInfo?.name || `카드 ${card.cardId}`}
                    </div>
                    {cardInfo && (
                      <div className="space-y-3 flex-grow flex flex-col justify-end">
                        <div className="text-slate-400 text-xs">
                          <span className="text-slate-300 font-medium">키워드:</span> {cardInfo.keywords.join(', ')}
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {card.isReversed ? cardInfo.reversedMeaning : cardInfo.uprightMeaning}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 mb-12">
            <div 
              className="text-slate-200 prose prose-slate max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: interpretation
                  .replace(/\n/g, '<br>')
                  .replace(/## (.*?)(<br>|$)/g, '<h2 class="text-xl font-medium text-white mt-8 mb-4 first:mt-0">$1</h2>')
                  .replace(/- (.*?)(<br>|$)/g, '<div class="ml-4 mb-2 text-slate-300">• $1</div>')
              }}
            />
          </div>

          <div className="text-center space-y-3 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Link
              href="/"
              className="block md:inline-block bg-slate-700/50 hover:bg-slate-700 text-white font-medium py-2.5 md:py-3 px-6 md:px-8 rounded-lg transition-all duration-200 border border-slate-600 hover:border-slate-500 text-sm md:text-base text-center"
            >
              홈으로
            </Link>
            
            <Link
              href="/chat"
              className="block md:inline-block bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 md:py-3 px-6 md:px-8 rounded-lg transition-all duration-200 border border-slate-700 hover:border-slate-600 text-sm md:text-base text-center"
            >
              다른 고민 상담하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}