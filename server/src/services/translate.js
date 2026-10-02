// Auto-translation via Claude when ANTHROPIC_API_KEY is set; otherwise returns the original text.
export const LANGS = { en: 'English', hi: 'Hindi', bn: 'Bengali', ta: 'Tamil', te: 'Telugu', mr: 'Marathi', gu: 'Gujarati', ur: 'Urdu' };

export async function translateFields({ title, description }, lang) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || !LANGS[lang]) return { title, description, translated: false };
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: `Translate the civic complaint into ${LANGS[lang]}. Reply with ONLY JSON: {"title":"...","description":"..."}`,
        messages: [{ role: 'user', content: JSON.stringify({ title, description }) }],
      }),
    });
    const data = await r.json();
    const text = data.content?.map((c) => c.text || '').join('') || '';
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    return { title: parsed.title, description: parsed.description, translated: true };
  } catch (e) {
    console.error('translate failed', e.message);
    return { title, description, translated: false };
  }
}
