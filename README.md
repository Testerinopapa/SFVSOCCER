# Super Futebol Virtual (SFV) ⚽📱

Mobile Football Manager & Match UI built with **React Native (Expo SDK 52)** and **TypeScript**.

SFV is an interactive mobile football management application featuring complete club operations, player trading, tournament management, tactical formations, and a dynamic match simulation interface.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- [pnpm](https://pnpm.io/) (or npm / yarn)
- Expo Go app on mobile (optional, for testing via QR code)

### Installation
```bash
# Clone the repository
git clone https://github.com/Testerinopapa/SFVSOCCER.git
cd SFVSOCCER

# Install dependencies
pnpm install
# or: npm install
```

### Running the App
```bash
# Start the Metro development server
pnpm start
# or: npx expo start

# Run on Web directly
pnpm web
```

Scan the QR code with **Expo Go** (Android/iOS) or press `w` to open in your web browser.

---

## 📱 Features & Implemented Modules

1. **Club Management**: Complete club customization (Club name, primary/secondary kits, formations like 4-3-3, 4-4-2, 3-5-2).
2. **Squad & Lineups**: Detailed 28+ player squad, starter/bench selection, tactical positions (Goleiro, Zagueiro, Laterais, Meias, Atacantes, Pontas).
3. **Transfer Market**: Buying and selling players, market values in SV (Super Virtuais), rarity tiers (Bronze, Prata, Ouro, Especial).
4. **Live Match Simulation & 2D Pitch**:
   - Interactive 2D pitch with virtual joystick, pass and shoot mechanics.
   - Comprehensive commentary ticker and real-time match events.
   - Post-match SV rewards calculation based on goals, victory, and fair play cards.
5. **Tournaments & Competitions**: Copa dos Campeões, League tables, upcoming fixtures calendar.
6. **Economy & Vault (Cofre)**: Real-time SV balance, prize distribution, and bonus rewards.
7. **Ranking & Leaderboards**: Overall club rankings and tournament tiers.
8. **Settings & Profile**: Audio controls, offline persistence with `AsyncStorage`.

---

## 🏗️ Project Architecture

```
clever-hertz/
├── App.tsx                     # Main navigation and modal management
├── app.json                    # Expo application configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── assets/                     # App icons, splash screens, and branding
├── src/
│   ├── components/             # Reusable UI components (Header, BottomNav, KitPreview, etc.)
│   ├── constants/              # Theme, colors, typography, layout constants
│   ├── context/                # AppContext (global club state & AsyncStorage persistence)
│   ├── data/                   # Initial mock squads, clubs, and tournaments
│   ├── screens/                # All 21 management and match screens/modals
│   ├── services/               # Match calculation and Unity Bridge service
│   └── types/                  # TypeScript interfaces (Club, Player, MatchResult, Uniform, etc.)
└── unity/
    ├── README.md               # Unity as a Library (UaaL) integration spec
    └── SFVMatchBridge.cs       # C# bridge contract for the 3D match engine
```

---

## 🎮 Unity 3D Engine Integration (UaaL)

This repository contains the **complete React Native UI & simulation layer**.

In full production builds:
- The app links to the native **Unity 3D Football Engine** (`SFVUnityActivity`) using Unity as a Library.
- When running in development mode (Expo Go, Web, or standard emulator without the 3D binary), the app automatically falls back to the **Interactive 2D Pitch & Physics Simulation** (`UnityMatchModal`), allowing developers to build and test UI flows without needing Unity installed.
