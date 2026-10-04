#!/bin/bash
# Ensures Python and Microsoft MarkItDown are available at session start.
set -euo pipefail

if ! command -v python3 >/dev/null 2>&1; then
  apt-get update -qq && apt-get install -y -qq python3 python3-pip >/dev/null
fi

if ! command -v markitdown >/dev/null 2>&1; then
  python3 -m pip install --quiet 'markitdown[all]' 2>/dev/null \
    || python3 -m pip install --quiet --break-system-packages 'markitdown[all]'
fi

echo "MarkItDown ready: $(markitdown --version 2>/dev/null)"
