/**
 * Groq API Route - Generates AI-powered astrological interpretations
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request) {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return Response.json({ error: 'Missing GROQ_API_KEY environment variable' }, { status: 500 });
    }

    const body = await request.json();
    const { type, data } = body;

    const prompt = generatePrompt(type, data);
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a mystical astrologer and numerologist with deep knowledge of celestial patterns, sacred numbers, and personality archetypes. Your responses are insightful, poetic yet precise, and deeply personalized. You blend ancient wisdom with modern psychological understanding. Keep responses concise but impactful - around 2-4 sentences for short interpretations, up to a paragraph for detailed ones. Use evocative language that feels magical yet grounded.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      return Response.json({ error: 'Failed to generate interpretation' }, { status: 500 });
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || '';

    return Response.json({ content });
  } catch (error) {
    console.error('API route error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generatePrompt(type, data) {
  switch (type) {
    case 'personality_synthesis':
      return `Create a deeply personalized personality synthesis for ${data.name}, born on ${data.date}.
Their archetype is "${data.archetype}" with Life Path ${data.lifePath} and Destiny Number ${data.destiny}.
Their dominant element is ${data.element}. Sun sign: ${data.sunSign}.
Weave these together into a cohesive, insightful paragraph about who they truly are at their core.`;

    case 'life_path_deep':
      return `Provide a profound interpretation of Life Path Number ${data.number} for ${data.name}.
Their name numerology shows Destiny ${data.destiny} and Soul Urge ${data.soulUrge}.
How do these numbers dance together to shape their life purpose? Be specific and personal.`;

    case 'romantic_insight':
      return `${data.name} is a ${data.sunSign} with Life Path ${data.lifePath}.
Their romantic archetype is "${data.archetype}" with ${data.attachmentStyle} attachment style.
Generate a deeply personal romantic forecast - their ideal love story, what they truly seek in partnership, and advice for their heart's journey.`;

    case 'career_guidance':
      return `For ${data.name}, archetype "${data.archetype}" with cognitive style "${data.cognitiveStyle}":
Life Path ${data.lifePath}, Destiny ${data.destiny}, dominant element ${data.element}.
Provide specific, actionable career guidance. What fields will bring them fulfilment? What is their unique professional gift?`;

    case 'hidden_patterns':
      return `Analyze the hidden mathematical and mystical patterns in ${data.name}'s chart:
- Name letters: ${data.letterCount} total, ${data.vowelRatio}% vowels
- Birth numbers sum to ${data.dateSum}, born on ${data.dayOfWeek}
- ${data.isPrimeDay ? 'Born on a prime-number day' : ''}
- Generation: ${data.generation}
Reveal surprising connections and what these patterns suggest about their destiny.`;

    case 'daily_guidance':
      return `Create a brief but powerful daily guidance message for ${data.name}, a ${data.sunSign} with Life Path ${data.lifePath}.
Today's date energy combined with their chart suggests... (give specific, actionable insight for today)`;

    case 'expand_section':
      return `Expand on this aspect of ${data.name}'s reading: "${data.section}"
Current insight: "${data.currentText}"
Go deeper - reveal additional layers, hidden meanings, and practical applications. Be specific to their chart.`;

    default:
      return `Provide mystical insight for ${data.name} about: ${data.query}`;
  }
}
