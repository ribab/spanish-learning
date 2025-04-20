import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure the chat model
const chatModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Configure the vision model for potential future use with images
const visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  temperature: number = 0.7
) {
  try {
    const chat = chatModel.startChat({
      history: messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        temperature,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
}

export async function validateSpanishAnswer(
  question: string,
  userAnswer: string,
  correctAnswer: string
) {
  try {
    const prompt = `As a Spanish language expert, evaluate if the user's answer is correct.
Question: ${question}
User's answer: ${userAnswer}
Correct answer: ${correctAnswer}

Provide your response in the following JSON format:
{
  "isCorrect": boolean,
  "explanation": "Brief explanation of why the answer is correct or incorrect",
  "suggestions": "Suggestions for improvement if the answer is incorrect"
}`;

    const result = await chatModel.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error validating answer:', error);
    throw error;
  }
}

export async function generateConversationPrompt(
  theme: string,
  userLevel: string,
  knownWords: string[],
  wordsToLearn: string[]
) {
  try {
    const prompt = `As a Spanish conversation partner, engage in a dialogue about ${theme}.
User's level: ${userLevel}
Known words: ${knownWords.join(', ')}
Words to learn: ${wordsToLearn.join(', ')}

Create a natural conversation that:
1. Uses known words frequently for reinforcement
2. Introduces words to learn naturally in context
3. Maintains appropriate difficulty for the user's level
4. Stays focused on the theme

Respond in a conversational manner, one message at a time.`;

    const result = await chatModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating conversation prompt:', error);
    throw error;
  }
}

export const geminiClient = {
  chatModel,
  visionModel,
  generateChatResponse,
  validateSpanishAnswer,
  generateConversationPrompt,
}; 