import { VideoLesson } from '@/components/features/video-learning/video-lesson'

export default function VideoLearningPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learn from Videos</h1>
        <p className="text-muted-foreground">
          Paste a Spanish YouTube video URL to start learning. Click on words in the transcript
          to mark them for learning.
        </p>
      </div>
      
      <VideoLesson />
    </div>
  )
} 