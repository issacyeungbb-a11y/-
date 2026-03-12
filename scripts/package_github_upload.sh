#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT_DIR/release"
BUNDLE_DIR="$OUT_DIR/o2o-simulator-github-upload"
ZIP_PATH="$OUT_DIR/o2o-simulator-github-upload.zip"

rm -rf "$BUNDLE_DIR"
mkdir -p "$BUNDLE_DIR"

cp "$ROOT_DIR/index.html" "$BUNDLE_DIR/index.html"
cp "$ROOT_DIR/README-GITHUB-UPLOAD.md" "$BUNDLE_DIR/README-GITHUB-UPLOAD.md"

(
  cd "$OUT_DIR"
  rm -f "$ZIP_PATH"
  zip -r "$(basename "$ZIP_PATH")" "$(basename "$BUNDLE_DIR")" >/dev/null
)

echo "✅ 已建立發佈壓縮檔：$ZIP_PATH"
