import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import { THEME } from './src/constants/theme';
import { Header } from './src/components/Header';
import { BottomNav } from './src/components/BottomNav';
import { LoginScreen } from './src/screens/LoginScreen';
import { CreateClubScreen } from './src/screens/CreateClubScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SquadScreen } from './src/screens/SquadScreen';
import { TournamentsScreen } from './src/screens/TournamentsScreen';
import { MarketScreen } from './src/screens/MarketScreen';
import { PlayerDetailModal } from './src/screens/PlayerDetailModal';
import { LineupSelectModal } from './src/screens/LineupSelectModal';
import { PlayMenuModal } from './src/screens/PlayMenuModal';
import { AIMatchSetupModal } from './src/screens/AIMatchSetupModal';
import { MatchSimulationModal } from './src/screens/MatchSimulationModal';
import { UnityMatchModal } from './src/screens/UnityMatchModal';
import { MatchResultModal } from './src/screens/MatchResultModal';
import { PrizesModal } from './src/screens/PrizesModal';
import { CopaCampeõesModal } from './src/screens/CopaCampeoesModal';
import { RankingScreen } from './src/screens/RankingScreen';
import { VideosScreen } from './src/screens/VideosScreen';
import { UpcomingMatchesScreen } from './src/screens/UpcomingMatchesScreen';
import { SettingsModal } from './src/screens/SettingsModal';
import { SellPlayerModal } from './src/screens/SellPlayerModal';
import { UnityBridgeService } from './src/services/unityBridge';
import { MatchResult, Player } from './src/types';

const MainAppContent: React.FC = () => {
  const {
    isLoggedIn,
    club,
    currentTab,
    activeModal,
    setActiveModal,
    recordMatchResult,
    lastMatchResult,
  } = useApp();

  const [authView, setAuthView] = useState<'login' | 'createClub'>('login');
  const [userKit, setUserKit] = useState<1 | 2>(1);
  const [aiKit, setAiKit] = useState<1 | 2>(1);
  const [sellingPlayer, setSellingPlayer] = useState<Player | null>(null);

  // If user is not logged in, show Auth screens
  if (!isLoggedIn) {
    return authView === 'login' ? (
      <LoginScreen onGoToCreateClub={() => setAuthView('createClub')} />
    ) : (
      <CreateClubScreen onBackToLogin={() => setAuthView('login')} />
    );
  }

  // Handle Match Flow (Unity 3D or 2D Sim)
  const handleStartAIMatch = async (
    userUniform: 1 | 2,
    aiUniform: 1 | 2,
    mode: 'unity3d' | 'simulation2d' = 'unity3d'
  ) => {
    setUserKit(userUniform);
    setAiKit(aiUniform);
    if (mode === 'unity3d') {
      if (UnityBridgeService.isUnityNativeAvailable()) {
        try {
          console.log('[App] Starting native Unity 3D match...');
          const config = UnityBridgeService.buildMatchConfig(club, userUniform, aiUniform);
          const result = await UnityBridgeService.launchMatch(config);
          handleFinishMatch(result);
          return;
        } catch (err: any) {
          console.log('[App] Unity 3D match ended without result (e.g. exit/back):', err);
          return;
        }
      }
      setActiveModal('unityMatch');
    } else {
      setActiveModal('matchSimulation');
    }
  };

  const handleFinishMatch = (result: MatchResult) => {
    recordMatchResult(result);
    setActiveModal('matchResult');
  };

  const handleOpenSellModal = (player: Player) => {
    setSellingPlayer(player);
    setActiveModal('sellPlayer');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.card} translucent={false} />

      {/* Main Header */}
      <Header />

      {/* Active Tab Screen */}
      <View style={styles.content}>
        {currentTab === 'home' && <HomeScreen />}
        {currentTab === 'squad' && <SquadScreen />}
        {currentTab === 'tournaments' && <TournamentsScreen />}
        {currentTab === 'market' && <MarketScreen />}
      </View>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* --- MODALS --- */}
      {/* 1. Player Details */}
      <PlayerDetailModal
        visible={activeModal === 'playerDetail'}
        onClose={() => setActiveModal(null)}
        onOpenSellModal={handleOpenSellModal}
      />

      {/* 2. Lineup Selection Modal */}
      <LineupSelectModal
        visible={activeModal === 'lineupSelect'}
        onClose={() => setActiveModal(null)}
      />

      {/* 3. Play Menu Modal */}
      <PlayMenuModal
        visible={activeModal === 'playMenu'}
        onClose={() => setActiveModal(null)}
        onSelectAIMatch={() => setActiveModal('matchSetup')}
      />

      {/* 4. AI Match Setup Modal */}
      <AIMatchSetupModal
        visible={activeModal === 'matchSetup'}
        onClose={() => setActiveModal(null)}
        onStartMatch={handleStartAIMatch}
      />

      {/* 5A. Live Match Simulation Modal (2D) */}
      <MatchSimulationModal
        visible={activeModal === 'matchSimulation'}
        userUniformNum={userKit}
        aiUniformNum={aiKit}
        onFinishMatch={handleFinishMatch}
      />

      {/* 5B. Soccer Unity 3D Match Engine */}
      <UnityMatchModal
        visible={activeModal === 'unityMatch'}
        userUniformNum={userKit}
        aiUniformNum={aiKit}
        onFinishMatch={handleFinishMatch}
        onClose={() => setActiveModal(null)}
      />

      {/* 6. Match Result Screen */}
      <MatchResultModal
        visible={activeModal === 'matchResult'}
        result={lastMatchResult}
        onContinue={() => setActiveModal(null)}
      />

      {/* 7. League Prizes Modal */}
      <PrizesModal
        visible={activeModal === 'prizes'}
        onClose={() => setActiveModal(null)}
      />

      {/* 8. Copa dos Campeões Modal */}
      <CopaCampeõesModal
        visible={activeModal === 'copaCampeoes'}
        onClose={() => setActiveModal(null)}
      />

      {/* 9. Ranking Geral Modal */}
      <RankingScreen
        visible={activeModal === 'ranking'}
        onClose={() => setActiveModal(null)}
      />

      {/* 10. Vídeos & Recompensas Modal */}
      <VideosScreen
        visible={activeModal === 'videos'}
        onClose={() => setActiveModal(null)}
      />

      {/* 11. Calendário de Partidas Modal */}
      <UpcomingMatchesScreen
        visible={activeModal === 'upcoming'}
        onClose={() => setActiveModal(null)}
      />

      {/* 12. Configurações Modal */}
      <SettingsModal
        visible={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
      />

      {/* 13. Sell Player Modal */}
      <SellPlayerModal
        visible={activeModal === 'sellPlayer'}
        onClose={() => {
          setActiveModal(null);
          setSellingPlayer(null);
        }}
        preselectedPlayer={sellingPlayer}
      />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: THEME.colors.card,
    paddingTop: 0,
  },
  content: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
});
