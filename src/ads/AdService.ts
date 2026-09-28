import { NativeModules, Platform } from 'react-native';

const { SFVAdModule } = NativeModules;

export type MatchVideoPlacement = 'pre_match' | 'halftime' | 'post_match';

class AdServiceManager {
  private isTransitionInProgress = false;
  private isVideoAdInProgress = false;

  /**
   * Checks whether the native Google Mobile Ads bridge is available
   */
  public isNativeAvailable(): boolean {
    return Platform.OS === 'android' && Boolean(SFVAdModule && typeof SFVAdModule.showInterstitial === 'function');
  }

  /**
   * Shows a full-screen interstitial ad during major screen transitions.
   *
   * Protection features:
   * - Prevents duplicate interstitials from rapid taps.
   * - Rejects concurrent transitions.
   * - Has a fail-safe timeout so navigation is never blocked if network fails or ad fails to load.
   */
  public async showInterstitial(): Promise<boolean> {
    if (this.isTransitionInProgress) {
      console.log('[AdService] Screen transition or ad already in progress. Ignoring duplicate request.');
      return false;
    }

    this.isTransitionInProgress = true;

    try {
      if (!this.isNativeAvailable()) {
        console.log('[AdService] Native ad module unavailable (e.g. web/Expo Go). Skipping interstitial.');
        return false;
      }

      console.log('[AdService] Presenting full-screen interstitial ad...');

      // Safe timeout promise to guarantee the user is never trapped
      const timeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => {
          resolve(false);
        }, 3500);
      });

      const adPromise = SFVAdModule.showInterstitial().then((result: boolean) => Boolean(result));

      // Race between ad completion and safety timeout
      const shown = await Promise.race([adPromise, timeoutPromise]);
      console.log('[AdService] Interstitial ad finished with result:', shown);
      return shown;
    } catch (error) {
      console.warn('[AdService] Error showing interstitial ad, continuing navigation:', error);
      return false;
    } finally {
      // Ensure mutex is cleared so future navigation functions work smoothly
      this.isTransitionInProgress = false;
    }
  }

  /**
   * Shows a video ad before match, at halftime, or after match.
   *
   * Safety features:
   * - If the ad fails to load or network is down, the game flow proceeds immediately.
   * - Gameplay is never permanently blocked by an advertising error.
   */
  public async showMatchVideo(placement: MatchVideoPlacement): Promise<boolean> {
    if (this.isVideoAdInProgress) {
      console.log(`[AdService] Video ad already running. Skipping concurrent request for ${placement}.`);
      return false;
    }

    this.isVideoAdInProgress = true;

    try {
      if (!this.isNativeAvailable()) {
        console.log(`[AdService] Native ad module unavailable. Skipping video ad for ${placement}.`);
        return false;
      }

      // Native module handles launch timeout internally (4.5s) and resolves when ad closes.
      // Safety timeout here protects against any hanging native thread (45s).
      const timeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => {
          console.warn(`[AdService] Video ad safety limit reached for ${placement}`);
          resolve(false);
        }, 45000);
      });

      const adPromise = SFVAdModule.showMatchVideo(placement).then((result: boolean) => Boolean(result));

      const shown = await Promise.race([adPromise, timeoutPromise]);
      console.log(`[AdService] Video ad (${placement}) completed with result:`, shown);
      return shown;
    } catch (error) {
      console.warn(`[AdService] Error showing video ad (${placement}), proceeding with match:`, error);
      return false;
    } finally {
      this.isVideoAdInProgress = false;
    }
  }
}

export const AdService = new AdServiceManager();
