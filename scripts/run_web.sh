#!/bin/bash
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
cd /Users/erdalalp/e/kasaradar || exit 1
export NODE_ENV=production
export PORT=3001
exec /usr/local/bin/npm run start -- -p 3001
