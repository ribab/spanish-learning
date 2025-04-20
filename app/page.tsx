import AuthButton from "@/components/auth/AuthButton";
import Header from "@/components/layout/Header";
import { cookies } from "next/headers";
import Link from 'next/link'
import { Card } from '@/components/ui/card'

const features = [
  {
    title: 'Learn from Videos',
    description: 'Watch Spanish YouTube videos with interactive transcripts.',
    href: '/learn/video',
  },
  {
    title: 'Practice Conversations',
    description: 'Have AI-powered conversations in Spanish.',
    href: '/learn/conversation',
  },
  {
    title: 'Reading Practice',
    description: 'Learn from Spanish texts with interactive translations.',
    href: '/learn/reading',
  },
  {
    title: 'Flashcards',
    description: 'Review words and phrases with spaced repetition.',
    href: '/flashcards',
  },
]

export default function HomePage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Welcome to Spanish Learning</h1>
            <p className="mt-2 text-muted-foreground">
              Choose a learning method to get started
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href}>
                <Card className="h-full p-6 hover:bg-accent transition-colors">
                  <h2 className="text-2xl font-semibold">{feature.title}</h2>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  )
}
