import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
const groqKey = process.env.GROQ_API_KEY;

const gemini = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;
const groq = groqKey ? new Groq({ apiKey: groqKey }) : null;

export type AIMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export type AIRequest = {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  cacheKey?: string;
};

export type AIResponse = {
  text: string;
  provider: 'gemini' | 'groq';
  latencyMs: number;
};

class AIError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'AIError';
  }
}

// Simple in-memory cache for identical requests within process lifetime.
// In production replace with Upstash Redis or Cloudflare KV.
const cache = new Map<string, { value: AIResponse; expiresAt: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60;

function getCached(key: string): AIResponse | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function setCached(key: string, value: AIResponse) {
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

async function callGemini(req: AIRequest): Promise<AIResponse> {
  if (!gemini) throw new AIError('Gemini not configured');
  const start = Date.now();

  const model = gemini.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: req.temperature ?? 0.7,
      maxOutputTokens: req.maxTokens ?? 2048,
      responseMimeType: req.jsonMode ? 'application/json' : 'text/plain',
    },
  });

  const systemMessage = req.messages.find((m) => m.role === 'system');
  const conversationMessages = req.messages.filter((m) => m.role !== 'system');

  const chat = model.startChat({
    systemInstruction: systemMessage?.content,
    history: conversationMessages.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  });

  const last = conversationMessages.at(-1);
  if (!last) throw new AIError('No user message provided');

  const result = await chat.sendMessage(last.content);
  const text = result.response.text();

  return { text, provider: 'gemini', latencyMs: Date.now() - start };
}

async function callGroq(req: AIRequest): Promise<AIResponse> {
  if (!groq) throw new AIError('Groq not configured');
  const start = Date.now();

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
    temperature: req.temperature ?? 0.7,
    max_tokens: req.maxTokens ?? 2048,
    response_format: req.jsonMode ? { type: 'json_object' } : undefined,
  });

  const text = completion.choices[0]?.message?.content ?? '';
  return { text, provider: 'groq', latencyMs: Date.now() - start };
}

export async function callAI(req: AIRequest): Promise<AIResponse> {
  if (req.cacheKey) {
    const cached = getCached(req.cacheKey);
    if (cached) return cached;
  }

  let lastError: unknown;
  for (const fn of [callGemini, callGroq]) {
    try {
      const result = await fn(req);
      if (req.cacheKey) setCached(req.cacheKey, result);
      return result;
    } catch (err) {
      lastError = err;
      console.warn('[ai] provider failed, falling back', err);
    }
  }

  throw new AIError('All AI providers failed', lastError);
}

export async function generateRecipeIntro(recipeTitle: string, cuisine: string): Promise<string> {
  const res = await callAI({
    messages: [
      {
        role: 'system',
        content:
          'You are a warm, expert food writer. Write 2 short paragraphs (max 90 words total) introducing a recipe. Mention origin, why it works, what makes it crave-worthy. No clichés. Conversational, helpful, never flowery.',
      },
      { role: 'user', content: `Recipe: ${recipeTitle}\nCuisine: ${cuisine}` },
    ],
    temperature: 0.8,
    maxTokens: 300,
    cacheKey: `intro:${recipeTitle}:${cuisine}`,
  });
  return res.text.trim();
}

export async function generateRecipeFaqs(
  recipeTitle: string,
  ingredients: string[],
): Promise<{ q: string; a: string }[]> {
  const res = await callAI({
    messages: [
      {
        role: 'system',
        content:
          'You generate FAQ pairs for recipe pages optimized for Google People-Also-Ask. Return strict JSON: {"faqs":[{"q":"...","a":"..."}]}. 6 questions. Each answer 30-60 words, conversational, specific.',
      },
      {
        role: 'user',
        content: `Recipe: ${recipeTitle}\nKey ingredients: ${ingredients.join(', ')}`,
      },
    ],
    temperature: 0.5,
    maxTokens: 800,
    jsonMode: true,
    cacheKey: `faqs:${recipeTitle}`,
  });
  try {
    const parsed = JSON.parse(res.text) as { faqs?: { q: string; a: string }[] };
    return parsed.faqs ?? [];
  } catch {
    return [];
  }
}
