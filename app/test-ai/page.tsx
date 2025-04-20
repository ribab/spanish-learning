'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateChatResponse, ChatMessage } from '@/lib/ai/gemini-client';
import { toast } from "sonner";

export default function TestAIPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');

  const runSimpleTest = async () => {
    try {
      setIsLoading(true);
      setError('');
      setResponse('');
      
      // Log the request payload
      const requestPayload: ChatMessage[] = [
        { role: 'user' as const, content: 'Say "Hello! I am working!" in Spanish' }
      ];
      console.log('API Request Payload:', JSON.stringify(requestPayload, null, 2));
      
      const result = await generateChatResponse(requestPayload);
      console.log('API Response:', result);
      
      setResponse(result);
      toast.success('API call successful!');
    } catch (err: any) {
      console.error('Simple test error:', err);
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const runTranslationTest = async () => {
    try {
      setIsLoading(true);
      setError('');
      setResponse('');
      
      const result = await generateChatResponse([
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
      setResponse(result);
      toast.success('Translation test successful!');
    } catch (err: any) {
      console.error('Translation test error:', err);
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const checkEnvironmentVariables = () => {
    try {
      setError('');
      setResponse('');
      
      const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!key) {
        const errorMessage = 'No API key found in environment variables';
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }
      
      const message = `API Key is configured! (Key format: ${key.slice(0, 4)}...)`;
      setResponse(message);
      toast.success('API key found!');
    } catch (err: any) {
      console.error('Environment check error:', err);
      const errorMessage = err.message || 'An error occurred checking environment variables';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Gemini API Test Page</h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <Button 
            onClick={checkEnvironmentVariables}
            variant="outline"
            className="w-full"
          >
            Check API Key Configuration
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Simple Test</h2>
          <Button 
            onClick={runSimpleTest}
            disabled={isLoading}
            variant="default"
            className="w-full"
          >
            {isLoading ? 'Running Test...' : 'Run Simple Test'}
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Translation Test</h2>
          <Button 
            onClick={runTranslationTest}
            disabled={isLoading}
            variant="default"
            className="w-full"
          >
            {isLoading ? 'Running Translation...' : 'Test Translation'}
          </Button>
        </Card>

        {isLoading && (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              Processing request...
            </div>
          </Card>
        )}

        {error && (
          <Card className="p-6 border-destructive">
            <h2 className="text-xl font-semibold mb-2 text-destructive">Error</h2>
            <pre className="text-destructive whitespace-pre-wrap">{error}</pre>
          </Card>
        )}

        {response && !error && (
          <Card className="p-6 border-primary">
            <h2 className="text-xl font-semibold mb-2 text-primary">Response</h2>
            <pre className="text-primary whitespace-pre-wrap">{response}</pre>
          </Card>
        )}
      </div>
    </div>
  );
} 