#!/bin/sh
# Xcode Cloud: install deps, build web assets, sync Capacitor iOS project.
set -e

cd "$CI_PRIMARY_REPOSITORY_PATH"

# Capacitor 8 requires Node.js 22+
if ! command -v node >/dev/null 2>&1 || [ "$(node -p "Number(process.versions.node.split('.')[0]) < 22")" = "1" ]; then
  brew install node@22
  export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
fi

echo "Node $(node -v)"
echo "npm $(npm -v)"

npm ci
npm run build:react
npx cap sync ios
