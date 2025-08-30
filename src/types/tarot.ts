export interface TaroCard {
  id: number;
  name: string;
  suit: 'major' | 'cups' | 'wands' | 'swords' | 'pentacles';
  uprightMeaning: string;
  reversedMeaning: string;
  keywords: string[];
  imageUrl: string;
}

export interface CardSelection {
  position: string;
  cardId: number;
  cardName: string;
  isReversed: boolean;
  keywords?: string[];
  meaning?: string;
}

export interface TaroReading {
  id: string;
  userId?: string;
  question: string;
  cardCount: number;
  positions: string[];
  selectedCards: CardSelection[];
  interpretation: string;
  createdAt: Date;
}

export interface AnalysisResult {
  cardCount: number;
  reason: string;
  positions: string[];
}

export interface ExampleQuestions {
  love: string[];
  career: string[];
  life: string[];
  relationship: string[];
}