# Platform Setup Guide

This guide explains how to set up and build the application for different platforms.

## Prerequisites

- Node.js (v18+ for development, v22+ for Capacitor CLI)
- npm or yarn

## Platform-Specific Setup

### Windows Desktop (Electron)

No additional setup required! Just run:
```bash
npm run build:electron
```

This will create a Windows installer in the `dist/` folder.

### iOS/iPad Setup

1. **Install Xcode** from the Mac App Store
2. **Install CocoaPods** (if not already installed):
   ```bash
   sudo gem install cocoapods
   ```

3. **Initialize Capacitor iOS platform** (first time only):
   ```bash
   # If Node.js >= 22, you can use:
   npx cap add ios
   
   # Otherwise, manually create ios/ folder and configure
   ```

4. **Install iOS dependencies**:
   ```bash
   cd ios/App
   pod install
   cd ../..
   ```

5. **Build and run**:
   ```bash
   npm run build:ios
   npm run open:ios
   ```

6. In Xcode:
   - Select your development team in Signing & Capabilities
   - Choose a simulator or connected iPad/iPhone
   - Click Run

### Android Setup

1. **Install Android Studio** from [developer.android.com](https://developer.android.com/studio)

2. **Configure Android SDK**:
   - Open Android Studio
   - Go to Tools → SDK Manager
   - Install Android SDK Platform 33 or higher
   - Install Android SDK Build-Tools

3. **Set up environment variables** (add to your `~/.zshrc` or `~/.bash_profile`):
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   ```

4. **Initialize Capacitor Android platform** (first time only):
   ```bash
   # If Node.js >= 22, you can use:
   npx cap add android
   
   # Otherwise, manually create android/ folder and configure
   ```

5. **Build and run**:
   ```bash
   npm run build:android
   npm run open:android
   ```

6. In Android Studio:
   - Wait for Gradle sync to complete
   - Choose an emulator or connected device
   - Click Run

## Quick Reference Commands

### Build Commands
- `npm run build:web` - Build for web only
- `npm run build:electron` - Build Windows executable
- `npm run build:ios` - Build and sync for iOS
- `npm run build:android` - Build and sync for Android

### Sync Commands (after code changes)
- `npm run sync:ios` - Sync React build to iOS project
- `npm run sync:android` - Sync React build to Android project

### Open Native Projects
- `npm run open:ios` - Open iOS project in Xcode
- `npm run open:android` - Open Android project in Android Studio

## Troubleshooting

### Capacitor CLI requires Node.js >= 22.0.0

If you see this error, you have two options:

1. **Upgrade Node.js** to v22+ (recommended)
   ```bash
   # Using nvm
   nvm install 22
   nvm use 22
   ```

2. **Use manual setup** - The Capacitor config is already created. You can manually:
   - Create `ios/` and `android/` folders
   - Copy Capacitor configuration
   - Use the sync commands after upgrading Node.js

### iOS Build Fails

- Make sure CocoaPods is installed: `pod --version`
- Run `pod install` in `ios/App/` directory
- Clean build folder in Xcode: Product → Clean Build Folder

### Android Build Fails

- Check that ANDROID_HOME is set correctly
- Make sure Android SDK Platform 33+ is installed
- In Android Studio: File → Invalidate Caches / Restart

## Platform Detection

The app automatically detects which platform it's running on:
- **Electron**: Uses IPC for file operations
- **Capacitor** (iOS/Android): Uses Capacitor Filesystem plugin
- **Web**: Falls back to localStorage

No code changes needed - the platform abstraction layer handles everything!

