# Environmental Studies Data Collection Project

Cross-platform React data collection application for Windows desktop (Electron) and iOS/iPad (Capacitor).

## Requirements

- Node.js >= 22.12.0
- macOS with Xcode for iOS builds
- Windows or a Windows CI runner for the Windows installer

## Development

```bash
npm install
npm start             # Vite development server at http://localhost:5173
npm test              # Vitest suite
npm run lint          # ESLint
npm run build         # Production web bundle plus Electron bridge files
npm run electron      # Run the rebuilt Electron app locally
```

## Platform builds

```bash
npm run build:electron   # Windows NSIS installer; run on Windows/Windows CI
npm run build:ios        # Build web assets and sync Capacitor iOS
npm run open:ios         # Open the iOS project in Xcode
npm run sync:ios         # Sync existing iOS project after web changes
```

The Electron renderer runs with `nodeIntegration: false`, `contextIsolation: true`, a sandboxed preload, and a local-only Content-Security-Policy. Desktop autosave uses an atomic temporary-file write/rename. Completion state is kept in autosave data and is intentionally omitted from the CSV schema.

## Release verification

Before shipping, run `npm test`, `npm run lint`, `npm run build`, `npm audit`, and `npm run build:ios`. Verify the main form, timestamp validation, feeding completion/reopen flow, CSV round-trip, autosave recovery, browser export, Electron native export, and Capacitor export on a signed iOS device or simulator. The Windows installer must be verified on Windows or CI; it is not verifiable from macOS alone.
