# Development Notes

## Current Development Status
Starting Phase 1: Foundation
- Setting up Next.js project with TypeScript ✓
- Implementing core infrastructure
- Configuring authentication and database
- Gemini AI Integration Started ✓
  - Base client configuration completed
  - Conversation prompts implemented
  - Answer validation system ready

## Technical Decisions
1. Framework & Libraries:
   - Next.js 14 with App Router for modern React features and better performance
   - Supabase for authentication and real-time features
   - Prisma as ORM for type-safe database queries
   - Shadcn/UI for consistent, accessible components
   - TailwindCSS for styling
   - Gemini AI for language learning features
   - @google/generative-ai SDK for Gemini integration

2. Database Design:
   - Supabase PostgreSQL for primary database
   - Tables planned:
     - users (extends Supabase auth)
     - words (vocabulary database)
     - learning_progress (user progress tracking)
     - flashcards (spaced repetition data)
     - video_lessons (YouTube video learning data)
     - conversations (AI conversation history)

## Implementation Notes
Current implementation status:
1. Gemini AI Integration:
   - Created base client configuration in src/lib/ai/gemini-client.ts
   - Implemented conversation prompts system
   - Set up answer validation functionality
   - Prepared conversation themes and templates
2. Next steps:
   - Set up database schema
   - Implement authentication
   - Create base UI components

## TODO List
Phase 1 Tasks:
- [x] Initialize Next.js project
- [ ] Set up Prisma
- [ ] Configure Supabase
- [ ] Set up authentication
- [ ] Create base UI components
- [ ] Design and implement database schema
- [x] Set up Gemini AI integration
  - [x] Install @google/generative-ai
  - [x] Create base client configuration
  - [x] Implement conversation system
  - [x] Set up answer validation
  - [ ] Add conversation history tracking
  - [ ] Implement word learning integration

## Questions & Considerations
1. Should we implement offline support for flashcards?
2. How to handle YouTube API quota limits?
3. Best approach for voice input/output implementation?
4. Caching strategy for AI responses?
5. How to optimize conversation history storage?
6. Should we implement streaming for long AI responses?

## Development Log

### 2024-03-19
- Starting project implementation
- Setting up initial infrastructure
- Implemented Gemini AI integration:
  - Base client configuration
  - Conversation system
  - Answer validation
  - Prompt templates

## Debugging Notes
- Remember to handle CORS for YouTube API
- Watch for Supabase connection limits
- Monitor Gemini API usage
- Handle AI response streaming properly
- Implement proper error handling for AI responses

## Performance Optimizations
Planned optimizations:
- Implement caching for AI responses
- Optimize YouTube video loading
- Use connection pooling for database
- Implement proper code splitting
- Consider streaming for long AI responses
- Cache conversation history efficiently

## Security Considerations
- Secure storage of API keys
- Rate limiting for AI endpoints
- Input sanitization for user content
- Proper authentication flow
- XSS prevention
- Sanitize AI responses before display
- Implement proper error boundaries

## Integration Notes
APIs to integrate:
1. Gemini AI API ✓
   - Base client setup complete
   - Conversation system implemented
   - Answer validation ready
2. YouTube Data API
3. Supabase Auth
4. Speech Recognition API
5. Speech Synthesis API

## Testing Notes
Test coverage needed for:
- Authentication flows
- AI conversation accuracy
- Spaced repetition algorithm
- Word learning tracking
- YouTube video processing
- AI response validation
- Conversation flow
- Error handling

## Deployment Notes
Deployment considerations:
1. Environment variables management
   - GEMINI_API_KEY
   - DATABASE_URL
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
2. Database migration strategy
3. API keys and secrets handling
4. Monitoring setup
5. Backup strategy
6. AI service monitoring 