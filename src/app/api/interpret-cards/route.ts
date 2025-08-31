import { NextRequest, NextResponse } from 'next/server';
import { openai, interpretCardsPrompt } from '@/lib/openai';
import { CardSelection } from '@/types/tarot';
import { tarotCards } from '@/lib/tarot-data';

export async function POST(request: NextRequest) {
  let selectedCards: CardSelection[] = [];
  let question = '';
  
  try {
    const requestData = await request.json();
    question = requestData.question;
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
## "${question}"에 대한 타로의 답변
죄송합니다. 일시적인 오류로 인해 상세한 해석을 제공할 수 없지만, 선택하신 카드들은 분명한 메시지를 전하고 있습니다. 현재 고민하고 계신 문제에는 내면의 성찰과 신중한 접근이 필요한 시점임을 알려주고 있습니다.

## 현재 상황과 에너지 흐름
지금은 변화의 기로에 서 있는 중요한 순간입니다. 과거의 경험들이 현재 상황을 이해하는 열쇠가 되고 있으며, 앞으로의 방향성을 결정하는 데 도움이 될 것입니다. 서둘러 결정하기보다는 충분한 시간을 두고 생각해보는 것이 좋겠습니다.

## 질문 해결을 위한 실천 방안
• **즉시 실행할 것**: 현재 상황을 정리하고 객관적으로 분석해보기
• **주의깊게 관찰할 것**: 주변 사람들의 반응과 조언, 그리고 내면의 직감
• **피해야 할 것**: 감정에 치우친 성급한 판단이나 결정
• **장기적으로 준비할 것**: 꾸준한 자기 성찰과 점진적인 변화

## 타로가 제시하는 전망
**가능성 높은 시나리오**: 시간을 두고 신중하게 접근한다면 긍정적인 결과를 얻을 수 있습니다
**주의할 시나리오**: 조급함으로 인한 실수나 놓치는 기회들이 있을 수 있습니다
**최적의 결과를 위한 조건**: 인내심과 균형 잡힌 시각, 그리고 꾸준한 노력

## 마무리 조언
현재의 고민은 더 나은 미래를 향한 중요한 과정입니다. 자신을 믿되 현실적인 관점도 잃지 마시고, 한 단계씩 차근차근 나아가시기 바랍니다.
    `;

    return NextResponse.json({
      interpretation: fallbackInterpretation,
      cards: selectedCards || []
    });
  }
}