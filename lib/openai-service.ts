import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

export async function generateUserStory(videoFrames: string[]): Promise<string> {
  try {
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `You are a Product Manager assistant that creates detailed user stories from video descriptions. 
        Format the user story in the following structure:
        
        Title: [Concise feature title]
        
        As a [type of user]
        I want to [action/feature]
        So that [benefit/value]
        
        Acceptance Criteria:
        1. [Criterion 1]
        2. [Criterion 2]
        3. [Criterion 3]
        
        Technical Notes:
        - [Technical consideration 1]
        - [Technical consideration 2]
        
        Story Points: [1, 2, 3, 5, 8, 13]`
      },
      {
        role: "user",
        content: `Based on these video frames showing a feature demonstration, create a detailed user story. The video shows: ${videoFrames.join(' ')}`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || 'Failed to generate user story';
  } catch (error) {
    console.error('Error generating user story:', error);
    throw new Error('Failed to generate user story');
  }
}
