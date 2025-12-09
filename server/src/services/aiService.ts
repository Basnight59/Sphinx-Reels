import config from '../config.js';

export interface AISceneGenerationRequest {
  topic: string;
  type: 'motivational' | 'educational' | 'storytime' | 'facts';
  count?: number;
}

interface GeneratedSceneData {
  text: string;
  duration: number;
  imageUrl: string;
  aiGenerated: boolean;
}

export const generateScenesFromTopic = async (
  topic: string,
  type: string,
  count: number = 3,
): Promise<GeneratedSceneData[]> => {
  if (!config.geminiApiKey) {
    console.warn('Gemini API Key not configured. Returning mock data.');
    return generateMockScenes(topic, count);
  }

  try {
    // In production, import and use the Gemini SDK
    // For now, return mock data
    return generateMockScenes(topic, count);
  } catch (error) {
    console.error('AI generation error:', error);
    return generateMockScenes(topic, count);
  }
};

const generateMockScenes = (topic: string, count: number): GeneratedSceneData[] => {
  const scenes: GeneratedSceneData[] = [];
  const descriptions = [
    `A visually stunning scene about ${topic}`,
    `Close-up shot highlighting key aspects of ${topic}`,
    `Dramatic presentation of ${topic} insights`,
    `Conclusion and call-to-action for ${topic}`,
    `Behind-the-scenes look at ${topic}`,
  ];

  for (let i = 0; i < Math.min(count, descriptions.length); i++) {
    scenes.push({
      text: `Here's an interesting fact about ${topic} - Part ${i + 1}`,
      duration: 3,
      imageUrl: `https://picsum.photos/seed/${topic}-${i}/1080/1920`,
      aiGenerated: true,
    });
  }

  return scenes;
};
