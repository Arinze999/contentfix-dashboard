import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-r1-0528:free'; // or your preferred variant

export async function POST(req: NextRequest) {
  try {
    const { prompt } = (await req.json()) as { prompt?: string };
    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEKR1_APIKEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server API key not configured' }, { status: 500 });
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      // These two are recommended by OpenRouter for attribution:
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'ContentFix',
    };

    const body = JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      top_p: 1,
      messages: [
        {
          role: 'system',
          content:
            'You are ContentFix, an expert at rewriting text for specific platforms and tones. Be concise and practical.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const resp = await fetch(OPENROUTER_URL, { method: 'POST', headers, body });
    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      return NextResponse.json({ error: errText || 'Upstream error' }, { status: resp.status });
    }

    const data = await resp.json();
    const content: string =
      data?.choices?.[0]?.message?.content?.trim?.() || 'No response.';

    return NextResponse.json(
      { content, id: data?.id, model: data?.model },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
