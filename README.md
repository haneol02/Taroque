# Taroque - AI 대화형 타로 웹서비스

AI가 사용자의 고민을 분석하고 최적의 타로 카드 해석을 제공하는 웹서비스입니다.

## 🌟 주요 기능

- **대화형 질문 입력**: 자유로운 텍스트로 고민을 입력
- **AI 카드 수 결정**: GPT가 질문을 분석하여 최적의 카드 수 자동 결정  
- **직관적 카드 선택**: 78장의 타로 카드 중 직감으로 선택
- **전문가 수준의 해석**: AI가 30년 경력 타로 전문가처럼 따뜻한 조언 제공

## 🚀 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-3.5 Turbo  
- **Deployment**: Vercel (권장)

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 홈페이지
│   ├── chat/page.tsx         # 질문 입력 페이지
│   ├── select-cards/page.tsx # 카드 선택 페이지
│   ├── result/page.tsx       # 결과 페이지
│   └── api/
│       ├── analyze-question/ # 질문 분석 API
│       └── interpret-cards/  # 카드 해석 API
├── components/              # 재사용 컴포넌트
├── lib/                    
│   ├── openai.ts           # OpenAI 설정
│   └── tarot-data.ts       # 타로 카드 데이터
└── types/
    └── tarot.ts            # 타입 정의
```

## 🛠 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   `.env.local` 파일에 OpenAI API 키 설정:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   http://localhost:3000

## 🎯 사용 방법

1. **홈페이지**: "고민 상담하기" 버튼 클릭
2. **질문 입력**: 자유롭게 고민을 텍스트로 입력 (최대 500자)
3. **AI 분석**: GPT가 질문을 분석하여 필요한 카드 수 결정
4. **카드 선택**: 직감적으로 카드를 선택
5. **결과 확인**: AI가 생성한 전문적인 타로 해석 확인

## 🔮 카드 수별 해석 방식

- **1장**: 단순한 Yes/No, 오늘의 운세
- **3장**: 과거-현재-미래 구조의 일반적 고민
- **5장**: 복잡한 상황의 다각도 분석  
- **7장**: 매우 복합적인 문제의 종합적 분석

## 🚀 배포

Vercel을 이용한 배포:

1. **Vercel에 프로젝트 연결**
2. **환경 변수 설정** (OPENAI_API_KEY)
3. **자동 배포 완료**

## 💡 향후 개선사항

- 사용자 인증 및 히스토리 저장
- 실제 타로 카드 이미지 적용
- 모바일 반응형 최적화  
- 소셜 공유 기능 강화
- 다국어 지원
