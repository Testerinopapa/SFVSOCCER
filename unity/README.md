# Soccer Unity ➔ SFV (Super Futebol Virtual) Integration Guide

Este diretório contém a ponte de integração entre o jogo 3D de futebol desenvolvido na **Unity** e o aplicativo mobile **Super Futebol Virtual (SFV)** em **React Native / Android**.

---

## 🏗️ Fluxo Arquitetural

```text
SFV React Native (UI/Manager)
│
├─ Login
├─ Clube & Tática (4-3-3, 4-4-2, etc.)
├─ Mercado de Transferências
├─ Torneios (Divisões 1 a 8)
├─ Ranking Geral
│
└─ JOGAR (AIMatchSetupModal)
      ↓ Envia JSON (Uniforme, Titulares, Atributos)
   Unity as a Library (unityLibrary)
      ↓
   Partida 3D de Futebol (Soccer Unity)
      ↓ Apito Final (90 min)
   Retorna JSON (Placar, Gols, Cartões, Posse, Faltas)
      ↓
SFV Tela de Resultados (MatchResultModal)
      ↓
Cálculo de SV (+1 gol, +3 vitória, -1 amarelo, -2 vermelho) e XP
```

---

## 🎮 Passo a Passo para Exportar o Projeto Unity

1. **Adicionar o Script C# de Ponte**:
   - Copie o arquivo [`SFVMatchBridge.cs`](./SFVMatchBridge.cs) para dentro da pasta `Assets/Scripts/` do seu projeto Unity.
   - Na sua cena principal de jogo de futebol 3D, crie um GameObject vazio na raiz chamado **`SFVMatchBridge`** e anexe o script a ele.

2. **Configurações de Build na Unity**:
   - No Unity Editor, abra: `File > Build Settings...`.
   - Selecione a plataforma **Android**.
   - Marque a caixa de seleção: **`Export Project`**.
   - Em `Player Settings > Other Settings`:
     - **Package Name**: `com.superfutebolvirtual.sfv` (ou deixe o padrão da Unity, a biblioteca usará o namespace da Unity).
     - **Scripting Backend**: `IL2CPP`.
     - **Target Architectures**: marque `ARMv7`, `ARM64`.

3. **Exportar a Pasta**:
   - Clique em **Export** e aponte o destino para:
     `c:\Users\null\Documents\antigravity\clever-hertz\unity\export`
   - Dentro da pasta exportada, haverá uma subpasta chamada **`unityLibrary`**.
   - Mova ou copie a pasta `unityLibrary` para:
     `c:\Users\null\Documents\antigravity\clever-hertz\unity\unityLibrary`

4. **Detecção Automática no Android**:
   - O arquivo `android/settings.gradle` e `android/app/build.gradle` já estão configurados com detecção condicional automática:
     ```groovy
     def unityProjectDir = new File(rootDir, "../unity/unityLibrary")
     if (unityProjectDir.exists()) {
         include ':unityLibrary'
         project(':unityLibrary').projectDir = unityProjectDir
     }
     ```
   - Assim que a pasta `unity/unityLibrary` existir, o Gradle compilará o módulo nativo da Unity junto com o aplicativo Android!

---

## 📡 Contrato de Dados (JSON Bridge)

### 1. React Native ➔ Unity (`ReceiveMatchConfig`)
```json
{
  "matchId": "sfv_match_1727300000",
  "clubName": "SFV WELTON",
  "opponentName": "SFV (IA)",
  "formation": "4-3-3",
  "userUniform": {
    "camisa": "#00E676",
    "short": "#111111",
    "meiao": "#00E676"
  },
  "aiUniform": {
    "camisa": "#FFFFFF",
    "short": "#FFFFFF",
    "meiao": "#FFFFFF"
  },
  "startingLineup": [
    {
      "id": "p_1",
      "name": "Danilo Pires",
      "number": 1,
      "position": "GO",
      "level": 4,
      "stats": {
        "velocidade": 68,
        "passe": 72,
        "finalizacao": 30,
        "defesa": 88,
        "fisico": 82
      }
    }
  ]
}
```

### 2. Unity ➔ React Native (`onUnityMatchFinished`)
```json
{
  "matchId": "sfv_match_1727300000",
  "userScore": 2,
  "opponentScore": 1,
  "opponentName": "SFV (IA)",
  "events": [
    {
      "minute": 23,
      "type": "gol",
      "player": "Lucas Almeida",
      "team": "user",
      "text": "GOL DO SFV WELTON! Finalização espetacular na gaveta!"
    },
    {
      "minute": 58,
      "type": "cartao_amarelo",
      "player": "Marcos Silva",
      "team": "user",
      "text": "Cartão amarelo por falta tática. (-1 SV)"
    }
  ],
  "stats": {
    "posseUser": 54,
    "posseOpp": 46,
    "finalizacoesUser": 8,
    "finalizacoesOpp": 5,
    "noGolUser": 5,
    "noGolOpp": 3,
    "faltasUser": 6,
    "faltasOpp": 7,
    "cartoesUser": 1,
    "cartoesOpp": 1
  }
}
```
