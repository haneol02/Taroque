import { NextRequest, NextResponse } from 'next/server';
import { openai, interpretCardsPrompt } from '@/lib/openai';
import { CardSelection } from '@/types/tarot';
import { tarotCards } from '@/lib/tarot-data';

export async function POST(request: NextRequest) {
  let selectedCards: CardSelection[] = [];
  
  try {
    const requestData = await request.json();
    const question = requestData.question;
    selectedCards = requestData.selectedCards;

    if (!question || !selectedCards || !Array.isArray(selectedCards)) {
      return NextResponse.json(
        { error: 'Question and selectedCards are required' },
        { status: 400 }
      );
    }

    const enrichedCards = selectedCards.map((card: CardSelection) => {
      const tarotCard = tarotCards.find(tc => tc.id === card.cardId);
      return {
        ...card,
        cardName: tarotCard?.name || `카드 ${card.cardId}`,
        meaning: card.isReversed ? tarotCard?.reversedMeaning : tarotCard?.uprightMeaning,
        keywords: tarotCard?.keywords || []
      };
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 30년 경력의 전문 타로 리더입니다. 객관적이고 균형잡힌 관점으로 카드의 의미를 정확히 전달하며, 긍정적인 측면과 주의해야 할 측면을 모두 포함하여 현실적인 조언을 제공합니다.'
        },
        {
          role: 'user',
          content: interpretCardsPrompt(question, enrichedCards)
        }
      ],
      temperature: 0.8,
    });

    const interpretation = completion.choices[0]?.message?.content || '';

    if (!interpretation) {
      return NextResponse.json(
        { error: 'Failed to generate interpretation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      interpretation,
      cards: enrichedCards
    });
  } catch (error) {
    console.error('Error interpreting cards:', error);
    
    const fallbackInterpretation = `
## 전체적인 메시지
현재 상황에 대해 깊이 고민하고 계시는군요. 선택하신 카드들이 말하는 것은 변화와 성장의 시기가 다가오고 있다는 것입니다.

## 카드별 해석
각각의 카드가 보여주는 메시지를 종합해보면, 과거의 경험이 현재의 지혜가 되어 미래의 길을 밝혀주고 있습니다.

## 실천 조언
- 현재 상황을 객관적으로 바라보세요
- 주변 사람들의 조언에 귀 기울이세요  
- 작은 변화부터 시작해보세요
- 내면의 직감을 믿으세요

## 희망의 메시지
어려운 시기도 반드시 지나갑니다. 지금의 고민과 노력이 더 나은 내일을 만들어낼 것입니다. 자신을 믿고 한 걸음씩 나아가세요.
    `;

    return NextResponse.json({
      interpretation: fallbackInterpretation,
      cards: selectedCards || []
    });
  }
}