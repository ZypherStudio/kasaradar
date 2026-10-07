#!/bin/bash
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
cd /Users/erdalalp/e/kasaradar || exit 1
exec /usr/local/bin/node /Users/erdalalp/e/kasaradar/scripts/telegram_auto_poster.js
