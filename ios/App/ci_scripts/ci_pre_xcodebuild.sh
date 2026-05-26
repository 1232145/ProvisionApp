#!/bin/sh
# Xcode Cloud: ensure latest web build is copied into the native project before compile.
set -e

cd "$CI_PRIMARY_REPOSITORY_PATH"

if command -v node >/dev/null 2>&1; then
  if [ -d "/opt/homebrew/opt/node@22/bin" ]; then
    export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
  fi
  npx cap sync ios
fi
