import fetch from 'node-fetch';
import config from '../../config.js';

export async function generateScenesWithGemini(prompt: string, options: any = {}) {
  const apiKey = config.geminiApiKey;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  // Keep prompt strict so response is JSON only
  const fullPrompt = `Return a JSON array of scenes. Each scene must be an object with keys: title, script, durationSeconds (number), mediaHints (object). Return ONLY the JSON array.\n\nTopic: ${prompt}`;

  const body = { prompt: fullPrompt, temperature: options.temperature ?? 0.7, maxOutputTokens: options.maxOutputTokens || 800 };

  // Using REST endpoint for Generative Language API; adjust model path as needed
  const url = 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-1:generateText';

  const res = await fetch(url + `?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini error: ${res.status} ${txt}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content || data?.output || '';

  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch (e) {
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/m);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error('Failed to parse Gemini response as JSON');
  }
}

export default generateScenesWithGemini;
