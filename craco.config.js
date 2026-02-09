// Configuration for Electron and iOS (Capacitor) builds only
// Electron builds need special webpack config, iOS builds use standard web target
const npmScript = process.env.npm_lifecycle_event || '';
const isElectronBuild = npmScript === 'build' || npmScript === 'build:electron' || npmScript === 'electron';

if (isElectronBuild) {
  // Electron-specific webpack configuration
  const nodeExternals = require("webpack-node-externals");
  module.exports = {
    webpack: {
      configure: {
        target: "electron-renderer",
        externals: [
          nodeExternals({
            allowlist: [/webpack(\/.*)?/, "electron-devtools-installer"],
          }),
        ],
      },
    },
  };
} else {
  // iOS/Capacitor build - standard web target (no Electron-specific config)
  module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.target = 'web';
        webpackConfig.externals = [];
        return webpackConfig;
      },
    },
  };
}