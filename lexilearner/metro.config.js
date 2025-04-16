const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
let config = getDefaultConfig(__dirname);

// First apply NativeWind
config = withNativeWind(config, {
  input: "./global.css",
});

// Then wrap with Reanimated
config = wrapWithReanimatedMetroConfig(config);

module.exports = config;

