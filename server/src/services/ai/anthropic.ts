import fetch from 'node-fetch';
import config from '../../config.js';

export async function generateScenesWithAnthropic(prompt: string, options: any = {}) {
  const apiKey = config.anthropicApiKey;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  const fullPrompt = `Return a JSON array of scenes. Each scene must be an object with keys: title, script, durationSeconds (number), mediaHints (object). Return ONLY the JSON array.\n\nTopic: ${prompt}`;

  const body = {
    model: options.model || 'claude-2.1',
    prompt: fullPrompt,
    max_tokens: options.maxTokens || 800,
  };

  const res = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Anthropic error: ${res.status} ${txt}`);
  }

  const data = await res.json();
  const text = data?.completion || '';

  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch (e) {
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/m);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error('Failed to parse Anthropic response as JSON');
  }
}

export default generateScenesWithAnthropic;
