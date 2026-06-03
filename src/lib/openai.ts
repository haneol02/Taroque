import OpenAI from 'openai';
import { CardSelection } from '@/types/tarot';

export const createOpenAIClient = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const MODEL = 'gpt-5.4-mini';

// ── 수트별 원소 ──────────────────────────────────────────────
const SUIT_ELEMENT: Record<string, string> = {
  major: '메이저 아르카나',
  wands:     '불 원소 (Fire) — 의지·열정·창조·행동의 에너지',
  cups:      '물 원소 (Water) — 감정·직관·관계·무의식의 에너지',
  swords:    '공기 원소 (Air) — 사고·진실·갈등·커뮤니케이션의 에너지',
  pentacles: '흙 원소 (Earth) — 물질·현실·신체·재정의 에너지',
};

// ── 수비학 의미 ──────────────────────────────────────────────
const NUM_MEANING: Record<number, string> = {
  1:  '순수한 시작, 잠재력의 씨앗',
  2:  '선택, 균형, 파트너십',
  3:  '창조, 표현, 성장',
  4:  '안정, 구조, 기반',
  5:  '변화, 갈등, 도전',
  6:  '조화, 치유, 책임',
  7:  '성찰, 탐구, 신비',
  8:  '힘, 실행, 순환',
  9:  '완성, 지혜, 통합',
  10: '순환의 끝, 새 시작의 문턱',
  11: '새 에너지, 메시지, 가능성 (페이지)',
  12: '행동, 추진력, 탐험 (나이트)',
  13: '성숙한 통찰, 양육, 권위 (퀸)',
  14: '완전한 통달, 지배적 힘 (킹)',
};

// ── 카드 번호 추출 (마이너 아르카나) ─────────────────────────
function getMinorNum(cardId: number): number {
  // Major: id 1-22, cups: 23-36, wands: 37-50, swords: 51-64, pentacles: 65-78
  if (cardId <= 22) return 0;
  return ((cardId - 23) % 14) + 1;
}

// ── 카드 컨텍스트 생성 ────────────────────────────────────────
export function buildCardContext(card: CardSelection & { suit?: string; cardId: number }) {
  const suit = card.suit || 'major';
  const element = SUIT_ELEMENT[suit];
  const isMajor = suit === 'major';

  let numContext = '';
  if (isMajor) {
    numContext = `메이저 아르카나 (영혼·운명·카르마의 영역)`;
  } else {
    const n = getMinorNum(card.cardId);
    numContext = `마이너 아르카나 · ${n}번 에너지 — ${NUM_MEANING[n] || ''}`;
  }

  const direction = card.isReversed
    ? '역방향 — 에너지가 내면화되거나 억압·지연·과잉 표현되는 상태'
    : '정방향 — 에너지가 외향적이고 활성화된 상태';

  return `
**${card.position}**: ${card.cardName} (${card.isReversed ? '역방향 ↑' : '정방향'})
- 원소: ${element}
- 성격: ${numContext}
- 방향성: ${direction}
- 핵심 키워드: ${card.keywords?.join(' · ') || ''}
- 기본 의미: ${card.meaning || ''}`.trim();
}

// ── 스프레드 통계 ─────────────────────────────────────────────
function analyzeSpread(cards: Array<CardSelection & { suit?: string }>) {
  const majorCards = cards.filter(c => (c.suit || 'major') === 'major');
  const minorCards = cards.filter(c => (c.suit || 'major') !== 'major');
  const reversedCards = cards.filter(c => c.isReversed);

  const suitCount: Record<string, number> = {};
  minorCards.forEach(c => {
    const s = c.suit || '';
    suitCount[s] = (suitCount[s] || 0) + 1;
  });
  const dominantSuit = Object.entries(suitCount).sort((a, b) => b[1] - a[1])[0];

  const suitNames: Record<string, string> = {
    wands: '완드(불)', cups: '컵(물)', swords: '소드(공기)', pentacles: '펜타클(흙)'
  };

  let spreadNote = '';
  if (majorCards.length >= cards.length * 0.5) {
    spreadNote = `📌 메이저 아르카나가 ${majorCards.length}장 — 카르마적·영혼적 주제가 강하게 작용 중입니다.`;
  } else if (majorCards.length === 0) {
    spreadNote = `📌 전체가 마이너 아르카나 — 현재 삶의 구체적 상황과 일상적 에너지에 초점이 맞춰져 있습니다.`;
  } else {
    spreadNote = `📌 메이저 ${majorCards.length}장 + 마이너 ${minorCards.length}장의 혼합 — 운명적 흐름 속 개인의 선택이 중요한 시점입니다.`;
  }

  if (dominantSuit) {
    spreadNote += ` ${suitNames[dominantSuit[0]]} 원소가 지배적(${dominantSuit[1]}장).`;
  }

  if (reversedCards.length >= cards.length * 0.6) {
    spreadNote += ` 역방향 카드가 많아 내면적 작업이 요구되는 시기입니다.`;
  }

  return spreadNote;
}

// ── 질문 분석 프롬프트 ────────────────────────────────────────
export const analyzeQuestionPrompt = (userQuestion: string) => `
사용자의 고민을 분석하여 가장 적합한 타로 스프레드를 결정해주세요.

사용자 질문: "${userQuestion}"

스프레드 선택 기준:
- 1카드: Yes/No 질문, 오늘의 에너지, 단순하고 명확한 한 가지 질문
- 3카드: 일반적 상황 분석 (예: 상황/행동/결과 / 과거/현재/미래 / 몸/마음/영혼)
- 5카드: 복합적 상황, 여러 요소가 얽힌 문제, 심층 분석 필요
- 7카드: 삶의 큰 흐름, 인생 전환점, 매우 복잡한 다면적 고민

포지션 이름 규칙:
- 타로 전통에 기반한 실제 포지션 이름 사용
- 추상적이지 않고 의미가 분명한 이름
- 예시: "표면에 드러난 것", "숨겨진 영향", "잠재적 가능성", "조언", "가장 가능성 높은 결과"

반드시 순수 JSON만 반환 (다른 텍스트 없이):
{
  "cardCount": 3,
  "reason": "과거의 영향과 현재 상황, 미래 방향성을 통합적으로 볼 필요가 있습니다",
  "positions": ["과거에서 온 영향", "현재의 에너지", "가장 가능성 높은 결과"]
}
`;

// ── 카드 해석 프롬프트 (전면 개선) ───────────────────────────
export const interpretCardsPrompt = (
  question: string,
  cards: Array<CardSelection & { suit?: string }>
) => {
  const spreadNote = analyzeSpread(cards);
  const cardContexts = cards.map(c => buildCardContext(c)).join('\n\n');

  return `질문자의 고민: "${question}"

═══ 배열된 카드 ═══
${cardContexts}

═══ 스프레드 분석 ═══
${spreadNote}

위 정보를 바탕으로 전문 타로 리딩을 수행해주세요.

━━━ 해석 구조 (마크다운) ━━━

## 스프레드 개관

카드들의 전체적인 에너지장을 먼저 읽습니다. 메이저/마이너 아르카나의 비율이 이 상황에 대해 무엇을 말하는지, 어떤 원소 에너지가 지배적인지, 역방향 카드가 있다면 어떤 내면적 흐름이 있는지를 2-3문장으로 전달합니다.

## 핵심 메시지

"${question}"에 대해 이 스프레드 전체가 전하는 가장 중요한 단 하나의 메시지를 2-3문장으로 명확하게 전달합니다. 모호하지 않고, 질문자가 실제로 듣고 싶어하는 것을 정면으로 다룹니다.

## 포지션별 심층 리딩

${cards.map(c => `### ${c.position}: ${c.cardName} ${c.isReversed ? '(역방향)' : ''}

이 카드가 이 포지션에 나타난 것의 의미를 3-4문장으로 심층 해석합니다.
- **상징 & 에너지**: 이 카드가 라이더-웨이트 체계에서 어떤 원형(Archetype)을 담고 있는지, 카드 이미지의 어떤 요소가 현재 상황과 공명하는지
- **포지션 메시지**: "${c.position}"이라는 자리에서 이 카드가 질문자에게 전달하는 구체적 메시지
${c.isReversed ? '- **역방향의 그림자**: 억압되거나 내면화된 이 에너지가 어떻게 드러나고 있는지' : ''}`
  ).join('\n\n')}

## 카드들의 대화

카드들이 서로 어떻게 에너지를 주고받는지 읽습니다. 인접한 카드들의 원소가 조화를 이루는지 충돌하는지, 전체 스프레드에서 에너지의 흐름이 어떤 방향으로 움직이는지를 3-4문장으로 전달합니다. 단순히 카드를 나열하지 않고, 하나의 이야기로 엮어냅니다.

## 타로가 드러내는 본질

이 스프레드가 드러내는 질문자의 내면적 상태, 무의식적 패턴, 혹은 미처 인식하지 못한 역동을 2-3문장으로 직접적으로 짚습니다. 심리적·영적 통찰을 포함합니다.

## 실천의 지혜

- **지금 당장 할 것**: 이 스프레드가 권고하는 가장 즉각적인 행동
- **내려놓을 것**: 현재 상황을 막고 있는 집착, 믿음, 혹은 행동 패턴
- **키울 것**: 이 상황을 헤쳐나가기 위해 강화해야 할 내면의 자원
- **주의할 것**: 카드가 경고하는 함정 혹은 유혹

## 에너지의 향방

**현재 흐름을 따를 때**: 지금의 방향이 이어진다면 펼쳐질 가능성
**의식적 전환을 선택할 때**: 새로운 선택이 만들어낼 다른 흐름
**결정적 타이밍**: 이 상황에서 특히 중요한 시기나 전환점 (가능한 경우)

## 리더의 말

이 리딩을 마무리하는 가장 핵심적인 메시지를 2-3문장으로. 위로나 희망이 아닌, 진실하고 힘 있는 말로. 질문자가 자신의 힘으로 나아갈 수 있다는 믿음을 전합니다.

━━━ 작성 원칙 ━━━
- 카드의 상징(이미지, 색상, 인물, 숫자)을 구체적으로 언급
- "일반적으로", "보통" 대신 "이 스프레드에서", "당신의 경우" 사용
- 역방향 카드는 단순 반대 의미가 아닌 에너지의 내면화·지연·과잉으로 해석
- 메이저 아르카나는 더 깊은 카르마적 맥락으로, 마이너는 현실적 맥락으로 해석
- 총 1600-2000자 내외의 충실하고 전문적인 리딩
- 한국어로 작성
`;
};
