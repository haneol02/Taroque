# Taroque - AI 대화형 타로 웹서비스

AI가 사용자의 고민을 분석하고 최적의 타로 카드 해석을 제공하는 웹서비스입니다.

## 🌟 주요 기능

- **원페이지 인터페이스**: 단일 페이지에서 모든 타로 상담 진행
- **실시간 카드 선택**: 78장의 타로 카드 중 직관적으로 선택
- **AI 카드 해석**: OpenAI GPT를 활용한 전문적인 타로 해석
- **개인 API 키 사용**: 사용자가 직접 OpenAI API 키를 입력하여 사용

## 🚀 기술 스택

- **Frontend**: Next.js 15.5, React 19.1, TypeScript
- **Styling**: Tailwind CSS 4
- **AI**: OpenAI API
- **Markdown**: marked 라이브러리
- **Build Tool**: Turbopack

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 메인 타로 상담 페이지
│   ├── layout.tsx            # 레이아웃
│   ├── globals.css           # 전역 스타일
│   └── api/
│       ├── analyze-question/ # 질문 분석 API
│       └── interpret-cards/  # 카드 해석 API
├── components/
│   ├── TarotCard.tsx         # 타로 카드 컴포넌트
│   └── ApiKeyInput.tsx       # API 키 입력 컴포넌트
├── lib/
│   ├── openai.ts             # OpenAI 클라이언트 설정
│   └── tarot-data.ts         # 타로 카드 데이터 (78장)
└── types/
    └── tarot.ts              # 타입 정의
```

## 🛠 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **브라우저에서 확인**
   - http://localhost:3000 접속
   - 초기 화면에서 OpenAI API 키 입력

## 🎯 사용 방법

1. **API 키 입력**: 초기 화면에서 OpenAI API 키 입력
2. **질문 입력**: 고민이나 궁금한 점을 텍스트로 작성
3. **카드 선택**: 화면에 표시되는 78장의 타로 카드 중 직관적으로 선택
4. **해석 확인**: AI가 선택한 카드를 바탕으로 생성한 타로 해석 확인
5. **새로운 상담**: "다시 시작" 버튼으로 새로운 타로 상담 진행

## 🔮 타로 카드 구성

- **메이저 아르카나**: 22장 (0-21번)
- **마이너 아르카나**: 56장
  - 완드 (Wands): 14장
  - 컵 (Cups): 14장
  - 소드 (Swords): 14장
  - 펜타클 (Pentacles): 14장

## 🚀 배포

### Vercel 배포
```bash
# Vercel CLI 사용
npm install -g vercel
vercel
```

배포 후 사용자가 직접 API 키를 입력하므로 환경 변수 설정이 불필요합니다.

## 📱 주요 특징

- **클라이언트 사이드 API 키 관리**: 서버에 API 키를 저장하지 않음
- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **다크 테마**: 신비로운 타로 분위기의 다크 UI
- **마크다운 지원**: AI 응답을 마크다운으로 렌더링

## 💡 향후 개선사항

- 타로 카드 이미지 추가
- 상담 히스토리 로컬 저장
- 소셜 공유 기능
- 다국어 지원 (영어, 일본어 등)
- 애니메이션 효과 강화

## 📞 문의

프로젝트 관련 문의나 버그 리포트는 GitHub Issues를 이용해 주세요.
