import { NextRequest, NextResponse } from 'next/server';
import { createOpenAIClient, analyzeQuestionPrompt, MODEL } from '@/lib/openai';
import { cardPositions } from '@/lib/tarot-data';
import { AnalysisResult } from '@/types/tarot';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const openai = createOpenAIClient();
    const response = await openai.responses.create({
      model: MODEL,
      instructions: '당신은 타로 전문가입니다. 사용자의 질문을 분석하여 적절한 타로 카드 수를 결정하고 JSON 형식으로만 응답해주세요. 다른 텍스트 없이 순수 JSON만 반환하세요.',
      input: analyzeQuestionPrompt(question),
    });

    const responseText = response.output_text || '';

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
      const analysis: AnalysisResult = JSON.parse(jsonStr);

      if (!analysis.cardCount || !analysis.positions) {
        throw new Error('Invalid analysis format');
      }

      return NextResponse.json(analysis);
    } catch {
      console.error('Failed to parse GPT response:', responseText);
      const fallbackAnalysis: AnalysisResult = {
        cardCount: 3,
        reason: '일반적인 고민 상담을 위해 3장의 카드로 과거-현재-미래를 살펴보겠습니다.',
        positions: cardPositions[3 as keyof typeof cardPositions] || ['과거/원인', '현재 상황', '미래/조언']
      };
      return NextResponse.json(fallbackAnalysis);
    }
  } catch (error) {
    console.error('Error analyzing question:', error);
    return NextResponse.json({
      cardCount: 3,
      reason: '일반적인 고민 상담을 위해 3장의 카드로 살펴보겠습니다.',
      positions: ['과거/원인', '현재 상황', '미래/조언']
    });
  }
}
