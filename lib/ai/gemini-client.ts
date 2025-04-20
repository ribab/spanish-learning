import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  console.warn("NEXT_PUBLIC_GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

// Configure the chat model with Gemini 2.0 Flash
const chatModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-04-17",
  generationConfig: {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  },
});

// Configure the vision model with Gemini 2.0 Flash
const visionModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-04-17",
  generationConfig: {
    temperature: 0.4,
    topK: 32,
    topP: 1,
    maxOutputTokens: 2048,
  },
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateChatResponse(messages: ChatMessage[] | string): Promise<string> {
  try {
    let apiRequest;
    
    // If messages is a string, use it directly as content
    if (typeof messages === 'string') {
      apiRequest = {
        contents: [{
          role: 'user',
          parts: [{text: messages}]
        }]
      };
    } else {
      // For chat messages, use the last user message
      const lastUserMessage = messages
        .filter(msg => msg.role === 'user')
        .pop();

      if (!lastUserMessage) {
        throw new Error('No user message found in chat history');
      }

      apiRequest = {
        contents: [{
          role: 'user',
          parts: [{text: lastUserMessage.content}]
        }]
      };
    }

    console.log('Sending request to Gemini API:', JSON.stringify(apiRequest, null, 2));
    const result = await chatModel.generateContent(apiRequest);
    console.log('Raw API response:', result);
    const response = await result.response;
    const text = response.text();
    console.log('Extracted text from response:', text);
    return text;
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
}

export async function validateAnswer(answer: string): Promise<string> {
  try {
    const validationPrompt = `Please validate if this answer is correct and provide feedback: ${answer}`;
    const result = await chatModel.generateContent(validationPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error validating answer:", error);
    throw error;
  }
}

export async function generateConversationPrompt(answer: string): Promise<string> {
  try {
    const prompt = `Based on this answer, generate a follow-up question to continue the conversation: ${answer}`;
    const result = await chatModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating conversation prompt:", error);
    throw error;
  }
}

export const geminiClient = {
  chatModel,
  visionModel,
  generateChatResponse,
  validateAnswer,
  generateConversationPrompt,
}; 