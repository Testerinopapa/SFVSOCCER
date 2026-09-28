/**
 * Centralized Ad Configuration for Super Futebol Virtual (SFV).
 * Switch ADS_USE_TEST_IDS to false when deploying with production IDs.
 */

export const ADS_USE_TEST_IDS = true;

// Google Mobile Ads Official Android Test Unit IDs
const TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';
const TEST_INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';
const TEST_VIDEO_ID = 'ca-app-pub-3940256099942544/5224354917';

// Production Ad Unit IDs (replace with your AdMob production keys when approved)
const PROD_BANNER_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PROD_INTERSTITIAL_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PROD_VIDEO_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';

export const AD_CONFIG = {
  useTestIds: ADS_USE_TEST_IDS,
  bannerAdUnitId: ADS_USE_TEST_IDS ? TEST_BANNER_ID : PROD_BANNER_ID,
  interstitialAdUnitId: ADS_USE_TEST_IDS ? TEST_INTERSTITIAL_ID : PROD_INTERSTITIAL_ID,
  videoAdUnitId: ADS_USE_TEST_IDS ? TEST_VIDEO_ID : PROD_VIDEO_ID,
};
