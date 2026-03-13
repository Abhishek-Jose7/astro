/**
 * AI Service - Client-side utilities for fetching AI-generated interpretations
 */

/**
 * Fetch AI-generated interpretation from Groq API
 */
export async function fetchAIInterpretation(type, data) {
  try {
    const response = await fetch('/api/groq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch AI interpretation');
    }

    const result = await response.json();
    return result.content;
  } catch (error) {
    console.error('AI Service error:', error);
    return null;
  }
}

/**
 * Generate personality synthesis
 */
export async function getPersonalitySynthesis(reading) {
  return fetchAIInterpretation('personality_synthesis', {
    name: reading.birthData.name,
    date: reading.birthData.date,
    archetype: reading.personalityCluster?.archetype?.name,
    lifePath: reading.numerology?.lifePathNumber,
    destiny: reading.nameNumerology?.destiny?.number,
    element: reading.personalityCluster?.dominantElement,
    sunSign: reading.romantic?.sunSign,
  });
}

/**
 * Generate deep life path interpretation
 */
export async function getLifePathDeep(reading) {
  return fetchAIInterpretation('life_path_deep', {
    name: reading.birthData.name,
    number: reading.numerology?.lifePathNumber,
    destiny: reading.nameNumerology?.destiny?.number,
    soulUrge: reading.nameNumerology?.soulUrge?.number,
  });
}

/**
 * Generate romantic insight
 */
export async function getRomanticInsight(reading) {
  return fetchAIInterpretation('romantic_insight', {
    name: reading.birthData.name,
    sunSign: reading.romantic?.sunSign,
    lifePath: reading.numerology?.lifePathNumber,
    archetype: reading.romantic?.archetype,
    attachmentStyle: reading.romantic?.attachmentStyle,
  });
}

/**
 * Generate career guidance
 */
export async function getCareerGuidance(reading) {
  return fetchAIInterpretation('career_guidance', {
    name: reading.birthData.name,
    archetype: reading.personalityCluster?.archetype?.name,
    cognitiveStyle: reading.personalityCluster?.cognitiveStyle?.name,
    lifePath: reading.numerology?.lifePathNumber,
    destiny: reading.nameNumerology?.destiny?.number,
    element: reading.personalityCluster?.dominantElement,
  });
}

/**
 * Generate hidden patterns analysis
 */
export async function getHiddenPatterns(reading) {
  return fetchAIInterpretation('hidden_patterns', {
    name: reading.birthData.name,
    letterCount: reading.letterAnalysis?.letterCounts?.total,
    vowelRatio: reading.letterAnalysis?.letterCounts?.vowelRatio,
    dateSum: reading.personalityCluster?.birthdayStats?.dateSum,
    dayOfWeek: reading.personalityCluster?.birthdayStats?.dayOfWeek,
    isPrimeDay: reading.personalityCluster?.birthdayStats?.isPrimeDay,
    generation: reading.demographics?.generation,
  });
}

/**
 * Generate daily guidance
 */
export async function getDailyGuidance(reading) {
  return fetchAIInterpretation('daily_guidance', {
    name: reading.birthData.name,
    sunSign: reading.romantic?.sunSign,
    lifePath: reading.numerology?.lifePathNumber,
  });
}

/**
 * Expand a section with more AI-generated content
 */
export async function expandSection(reading, section, currentText) {
  return fetchAIInterpretation('expand_section', {
    name: reading.birthData.name,
    section,
    currentText,
  });
}
