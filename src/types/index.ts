export interface User {
  id: string;
  name: string;
  email: string;
  ageGroup: AgeGroup;
  preferences: UserPreferences;
  growthMetrics: GrowthMetrics;
  mentorshipLevel: MentorshipLevel;
}

export type AgeGroup = 
  | 'children' // 5-12
  | 'teens' // 13-17
  | 'young-adults' // 18-25
  | 'adults' // 26-40
  | 'middle-age' // 41-60
  | 'seniors' // 60+;

export type MentorshipLevel = 'seeker' | 'apprentice' | 'practitioner' | 'mentor' | 'sage';

export interface UserPreferences {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  innovationFocus: 'technical' | 'creative' | 'philosophical' | 'entrepreneurial';
  mentorPersona: 'jobs' | 'wozniak' | 'rohn' | 'davinci' | 'delacroix';
}

export interface GrowthMetrics {
  wisdom: number;
  creativity: number;
  technical: number;
  leadership: number;
  emotional: number;
  physical: number;
}

export interface Innovation {
  id: string;
  title: string;
  description: string;
  ageGroups: AgeGroup[];
  category: 'technical' | 'creative' | 'philosophical' | 'entrepreneurial';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master';
  mentor: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  ageGroup: AgeGroup;
  duration: string;
  rewards: string[];
  skills: string[];
}