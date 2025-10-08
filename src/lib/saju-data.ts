import { SajuExampleQuestions } from '@/types/tarot';

export const sajuExampleQuestions: SajuExampleQuestions = {
  fortune: [
    '올해 나의 재물운은 어떤가요?',
    '사업을 시작하기 좋은 시기인가요?',
    '투자 결정을 해도 괜찮을까요?',
    '금전적으로 안정될 수 있을까요?'
  ],
  career: [
    '지금 직장을 옮기는 것이 좋을까요?',
    '이 분야에서 성공할 수 있을까요?',
    '승진 기회가 올까요?',
    '창업을 해도 될까요?'
  ],
  love: [
    '올해 좋은 인연을 만날 수 있을까요?',
    '지금 만나는 사람과 결혼해도 될까요?',
    '연애운이 언제쯤 좋아질까요?',
    '배우자와의 궁합은 어떤가요?'
  ],
  health: [
    '건강상 주의해야 할 점은 무엇인가요?',
    '앞으로의 건강운은 어떤가요?',
    '체질 개선을 위해 무엇을 해야 할까요?',
    '가족의 건강은 괜찮을까요?'
  ]
};

// 천간 (天干)
export const heavenlyStems = ['갑(甲)', '을(乙)', '병(丙)', '정(丁)', '무(戊)', '기(己)', '경(庚)', '신(辛)', '임(壬)', '계(癸)'];

// 지지 (地支)
export const earthlyBranches = ['자(子)', '축(丑)', '인(寅)', '묘(卯)', '진(辰)', '사(巳)', '오(午)', '미(未)', '신(申)', '유(酉)', '술(戌)', '해(亥)'];

// 오행 (五行)
export const elements = ['목(木)', '화(火)', '토(土)', '금(金)', '수(水)'];

// 십신 (十神)
export const tenGods = ['비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인'];

// 시간대별 시주 매핑 (23:00-01:00 자시, 01:00-03:00 축시, ...)
export const hourBranches = [
  { start: 23, end: 1, branch: '자(子)' },
  { start: 1, end: 3, branch: '축(丑)' },
  { start: 3, end: 5, branch: '인(寅)' },
  { start: 5, end: 7, branch: '묘(卯)' },
  { start: 7, end: 9, branch: '진(辰)' },
  { start: 9, end: 11, branch: '사(巳)' },
  { start: 11, end: 13, branch: '오(午)' },
  { start: 13, end: 15, branch: '미(未)' },
  { start: 15, end: 17, branch: '신(申)' },
  { start: 17, end: 19, branch: '유(酉)' },
  { start: 19, end: 21, branch: '술(戌)' },
  { start: 21, end: 23, branch: '해(亥)' }
];
