export enum GameStage {
  TARMAC = 'TARMAC',        // Acte 1 : Identité & Rôle
  GANGWAY = 'PASSERELLE',   // Acte 2 : Compétences & Quiz (Mini-jeu)
  AIRCRAFT = 'AVION',       // Acte 3 : Plan de Vol (Mission)
  COCKPIT = 'COCKPIT'       // Acte 4 : Tableau de bord opérationnel
}

export enum RoleType {
  MEDIATOR = 'Médiateur (Chef de Cabine)',
  COORDINATOR = 'Coordinateur (Pilote)',
  EXPERT = 'Expert (Technicien)'
}

export interface UserProfile {
  name: string;
  role: RoleType | null;
  miles: number;
  skills: string[];
  badges: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MissionAnalysis {
  urgency: number; // 0-3
  difficulty: number; // 0-3
  weatherReport: string; 
  approved: boolean;
  suggestions?: string[];
}

export interface FlightPlan {
  title: string;
  context: string;
  constraints: string;
}

export const SKILL_OPTIONS = [
  "Accompagnement agents",
  "Conduite de projet IA",
  "Éthique & RGPD",
  "Traitement du Langage (NLP)",
  "RAG & Bases de Connaissances",
  "Computer Vision",
  "Prompt Engineering"
];