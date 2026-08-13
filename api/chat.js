export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing messages array in request body' });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not set in environment');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Call OpenRouter OpenAI-compatible chat completions endpoint
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
  'HTTP-Referer': process.env.APP_URL || 'http://localhost:5175',
  'X-Title': 'Sai Teja Portfolio',
},
      body: JSON.stringify({
  model: 'openrouter/free',
  messages: messages,
  max_tokens: 512,
}),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('OpenRouter request failed:', response.status, text.slice(0, 500));
      return res.status(502).json({
        error: 'The chat provider is temporarily unavailable. Please try again later.',
      });
    }

    const data = await response.json();

    // Extract assistant text from known response shapes
    let assistantContent = null;

    if (data?.choices && data.choices.length > 0) {
      const first = data.choices[0];
      if (first.message && typeof first.message.content === 'string') {
        assistantContent = first.message.content;
      } else if (typeof first.text === 'string') {
        assistantContent = first.text;
      } else if (first.message && typeof first.message.content === 'object') {
        // some providers nest content
        assistantContent = first.message.content?.text || JSON.stringify(first.message.content);
      }
    }

    // Fallback: try other shapes
    if (!assistantContent) {
      if (data?.output && Array.isArray(data.output) && data.output[0]?.content) {
        const out = data.output[0].content;
        if (Array.isArray(out) && out[0]?.text) assistantContent = out[0].text;
      }
    }

    if (!assistantContent) {
      assistantContent = JSON.stringify(data);
    }

    return res.status(200).json({
      choices: [
        {
          message: {
            content: assistantContent,
          },
        },
      ],
    });
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({
      error: 'Unable to process the chat request right now.',
    });
  }
}
