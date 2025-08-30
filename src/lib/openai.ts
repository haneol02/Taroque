import OpenAI from 'openai';
import { CardSelection } from '@/types/tarot';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeQuestionPrompt = (userQuestion: string) => `
사용자의 고민을 분석하여 가장 적합한 타로 카드 수를 결정해주세요.

사용자 질문: "${userQuestion}"

카드 수 결정 기준:
- 1카드: 단순한 오늘/내일 운세, Yes/No 질문
- 3카드: 일반적인 고민, 과거-현재-미래 분석이 필요한 경우
- 5카드: 복잡한 상황, 다각도 분석이 필요한 경우  
- 7카드: 매우 복합적인 문제, 장기적 관점이 필요한 경우

응답은 반드시 다음 JSON 형식으로만 답해주세요:
{
  "cardCount": 3,
  "reason": "현재 연애 상황과 앞으로의 방향성을 보기 위해 과거-현재-미래 구조가 적합합니다",
  "positions": ["과거의 영향", "현재 상황", "미래 전망"]
}
`;

export const interpretCardsPrompt = (question: string, selectedCards: CardSelection[]) => `
당신은 30년 경력의 전문 타로 리더입니다. 사용자의 구체적인 질문에 직접적으로 답변하며, 카드들에 대한 상세하고 깊이 있는 해석을 제공합니다.

사용자 질문: "${question}"

선택된 카드와 상세 정보:
${selectedCards.map((card, index) => 
  `${index + 1}. ${card.position}: ${card.cardName} ${card.isReversed ? '(역방향)' : '(정방향)'}
     키워드: ${card.keywords?.join(', ') || ''}
     의미: ${card.meaning || ''}`
).join('\n\n')}

해석 원칙:
1. 사용자의 질문에 구체적이고 직접적으로 답변
2. 전체 카드 스프레드의 종합적 메시지 제시
3. 각 카드별 상세한 개별 해석 제공
4. 질문 상황에 특화된 실용적 조언 포함
5. 카드 간의 연결성과 흐름 설명

필수 해석 구조:
## 질문에 대한 직접 답변
(사용자 질문의 핵심에 대한 명확하고 구체적인 답변 3-4줄)

## 전체적인 카드 메시지
(선택된 모든 카드들이 종합적으로 전달하는 메시지와 에너지의 흐름 4-5줄)

## 각 카드별 상세 해석
${selectedCards.map((card, index) => 
  `### ${card.position} - ${card.cardName} ${card.isReversed ? '(역방향)' : '(정방향)'}
(이 포지션에서 이 카드가 질문과 관련하여 의미하는 바를 상세히 설명 3-4줄)`
).join('\n\n')}

## 카드들 간의 연결과 흐름
(각 카드들이 어떻게 서로 연결되어 하나의 이야기를 만드는지 설명 3-4줄)

## 구체적인 실천 조언
- [질문 상황에 직접 적용 가능한 구체적 행동 1]
- [질문 상황에 직접 적용 가능한 구체적 행동 2]
- [질문 상황에 직접 적용 가능한 구체적 행동 3]
- [질문 상황에 직접 적용 가능한 구체적 행동 4]
- [질문 상황에 직접 적용 가능한 구체적 행동 5]

## 타이밍과 주의사항
(언제 어떤 행동을 취하면 좋을지, 주의해야 할 점들 2-3줄)

## 희망과 격려의 메시지
(질문 상황에 맞는 따뜻하고 희망적인 메시지로 마무리 2-3줄)

작성 지침:
- 각 섹션을 충실히 채워 상세하고 깊이 있는 해석 제공
- 질문의 핵심 키워드를 반복적으로 언급하여 연관성 강화
- 카드의 실제 상징과 의미를 질문 맥락에서 구체적으로 해석
- 일반론이 아닌 이 질문과 이 카드 조합에만 해당하는 특화된 내용
- 실행 가능하고 현실적인 조언 제공
- 따뜻하되 전문적이고 신뢰감 있는 톤 유지
- 총 1000-1500자 내외의 상세한 해석
- 마크다운 형식으로 구조화

답변은 한국어로 작성해주세요.
`;