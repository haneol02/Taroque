import { NextRequest, NextResponse } from 'next/server';
import { createOpenAIClient, interpretCardsPrompt, MODEL } from '@/lib/openai';
import { CardSelection } from '@/types/tarot';
import { tarotCards } from '@/lib/tarot-data';

export async function POST(request: NextRequest) {
  let question = '';
  let selectedCards: CardSelection[] = [];

  try {
    const body = await request.json();
    question = body.question;
    selectedCards = body.selectedCards;

    if (!question || !Array.isArray(selectedCards) || selectedCards.length === 0) {
      return NextResponse.json({ error: 'Question and selectedCards are required' }, { status: 400 });
    }

    // 카드 데이터 강화 (원소, 수비학, 상징 정보 포함)
    const enrichedCards = selectedCards.map((card: CardSelection) => {
      const tarotCard = tarotCards.find(tc => tc.id === card.cardId);
      return {
        ...card,
        cardName: tarotCard?.name || card.cardName || `카드 ${card.cardId}`,
        suit: tarotCard?.suit || 'major',
        meaning: card.isReversed ? tarotCard?.reversedMeaning : tarotCard?.uprightMeaning,
        keywords: tarotCard?.keywords || card.keywords || [],
      };
    });

    const openai = createOpenAIClient();
    const response = await openai.responses.create({
      model: MODEL,
      instructions: `당신은 20년 이상 실전 타로 리딩을 해온 전문가입니다.

핵심 지침 — 질문에 먼저 답하세요:
질문자가 "이 관계가 잘 될까요?"라고 물으면, 리딩은 그 질문에 대한 답으로 시작해야 합니다.
카드는 그 답을 뒷받침하는 근거이지, 리딩의 주인공이 아닙니다.

각 카드 해석의 구조:
1. 먼저 이 카드 자체가 어떤 카드인지 짧게 설명 (1-2문장)
2. 그 다음 "그 카드가 질문자의 상황에서 무엇을 뜻하는지" 로 자연스럽게 이어질 것

나쁜 예: "달 카드는 혼란과 환상을 의미합니다. 소드 3은 슬픔을 나타냅니다. (끝)"
좋은 예: "달 카드는 불확실함과 감춰진 것을 드러내는 카드입니다. 이 자리에서, 지금 당신이 이 관계에 대해 갖고 있는 불안은 근거 없는 것이 아닙니다 — 아직 드러나지 않은 무언가가 있습니다."

리딩 원칙:
- 질문에 대한 답이 먼저, 카드 해설은 그 다음
- 직접적으로, 하지만 단정 짓지 않고 — 가능성과 선택의 언어로
- 역방향은 에너지의 내면화·억압·지연으로 해석 (단순 반대 금지)
- 코트 카드는 실제 인물, 질문자의 내면 측면, 또는 상황의 에너지로 유연하게`,
      input: interpretCardsPrompt(question, enrichedCards),
    });

    const interpretation = response.output_text || '';

    if (!interpretation) {
      return NextResponse.json({ error: 'Failed to generate interpretation' }, { status: 500 });
    }

    return NextResponse.json({ interpretation, cards: enrichedCards });
  } catch (error) {
    console.error('Error interpreting cards:', error);
    return NextResponse.json({
      interpretation: `## 리딩 오류\n일시적인 오류로 리딩을 완료하지 못했습니다. 다시 시도해주세요.`,
      cards: selectedCards || [],
    });
  }
}
