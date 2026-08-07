
export interface ScoreComponent {
  name: string;
  score: number;
  weight: number;
  explanation: string;
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK' | 'CRITICAL';
}

export interface HealthRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface HealthScoreResponse {
  overallScore: number;
  previousScore: number;
  trend: number;
  components: ScoreComponent[];
  recommendations: HealthRecommendation[];
  history: { date: string; score: number }[];
}
