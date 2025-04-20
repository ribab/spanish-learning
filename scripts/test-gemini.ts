require('dotenv').config({ path: '.env.local' });
const { generateChatResponse, generateConversationPrompt } = require('../lib/ai/gemini-client');

async function runTests() {
  console.log('🧪 Starting Gemini API Tests...\n');
  console.log('Environment Variables:');
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓ Found' : '✗ Missing');
  console.log('NEXT_PUBLIC_GEMINI_API_KEY:', process.env.NEXT_PUBLIC_GEMINI_API_KEY ? '✓ Found' : '✗ Missing');
  console.log('\n');

  try {
    console.log('Test 1: Simple Chat Response');
    console.log('---------------------------');
    const simpleResponse = await generateChatResponse([
      { role: 'user', content: 'Say "Hello! I am working!" in Spanish' }
    ]);
    console.log('Response:', simpleResponse);
    console.log('\n');

    console.log('Test 2: Translation Test');
    console.log('----------------------');
    const translationResponse = await generateChatResponse([
      { 
        role: 'user', 
        content: `Translate these words to English and provide part of speech:
Words: gato, perro, casa, correr, feliz

Format the response as a JSON array like this:
[
  {"spanish": "word", "english": "translation", "partOfSpeech": "type"}
]`
      }
    ]);
    console.log('Response:', translationResponse);
    console.log('\n');

    console.log('Test 3: Conversation Prompt');
    console.log('-------------------------');
    const conversationResponse = await generateConversationPrompt(
      'food',
      'beginner',
      ['hola', 'gracias', 'por favor'],
      ['hamburguesa', 'bebida', 'postre']
    );
    console.log('Response:', conversationResponse);
    console.log('\n');

    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

runTests(); 