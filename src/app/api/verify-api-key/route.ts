import { NextRequest, NextResponse } from 'next/server';
import { createOpenAIClient } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { valid: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    // OpenAI API 키 검증을 위한 간단한 요청
    const openai = createOpenAIClient(apiKey);

    try {
      // 가장 저렴한 요청으로 키 검증
      await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: 'test'
          }
        ],
        max_tokens: 5,
      });

      return NextResponse.json({ valid: true });
    } catch (error: any) {
      // API 키가 유효하지 않은 경우
      if (error.status === 401 || error.code === 'invalid_api_key') {
        return NextResponse.json(
          { valid: false, error: 'Invalid API key' },
          { status: 401 }
        );
      }

      // 기타 오류 (할당량 초과 등)
      return NextResponse.json(
        { valid: false, error: error.message || 'API key verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying API key:', error);
    return NextResponse.json(
      { valid: false, error: 'Server error during verification' },
      { status: 500 }
    );
  }
}
