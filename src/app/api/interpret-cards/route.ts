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
      instructions: `당신은 20년 이상 라이더-웨이트 타로를 연구하고 실전 리딩을 해온 전문 타로 리더입니다.

독법 철학:
- 메이저 아르카나는 영혼의 여정과 카르마적 힘을, 마이너 아르카나는 현재의 에너지와 일상적 상황을 반영합니다
- 수트는 원소 에너지를 담습니다: 완드(불/의지), 컵(물/감정), 소드(공기/사고), 펜타클(흙/현실)
- 역방향 카드는 단순한 반대가 아닙니다. 에너지가 내면으로 향하거나, 억압되거나, 지연되거나, 과잉 표현됨을 의미합니다
- 인접 카드들의 원소 조화/충돌을 읽어 에너지의 흐름을 파악합니다
- 카드의 이미지, 숫자, 상징을 구체적으로 언급하여 리딩에 깊이를 더합니다
- 코트 카드(페이지/나이트/퀸/킹)는 실제 인물, 질문자의 내면 측면, 혹은 상황의 특성을 나타낼 수 있습니다

리딩 원칙:
- 진실하고 직접적으로, 하지만 공감을 잃지 않고
- 운명론이 아닌 선택과 성장의 관점에서
- 모호하고 추상적인 표현보다 구체적이고 심층적인 통찰 제공`,
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
