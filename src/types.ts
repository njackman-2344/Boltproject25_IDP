export interface Conversation {
  id: string;
  userMessage: string;
  parentTone: 'nurturing' | 'validating' | 'protective' | 'encouraging';
  parentResponse: string;
  timestamp: string;
}

export interface Reflection {
  id: string;
  conversationId: string;
  emotionalState: string;
  insights: string;
  healingRating: number; // 1-5 scale
  timestamp: string;
}

export interface ParentTone {
  id: 'nurturing' | 'validating' | 'protective' | 'encouraging';
  label: string;
  description: string;
  color: string;
  icon: string;
}

export interface EmotionalNeed {
  id: string;
  label: string;
  description: string;
  examples: string[];
}