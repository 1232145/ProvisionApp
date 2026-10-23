// Configuration for Electron and iOS (Capacitor) builds only
// Electron builds need special webpack config, iOS builds use standard web target
const npmScript = process.env.npm_lifecycle_event || '';
const isElectronBuild = npmScript === 'build' || npmScript === 'build:electron' || npmScript === 'electron';

if (isElectronBuild) {
  // The renderer runs with nodeIntegration disabled, so application dependencies
  // such as React must be bundled instead of emitted as CommonJS externals.
  module.exports = {
    webpack: {
      configure: {
        target: "web",
        externals: [],
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
