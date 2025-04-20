import Link from 'next/link';
import AuthButton from '../auth/AuthButton';

export default function Navigation() {
  return (
    <nav className="w-full border-b border-b-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link 
            href="/"
            className="text-xl font-bold hover:text-primary transition-colors"
          >
            Spanish Learning
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              href="/learn/video"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Video Learning
            </Link>
            <Link 
              href="/learn/reading"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Reading
            </Link>
            <Link 
              href="/learn/conversation"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Conversation
            </Link>
            <Link 
              href="/flashcards"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Flashcards
            </Link>
          </div>
        </div>
        <AuthButton />
      </div>
    </nav>
  );
} 