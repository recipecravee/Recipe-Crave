import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';
export const maxDuration = 30;

const RequestSchema = z.object({
  imageDataUrl: z.string().min(20).max(8_000_000),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = RequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid image payload.' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'Gemini not configured.' }, { status: 503 });
  }

  // Extract mime + base64 from data URL
  const match = /^data:(image\/[a-zA-Z]+);base64,(.+)$/.exec(parsed.imageDataUrl);
  if (!match) {
    return NextResponse.json({ ok: false, error: 'Image must be a base64 data URL.' }, { status: 400 });
  }
  const [, mimeType, base64] = match;
  if (!mimeType || !base64) {
    return NextResponse.json({ ok: false, error: 'Bad image format.' }, { status: 400 });
  }

  try {
    const gemini = new GoogleGenerativeAI(apiKey);
    const model = gemini.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 600,
        responseMimeType: 'application/json',
      },
    });

    const prompt = `You are a kitchen vision assistant. Look at this photo of someone's fridge, pantry, or counter.
Identify visible FOOD INGREDIENTS only (raw produce, packaged staples, meats, dairy, condiments, dry goods).
Skip non-food items, empty packaging, dishes, utensils, and decorations.

Return strict JSON only:
{"ingredients":[{"name":"chicken thighs","confidence":0.9},{"name":"yellow onion","confidence":0.85}]}

Rules:
- name: lowercase, common kitchen term (use "yellow onion" not "Onion (Allium cepa)")
- confidence: 0-1 float; >0.7 = clearly visible, 0.4-0.7 = partially visible, <0.4 = guess
- Skip anything below 0.3 confidence
- Cap at 20 items
- Return {"ingredients":[]} if no food visible`;

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType, data: base64 } },
    ]);

    const text = result.response.text();
    let data: { ingredients?: Array<{ name: string; confidence: number }> };
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ ok: false, error: 'AI returned malformed JSON.' }, { status: 502 });
    }

    const ingredients = (data.ingredients ?? [])
      .filter((i) => typeof i.name === 'string' && i.name.length > 1 && i.name.length < 60)
      .filter((i) => typeof i.confidence === 'number' && i.confidence >= 0.3)
      .slice(0, 20);

    return NextResponse.json({ ok: true, ingredients });
  } catch (err) {
    console.error('[pantry-vision] failed', err);
    return NextResponse.json({ ok: false, error: 'Vision model failed. Try a clearer photo.' }, { status: 503 });
  }
}
