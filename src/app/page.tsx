'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { marked } from 'marked';
import { CardSelection, ExampleQuestions } from '@/types/tarot';
import { cardPositions, tarotCards, exampleQuestions } from '@/lib/tarot-data';
import TarotCard from '@/components/TarotCard';
import ApiKeyInput from '@/components/ApiKeyInput';
import SajuInput from '@/components/SajuInput';
import { SajuInfo, SajuExampleQuestions } from '@/types/tarot';
import { sajuExampleQuestions } from '@/lib/saju-data';

type PageType = 'home' | 'select-service' | 'chat' | 'saju-chat' | 'select-cards' | 'saju-result' | 'result';
type ServiceType = 'tarot' | 'saju' | null;

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

  // Chat page states
  const [question, setQuestion] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Saju page states
  const [sajuInfo, setSajuInfo] = useState<SajuInfo | null>(null);
  const [sajuInterpretation, setSajuInterpretation] = useState('');
  const [isLoadingSaju, setIsLoadingSaju] = useState(false);
  
  // Select cards page states
  const [cardCount, setCardCount] = useState(3);
  const [positions, setPositions] = useState<string[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [reversedCards, setReversedCards] = useState<boolean[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shuffledCardIndices, setShuffledCardIndices] = useState<number[]>([]);
  const nextButtonRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const sajuResultRef = useRef<HTMLDivElement>(null);
  
  // Result page states
  const [selectedCardSelections, setSelectedCardSelections] = useState<CardSelection[]>([]);
  const [interpretation, setInterpretation] = useState('');
  const [isLoadingResult, setIsLoadingResult] = useState(false);

  const categories = [
    { key: 'love' as keyof ExampleQuestions, label: '연애' },
    { key: 'career' as keyof ExampleQuestions, label: '진로' },
    { key: 'life' as keyof ExampleQuestions, label: '인생' },
    { key: 'relationship' as keyof ExampleQuestions, label: '인간관계' }
  ];

  const navigateToPage = (page: PageType) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentPage(page);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoadingChat(true);
    setIsAnalyzing(true);
    
    try {
      navigateToPage('select-cards');
      await analyzeQuestion(question);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const shuffleCards = () => {
    const indices = Array.from({ length: 78 }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledCardIndices(indices);
  };

  const analyzeQuestion = async (userQuestion: string) => {
    try {
      const response = await fetch('/api/analyze-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userQuestion, apiKey: userApiKey, model: selectedModel }),
      });

      const result = await response.json();
      setCardCount(result.cardCount);
      setPositions(result.positions);
      shuffleCards();
    } catch (error) {
      console.error('Error analyzing question:', error);
      setCardCount(3);
      setPositions(cardPositions[3] || ['과거/원인', '현재 상황', '미래/조언']);
      shuffleCards();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCardClick = (cardIndex: number) => {
    if (selectedCards.includes(cardIndex) || selectedCards.length >= cardCount) {
      return;
    }
    const isReversed = Math.random() > 0.5;
    const newSelectedCards = [...selectedCards, cardIndex];
    setSelectedCards(newSelectedCards);
    setReversedCards([...reversedCards, isReversed]);
    
    if (newSelectedCards.length === cardCount) {
      setTimeout(() => {
        if (nextButtonRef.current) {
          nextButtonRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
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

    setSelectedCardSelections(cardSelections);
    setIsLoadingResult(true);
    navigateToPage('result');
    await interpretCards(question, cardSelections);
  };

  const interpretCards = async (userQuestion: string, cards: CardSelection[]) => {
    try {
      const response = await fetch('/api/interpret-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userQuestion,
          selectedCards: cards,
          apiKey: userApiKey,
          model: selectedModel
        }),
      });

      const result = await response.json();
      setInterpretation(result.interpretation);
    } catch (error) {
      console.error('Error interpreting cards:', error);
      setInterpretation('해석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoadingResult(false);
    }
  };

  const handleExampleClick = (exampleQuestion: string) => {
    setQuestion(exampleQuestion);
    // 질문이 설정된 후 "다음으로" 버튼 위치로 스크롤
    setTimeout(() => {
      const nextButton = document.querySelector('button[type="submit"]');
      if (nextButton) {
        nextButton.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  const resetToHome = () => {
    setQuestion('');
    setSelectedCards([]);
    setReversedCards([]);
    setSelectedCardSelections([]);
    setInterpretation('');
    setShuffledCardIndices([]);
    navigateToPage('home');
  };

  const copyEmailToClipboard = async () => {
    const email = 'gksdjf051@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  const startNewReading = () => {
    setQuestion('');
    setSelectedCards([]);
    setReversedCards([]);
    setSelectedCardSelections([]);
    setInterpretation('');
    setShuffledCardIndices([]);
    navigateToPage('chat');
  };

  const getCardInfo = (cardId: number) => {
    return tarotCards.find(card => card.id === cardId);
  };

  const convertMarkdownToHtml = (markdown: string) => {
    // marked 설정
    marked.setOptions({
      gfm: true,
      breaks: true
    });

    try {
      const html = marked(markdown);
      return html as string;
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return markdown;
    }
  };


  const handleServiceSelect = (service: ServiceType) => {
    if (service === 'tarot') {
      navigateToPage('chat');
    } else if (service === 'saju') {
      navigateToPage('saju-chat');
    }
  };

  const handleSajuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !sajuInfo) return;

    setIsLoadingSaju(true);
    navigateToPage('saju-result');
    await interpretSaju(question, sajuInfo);
  };

  const interpretSaju = async (userQuestion: string, userSajuInfo: SajuInfo) => {
    try {
      const response = await fetch('/api/interpret-saju', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userQuestion,
          sajuInfo: userSajuInfo,
          apiKey: userApiKey,
          model: selectedModel
        }),
      });

      const result = await response.json();
      setSajuInterpretation(result.interpretation);
    } catch (error) {
      console.error('Error interpreting saju:', error);
      setSajuInterpretation('해석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoadingSaju(false);
    }
  };

  const sajuCategories = [
    { key: 'fortune' as keyof SajuExampleQuestions, label: '재물운' },
    { key: 'career' as keyof SajuExampleQuestions, label: '진로/사업' },
    { key: 'love' as keyof SajuExampleQuestions, label: '연애/결혼' },
    { key: 'health' as keyof SajuExampleQuestions, label: '건강' }
  ];

  const pageContent = () => {
    if (currentPage === 'home') {
      return (
        <div className="min-h-screen bg-slate-800 relative overflow-hidden select-none">
          <div className="container mx-auto px-6 py-40 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="mb-6 flex justify-center">
                  <Image
                    src="/logo.png"
                    alt="Taroque Logo"
                    width={64}
                    height={64}
                    className="w-16 h-16"
                    style={{
                      filter: 'drop-shadow(0 0 10px rgba(196, 181, 253, 0.6)) drop-shadow(0 0 20px rgba(196, 181, 253, 0.4)) drop-shadow(0 0 40px rgba(196, 181, 253, 0.2))'
                    }}
                  />
                </div>
                <h1 className="text-7xl md:text-6xl font-light text-white mb-6 tracking-wide text-glow">
                  TAROQUE
                </h1>
                <div className="w-24 h-0.5 bg-violet-400 mx-auto mb-8"></div>
                <p className="text-2xl text-gray-300 mb-4 font-light text-glow-subtle">
                  마음의 답을 찾아드려요.
                </p>
                <p className="text-md text-gray-400 mb-16 leading-relaxed text-glow-subtle">
                  고민을 자유롭게 털어놓으세요.<br />타로를 통해 답해드립니다.
                </p>
              </div>

              <div className="mb-12 max-w-2xl mx-auto">
                <ApiKeyInput
                  onApiKeyChange={setUserApiKey}
                  onValidationChange={setIsApiKeyValid}
                  onModelChange={setSelectedModel}
                />
              </div>

              <div className="mb-20">
                <button
                  onClick={() => navigateToPage('select-service')}
                  disabled={!isApiKeyValid}
                  className="inline-flex items-center px-8 py-4 glass-lavender text-white font-medium rounded-lg transition-all duration-200 hover:bg-slate-8000/30 transform hover:scale-105 active:scale-95 active:bg-slate-8000/40 button-glow-purple disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isApiKeyValid ? '상담 시작하기' : 'API 키를 먼저 인증해주세요'}
                  {isApiKeyValid && (
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass rounded-lg p-8 text-center transition-all duration-300 hover:bg-white/15">
                  <div className="w-12 h-12 bg-yellow-50/20 border border-yellow-100/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-3">맞춤 분석</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    고민에 따라 최적의 카드 수를<br />자동으로 결정합니다
                  </p>
                </div>
                
                <div className="glass rounded-lg p-8 text-center transition-all duration-300 hover:bg-white/15">
                  <div className="w-12 h-12 bg-yellow-50/20 border border-yellow-100/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-3">직관적 선택</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    마음이 이끄는 대로<br />카드를 선택하세요
                  </p>
                </div>
                
                <div className="glass rounded-lg p-8 text-center transition-all duration-300 hover:bg-white/15">
                  <div className="w-12 h-12 bg-yellow-50/20 border border-yellow-100/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-3">개인화된 해석</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    30년 경력의 전문가처럼<br />따뜻한 조언을 받아보세요
                  </p>
                </div>
              </div>

              {/* 연락처 */}
              <div className="mt-20 text-center">
                <p className="text-gray-400 text-sm">
                  문의사항:{' '}
                  <button 
                    onClick={copyEmailToClipboard}
                    className="text-gray-300 hover:text-gray-200 underline transition-colors duration-200 relative"
                  >
                    gksdjf051@gmail.com
                    {emailCopied && (
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded shadow-lg">
                        복사됨!
                      </span>
                    )}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentPage === 'select-service') {
      return (
        <div className="min-h-screen bg-slate-800 select-none">
          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="mb-6">
                  <button
                    onClick={() => navigateToPage('home')}
                    className="inline-flex items-center text-gray-400 hover:text-violet-300 transition-all duration-200 text-sm transform hover:scale-105 active:scale-95"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    홈으로 돌아가기
                  </button>
                </div>
                <h1 className="text-3xl font-light text-white mb-4 text-glow-subtle">
                  어떤 상담을 원하시나요?
                </h1>
                <p className="text-gray-400 text-lg">
                  타로와 사주 중 선택해주세요
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 타로 카드 */}
                <button
                  onClick={() => handleServiceSelect('tarot')}
                  className="glass rounded-lg p-8 text-center transition-all duration-300 hover:bg-white/15 transform hover:scale-105 active:scale-95"
                >
                  <div className="w-20 h-20 bg-purple-50/20 border border-purple-100/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-medium text-white mb-4">타로</h2>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    직관적인 카드를 통해<br />
                    현재 상황과 미래를 살펴봅니다
                  </p>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>✓ 빠른 상담 (5-10분)</p>
                    <p>✓ 구체적인 질문에 적합</p>
                    <p>✓ 현재 상황 중심 해석</p>
                  </div>
                </button>

                {/* 사주 카드 */}
                <button
                  onClick={() => handleServiceSelect('saju')}
                  className="glass rounded-lg p-8 text-center transition-all duration-300 hover:bg-white/15 transform hover:scale-105 active:scale-95"
                >
                  <div className="w-20 h-20 bg-amber-50/20 border border-amber-100/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-medium text-white mb-4">사주</h2>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    생년월일시를 기반으로<br />
                    운명과 운세를 깊이 분석합니다
                  </p>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>✓ 종합 상담 (10-15분)</p>
                    <p>✓ 인생 전반적인 조언</p>
                    <p>✓ 장기적 운세 파악</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentPage === 'chat') {
      return (
        <div className="min-h-screen bg-slate-800 select-none">
          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="mb-6">
                  <button
                    onClick={() => navigateToPage('home')}
                    className="inline-flex items-center text-gray-400 hover:text-violet-300 transition-all duration-200 text-sm transform hover:scale-105 active:scale-95"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    홈으로 돌아가기
                  </button>
                </div>
                <h1 className="text-3xl font-light text-white mb-4 text-glow-subtle">
                  어떤 고민이 있으신가요?
                </h1>
                <p className="text-gray-400 text-lg">
                  마음을 털어놓으세요. 비밀은 보장됩니다.
                </p>
              </div>

              <form onSubmit={handleChatSubmit} className="mb-12">
                <div className="glass rounded-lg p-6 mb-6">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="자유롭게 고민을 적어주세요... (최대 500자)"
                    className="w-full h-40 bg-transparent text-white placeholder-gray-400 border-none outline-none resize-none text-lg leading-relaxed select-text"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                    <span className="text-gray-400 text-sm">
                      {question.length}/500
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!question.trim() || !isApiKeyValid || isLoadingChat}
                  className="w-full glass-lavender text-white font-medium py-3 md:py-4 px-6 md:px-8 rounded-lg transition-all duration-200 hover:bg-slate-8000/30 disabled:cursor-not-allowed disabled:opacity-50 text-sm md:text-base transform hover:scale-105 active:scale-95 active:bg-slate-8000/40 disabled:transform-none"
                >
                  {isLoadingChat ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      분석 중...
                    </div>
                  ) : (!isApiKeyValid ? 'API 키를 먼저 인증해주세요' : '다음으로')}
                </button>
              </form>

              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-xl font-light text-white mb-2 text-glow-subtle">
                    예시 질문들
                  </h2>
                  <div className="w-16 h-0.5 bg-violet-400 mx-auto"></div>
                </div>
                
                {categories.map((category) => (
                  <div key={category.key} className="glass rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">
                      {category.label}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {exampleQuestions[category.key].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleExampleClick(question)}
                          className="text-left p-3 md:p-4 glass-dark hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-all duration-200 text-xs md:text-sm leading-relaxed transform hover:scale-105 active:scale-95 active:bg-white/15"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentPage === 'select-cards') {
      if (isAnalyzing) {
        return (
          <div className="min-h-screen bg-slate-800 flex items-center justify-center select-none">
            <div className="text-center">
              <div className="mb-6">
                <Image
                  src="/logo.png"
                  alt="Loading..."
                  width={64}
                  height={64}
                  className="w-16 h-16 mx-auto animate-spin"
                  style={{
                    filter: 'drop-shadow(0 0 15px rgba(196, 181, 253, 0.8)) drop-shadow(0 0 30px rgba(196, 181, 253, 0.6)) drop-shadow(0 0 60px rgba(196, 181, 253, 0.4))'
                  }}
                />
              </div>
              <h2 className="text-xl font-light text-white mb-2 text-glow-subtle">고민을 분석하고 있어요</h2>
              <p className="text-gray-400">잠시만 기다려주세요...</p>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-slate-800 select-none">
          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-light text-white mb-4 text-glow-subtle">
                {cardCount}장의 카드를 선택해주세요
              </h1>
              <p className="text-gray-400 mb-8 text-lg">
                마음이 이끄는 대로 카드를 골라보세요
              </p>
              
              <div className="glass rounded-lg p-6 mb-8 max-w-3xl mx-auto">
                <p className="text-white text-sm mb-4 font-medium">선택 진행상황</p>
                <div className="flex justify-center gap-3 mb-4 flex-wrap">
                  {positions.map((position, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedCards.length > index
                          ? 'glass-lavender text-white'
                          : 'glass-dark text-gray-400'
                      }`}
                    >
                      {position}
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm">
                  {selectedCards.length}/{cardCount} 선택됨
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 mb-8">
              {shuffledCardIndices.map((cardIndex, displayIndex) => {
                const card = tarotCards[cardIndex];
                const isSelected = selectedCards.includes(cardIndex);
                const isDisabled = selectedCards.length >= cardCount && !isSelected;
                const selectedIndex = selectedCards.indexOf(cardIndex);
                const isReversed = selectedIndex !== -1 ? reversedCards[selectedIndex] : false;
                
                return (
                  <TarotCard
                    key={displayIndex}
                    card={card}
                    isRevealed={isSelected}
                    isReversed={isReversed}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    showTooltip={false}
                    onClick={() => handleCardClick(cardIndex)}
                    selectionNumber={selectedIndex !== -1 ? selectedIndex + 1 : undefined}
                  />
                );
              })}
            </div>

            {selectedCards.length > 0 && (
              <div className="text-center mb-12">
                <h3 className="text-xl font-light text-white mb-6 text-glow-subtle">선택된 카드들</h3>
                <div className="flex justify-center gap-6 flex-wrap max-w-4xl mx-auto">
                  {selectedCards.map((cardIndex, index) => {
                    const card = tarotCards[cardIndex];
                    const isReversed = reversedCards[index];
                    
                    return (
                      <div key={cardIndex} className="glass rounded-lg p-4">
                        <div className="text-white text-sm mb-3 text-center font-medium">{positions[index]}</div>
                        <div className="flex justify-center">
                          <TarotCard
                            card={card}
                            isRevealed={true}
                            isReversed={isReversed}
                            className="w-24"
                            selectionNumber={index + 1}
                          />
                        </div>
                        <div className="text-gray-400 text-xs mt-3 text-center">
                          {card.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedCards.length === cardCount && (
              <div ref={nextButtonRef} className="text-center">
                <button
                  onClick={handleProceed}
                  className="glass-lavender text-white font-medium py-3 md:py-4 px-6 md:px-8 rounded-lg transition-all duration-200 hover:bg-slate-8000/30 text-sm md:text-base transform hover:scale-105 active:scale-95 active:bg-slate-8000/40"
                >
                  카드 해석 보기
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (currentPage === 'saju-chat') {
      return (
        <div className="min-h-screen bg-slate-800 select-none">
          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="mb-6">
                  <button
                    onClick={() => navigateToPage('select-service')}
                    className="inline-flex items-center text-gray-400 hover:text-violet-300 transition-all duration-200 text-sm transform hover:scale-105 active:scale-95"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    뒤로 가기
                  </button>
                </div>
                <h1 className="text-3xl font-light text-white mb-4 text-glow-subtle">
                  사주 상담
                </h1>
                <p className="text-gray-400 text-lg">
                  생년월일시와 궁금한 점을 알려주세요
                </p>
              </div>

              <SajuInput onSajuInfoChange={setSajuInfo} />

              <form onSubmit={handleSajuSubmit} className="mb-12">
                <div className="glass rounded-lg p-6 mb-6">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="궁금한 점을 자유롭게 적어주세요... (최대 500자)"
                    className="w-full h-40 bg-transparent text-white placeholder-gray-400 border-none outline-none resize-none text-lg leading-relaxed select-text"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                    <span className="text-gray-400 text-sm">
                      {question.length}/500
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!question.trim() || !sajuInfo || !isApiKeyValid || isLoadingSaju}
                  className="w-full glass-lavender text-white font-medium py-3 md:py-4 px-6 md:px-8 rounded-lg transition-all duration-200 hover:bg-slate-8000/30 disabled:cursor-not-allowed disabled:opacity-50 text-sm md:text-base transform hover:scale-105 active:scale-95 active:bg-slate-8000/40 disabled:transform-none"
                >
                  {isLoadingSaju ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      사주 풀이 중...
                    </div>
                  ) : (!sajuInfo ? '생년월일시를 입력해주세요' : '사주 풀이 보기')}
                </button>
              </form>

              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-xl font-light text-white mb-2 text-glow-subtle">
                    예시 질문들
                  </h2>
                  <div className="w-16 h-0.5 bg-violet-400 mx-auto"></div>
                </div>

                {sajuCategories.map((category) => (
                  <div key={category.key} className="glass rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">
                      {category.label}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {sajuExampleQuestions[category.key].map((q, index) => (
                        <button
                          key={index}
                          onClick={() => handleExampleClick(q)}
                          className="text-left p-3 md:p-4 glass-dark hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-all duration-200 text-xs md:text-sm leading-relaxed transform hover:scale-105 active:scale-95 active:bg-white/15"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentPage === 'saju-result') {
      if (isLoadingSaju) {
        return (
          <div className="min-h-screen bg-slate-800 flex items-center justify-center select-none">
            <div className="text-center">
              <div className="mb-6">
                <Image
                  src="/logo.png"
                  alt="Loading..."
                  width={64}
                  height={64}
                  className="w-16 h-16 mx-auto animate-spin"
                  style={{
                    filter: 'drop-shadow(0 0 15px rgba(196, 181, 253, 0.8)) drop-shadow(0 0 30px rgba(196, 181, 253, 0.6)) drop-shadow(0 0 60px rgba(196, 181, 253, 0.4))'
                  }}
                />
              </div>
              <h2 className="text-xl font-light text-white mb-2 text-glow-subtle">사주를 풀이하고 있어요</h2>
              <p className="text-gray-400">잠시만 기다려주세요...</p>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-slate-800">
          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="max-w-5xl mx-auto" ref={sajuResultRef}>
              <div className="text-center mb-12">
                <h1 className="text-3xl font-light text-white mb-6 text-glow-subtle">
                  사주 풀이 결과
                </h1>
                <div className="glass rounded-lg p-6 max-w-3xl mx-auto">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    <span className="text-white font-medium">질문:</span> {question}
                  </p>
                  {sajuInfo && (
                    <p className="text-gray-400 text-sm mt-3">
                      {sajuInfo.year}년 {sajuInfo.month}월 {sajuInfo.day}일 {sajuInfo.hour}시 {sajuInfo.minute}분 ({sajuInfo.isLunar ? '음력' : '양력'}) / {sajuInfo.gender === 'male' ? '남성' : '여성'}
                    </p>
                  )}
                </div>
              </div>

              <div className="glass rounded-lg p-8 mb-12">
                <div
                  className="text-gray-300 prose prose-invert max-w-none leading-relaxed interpretation-content"
                  dangerouslySetInnerHTML={{
                    __html: convertMarkdownToHtml(sajuInterpretation)
                  }}
                />
              </div>

              <div className="text-center space-y-3">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
                  <button
                    onClick={resetToHome}
                    className="w-full md:w-auto glass-dark text-gray-300 hover:text-white font-medium py-2.5 md:py-3 px-6 md:px-8 rounded-lg transition-all duration-200 hover:bg-white/10 text-sm md:text-base text-center transform hover:scale-105 active:scale-95 active:bg-white/15"
                  >
                    홈으로
                  </button>

                  <button
                    onClick={() => navigateToPage('saju-chat')}
                    className="w-full md:w-auto glass-lavender text-white font-medium py-2.5 md:py-3 px-6 md:px-8 rounded-lg transition-all duration-200 hover:bg-slate-8000/30 text-sm md:text-base text-center transform hover:scale-105 active:scale-95 active:bg-slate-8000/40"
                  >
                    다른 질문하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentPage === 'result') {
      if (isLoadingResult) {
        return (
          <div className="min-h-screen bg-slate-800 flex items-center justify-center select-none">
            <div className="text-center">
              <div className="mb-6">
                <Image
                  src="/logo.png"
                  alt="Loading..."
                  width={64}
                  height={64}
                  className="w-16 h-16 mx-auto animate-spin"
                  style={{
                    filter: 'drop-shadow(0 0 15px rgba(196, 181, 253, 0.8)) drop-shadow(0 0 30px rgba(196, 181, 253, 0.6)) drop-shadow(0 0 60px rgba(196, 181, 253, 0.4))'
                  }}
                />
              </div>
              <h2 className="text-xl font-light text-white mb-2 text-glow-subtle">카드를 해석하고 있어요</h2>
              <p className="text-gray-400">잠시만 기다려주세요...</p>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-slate-800">
          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="max-w-5xl mx-auto" ref={resultRef}>
              <div className="text-center mb-12">
                <h1 className="text-3xl font-light text-white mb-6 text-glow-subtle">
                  리딩 결과
                </h1>
                <div className="glass rounded-lg p-6 max-w-3xl mx-auto">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    <span className="text-white font-medium">질문:</span> {question}
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center mb-12">
                <div className="flex flex-wrap justify-center gap-6 max-w-6xl">
                {selectedCardSelections.map((card, index) => {
                  const cardInfo = getCardInfo(card.cardId);
                  return (
                    <div key={index} className="text-center w-48">
                      <div className="glass rounded-lg p-5 h-full flex flex-col">
                        <h3 className="text-white text-sm font-medium mb-4">
                          {card.position}
                        </h3>
                        <div className="mb-4 flex justify-center">
                          <TarotCard
                            card={cardInfo}
                            isRevealed={true}
                            isReversed={card.isReversed}
                            className="w-32"
                          />
                        </div>
                        <div className="text-white text-sm font-medium mb-3">
                          {cardInfo?.name || `카드 ${card.cardId}`} {card.isReversed ? '(역방향)' : ''}
                        </div>
                        {cardInfo && (
                          <div className="space-y-3 flex-grow flex flex-col justify-end">
                            <div className="border-t border-gray-600 pt-3">
                              <p className="text-gray-400 text-xs leading-relaxed">
                                {card.isReversed ? cardInfo.reversedMeaning : cardInfo.uprightMeaning}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>

              <div className="glass rounded-lg p-8 mb-12">
                <div 
                  className="text-gray-300 prose prose-invert max-w-none leading-relaxed interpretation-content"
                  dangerouslySetInnerHTML={{
                    __html: convertMarkdownToHtml(interpretation)
                  }}
                />
              </div>

              <div className="text-center space-y-3">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
                  <button
                    onClick={resetToHome}
                    className="w-full md:w-auto glass-dark text-gray-300 hover:text-white font-medium py-2.5 md:py-3 px-6 md:px-8 rounded-lg transition-all duration-200 hover:bg-white/10 text-sm md:text-base text-center transform hover:scale-105 active:scale-95 active:bg-white/15"
                  >
                    홈으로
                  </button>

                  <button
                    onClick={startNewReading}
                    className="w-full md:w-auto glass-lavender text-white font-medium py-2.5 md:py-3 px-6 md:px-8 rounded-lg transition-all duration-200 hover:bg-slate-8000/30 text-sm md:text-base text-center transform hover:scale-105 active:scale-95 active:bg-slate-8000/40"
                  >
                    다른 고민 상담하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`${isTransitioning ? 'fade-out' : 'fade-in'}`}>
      {pageContent()}
    </div>
  );
}