import { NativeModules, Platform } from 'react-native';
import { Club, MatchResult, MatchEvent, MatchStats, Player } from '../types';
import { UnityMatchConfig, UnityPlayerConfig, UnityMatchResultPayload } from '../types/unity';

export class UnityBridgeService {
  /**
   * Checks if native Unity module is linked and available in the current runtime
   */
  public static isUnityNativeAvailable(): boolean {
    const unity = NativeModules?.UnityModule;
    return Platform.OS === 'android' && !!unity && (typeof unity.launchMatch === 'function' || typeof unity.postMessage === 'function');
  }

  /**
   * Builds the official UnityMatchConfig payload from the current SFV Club state
   */
  public static buildMatchConfig(
    club: Club,
    userUniformChoice: 1 | 2,
    aiUniformChoice: 1 | 2
  ): UnityMatchConfig {
    const userUniform = userUniformChoice === 1 ? club.uniform1 : club.uniform2;
    const aiUniform =
      aiUniformChoice === 1
        ? { camisa: '#FFFFFF', short: '#FFFFFF', meiao: '#FFFFFF' }
        : { camisa: '#111111', short: '#111111', meiao: '#111111' };

    const startingLineup: UnityPlayerConfig[] = club.lineup
      .map(id => club.squad.find(p => p.id === id))
      .filter((p): p is Player => Boolean(p))
      .map(p => ({
        id: p.id,
        name: p.name,
        number: p.number,
        position: p.position,
        level: p.level,
        stats: { ...p.stats },
      }));

    const benchPlayers: UnityPlayerConfig[] = club.squad
      .filter(p => !club.lineup.includes(p.id))
      .slice(0, 7)
      .map(p => ({
        id: p.id,
        name: p.name,
        number: p.number,
        position: p.position,
        level: p.level,
        stats: { ...p.stats },
      }));

    return {
      matchId: `sfv_match_${Date.now()}`,
      clubName: club.name,
      opponentName: 'SFV (IA)',
      formation: club.formation,
      userUniform,
      aiUniform,
      startingLineup,
      benchPlayers,
      gameDurationMinutes: 90,
      difficulty: 'medium',
    };
  }

  /**
   * Sends the match config to Unity and awaits the final match result
   */
  public static async launchMatch(
    config: UnityMatchConfig,
    onProgress?: (minute: number, eventText?: string) => void
  ): Promise<MatchResult> {
    const unity = NativeModules?.UnityModule;
    if (this.isUnityNativeAvailable() && unity && typeof unity.launchMatch === 'function') {
      console.log('[UnityBridge] Starting native Unity 3D match via UnityModule.launchMatch');
      const configJson = JSON.stringify(config);
      const rawResult = await unity.launchMatch(configJson);
      const parsed: UnityMatchResultPayload = typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult;
      return this.processMatchResult(parsed);
    }

    // High-fidelity fallback / simulated 3D gameplay provider
    return this.simulateMatchFlow(config, onProgress);
  }

  /**
   * Processes the raw Unity match output into the full SFV MatchResult with calculated SV rewards
   */
  public static processMatchResult(raw: UnityMatchResultPayload): MatchResult {
    const yellowCount = raw.events.filter(e => e.team === 'user' && e.type === 'cartao_amarelo').length;
    const redCount = raw.events.filter(e => e.team === 'user' && e.type === 'cartao_vermelho').length;

    const goalSV = raw.userScore * 1;
    let resultSV = 0;
    let resultText = '';

    if (raw.userScore > raw.opponentScore) {
      resultSV = 3;
      resultText = 'Vitória Oficial (+3 SV)';
    } else if (raw.userScore === raw.opponentScore) {
      resultSV = 1;
      resultText = 'Empate Oficial (+1 SV)';
    } else {
      resultSV = 1;
      resultText = 'Consolação Fair Play (+1 SV)';
    }

    const yellowPenaltySV = yellowCount * 1;
    const redPenaltySV = redCount * 2;
    const totalSV = Math.max(0, goalSV + resultSV - yellowPenaltySV - redPenaltySV);

    return {
      userScore: raw.userScore,
      opponentScore: raw.opponentScore,
      opponentName: raw.opponentName,
      events: raw.events,
      stats: raw.stats,
      rewards: {
        goalsUser: raw.userScore,
        goalSV,
        resultSV,
        resultText,
        yellowCount,
        yellowPenaltySV,
        redCount,
        redPenaltySV,
        totalSV,
      },
    };
  }

  /**
   * Simulates a dynamic match flow matching the Unity 3D match timeline
   */
  private static async simulateMatchFlow(
    config: UnityMatchConfig,
    onProgress?: (minute: number, eventText?: string) => void
  ): Promise<MatchResult> {
    const roll = Math.random();
    let uScore = 2;
    let aScore = 1;

    if (roll < 0.55) {
      uScore = Math.floor(Math.random() * 3) + 1;
      aScore = Math.max(0, uScore - (Math.floor(Math.random() * 2) + 1));
    } else if (roll < 0.8) {
      uScore = Math.floor(Math.random() * 3);
      aScore = uScore;
    } else {
      aScore = Math.floor(Math.random() * 3) + 1;
      uScore = Math.max(0, aScore - (Math.floor(Math.random() * 2) + 1));
    }

    const events: MatchEvent[] = [];
    const strikers = config.startingLineup.filter(p => ['AT', 'PT', 'MO', 'MC'].includes(p.position));
    const randomScorer = () => strikers[Math.floor(Math.random() * strikers.length)]?.name || config.startingLineup[0]?.name || 'Atacante SFV';

    // Generate Goals
    for (let i = 0; i < uScore; i++) {
      const min = Math.floor(Math.random() * 75) + 10;
      events.push({
        minute: min,
        type: 'gol',
        team: 'user',
        player: randomScorer(),
        text: `GOL DO ${config.clubName}! Finalização espetacular na gaveta!`,
      });
    }

    for (let i = 0; i < aScore; i++) {
      const min = Math.floor(Math.random() * 75) + 12;
      events.push({
        minute: min,
        type: 'gol',
        team: 'opponent',
        player: 'SFV IA',
        text: 'GOL DO SFV IA! Contra-ataque veloz empata ou amplia o placar.',
      });
    }

    // Yellow card
    events.push({
      minute: 34,
      type: 'cartao_amarelo',
      team: 'user',
      player: config.startingLineup[1]?.name || 'Zagueiro',
      text: `Cartão amarelo por falta tática. (-1 SV)`,
    });

    events.sort((a, b) => a.minute - b.minute);

    const stats: MatchStats = {
      posseUser: Math.floor(Math.random() * 12) + 50,
      posseOpp: 0,
      finalizacoesUser: uScore + Math.floor(Math.random() * 5) + 4,
      finalizacoesOpp: aScore + Math.floor(Math.random() * 4) + 3,
      noGolUser: uScore + Math.floor(Math.random() * 3) + 1,
      noGolOpp: aScore + Math.floor(Math.random() * 2) + 1,
      faltasUser: Math.floor(Math.random() * 5) + 3,
      faltasOpp: Math.floor(Math.random() * 6) + 4,
      cartoesUser: 1,
      cartoesOpp: 1,
    };
    stats.posseOpp = 100 - stats.posseUser;

    return this.processMatchResult({
      matchId: config.matchId,
      userScore: uScore,
      opponentScore: aScore,
      opponentName: config.opponentName,
      events,
      stats,
    });
  }
}
