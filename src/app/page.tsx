'use client';

import { useState } from 'react';
import Image from 'next/image';
import { marked } from 'marked';
import { CardSelection, ExampleQuestions } from '@/types/tarot';
import { cardPositions, tarotCards, exampleQuestions } from '@/lib/tarot-data';
import CardDeck from '@/components/CardDeck';
import SajuInput from '@/components/SajuInput';
import { SajuInfo, SajuExampleQuestions } from '@/types/tarot';
import { sajuExampleQuestions } from '@/lib/saju-data';

type PageType = 'home' | 'select-service' | 'chat' | 'saju-chat' | 'select-cards' | 'saju-result' | 'result';

// 공통 로딩 화면
function ArcanaLoader({ message }: { message: string }) {
  return (
    <div className="min-h-screen space-bg flex items-center justify-center select-none">
      <div className="text-center relative z-10">
        <div className="mb-6 flex items-center justify-center">
          <Image src="/logo.png" alt="loading" width={56} height={56}
            className="w-14 h-14 animate-spin"
            style={{ filter: 'drop-shadow(0 0 12px rgba(196,181,253,0.8)) drop-shadow(0 0 24px rgba(210,195,255,0.72))' }}
          />
        </div>
        <p className="arcana-title text-lg font-light text-white mb-2">{message}</p>
        <p className="text-xs tracking-wider" style={{ color: 'rgba(196,181,253,0.65)' }}>
          잠시만 기다려주세요
        </p>
      </div>
    </div>
  );
}

// 뒤로 가기 버튼
function BackButton({ onClick, label = '뒤로 가기' }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="arcana-back inline-flex items-center gap-1.5 mb-8">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const [question, setQuestion] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const [sajuInfo, setSajuInfo] = useState<SajuInfo | null>(null);
  const [sajuInterpretation, setSajuInterpretation] = useState('');
  const [isLoadingSaju, setIsLoadingSaju] = useState(false);

  const [cardCount, setCardCount] = useState(3);
  const [positions, setPositions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shuffledCardIndices, setShuffledCardIndices] = useState<number[]>([]);

  const [selectedCardSelections, setSelectedCardSelections] = useState<CardSelection[]>([]);
  const [interpretation, setInterpretation] = useState('');
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [isProceedLoading, setIsProceedLoading] = useState(false);

  const categories = [
    { key: 'love' as keyof ExampleQuestions, label: '연애' },
    { key: 'career' as keyof ExampleQuestions, label: '진로' },
    { key: 'life' as keyof ExampleQuestions, label: '인생' },
    { key: 'relationship' as keyof ExampleQuestions, label: '인간관계' }
  ];
  const sajuCategories = [
    { key: 'fortune' as keyof SajuExampleQuestions, label: '재물운' },
    { key: 'career' as keyof SajuExampleQuestions, label: '진로/사업' },
    { key: 'love' as keyof SajuExampleQuestions, label: '연애/결혼' },
    { key: 'health' as keyof SajuExampleQuestions, label: '건강' }
  ];

  const navigateToPage = (page: PageType) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQuestion }),
      });
      const result = await response.json();
      setCardCount(result.cardCount);
      setPositions(result.positions);
      shuffleCards();
    } catch {
      setCardCount(3);
      setPositions(cardPositions[3] || ['과거/원인', '현재 상황', '미래/조언']);
      shuffleCards();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setIsLoadingChat(true);
    setIsAnalyzing(true);
    navigateToPage('select-cards');
    try { await analyzeQuestion(question); }
    catch { /* handled inside */ }
    finally { setIsLoadingChat(false); }
  };

  const handleCardSelectionComplete = async (sels: Array<{ cardIndex: number; isReversed: boolean }>) => {
    const cardSelections: CardSelection[] = sels.map((s, index) => {
      const card = tarotCards[s.cardIndex];
      return { position: positions[index], cardId: card.id, cardName: card.name, isReversed: s.isReversed };
    });
    setSelectedCardSelections(cardSelections);
    setIsProceedLoading(true);
    setIsLoadingResult(true);
    navigateToPage('result');
    try {
      const response = await fetch('/api/interpret-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, selectedCards: cardSelections }),
      });
      const result = await response.json();
      setInterpretation(result.interpretation);
    } catch {
      setInterpretation('해석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoadingResult(false);
      setIsProceedLoading(false);
    }
  };

  const handleSajuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !sajuInfo) return;
    setIsLoadingSaju(true);
    navigateToPage('saju-result');
    try {
      const response = await fetch('/api/interpret-saju', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sajuInfo }),
      });
      const result = await response.json();
      setSajuInterpretation(result.interpretation);
    } catch {
      setSajuInterpretation('해석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoadingSaju(false);
    }
  };

  const handleExampleClick = (q: string) => {
    setQuestion(q);
    setTimeout(() => {
      document.querySelector('button[type="submit"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const resetToHome = () => {
    setQuestion(''); setSelectedCardSelections([]); setInterpretation(''); setShuffledCardIndices([]);
    navigateToPage('home');
  };

  const copyEmailToClipboard = async () => {
    try { await navigator.clipboard.writeText('gksdjf051@gmail.com'); setEmailCopied(true); setTimeout(() => setEmailCopied(false), 2000); } catch {}
  };

  const getCardInfo = (cardId: number) => tarotCards.find(c => c.id === cardId);

  const toHtml = (md: string) => {
    marked.setOptions({ gfm: true, breaks: true });
    try { return marked(md) as string; } catch { return md; }
  };

  const pageContent = () => {

    // ────────────────────────── 홈 ──────────────────────────
    if (currentPage === 'home') {
      return (
        <div className="min-h-screen space-bg select-none flex flex-col">
          {/* 중앙 콘텐츠 */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center">
            {/* 로고 */}
            <div className="mb-10">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 rounded-full blur-2xl"
                  style={{ background: 'rgba(139,92,246,0.32)', transform: 'scale(2.4)' }} />
                <div className="absolute inset-0 rounded-full blur-3xl"
                  style={{ background: 'rgba(212,175,55,0.15)', transform: 'scale(3.2)' }} />
                <Image src="/logo.png" alt="Taroque" width={80} height={80}
                  className="w-20 h-20 md:w-24 md:h-24 relative z-10"
                  style={{ filter: 'drop-shadow(0 0 14px rgba(212,175,55,0.65)) drop-shadow(0 0 28px rgba(196,181,253,0.45))' }}
                />
              </div>
              <h1 className="arcana-title text-4xl md:text-6xl lg:text-7xl font-light text-white mb-3"
                style={{ letterSpacing: '0.18em' }}>
                TAROQUE
              </h1>
              <div className="arcana-divider mx-auto mb-5" />
              <p className="text-sm md:text-base font-light mb-2" style={{ color: 'rgba(212,175,55,0.9)', letterSpacing: '0.08em' }}>
                타로와 사주로 마음의 답을 찾아드립니다
              </p>
            </div>

            {/* 시작 버튼 */}
            <button
              onClick={() => navigateToPage('select-service')}
              className="arcana-btn text-white font-light rounded-full py-3.5 px-12 text-base"
            >
              상담 시작하기
            </button>
          </div>

          {/* 이메일 - 하단 고정 */}
          <div className="relative z-10 flex justify-center pb-8">
            <button onClick={copyEmailToClipboard} className="relative text-xs arcana-back tracking-wide">
              문의: gksdjf051@gmail.com
              {emailCopied && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 arcana-panel text-white text-xs px-2.5 py-1 rounded-lg whitespace-nowrap">
                  복사됨!
                </span>
              )}
            </button>
          </div>
        </div>
      );
    }

    // ────────────────────── 서비스 선택 ──────────────────────
    if (currentPage === 'select-service') {
      return (
        <div className="min-h-screen space-bg select-none flex flex-col">
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-16">
            <BackButton onClick={() => navigateToPage('home')} label="홈으로" />

            <div className="text-center mb-10">
              <h1 className="arcana-title text-2xl sm:text-3xl font-light text-white mb-3">어떤 상담을 원하시나요?</h1>
              <div className="arcana-divider mx-auto mb-4" />
              <p className="text-sm" style={{ color: 'rgba(210,195,255,0.88)', letterSpacing: '0.04em' }}>
                원하시는 방법을 선택해 주세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
              {/* 타로 */}
              <button
                onClick={() => navigateToPage('chat')}
                className="arcana-panel arcana-panel-hover rounded-2xl p-8 text-center"
              >
                <div className="text-3xl mb-4" style={{ color: 'rgba(212,175,55,0.88)' }}>☽</div>
                <h2 className="arcana-title text-xl font-light text-white mb-2 tracking-wider">타로</h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(185,200,225,0.92)' }}>
                  직관적인 카드를 통해<br />현재 상황과 미래를 살펴봅니다
                </p>
                <div className="space-y-1.5 text-xs" style={{ color: 'rgba(210,195,255,0.88)' }}>
                  <p>5–10분 · 구체적인 질문</p>
                  <p>현재 상황 중심 해석</p>
                </div>
              </button>

              {/* 사주 */}
              <button
                onClick={() => navigateToPage('saju-chat')}
                className="arcana-panel arcana-panel-hover rounded-2xl p-8 text-center"
              >
                <div className="text-3xl mb-4" style={{ color: 'rgba(212,175,55,0.88)' }}>☀</div>
                <h2 className="arcana-title text-xl font-light text-white mb-2 tracking-wider">사주</h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(185,200,225,0.92)' }}>
                  생년월일시를 기반으로<br />운명과 운세를 깊이 분석합니다
                </p>
                <div className="space-y-1.5 text-xs" style={{ color: 'rgba(210,195,255,0.88)' }}>
                  <p>10–15분 · 인생 전반 조언</p>
                  <p>장기적 운세 파악</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ─────────────────────── 타로 질문 ───────────────────────
    if (currentPage === 'chat') {
      return (
        <div className="min-h-screen space-bg select-none">
          <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
            <BackButton onClick={() => navigateToPage('select-service')} />

            <div className="text-center mb-10">
              <h1 className="arcana-title text-2xl sm:text-3xl font-light text-white mb-3">어떤 고민이 있으신가요?</h1>
              <div className="arcana-divider mx-auto mb-3" />
              <p className="text-sm" style={{ color: 'rgba(210,195,255,0.88)', letterSpacing: '0.02em' }}>
                자유롭게 털어놓으세요
              </p>
            </div>

            <form onSubmit={handleChatSubmit} className="mb-10">
              <div className="arcana-panel rounded-xl p-5 mb-4">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="자유롭게 고민을 적어주세요..."
                  className="w-full h-36 bg-transparent text-white border-none outline-none resize-none text-sm leading-relaxed select-text"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                  maxLength={500}
                />
                <div className="flex justify-end pt-3 border-t" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
                  <span className="text-xs" style={{ color: 'rgba(185,200,225,0.72)' }}>{question.length} / 500</span>
                </div>
              </div>
              <button type="submit" disabled={!question.trim() || isLoadingChat}
                className="arcana-btn w-full text-white font-light py-3 px-6 rounded-xl">
                {isLoadingChat ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />분석 중...
                  </span>
                ) : '다음으로 →'}
              </button>
            </form>

            {/* 예시 질문 */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: 'rgba(218,175,60,0.2)' }} />
                <p className="text-xs font-medium tracking-widest shrink-0" style={{ color: 'rgba(212,175,55,0.85)' }}>
                  예시 질문
                </p>
                <div className="flex-1 h-px" style={{ background: 'rgba(218,175,60,0.2)' }} />
              </div>
              {categories.map((cat) => (
                <div key={cat.key} className="arcana-panel rounded-xl p-5">
                  <h3 className="text-xs font-medium tracking-widest mb-3"
                    style={{ color: 'rgba(212,175,55,0.85)' }}>
                    {cat.label.toUpperCase()}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {exampleQuestions[cat.key].map((q, i) => (
                      <button key={i} onClick={() => handleExampleClick(q)}
                        className="arcana-question-btn rounded-lg px-3 py-2.5 text-xs leading-relaxed"
                        style={{ color: 'rgba(185,200,225,0.95)' }}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ─────────────────────── 카드 선택 ───────────────────────
    if (currentPage === 'select-cards') {
      if (isAnalyzing) return <ArcanaLoader message="고민을 분석하고 있어요" />;
      return (
        <div className="h-[100dvh] overflow-hidden space-bg select-none flex flex-col">
          <div className="relative z-10 flex flex-col items-center h-full py-4 gap-3 overflow-hidden">
            <div className="text-center px-6 shrink-0">
              <h1 className="arcana-title text-xl sm:text-2xl md:text-3xl font-light text-white mb-1">
                {cardCount}장의 카드를 뽑아 올리세요
              </h1>
              <p className="text-sm" style={{ color: 'rgba(210,195,255,0.82)', letterSpacing: '0.02em' }}>
                마음이 끌리는 카드를 선택해보세요
              </p>
            </div>
            <div className="flex-1 min-h-0 w-full overflow-hidden">
              <CardDeck
                shuffledIndices={shuffledCardIndices}
                cards={tarotCards}
                requiredCount={cardCount}
                positions={positions}
                onProceed={handleCardSelectionComplete}
                isProceedLoading={isProceedLoading}
              />
            </div>
          </div>
        </div>
      );
    }

    // ─────────────────────── 사주 입력 ───────────────────────
    if (currentPage === 'saju-chat') {
      return (
        <div className="min-h-screen space-bg select-none">
          <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
            <BackButton onClick={() => navigateToPage('select-service')} />

            <div className="text-center mb-10">
              <h1 className="arcana-title text-3xl font-light text-white mb-3">사주 상담</h1>
              <div className="arcana-divider mx-auto mb-3" />
              <p className="text-sm" style={{ color: 'rgba(210,195,255,0.88)', letterSpacing: '0.06em' }}>
                생년월일시와 궁금한 점을 알려주세요
              </p>
            </div>

            <SajuInput onSajuInfoChange={setSajuInfo} />

            <form onSubmit={handleSajuSubmit} className="mb-10">
              <div className="arcana-panel rounded-xl p-5 mb-4">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="궁금한 점을 자유롭게 적어주세요..."
                  className="w-full h-36 bg-transparent border-none outline-none resize-none text-sm leading-relaxed select-text"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                  maxLength={500}
                />
                <div className="flex justify-end pt-3 border-t" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
                  <span className="text-xs" style={{ color: 'rgba(185,200,225,0.55)' }}>{question.length} / 500</span>
                </div>
              </div>
              <button type="submit" disabled={!question.trim() || !sajuInfo || isLoadingSaju}
                className="arcana-btn w-full text-white font-light py-3 px-6 rounded-xl">
                {isLoadingSaju ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />사주 풀이 중...
                  </span>
                ) : !sajuInfo ? '생년월일시를 입력해주세요' : '사주 풀이 보기 →'}
              </button>
            </form>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: 'rgba(218,175,60,0.2)' }} />
                <p className="text-xs font-medium tracking-widest shrink-0" style={{ color: 'rgba(212,175,55,0.85)' }}>
                  예시 질문
                </p>
                <div className="flex-1 h-px" style={{ background: 'rgba(218,175,60,0.2)' }} />
              </div>
              {sajuCategories.map((cat) => (
                <div key={cat.key} className="arcana-panel rounded-xl p-5">
                  <h3 className="text-xs font-medium tracking-widest mb-3"
                    style={{ color: 'rgba(212,175,55,0.85)' }}>
                    {cat.label.toUpperCase()}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sajuExampleQuestions[cat.key].map((q, i) => (
                      <button key={i} onClick={() => handleExampleClick(q)}
                        className="arcana-question-btn rounded-lg px-3 py-2.5 text-xs leading-relaxed"
                        style={{ color: 'rgba(185,200,225,0.95)' }}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ─────────────────────── 사주 결과 ───────────────────────
    if (currentPage === 'saju-result') {
      if (isLoadingSaju) return <ArcanaLoader message="사주를 풀이하고 있어요" />;
      return (
        <div className="min-h-screen space-bg">
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h1 className="arcana-title text-3xl font-light text-white mb-4">사주 풀이 결과</h1>
              <div className="arcana-divider mx-auto mb-6" />
              <div className="arcana-panel rounded-xl p-5 max-w-2xl mx-auto">
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(210,220,240,0.95)' }}>
                  <span className="text-white font-medium">Q. </span>{question}
                </p>
                {sajuInfo && (
                  <p className="text-xs mt-3 pt-3 border-t" style={{ color: 'rgba(196,181,253,0.7)', borderColor: 'rgba(212,175,55,0.15)' }}>
                    {sajuInfo.year}년 {sajuInfo.month}월 {sajuInfo.day}일{' '}
                    {sajuInfo.hour !== -1 ? `${sajuInfo.hour}시 ${sajuInfo.minute}분` : '(시간 모름)'}{' '}
                    · {sajuInfo.isLunar ? '음력' : '양력'} · {sajuInfo.gender === 'male' ? '남성' : '여성'}
                  </p>
                )}
              </div>
            </div>

            <div className="arcana-panel rounded-2xl p-8 mb-8">
              <div className="text-gray-300 prose prose-invert max-w-none leading-relaxed interpretation-content"
                dangerouslySetInnerHTML={{ __html: toHtml(sajuInterpretation) }} />
            </div>

            <div className="flex flex-col md:flex-row gap-3 justify-center">
              <button onClick={resetToHome} className="arcana-btn-ghost text-white font-light py-2.5 px-8 rounded-full text-sm">
                홈으로
              </button>
              <button onClick={() => navigateToPage('saju-chat')} className="arcana-btn text-white font-light py-2.5 px-8 rounded-full text-sm">
                다른 질문하기
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ─────────────────────── 타로 결과 ───────────────────────
    if (currentPage === 'result') {
      if (isLoadingResult) return <ArcanaLoader message="카드를 해석하고 있어요" />;
      return (
        <div className="min-h-screen space-bg">
          <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h1 className="arcana-title text-3xl font-light text-white mb-4">리딩 결과</h1>
              <div className="arcana-divider mx-auto mb-6" />
              <div className="arcana-panel rounded-xl p-5 max-w-2xl mx-auto">
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(210,220,240,0.95)' }}>
                  <span className="text-white font-medium">Q. </span>{question}
                </p>
              </div>
            </div>

            {/* 선택된 카드들 - 팬 배치 */}
            {(() => {
              const N = selectedCardSelections.length;
              const CW = 72, CH = 108, PAD = 30, MAX_ROT = 16;
              // 가용 너비에 맞게 겹침 자동 축소 (px-6 양쪽 = 48px)
              const availW = typeof window !== 'undefined' ? window.innerWidth - 48 : 600;
              const OVL = N > 1 ? Math.min(56, Math.floor((availW - CW - PAD * 2) / (N - 1))) : 56;
              const fanW = Math.max((N - 1) * OVL + CW + PAD * 2, CW + PAD * 2);
              const fanH = CH + 8;
              return (
                <div className="flex flex-col items-center mb-10">
                  <div className="relative" style={{ width: `${fanW}px`, height: `${fanH}px` }}>
                    {selectedCardSelections.map((card, index) => {
                      const cardInfo = getCardInfo(card.cardId);
                      const t = N > 1 ? index / (N - 1) : 0.5;
                      const tCentered = t - 0.5;
                      const tilt = tCentered * MAX_ROT;
                      const x = PAD + index * OVL;
                      const arcY = Math.abs(tCentered) * 10;
                      return (
                        <div
                          key={index}
                          className="absolute result-card-enter"
                          style={{
                            left: `${x}px`,
                            top: `${arcY}px`,
                            width: `${CW}px`,
                            height: `${CH}px`,
                            transform: `rotate(${tilt}deg)`,
                            transformOrigin: '50% 100%',
                            zIndex: 10 + index,
                            '--delay': `${index * 110}ms`,
                            '--card-rot': `${tilt}deg`,
                          } as React.CSSProperties}
                        >
                          <div className="rounded-xl overflow-hidden border-2 w-full h-full"
                            style={{
                              borderColor: 'rgba(212,175,55,0.55)',
                              boxShadow: '0 6px 24px rgba(0,0,0,0.55)',
                            }}>
                            {cardInfo && (
                              <div className={`w-full h-full relative ${card.isReversed ? 'rotate-180' : ''}`}>
                                <Image src={cardInfo.imageUrl} alt={cardInfo.name} fill sizes="72px" className="object-contain" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* 카드 이름 목록 - 팬 아래 별도 표시 */}
                  <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-5 px-4">
                    {selectedCardSelections.map((card, index) => {
                      const cardInfo = getCardInfo(card.cardId);
                      return (
                        <div key={index} className="text-center">
                          <p className="text-[10px] tracking-wide mb-0.5"
                            style={{ color: 'rgba(212,175,55,0.7)' }}>
                            {card.position}
                          </p>
                          <p className="text-[11px] font-medium text-white">
                            {cardInfo?.name}
                            {card.isReversed && <span style={{ color: 'rgba(248,113,113,0.65)' }}> ↑</span>}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* 해석 */}
            <div className="arcana-panel rounded-2xl p-8 mb-8">
              <div className="text-gray-300 prose prose-invert max-w-none leading-relaxed interpretation-content"
                dangerouslySetInnerHTML={{ __html: toHtml(interpretation) }} />
            </div>

            <div className="flex flex-col md:flex-row gap-3 justify-center">
              <button onClick={resetToHome} className="arcana-btn-ghost text-white font-light py-2.5 px-8 rounded-full text-sm">
                홈으로
              </button>
              <button onClick={() => { setQuestion(''); setSelectedCardSelections([]); setInterpretation(''); setShuffledCardIndices([]); navigateToPage('chat'); }}
                className="arcana-btn text-white font-light py-2.5 px-8 rounded-full text-sm">
                다른 고민 상담하기
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={isTransitioning ? 'fade-out' : 'fade-in'}>
      {pageContent()}
    </div>
  );
}
