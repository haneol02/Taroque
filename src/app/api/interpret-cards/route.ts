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
## 질문에 대한 직접 답변
현재 상황에 대해 깊이 고민하고 계시는군요. 선택하신 카드들이 말하는 것은 변화와 성장의 시기가 다가오고 있다는 것입니다. 이는 당신이 올바른 방향으로 나아가고 있음을 의미합니다.

## 전체적인 카드 메시지
각각의 카드가 보여주는 메시지를 종합해보면, 과거의 경험이 현재의 지혜가 되어 미래의 길을 밝혀주고 있습니다. 지금은 내면의 성장과 외면의 변화가 동시에 일어나는 중요한 전환점에 서 있습니다.

## 실질적인 실천 방안
- 현재 상황을 객관적으로 바라보고 감정에 휩쓸리지 않기
- 주변 신뢰할 수 있는 사람들의 조언에 열린 마음으로 귀 기울이기
- 큰 변화보다는 작은 실천부터 꾸준히 시작해보기
- 내면의 직감과 경험을 모두 고려한 균형잡힌 판단하기
- 성급한 결정보다는 충분한 시간을 두고 신중하게 접근하기

## 현실적 전망과 대비책
어려운 시기도 반드시 지나가며, 지금의 고민과 노력이 더 나은 내일의 토대가 됩니다. 예상치 못한 변화가 있더라도 유연하게 대응할 준비를 해두시기 바랍니다.

## 균형 있는 결론
현재의 도전은 성장의 기회입니다. 자신의 능력을 믿되 현실적인 한계도 인정하며, 한 걸음씩 꾸준히 나아가시기 바랍니다.
    `;

    return NextResponse.json({
      interpretation: fallbackInterpretation,
      cards: selectedCards || []
    });
  }
}