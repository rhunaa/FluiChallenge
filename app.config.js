const fs = require('fs');
const path = require('path');

function readAppJson() {
  const raw = fs.readFileSync(path.join(__dirname, 'app.json'), 'utf8');
  return JSON.parse(raw).expo;
}

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
