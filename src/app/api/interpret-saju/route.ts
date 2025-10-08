import { NextRequest, NextResponse } from 'next/server';
import { createOpenAIClient } from '@/lib/openai';
import { SajuInfo } from '@/types/tarot';

function interpretSajuPrompt(question: string, sajuInfo: SajuInfo): string {
  const { year, month, day, hour, minute, isLunar, gender } = sajuInfo;

  return `당신은 30년 경력의 전문 사주 명리학자입니다. 아래 정보를 바탕으로 상담자의 질문에 대해 사주 풀이를 해주세요.

**상담자 정보:**
- 생년월일: ${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분
- 음력/양력: ${isLunar ? '음력' : '양력'}
- 성별: ${gender === 'male' ? '남성' : '여성'}

**질문:** ${question}

**답변 형식:**
다음과 같은 구조로 깊이 있고 구체적인 답변을 작성해주세요:

## "${question}"에 대한 사주 풀이

### 1. 사주 구조 분석
생년월일시를 기반으로 한 사주팔자의 기본 구조와 오행의 균형, 용신과 희신 등을 분석해주세요.

### 2. 질문에 대한 명리학적 해석
질문과 관련된 육친, 십신, 대운, 세운 등을 종합적으로 고려하여 현재 상황을 분석하고 앞으로의 흐름을 예측해주세요.

### 3. 구체적인 조언
- **즉시 실행할 것**: 지금 바로 실천하면 좋은 구체적인 행동
- **주의해야 할 점**: 조심하고 피해야 할 상황이나 행동
- **장기적 방향**: 앞으로 나아가야 할 방향과 준비사항
- **개운 방법**: 오행 조화를 위한 색상, 방향, 숫자 등의 조언

### 4. 시기별 전망
- **현재(올해)**: 현재 운세와 주의사항
- **단기(1-2년)**: 가까운 미래의 변화와 기회
- **장기(3-5년)**: 인생의 큰 흐름과 전환점

### 5. 마무리 조언
따뜻하고 현실적인 격려의 말씀으로 마무리해주세요.

**작성 시 유의사항:**
- 전문적이면서도 이해하기 쉬운 언어 사용
- 긍정적인 측면과 개선이 필요한 측면을 균형있게 제시
- 구체적이고 실천 가능한 조언 제공
- 마크다운 형식으로 가독성 있게 작성
- 운명론적이기보다는 주체적으로 삶을 개척할 수 있다는 관점 유지`;
}

export async function POST(request: NextRequest) {
  let sajuInfo;
  try {
    const requestData = await request.json();
    const { question, apiKey, model = 'gpt-4o-mini' } = requestData;
    sajuInfo = requestData.sajuInfo;

    if (!question || !sajuInfo) {
      return NextResponse.json(
        { error: 'Question and saju information are required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const openai = createOpenAIClient(apiKey);
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: '당신은 30년 경력의 전문 사주 명리학자입니다. 깊이 있는 사주 분석과 함께 따뜻하고 현실적인 조언을 제공합니다.'
        },
        {
          role: 'user',
          content: interpretSajuPrompt(question, sajuInfo)
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
      sajuInfo
    });
  } catch (error) {
    console.error('Error interpreting saju:', error);

    const fallbackInterpretation = `
## 사주 풀이 결과

죄송합니다. 일시적인 오류로 인해 상세한 사주 풀이를 제공할 수 없습니다.

### 기본 조언

현재는 중요한 결정을 내리기 전에 충분한 시간을 두고 신중하게 생각해보시는 것이 좋겠습니다.
주변의 조언에 귀 기울이되, 최종 결정은 본인의 판단을 믿고 내리시기 바랍니다.

### 실천 방안
- **즉시 실행할 것**: 현재 상황을 객관적으로 정리하고 분석하기
- **주의할 점**: 감정에 치우친 성급한 판단
- **장기적 준비**: 꾸준한 자기 계발과 인내심

### 마무리
현재의 고민은 더 나은 미래를 향한 중요한 과정입니다. 차근차근 한 걸음씩 나아가시기 바랍니다.
    `;

    return NextResponse.json({
      interpretation: fallbackInterpretation,
      sajuInfo: sajuInfo || {}
    });
  }
}
