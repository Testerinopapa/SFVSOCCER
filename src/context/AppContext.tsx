import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Club,
  Player,
  Uniform,
  MarketPlayer,
  DivisionTeam,
  CupMatch,
  MatchResult,
  Position,
} from '../types';
import {
  INITIAL_DEMO_CLUB,
  INITIAL_DEMO_PLAYERS,
  INITIAL_MARKET_PLAYERS,
  DIVISION_STANDINGS_MOCK,
  COPA_CAMPEOES_MOCK,
  CURRENT_SEASON,
} from '../data/mockData';

const STORAGE_KEY = '@sfv_app_state_v1';

interface AppContextType {
  isLoggedIn: boolean;
  club: Club;
  myListings: Player[];
  marketListings: MarketPlayer[];
  divisionStandings: Record<number, DivisionTeam[]>;
  cupMatches: CupMatch[];
  currentSeason: string;
  selectedPlayer: Player | null;
  selectedLineupSlot: number | null;
  lastMatchResult: MatchResult | null;
  levelUpAlert: { show: boolean; player: Player; oldLevel: number; newLevel: number } | null;
  
  // Navigation / Modals
  currentTab: 'home' | 'squad' | 'play' | 'tournaments' | 'market';
  setCurrentTab: (tab: 'home' | 'squad' | 'play' | 'tournaments' | 'market') => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;

  // Actions
  login: (name: string, pass: string) => boolean;
  loginDemo: () => void;
  createClub: (name: string, pass: string, u1: Uniform, u2: Uniform) => void;
  logout: () => void;
  setSelectedPlayer: (player: Player | null) => void;
  setSelectedLineupSlot: (slot: number | null) => void;
  updateUniformItem: (type: 1 | 2, part: 'camisa' | 'short' | 'meiao', color: string) => void;
  updateFormation: (formation: string) => void;
  setLineupPlayer: (slotIndex: number, playerId: string) => void;
  addXPToPlayer: (playerId: string, xpAmount: number) => { leveledUp: boolean; newLevel: number };
  dismissLevelUpAlert: () => void;
  buyMarketPlayer: (player: MarketPlayer) => { success: boolean; message: string };
  listPlayerForSale: (playerId: string, price: number) => { success: boolean; message: string };
  simulateSale: (playerId: string) => void;
  cancelListing: (playerId: string) => void;
  recordMatchResult: (result: MatchResult) => void;
  resetDemoData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [club, setClub] = useState<Club>(INITIAL_DEMO_CLUB);
  const [myListings, setMyListings] = useState<Player[]>([]);
  const [marketListings, setMarketListings] = useState<MarketPlayer[]>(INITIAL_MARKET_PLAYERS);
  const [divisionStandings, setDivisionStandings] = useState<Record<number, DivisionTeam[]>>(DIVISION_STANDINGS_MOCK);
  const [cupMatches, setCupMatches] = useState<CupMatch[]>(COPA_CAMPEOES_MOCK);
  const [currentSeason] = useState<string>(CURRENT_SEASON);
  
  const [currentTab, setCurrentTab] = useState<'home' | 'squad' | 'play' | 'tournaments' | 'market'>('home');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedLineupSlot, setSelectedLineupSlot] = useState<number | null>(null);
  const [lastMatchResult, setLastMatchResult] = useState<MatchResult | null>(null);
  const [levelUpAlert, setLevelUpAlert] = useState<{ show: boolean; player: Player; oldLevel: number; newLevel: number } | null>(null);

  // Load from AsyncStorage
  useEffect(() => {
    const loadState = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.club) setClub(parsed.club);
          if (parsed.isLoggedIn !== undefined) setIsLoggedIn(parsed.isLoggedIn);
          if (parsed.myListings) setMyListings(parsed.myListings);
          if (parsed.marketListings) setMarketListings(parsed.marketListings);
          if (parsed.divisionStandings) setDivisionStandings(parsed.divisionStandings);
        }
      } catch (err) {
        console.log('Error loading saved state:', err);
      }
    };
    loadState();
  }, []);

  // Save to AsyncStorage
  const saveState = async (updatedClub: Club, logged: boolean, listings: Player[], market: MarketPlayer[], standings: Record<number, DivisionTeam[]>) => {
    try {
      const data = {
        club: updatedClub,
        isLoggedIn: logged,
        myListings: listings,
        marketListings: market,
        divisionStandings: standings,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.log('Error saving state:', err);
    }
  };

  const login = (name: string, _pass: string): boolean => {
    if (!name.trim()) return false;
    const formattedName = name.toUpperCase().startsWith('SFV') ? name.toUpperCase() : `SFV ${name.toUpperCase()}`;
    const updated = { ...club, name: formattedName };
    setClub(updated);
    setIsLoggedIn(true);
    saveState(updated, true, myListings, marketListings, divisionStandings);
    return true;
  };

  const loginDemo = () => {
    setClub(INITIAL_DEMO_CLUB);
    setIsLoggedIn(true);
    saveState(INITIAL_DEMO_CLUB, true, myListings, marketListings, divisionStandings);
  };

  const createClub = (name: string, _pass: string, u1: Uniform, u2: Uniform) => {
    const formattedName = name.toUpperCase().startsWith('SFV') ? name.toUpperCase() : `SFV ${name.toUpperCase()}`;
    
    // Generate 30 custom players based on initial demo names
    const generatedPlayers = INITIAL_DEMO_PLAYERS.map((p, idx) => ({
      ...p,
      id: `custom-p-${idx + 1}`,
      level: Math.floor(Math.random() * 3) + 5, // 5, 6, 7
      xp: Math.floor(Math.random() * 300) + 100,
    }));

    const newClub: Club = {
      id: `club-${Date.now()}`,
      name: formattedName,
      balanceSV: 850,
      division: 4,
      uniform1: u1,
      uniform2: u2,
      formation: '4-3-3',
      lineup: generatedPlayers.slice(0, 11).map(p => p.id),
      squad: generatedPlayers,
    };

    setClub(newClub);
    setIsLoggedIn(true);
    saveState(newClub, true, [], INITIAL_MARKET_PLAYERS, DIVISION_STANDINGS_MOCK);
  };

  const logout = () => {
    setIsLoggedIn(false);
    saveState(club, false, myListings, marketListings, divisionStandings);
  };

  const updateUniformItem = (type: 1 | 2, part: 'camisa' | 'short' | 'meiao', color: string) => {
    setClub(prev => {
      const uKey = type === 1 ? 'uniform1' : 'uniform2';
      const updated = {
        ...prev,
        [uKey]: {
          ...prev[uKey],
          [part]: color,
        },
      };
      saveState(updated, isLoggedIn, myListings, marketListings, divisionStandings);
      return updated;
    });
  };

  const updateFormation = (formation: string) => {
    setClub(prev => {
      const updated = { ...prev, formation };
      saveState(updated, isLoggedIn, myListings, marketListings, divisionStandings);
      return updated;
    });
  };

  const setLineupPlayer = (slotIndex: number, playerId: string) => {
    setClub(prev => {
      const newLineup = [...prev.lineup];
      // If player is already in another slot, swap
      const existingSlot = newLineup.indexOf(playerId);
      if (existingSlot !== -1 && existingSlot !== slotIndex) {
        newLineup[existingSlot] = newLineup[slotIndex];
      }
      newLineup[slotIndex] = playerId;
      const updated = { ...prev, lineup: newLineup };
      saveState(updated, isLoggedIn, myListings, marketListings, divisionStandings);
      return updated;
    });
  };

  const addXPToPlayer = (playerId: string, xpAmount: number): { leveledUp: boolean; newLevel: number } => {
    let leveledUp = false;
    let newLevel = 1;
    let affectedPlayer: Player | null = null;

    setClub(prev => {
      const updatedSquad = prev.squad.map(player => {
        if (player.id === playerId) {
          let currentXP = player.xp + xpAmount;
          let currentLevel = player.level;
          let maxXP = player.xpMax;

          if (currentXP >= maxXP && currentLevel < 10) {
            currentXP -= maxXP;
            currentLevel += 1;
            maxXP = Math.floor(maxXP * 1.25);
            leveledUp = true;
            newLevel = currentLevel;
          }

          const upgraded: Player = {
            ...player,
            level: currentLevel,
            xp: currentXP,
            xpMax: maxXP,
            stats: {
              velocidade: Math.min(99, player.stats.velocidade + (leveledUp ? 2 : 0)),
              passe: Math.min(99, player.stats.passe + (leveledUp ? 2 : 0)),
              finalizacao: Math.min(99, player.stats.finalizacao + (leveledUp ? 2 : 0)),
              defesa: Math.min(99, player.stats.defesa + (leveledUp ? 2 : 0)),
              fisico: Math.min(99, player.stats.fisico + (leveledUp ? 2 : 0)),
            },
          };
          affectedPlayer = upgraded;
          return upgraded;
        }
        return player;
      });

      const updated = { ...prev, squad: updatedSquad };
      saveState(updated, isLoggedIn, myListings, marketListings, divisionStandings);
      return updated;
    });

    if (leveledUp && affectedPlayer) {
      const targetPlayer: Player = affectedPlayer;
      setLevelUpAlert({
        show: true,
        player: targetPlayer,
        oldLevel: newLevel - 1,
        newLevel: newLevel,
      });
    }

    return { leveledUp, newLevel };
  };

  const dismissLevelUpAlert = () => {
    setLevelUpAlert(null);
  };

  const buyMarketPlayer = (player: MarketPlayer): { success: boolean; message: string } => {
    if (club.balanceSV < player.priceSV) {
      return { success: false, message: `Saldo insuficiente! Você tem ${club.balanceSV} SV e precisa de ${player.priceSV} SV.` };
    }

    const newPlayer: Player = {
      id: `bought-${Date.now()}`,
      name: player.name,
      number: player.number,
      position: player.position,
      level: player.level,
      xp: 100,
      xpMax: 500,
      stats: player.stats,
    };

    const updatedClub = {
      ...club,
      balanceSV: club.balanceSV - player.priceSV,
      squad: [...club.squad, newPlayer],
    };

    const updatedMarket = marketListings.filter(m => m.id !== player.id);

    setClub(updatedClub);
    setMarketListings(updatedMarket);
    saveState(updatedClub, isLoggedIn, myListings, updatedMarket, divisionStandings);

    return { success: true, message: `${player.name} foi contratado por ${player.priceSV} SV e adicionado ao seu elenco!` };
  };

  const listPlayerForSale = (playerId: string, price: number): { success: boolean; message: string } => {
    if (price < 1) {
      return { success: false, message: 'O preço mínimo de venda é 1 SV.' };
    }

    const playerToList = club.squad.find(p => p.id === playerId);
    if (!playerToList) {
      return { success: false, message: 'Jogador não encontrado.' };
    }

    const updatedSquad = club.squad.map(p => {
      if (p.id === playerId) {
        return { ...p, isListed: true, listPrice: price };
      }
      return p;
    });

    const updatedClub = { ...club, squad: updatedSquad };
    const updatedListings = [...myListings, { ...playerToList, isListed: true, listPrice: price }];

    setClub(updatedClub);
    setMyListings(updatedListings);
    saveState(updatedClub, isLoggedIn, updatedListings, marketListings, divisionStandings);

    return { success: true, message: `${playerToList.name} foi colocado à venda por ${price} SV!` };
  };

  const simulateSale = (playerId: string) => {
    const item = myListings.find(p => p.id === playerId);
    if (!item || !item.listPrice) return;

    const price = item.listPrice;
    const updatedSquad = club.squad.filter(p => p.id !== playerId);
    const updatedLineup = club.lineup.map(id => (id === playerId ? updatedSquad[0]?.id || '' : id));
    const updatedListings = myListings.filter(p => p.id !== playerId);

    const updatedClub: Club = {
      ...club,
      balanceSV: club.balanceSV + price,
      squad: updatedSquad,
      lineup: updatedLineup,
    };

    setClub(updatedClub);
    setMyListings(updatedListings);
    saveState(updatedClub, isLoggedIn, updatedListings, marketListings, divisionStandings);
  };

  const cancelListing = (playerId: string) => {
    const updatedSquad = club.squad.map(p => {
      if (p.id === playerId) {
        return { ...p, isListed: false, listPrice: undefined };
      }
      return p;
    });

    const updatedListings = myListings.filter(p => p.id !== playerId);
    const updatedClub = { ...club, squad: updatedSquad };

    setClub(updatedClub);
    setMyListings(updatedListings);
    saveState(updatedClub, isLoggedIn, updatedListings, marketListings, divisionStandings);
  };

  const recordMatchResult = (result: MatchResult) => {
    setLastMatchResult(result);
    const rewardSV = result.rewards.totalSV;

    // Update club balance
    const updatedClub: Club = {
      ...club,
      balanceSV: Math.max(0, club.balanceSV + rewardSV),
    };

    // Update 4ª Divisão standings for user club
    const div4 = divisionStandings[4] || [];
    const updatedDiv4 = div4.map(team => {
      if (team.isUser || team.name === club.name) {
        const isWin = result.userScore > result.opponentScore;
        const isDraw = result.userScore === result.opponentScore;
        const isLoss = result.userScore < result.opponentScore;

        return {
          ...team,
          played: team.played + 1,
          won: team.won + (isWin ? 1 : 0),
          drawn: team.drawn + (isDraw ? 1 : 0),
          lost: team.lost + (isLoss ? 1 : 0),
          points: team.points + (isWin ? 3 : isDraw ? 1 : 0),
          goalDiff: team.goalDiff + (result.userScore - result.opponentScore),
        };
      }
      return team;
    });

    // Re-sort division 4 by points, then goalDiff
    updatedDiv4.sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff);

    const updatedStandings = {
      ...divisionStandings,
      4: updatedDiv4,
    };

    setClub(updatedClub);
    setDivisionStandings(updatedStandings);
    saveState(updatedClub, isLoggedIn, myListings, marketListings, updatedStandings);
  };

  const resetDemoData = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setClub(INITIAL_DEMO_CLUB);
      setIsLoggedIn(true);
      setMyListings([]);
      setMarketListings(INITIAL_MARKET_PLAYERS);
      setDivisionStandings(DIVISION_STANDINGS_MOCK);
      setCupMatches(COPA_CAMPEOES_MOCK);
      setSelectedPlayer(null);
      setSelectedLineupSlot(null);
      setLastMatchResult(null);
      setLevelUpAlert(null);
      setCurrentTab('home');
      setActiveModal(null);
    } catch (err) {
      console.log('Error resetting demo:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        club,
        myListings,
        marketListings,
        divisionStandings,
        cupMatches,
        currentSeason,
        selectedPlayer,
        selectedLineupSlot,
        lastMatchResult,
        levelUpAlert,
        currentTab,
        setCurrentTab,
        activeModal,
        setActiveModal,
        login,
        loginDemo,
        createClub,
        logout,
        setSelectedPlayer,
        setSelectedLineupSlot,
        updateUniformItem,
        updateFormation,
        setLineupPlayer,
        addXPToPlayer,
        dismissLevelUpAlert,
        buyMarketPlayer,
        listPlayerForSale,
        simulateSale,
        cancelListing,
        recordMatchResult,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
