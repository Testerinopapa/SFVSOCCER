using System;
using System.Collections.Generic;
using UnityEngine;

namespace SFV.Bridge
{
    [Serializable]
    public class UniformData
    {
        public string camisa;
        public string shortColor; // 'short' is a C# keyword
        public string meiao;
    }

    [Serializable]
    public class PlayerStatsData
    {
        public int velocidade;
        public int passe;
        public int finalizacao;
        public int defesa;
        public int fisico;
    }

    [Serializable]
    public class PlayerData
    {
        public string id;
        public string name;
        public int number;
        public string position;
        public int level;
        public PlayerStatsData stats;
    }

    [Serializable]
    public class UnityMatchConfig
    {
        public string matchId;
        public string clubName;
        public string opponentName;
        public string formation;
        public UniformData userUniform;
        public UniformData aiUniform;
        public List<PlayerData> startingLineup;
        public List<PlayerData> benchPlayers;
        public int gameDurationMinutes;
    }

    [Serializable]
    public class MatchEventData
    {
        public int minute;
        public string type; // "gol", "cartao_amarelo", "cartao_vermelho", "substituicao"
        public string player;
        public string team; // "user", "opponent"
        public string text;
    }

    [Serializable]
    public class MatchStatsData
    {
        public int posseUser;
        public int posseOpp;
        public int finalizacoesUser;
        public int finalizacoesOpp;
        public int noGolUser;
        public int noGolOpp;
        public int faltasUser;
        public int faltasOpp;
        public int cartoesUser;
        public int cartoesOpp;
    }

    [Serializable]
    public class UnityMatchResult
    {
        public string matchId;
        public int userScore;
        public int opponentScore;
        public string opponentName;
        public List<MatchEventData> events;
        public MatchStatsData stats;
    }

    /// <summary>
    /// Attach this script to a GameObject named "SFVMatchBridge" in the root of your Unity Soccer scene.
    /// It handles bidirectional JSON messaging between React Native (Android) and the Unity 3D engine.
    /// </summary>
    public class SFVMatchBridge : MonoBehaviour
    {
        public static SFVMatchBridge Instance { get; private set; }

        public UnityMatchConfig CurrentConfig { get; private set; }

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        /// <summary>
        /// Called from React Native Android via:
        /// UnityPlayer.UnitySendMessage("SFVMatchBridge", "ReceiveMatchConfig", jsonString);
        /// </summary>
        public void ReceiveMatchConfig(string jsonString)
        {
            try
            {
                CurrentConfig = JsonUtility.FromJson<UnityMatchConfig>(jsonString);
                Debug.Log($"[SFVMatchBridge] Received Match Config: {CurrentConfig.clubName} vs {CurrentConfig.opponentName}, Formation: {CurrentConfig.formation}");
                
                // Initialize 3D Match
                Start3DMatch(CurrentConfig);
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SFVMatchBridge] Failed to parse match config JSON: {ex.Message}");
            }
        }

        private void Start3DMatch(UnityMatchConfig config)
        {
            Debug.Log("[SFVMatchBridge] Starting 3D Match Simulation / Gameplay...");
            // TODO: Apply uniform colors to 3D materials
            // TODO: Spawn 11 user players with stats and positions
            // TODO: Spawn 11 opponent players
            // TODO: Kickoff
        }

        /// <summary>
        /// Call this method when the referee blows the halftime whistle (45 mins).
        /// Signals Android host to pause Unity and display the Halftime Video Ad.
        /// </summary>
        public void SendHalfTimeToApp()
        {
            Debug.Log("[SFVMatchBridge] Halftime reached! Signaling Android Activity to show Halftime Video Ad...");
#if UNITY_ANDROID && !UNITY_EDITOR
            try
            {
                using (AndroidJavaClass unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
                {
                    AndroidJavaObject currentActivity = unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
                    currentActivity.Call("onUnityHalfTime");
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SFVMatchBridge] Error sending Halftime to Android Activity: {ex.Message}");
            }
#endif
        }

        /// <summary>
        /// Called from Android Activity when ad starts or match is paused
        /// </summary>
        public void PauseMatch()
        {
            Debug.Log("[SFVMatchBridge] Pausing Unity Match for Advertisement...");
            Time.timeScale = 0f;
        }

        /// <summary>
        /// Called from Android Activity when ad finishes to resume the match
        /// </summary>
        public void ResumeMatch()
        {
            Debug.Log("[SFVMatchBridge] Resuming Unity Match after Advertisement...");
            Time.timeScale = 1.0f;
        }

        /// <summary>
        /// Call this method when the referee blows the final whistle (90 mins).
        /// It packages the score, events, and stats, and sends them back to Android/React Native.
        /// </summary>
        public void SendMatchResultToApp(int userScore, int oppScore, List<MatchEventData> events, MatchStatsData stats)
        {
            var result = new UnityMatchResult
            {
                matchId = CurrentConfig != null ? CurrentConfig.matchId : "match_default",
                userScore = userScore,
                opponentScore = oppScore,
                opponentName = CurrentConfig != null ? CurrentConfig.opponentName : "SFV (IA)",
                events = events ?? new List<MatchEventData>(),
                stats = stats ?? new MatchStatsData()
            };

            string resultJson = JsonUtility.ToJson(result);
            Debug.Log($"[SFVMatchBridge] Sending Match Result to React Native: {resultJson}");

#if UNITY_ANDROID && !UNITY_EDITOR
            try
            {
                using (AndroidJavaClass unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
                {
                    AndroidJavaObject currentActivity = unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
                    currentActivity.Call("onUnityMatchFinished", resultJson);
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SFVMatchBridge] Error sending result to Android Activity: {ex.Message}");
            }
#endif
        }
    }
}
