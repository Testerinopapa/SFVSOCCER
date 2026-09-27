export type Position =
  | 'GO' // Goleiro
  | 'ZG' // Zagueiro
  | 'LT' // Lateral
  | 'MD' // Meio-Direita
  | 'MC' // Meio-Campo
  | 'ML' // Meio-Lateral
  | 'MO' // Meio-Ofensivo
  | 'PT' // Ponta
  | 'AT'; // Atacante

export interface PlayerStats {
  velocidade: number;
  passe: number;
  finalizacao: number;
  defesa: number;
  fisico: number;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: Position;
  level: number;
  xp: number;
  xpMax: number;
  stats: PlayerStats;
  isListed?: boolean;
  listPrice?: number;
}

export interface Uniform {
  camisa: string;
  short: string;
  meiao: string;
}

export interface Club {
  id: string;
  name: string;
  balanceSV: number;
  division: number;
  uniform1: Uniform;
  uniform2: Uniform;
  formation: string;
  lineup: string[]; // 11 player IDs in order of formation positions
  squad: Player[];
}

export type MatchEventType = 'gol' | 'cartao_amarelo' | 'cartao_vermelho' | 'substituicao';

export interface MatchEvent {
  minute: number;
  type: MatchEventType;
  team: 'user' | 'opponent';
  player?: string;
  text: string;
}

export interface MatchRewards {
  goalsUser: number;
  goalSV: number;
  resultSV: number;
  resultText: string;
  yellowCount: number;
  yellowPenaltySV: number;
  redCount: number;
  redPenaltySV: number;
  totalSV: number;
}

export interface MatchStats {
  posseUser: number;
  posseOpp: number;
  finalizacoesUser: number;
  finalizacoesOpp: number;
  noGolUser: number;
  noGolOpp: number;
  faltasUser: number;
  faltasOpp: number;
  cartoesUser: number;
  cartoesOpp: number;
}

export interface MatchResult {
  userScore: number;
  opponentScore: number;
  opponentName: string;
  events: MatchEvent[];
  stats: MatchStats;
  rewards: MatchRewards;
}

export interface MarketPlayer {
  id: string;
  name: string;
  number: number;
  position: Position;
  level: number;
  priceSV: number;
  stats: PlayerStats;
  sellerClub?: string;
}

export interface DivisionTeam {
  id: string;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goalDiff: number;
  isUser?: boolean;
}

export interface CupMatch {
  id: string;
  stage: 'oitavas' | 'quartas' | 'semifinal' | 'final';
  roundName: string;
  teamA: string;
  scoreA: number;
  teamB: string;
  scoreB: number;
  winner: string;
}

export interface RankingClub {
  rank: number;
  name: string;
  points: number;
  victories: number;
  division: number;
  isUser?: boolean;
}

export interface UpcomingMatch {
  id: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  division: string;
}
