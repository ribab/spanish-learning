export const CONVERSATION_THEMES = {
  RESTAURANT: 'restaurant',
  SHOPPING: 'shopping',
  TRAVEL: 'travel',
  FAMILY: 'family',
  HOBBIES: 'hobbies',
  WORK: 'work',
  EDUCATION: 'education',
  WEATHER: 'weather',
  HEALTH: 'health',
  CULTURE: 'culture',
} as const;

export type ConversationTheme = typeof CONVERSATION_THEMES[keyof typeof CONVERSATION_THEMES];

export const SPANISH_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export type SpanishLevel = typeof SPANISH_LEVELS[keyof typeof SPANISH_LEVELS];

export interface ConversationConfig {
  theme: ConversationTheme;
  level: SpanishLevel;
  knownWords: string[];
  wordsToLearn: string[];
  maxTurns?: number;
  temperature?: number;
}

export const DEFAULT_CONVERSATION_CONFIG: Partial<ConversationConfig> = {
  maxTurns: 10,
  temperature: 0.7,
};

export function generateSystemPrompt(config: ConversationConfig): string {
  return `You are a helpful Spanish language tutor engaging in a conversation with a ${config.level} level student.
Theme: ${config.theme}

Instructions:
1. Respond only in Spanish unless explicitly asked for translations
2. Use these known words frequently: ${config.knownWords.join(', ')}
3. Naturally introduce these new words: ${config.wordsToLearn.join(', ')}
4. Keep responses appropriate for ${config.level} level
5. Provide gentle corrections for grammar mistakes
6. Use appropriate cultural context for ${config.theme}
7. Keep the conversation focused on ${config.theme}

If the student makes a mistake:
- Acknowledge their attempt
- Provide the correct form
- Explain the correction briefly in English
- Continue the conversation in Spanish

Remember to:
- Use appropriate greetings and closings
- Ask questions to engage the student
- Provide positive reinforcement
- Keep responses concise and clear`;
}

export function generateConversationStart(config: ConversationConfig): string {
  const greetings = {
    [SPANISH_LEVELS.BEGINNER]: '¡Hola! ¿Cómo estás?',
    [SPANISH_LEVELS.INTERMEDIATE]: '¡Hola! ¿Qué tal? ¿Listo/a para practicar español?',
    [SPANISH_LEVELS.ADVANCED]: '¡Hola! ¿Qué te parece si charlamos un rato sobre {theme}?',
  };

  return greetings[config.level].replace('{theme}', config.theme);
}

export const CORRECTION_TEMPLATE = `
Correction:
{correct_form}

Explanation:
{explanation}

Let's continue...
`;

export const CONVERSATION_END_TEMPLATE = `
¡Muy bien! Has practicado estas palabras nuevas:
{learned_words}

Palabras que necesitas practicar más:
{words_to_practice}

¿Te gustaría continuar la conversación o prefieres terminar por ahora?`; 