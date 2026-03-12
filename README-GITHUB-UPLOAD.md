# O2O 達人店長模擬器：GitHub 上傳指南（避免二進位檔案問題）

如果你在 GitHub 看到「未能支援二進位檔案」，**請不要上傳 `.zip` 壓縮檔**，改為上傳解壓後的文字檔（例如 `index.html`）。

## 建議做法（最穩定）
1. 只上傳 `index.html`（必要）
2. 可選再上傳 `README-GITHUB-UPLOAD.md`
3. 不要把 `release/*.zip` 放進 repo

## 1) 上傳到 GitHub（網頁操作）
1. 到你的 GitHub repo。
2. 按 **Add file** → **Upload files**。
3. 把 `index.html`（及可選 README）拖進去。
4. 按 **Commit changes**。

## 2) 啟用 GitHub Pages
1. 進入 repo 的 **Settings** → **Pages**。
2. Source 選 **Deploy from a branch**。
3. Branch 選 `main`，Folder 選 `/(root)`。
4. 按 Save，等待 1–3 分鐘。

網站網址通常是：
`https://<你的帳號>.github.io/<repo名稱>/`

## 3) 本地打包（可選）
如果你只是想自己備份 zip，可在專案根目錄執行：

```bash
bash scripts/package_github_upload.sh
```

輸出檔案：
- `release/o2o-simulator-github-upload.zip`

> 注意：zip 是給下載備份用，不建議直接上傳到 GitHub 網頁編輯流程。
