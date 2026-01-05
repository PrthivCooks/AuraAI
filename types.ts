
export enum UncertaintyLevel {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High"
}

export interface InferredIntent {
  concern: string;
  confidence: number;
  reasoning: string;
}

export interface IngredientInsight {
  ingredient: string;
  impact: string;
  whyItMatters: string;
  tradeoff: string;
  isPrimaryConcern: boolean; // Dynamic highlight flag
  uncertainty: UncertaintyLevel;
  uncertaintyReason?: string;
}

export interface CoPilotAnalysis {
  inferredIntent: InferredIntent;
  overallNarrative: string;
  insights: IngredientInsight[];
  clarifyingQuestions: string[]; // Aura's brief, natural questions
  suggestedAction: string;
}

export interface AppState {
  view: 'landing' | 'scanning' | 'reasoning' | 'error';
  inputData: {
    text?: string;
    image?: string;
    additionalContext?: string; // For refined analysis
  };
  analysis?: CoPilotAnalysis;
  isLoading: boolean;
  error?: string;
}
