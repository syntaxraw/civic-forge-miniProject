// Auto-translation via Gemini when GEMINI_API_KEY is set; otherwise returns the original text.
export const LANGS = { en: 'English', hi: 'Hindi', bn: 'Bengali', ta: 'Tamil', te: 'Telugu', mr: 'Marathi', gu: 'Gujarati', ur: 'Urdu' };

export async function translateFields({ title, description }, lang) {
  const key = process.env.GEMINI_API_KEY;
  if (!key || !LANGS[lang]) return { title, description, translated: false };
  try {
    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: `Translate the civic complaint into ${LANGS[lang]}. Return only valid JSON in this exact shape: {"title":"...","description":"..."}.` }],
        },
        contents: [{ role: 'user', parts: [{ text: JSON.stringify({ title, description }) }] }],
        generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 1000 },
      }),
    });
    if (!r.ok) throw new Error(`Gemini request failed (${r.status})`);
    const data = await r.json();
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
    const parsed = JSON.parse(text.trim());
    if (typeof parsed.title !== 'string' || typeof parsed.description !== 'string') throw new Error('Gemini returned an invalid translation');
    return { title: parsed.title, description: parsed.description, translated: true };
  } catch (e) {
    console.error('translate failed', e.message);
    return { title, description, translated: false };
  }
}
