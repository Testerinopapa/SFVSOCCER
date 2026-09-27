import { MatchEvent, MatchRewards, MatchStats, Player, Position, Uniform } from './index';

export interface UnityPlayerConfig {
  id: string;
  name: string;
  number: number;
  position: Position;
  level: number;
  stats: {
    velocidade: number;
    passe: number;
    finalizacao: number;
    defesa: number;
    fisico: number;
  };
}

export interface UnityMatchConfig {
  matchId: string;
  clubName: string;
  opponentName: string;
  formation: string;
  userUniform: Uniform;
  aiUniform: Uniform;
  startingLineup: UnityPlayerConfig[];
  benchPlayers: UnityPlayerConfig[];
  gameDurationMinutes: number; // e.g., 90
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UnityMatchResultPayload {
  matchId: string;
  userScore: number;
  opponentScore: number;
  opponentName: string;
  events: MatchEvent[];
  stats: MatchStats;
}
