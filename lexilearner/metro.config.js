const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
let config = getDefaultConfig(__dirname);

// Enable require.context for Expo Router
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

// First apply NativeWind
config = withNativeWind(config, {
  input: "./global.css",
});

// Then wrap with Reanimated
config = wrapWithReanimatedMetroConfig(config);

module.exports = config;
