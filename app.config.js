const fs = require('fs');
const path = require('path');

// Read app.json fresh from disk on every call (no require() caching) so
// changes made mid-process — like `eas build` writing extra.eas.projectId
// into app.json — are picked up immediately instead of using a stale copy.
function readAppJson() {
  const raw = fs.readFileSync(path.join(__dirname, 'app.json'), 'utf8');
  return JSON.parse(raw).expo;
}

// Expo automatically loads variables from a local .env file (see .env.example)
// and injects them into process.env here — no extra package needed.
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? '';

module.exports = ({ config }) => {
  const appJson = readAppJson();

  return {
    ...config,
    ...appJson,
    ios: {
      ...appJson.ios,
      bundleIdentifier: 'com.flui.app',
      config: {
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      ...appJson.android,
      package: 'com.flui.app',
      config: {
        googleMaps: {
          apiKey: GOOGLE_MAPS_API_KEY,
        },
      },
    },
    extra: {
      ...appJson.extra,
      hasGoogleMapsKey: GOOGLE_MAPS_API_KEY.length > 0,
    },
  };
};
