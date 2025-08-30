import { NextRequest, NextResponse } from 'next/server';
import { openai, analyzeQuestionPrompt } from '@/lib/openai';
import { cardPositions } from '@/lib/tarot-data';
import { AnalysisResult } from '@/types/tarot';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 타로 전문가입니다. 사용자의 질문을 분석하여 적절한 타로 카드 수를 결정하고 JSON 형식으로 응답해주세요.'
        },
        {
          role: 'user',
          content: analyzeQuestionPrompt(question)
        }
      ],
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    try {
      const analysis: AnalysisResult = JSON.parse(responseText);
      
      if (!analysis.cardCount || !analysis.positions) {
        throw new Error('Invalid analysis format');
      }

      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error('Failed to parse GPT response:', responseText);
      
      const fallbackCardCount = 3;
      const fallbackAnalysis: AnalysisResult = {
        cardCount: fallbackCardCount,
        reason: '일반적인 고민 상담을 위해 3장의 카드로 과거-현재-미래를 살펴보겠습니다.',
        positions: cardPositions[fallbackCardCount as keyof typeof cardPositions] || ['과거/원인', '현재 상황', '미래/조언']
      };
      
      return NextResponse.json(fallbackAnalysis);
    }
  } catch (error) {
    console.error('Error analyzing question:', error);
    
    const fallbackAnalysis: AnalysisResult = {
      cardCount: 3,
      reason: '일반적인 고민 상담을 위해 3장의 카드로 살펴보겠습니다.',
      positions: ['과거/원인', '현재 상황', '미래/조언']
    };
    
    return NextResponse.json(fallbackAnalysis);
  }
}