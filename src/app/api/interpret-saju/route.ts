import { NextRequest, NextResponse } from 'next/server';
import { createOpenAIClient, MODEL } from '@/lib/openai';
import { SajuInfo } from '@/types/tarot';

function interpretSajuPrompt(question: string, sajuInfo: SajuInfo): string {
  const { year, month, day, hour, minute, isLunar, gender } = sajuInfo;
  const isTimeUnknown = hour === -1;

  return `상담자 정보:
- 생년월일시: ${year}년 ${month}월 ${day}일 ${isTimeUnknown ? '(시간 모름)' : `${hour}시 ${minute}분`}
- 음력/양력: ${isLunar ? '음력' : '양력'}
- 성별: ${gender === 'male' ? '남성' : '여성'}

질문: "${question}"

위 사주 정보를 바탕으로 질문에 대한 깊이 있는 명리학적 풀이를 제공해주세요.

## "${question}"에 대한 사주 풀이

### 1. 사주 구조와 타고난 기운
생년월일시로 도출된 사주팔자의 오행 구성과 강약을 분석합니다. 천간과 지지의 조합이 이 사람에게 어떤 본래적 기질과 잠재력을 부여하는지, 용신(필요한 오행)과 기신(해로운 오행)을 설명합니다. 이 기반 위에서 현재 질문이 어떤 맥락을 갖는지 연결합니다. (4-5문장)

### 2. 질문에 대한 명리학적 해석
"${question}"과 직접 관련된 육친(부모·형제·배우자·자녀 등), 십신(식신·상관·재성·관성·인성 등)의 상태를 분석합니다. 현재 대운과 세운이 이 질문 영역에 어떤 영향을 주는지 구체적으로 설명하고, 사주 원국과의 충·합·형·파를 고려한 현 시점의 기운을 해석합니다. (5-6문장)

### 3. 맞춤 조언
- **지금 해야 할 것**: 현재 사주 기운에 맞는 가장 유리한 행동 방향
- **조심해야 할 것**: 이 시기에 특히 주의해야 할 상황이나 선택
- **장기적 방향**: 사주가 가리키는 자신에게 맞는 길과 준비 사항
- **개운 포인트**: 오행 보완을 위한 색상, 방향, 음식, 활동 등 실용적 조언

### 4. 시기별 운세
- **올해 (${new Date().getFullYear()}년)**: 현재 세운의 기운과 이 질문 영역의 구체적인 변화
- **1-2년 내**: 가까운 미래의 대운·세운 흐름과 기회의 창
- **3-5년 후**: 큰 흐름 속에서 찾아올 전환점과 준비해야 할 것

### 5. 마무리
사주는 운명을 정해놓은 틀이 아니라, 타고난 기운을 이해하고 최선의 선택을 하기 위한 지도입니다. 이 분의 사주가 가진 강점을 살려 "${question}"에 관한 현실적이고 따뜻한 격려의 말씀으로 마무리해주세요. (2-3문장)

작성 시 유의사항:
- 전문 용어는 괄호 안에 쉬운 설명을 함께 제공
- 운명론적 단정보다는 가능성과 선택의 관점 유지
- 구체적이고 실천 가능한 조언 중심
- 마크다운 형식으로 가독성 있게 작성
- 답변은 한국어로`;
}

export async function POST(request: NextRequest) {
  let sajuInfo: SajuInfo | undefined;
  try {
    const requestData = await request.json();
    const { question } = requestData;
    sajuInfo = requestData.sajuInfo;

    if (!question || !sajuInfo) {
      return NextResponse.json({ error: 'Question and saju information are required' }, { status: 400 });
    }

    const openai = createOpenAIClient();
    const response = await openai.responses.create({
      model: MODEL,
      instructions: '당신은 30년 경력의 전문 사주 명리학자입니다. 천간지지, 오행, 십신, 육친, 대운, 세운을 종합적으로 분석하여 깊이 있는 사주 풀이를 제공합니다. 어렵고 추상적인 표현보다는 실생활에 적용할 수 있는 현실적인 조언을 따뜻하게 전달합니다.',
      input: interpretSajuPrompt(question, sajuInfo),
    });

    const interpretation = response.output_text || '';

    if (!interpretation) {
      return NextResponse.json({ error: 'Failed to generate interpretation' }, { status: 500 });
    }

    return NextResponse.json({ interpretation, sajuInfo });
  } catch (error) {
    console.error('Error interpreting saju:', error);

    const fallbackInterpretation = `
## 사주 풀이 결과

일시적인 오류로 인해 상세한 사주 풀이를 제공할 수 없습니다.

### 기본 조언
현재는 중요한 결정을 내리기 전에 충분한 시간을 두고 신중하게 생각해보시는 것이 좋겠습니다.
주변의 조언에 귀 기울이되, 최종 결정은 본인의 판단을 믿고 내리시기 바랍니다.

### 실천 방안
- **지금 해야 할 것**: 현재 상황을 객관적으로 정리하고 분석하기
- **조심해야 할 것**: 감정에 치우친 성급한 판단
- **장기적 준비**: 꾸준한 자기 계발과 인내심

### 마무리
현재의 고민은 더 나은 미래를 향한 중요한 과정입니다. 차근차근 한 걸음씩 나아가시기 바랍니다.
    `;

    return NextResponse.json({ interpretation: fallbackInterpretation, sajuInfo: sajuInfo || {} });
  }
}
