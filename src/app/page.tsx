import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-40">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-wide">
              TAROQUE
            </h1>
            <div className="w-24 h-0.5 bg-slate-500 mx-auto mb-8"></div>
            <p className="text-xl text-slate-300 mb-4 font-light">
              마음의 답을 찾아드려요.
            </p>
            <p className="text-md text-slate-500 mb-16 leading-relaxed">
              고민을 자유롭게 털어놓으세요.<br />타로큐가 타로를 통해 답해드립니다.
            </p>
          </div>
          
          <div className="mb-20">
            <Link 
              href="/chat"
              className="inline-flex items-center px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-all duration-200 border border-slate-700 hover:border-slate-600"
            >
              고민 상담하기
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-3">맞춤 분석</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                고민에 따라 최적의 카드 수를<br />자동으로 결정합니다
              </p>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-3">직관적 선택</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                마음이 이끄는 대로<br />카드를 선택하세요
              </p>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-3">개인화된 해석</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                30년 경력의 전문가처럼<br />따뜻한 조언을 받아보세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
