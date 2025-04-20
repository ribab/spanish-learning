'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { generateChatResponse } from '@/lib/ai/gemini-client';

// Form validation schema
const flashcardSchema = z.object({
  text: z.string().min(1, "Please enter some Spanish text"),
});

type FlashcardFormData = z.infer<typeof flashcardSchema>;

interface Word {
  spanish: string;
  english: string;
  partOfSpeech: string;
  isKnown?: boolean;
  isHard?: boolean;
}

export default function FlashcardsPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cards, setCards] = useState<Word[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<FlashcardFormData>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: {
      text: "",
    },
  });

  const extractUniqueWords = (text: string): string[] => {
    // Split text into words, remove punctuation, and convert to lowercase
    const words = text.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .split(/\s+/);
    
    // Remove duplicates, empty strings, and convert Set to Array
    return Array.from(new Set(words)).filter(word => word.length > 0);
  };

  const onSubmit = async (data: FlashcardFormData) => {
    try {
      setIsProcessing(true);
      const uniqueWords = extractUniqueWords(data.text);
      
      // Process words in smaller batches
      const BATCH_SIZE = 15;
      const wordBatches = [];
      for (let i = 0; i < uniqueWords.length; i += BATCH_SIZE) {
        wordBatches.push(uniqueWords.slice(i, i + BATCH_SIZE));
      }

      const allNewCards: Word[] = [];

      for (const batch of wordBatches) {
        try {
          // Generate prompt for Gemini
          const prompt = `Translate these Spanish words to English and provide their parts of speech.
Words: ${batch.join(", ")}

Return ONLY a JSON array in this exact format (no other text):
[
  {
    "spanish": "word1",
    "english": "translation1",
    "partOfSpeech": "noun/verb/adjective/etc"
  }
]`;

          const response = await generateChatResponse([
            { role: 'user', content: prompt }
          ]);

          console.log('Response length:', response.length);
          console.log('Raw response:', response);

          // Clean and extract JSON from the response
          let cleanedResponse = response;
          
          // Remove markdown code blocks if present
          cleanedResponse = cleanedResponse.replace(/```json\n?|\n?```/g, '');
          
          // Try to extract the JSON array
          const jsonMatch = cleanedResponse.match(/\[\s*\{[\s\S]*\}\s*\]/);
          
          if (!jsonMatch) {
            console.error('No valid JSON array found in response');
            console.error('Cleaned response:', cleanedResponse);
            throw new Error('No valid JSON array found in response');
          }

          let extractedJson = jsonMatch[0];
          
          // Remove any trailing commas before closing brackets
          extractedJson = extractedJson.replace(/,(\s*[\]}])/g, '$1');
          
          console.log('Cleaned JSON:', extractedJson);

          // Try to parse the cleaned JSON
          let batchCards: Word[];
          try {
            batchCards = JSON.parse(extractedJson);
          } catch (parseError: Error | unknown) {
            console.error('Failed to parse cleaned JSON:', parseError);
            console.error('Attempted to parse:', extractedJson);
            throw new Error(`JSON parse error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
          }

          // Validate the structure of each card
          batchCards = batchCards.filter(card => {
            const isValid = card && 
              typeof card === 'object' && 
              typeof card.spanish === 'string' && 
              typeof card.english === 'string' && 
              typeof card.partOfSpeech === 'string';
            
            if (!isValid) {
              console.warn('Invalid card structure:', card);
            }
            return isValid;
          });

          if (batchCards.length === 0) {
            console.error('No valid cards in batch');
            continue; // Skip this batch but continue processing others
          }

          allNewCards.push(...batchCards);
          console.log(`Successfully processed ${batchCards.length} words in current batch`);
        } catch (error: any) {
          if (error.message?.includes('GEMINI_API_KEY')) {
            // If Gemini is not configured, just add the words without translation
            const newCards: Word[] = batch.map(word => ({
              spanish: word,
              english: "Translation not available",
              partOfSpeech: "Unknown",
            }));
            allNewCards.push(...newCards);
            toast.warning("Added words without translation. Please configure Gemini API for translations.");
            break; // No need to process more batches if API is not configured
          } else {
            console.error('Batch processing error:', error);
            toast.error(`Failed to process batch: ${error.message || 'Unknown error'}`);
            // Continue with next batch
          }
        }
      }

      // Update cards state with all successfully processed cards
      if (allNewCards.length > 0) {
        setCards(prevCards => {
          // Merge new cards with existing ones, avoiding duplicates
          const existingSpanishWords = new Set(prevCards.map(c => c.spanish));
          const uniqueNewCards = allNewCards.filter(card => !existingSpanishWords.has(card.spanish));
          return [...prevCards, ...uniqueNewCards];
        });
        toast.success(`Successfully processed ${allNewCards.length} words!`);
      }

      form.reset();
    } catch (error) {
      toast.error("Failed to process words");
      console.error('Global error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const markCardStatus = (status: 'known' | 'hard') => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      if (status === 'known') {
        newCards[currentCardIndex].isKnown = true;
        newCards[currentCardIndex].isHard = false;
      } else {
        newCards[currentCardIndex].isHard = true;
        newCards[currentCardIndex].isKnown = false;
      }
      return newCards;
    });
    nextCard();
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Spanish Flashcards</h1>

      <Tabs defaultValue="study" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="create">Add Words</TabsTrigger>
        </TabsList>

        <TabsContent value="study" className="mt-6">
          <div className="flex flex-col items-center">
            {cards.length > 0 ? (
              <>
                <Card
                  className={`w-96 h-60 cursor-pointer [perspective:1000px] relative ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  } [transform-style:preserve-3d] transition-transform duration-500`}
                  onClick={flipCard}
                >
                  <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 text-center backface-hidden ${
                    isFlipped ? "invisible" : ""
                  }`}>
                    <div className="text-2xl font-semibold mb-2">
                      {cards[currentCardIndex].spanish}
                    </div>
                    <div className="text-sm text-gray-500">
                      {cards[currentCardIndex].partOfSpeech}
                    </div>
                  </div>
                  <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 text-center backface-hidden [transform:rotateY(180deg)] ${
                    isFlipped ? "" : "invisible"
                  }`}>
                    <div className="text-2xl font-semibold">
                      {cards[currentCardIndex].english}
                    </div>
                  </div>
                </Card>

                <div className="flex gap-4 mt-6">
                  <Button onClick={previousCard} disabled={currentCardIndex === 0}>
                    Previous
                  </Button>
                  <Button onClick={() => markCardStatus('known')} variant="outline" className="bg-green-100">
                    I Know This
                  </Button>
                  <Button onClick={() => markCardStatus('hard')} variant="outline" className="bg-red-100">
                    This is Hard
                  </Button>
                  <Button onClick={nextCard} disabled={currentCardIndex === cards.length - 1}>
                    Next
                  </Button>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  Card {currentCardIndex + 1} of {cards.length}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                No flashcards available. Add some words to start studying!
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spanish Text</FormLabel>
                    <FormControl>
                      <textarea 
                        className="w-full h-32 p-2 border rounded-md"
                        placeholder="Paste Spanish text here. Words will be automatically extracted and translated."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Extract Words"}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
} 