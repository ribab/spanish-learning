"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export function VideoLesson() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Extract YouTube ID from URL
      const youtubeId = youtubeUrl.split('v=')[1]?.split('&')[0];
      if (!youtubeId) {
        throw new Error('Invalid YouTube URL');
      }

      // TODO: Implement video transcript fetching
      // For now, just store the video ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('video_lessons')
        .insert([
          {
            user_id: user.id,
            youtube_id: youtubeId,
            title: 'Untitled Video', // TODO: Fetch video title
            transcript: '', // TODO: Fetch and process transcript
            difficulty: 'beginner'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // TODO: Process transcript and identify Spanish words
      setTranscript('Transcript will appear here...');
    } catch (error) {
      console.error('Error processing video:', error);
      alert('Error processing video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Paste YouTube URL here"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Load Video'}
          </Button>
        </div>
      </form>

      {transcript && (
        <div className="mt-8 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Transcript</h3>
          <p className="whitespace-pre-wrap">{transcript}</p>
        </div>
      )}
    </div>
  );
} 