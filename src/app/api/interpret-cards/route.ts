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

가장 중요한 원칙:
질문자가 던진 질문에 직접 답하는 것이 리딩의 핵심입니다. 카드 상징과 이미지 설명은 그 답을 뒷받침하는 근거로만 사용하세요. "이 카드는 ~를 의미합니다"가 아니라 "당신의 상황에서 이것은 ~를 가리킵니다"로 말하세요.

리딩 원칙:
- 질문에 대한 답을 먼저, 카드 해설은 그 다음
- 진실하고 직접적으로, 회피 없이
- 운명론이 아닌 선택과 가능성의 관점에서
- 역방향은 에너지의 내면화·억압·지연으로 해석 (단순 반대 금지)
- 코트 카드는 실제 인물, 질문자의 내면, 또는 상황의 성격으로 유연하게 해석`,
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
