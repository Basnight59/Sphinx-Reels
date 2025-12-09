import fetch from 'node-fetch';
import config from '../../config.js';

export async function generateScenesWithOpenAI(prompt: string, options: any = {}) {
  const apiKey = config.openaiApiKey;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const instruction = `Return a JSON array of scenes. Each scene must be an object with keys: title, script, durationSeconds (number), mediaHints (object). Return ONLY the JSON array.`;
  const fullPrompt = `${instruction}\n\nTopic: ${prompt}`;

  const body = {
    model: options.model || 'gpt-4o-mini',
    messages: [{ role: 'user', content: fullPrompt }],
    max_tokens: options.maxTokens || 800,
    temperature: options.temperature ?? 0.7,
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${text}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || '';

  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch (e) {
    // attempt to extract JSON substring
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/m);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error('Failed to parse OpenAI response as JSON');
  }
}

export default generateScenesWithOpenAI;
