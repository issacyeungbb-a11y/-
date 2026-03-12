#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT_DIR/release"
BUNDLE_DIR="$OUT_DIR/o2o-simulator-github-upload"
ZIP_PATH="$OUT_DIR/o2o-simulator-github-upload.zip"

if rg -n "^(<<<<<<<|=======|>>>>>>>)" "$ROOT_DIR/index.html" >/dev/null 2>&1; then
  echo "❌ 偵測到 index.html 尚有 Git 衝突標記（<<<<<<< / ======= / >>>>>>>），請先解衝突再打包。"
  exit 1
fi

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
