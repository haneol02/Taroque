'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { exampleQuestions } from '@/lib/tarot-data';
import { ExampleQuestions } from '@/types/tarot';

export default function ChatPage() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    
    try {
      localStorage.setItem('userQuestion', question);
      router.push('/select-cards');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (exampleQuestion: string) => {
    setQuestion(exampleQuestion);
  };

  const categories = [
    { key: 'love' as keyof ExampleQuestions, label: '연애' },
    { key: 'career' as keyof ExampleQuestions, label: '진로' },
    { key: 'life' as keyof ExampleQuestions, label: '인생' },
    { key: 'relationship' as keyof ExampleQuestions, label: '인간관계' }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center text-slate-400 hover:text-white transition-colors duration-200 text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                홈으로 돌아가기
              </Link>
            </div>
            <h1 className="text-3xl font-light text-white mb-4">
              어떤 고민이 있으신가요?
            </h1>
            <p className="text-slate-400 text-lg">
              마음을 털어놓으세요. 비밀은 보장됩니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-12">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="자유롭게 고민을 적어주세요... (최대 500자)"
                className="w-full h-40 bg-transparent text-white placeholder-slate-500 border-none outline-none resize-none text-lg leading-relaxed"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
                <span className="text-slate-500 text-sm">
                  {question.length}/500
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-white font-medium py-3 md:py-4 px-6 md:px-8 rounded-lg transition-all duration-200 border border-slate-700 hover:border-slate-600 disabled:cursor-not-allowed disabled:border-slate-800 text-sm md:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  분석 중...
                </div>
              ) : '타로큐에게 물어보기'}
            </button>
          </form>

          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-xl font-light text-white mb-2">
                예시 질문들
              </h2>
              <div className="w-16 h-0.5 bg-slate-600 mx-auto"></div>
            </div>
            
            {categories.map((category) => (
              <div key={category.key} className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">
                  {category.label}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exampleQuestions[category.key].map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(question)}
                      className="text-left p-3 md:p-4 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-500 rounded-lg text-slate-300 hover:text-white transition-all duration-200 text-xs md:text-sm leading-relaxed"
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