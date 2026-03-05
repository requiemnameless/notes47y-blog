# Cloudflare Access 設定指南（MFA 保護）

透過 Cloudflare Zero Trust / Access 為 Notes47y 加上認證層，僅允許你自己存取。

## 前置條件

- Cloudflare 帳號（免費方案支援 50 人以下）
- 網站已部署在 Cloudflare Pages（`notes47y.pages.dev` 或自訂網域）

## 設定步驟

### 1. 啟用 Zero Trust

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左側選單點選 **Zero Trust**
3. 首次使用會引導你建立 Zero Trust 組織名稱（例如 `notes47y`）

### 2. 設定身份提供者（IdP）

1. 進入 **Settings → Authentication → Login methods**
2. 點選 **Add new** → 選擇你偏好的 IdP：
   - **Google**：最簡單，用你的 Google 帳號登入
   - **GitHub**：用 GitHub 帳號登入
   - **One-time PIN**：透過 Email 寄送一次性驗證碼
3. 依照指引完成 OAuth 設定

### 3. 建立 Access Application

1. 進入 **Access → Applications**
2. 點選 **Add an application** → 選擇 **Self-hosted**
3. 填入：
   - **Application name**: `Notes47y`
   - **Session Duration**: `24 hours`（或你偏好的時長）
   - **Application domain**: `notes47y.pages.dev`（或你的自訂網域）
   - **Path**: 留空（保護整個站台）

### 4. 建立 Access Policy（僅允許自己）

在同一個設定頁面的 Policy 區塊：

1. **Policy name**: `Only Me`
2. **Action**: `Allow`
3. **Include** 規則：
   - **Selector**: `Emails`
   - **Value**: `你的email@example.com`
4. 儲存

這樣只有你的 Email 能通過認證。

### 5. 啟用 MFA（多因素驗證）

1. 進入 **Settings → Authentication → Multi-factor authentication**
2. 勾選 **Require MFA for all Access applications**
3. 支援的 MFA 方式取決於你選擇的 IdP：
   - **Google**: 使用 Google 帳號本身的兩步驗證
   - **GitHub**: 使用 GitHub 帳號本身的 2FA
   - **One-time PIN**: Email 驗證碼本身即為驗證因素

> 如果使用 Google/GitHub，請確保你的帳號已啟用兩步驗證。

### 6. 驗證

1. 開啟無痕視窗
2. 前往 `https://notes47y.pages.dev`
3. 應該會看到 Cloudflare Access 的登入頁面
4. 使用你設定的 IdP 登入
5. 驗證 MFA 後才能存取網站內容

### 7. 保護 Preview 部署（重要）

Cloudflare Pages 的分支預覽部署（`*.notes47y.pages.dev`）**不會自動受 Access 保護**。

處理方式（擇一）：

1. **Wildcard 保護（推薦）**：在步驟 3 建立 Application 時，新增第二個 domain：
   - **Application domain**: `*.notes47y.pages.dev`
   - 這樣所有預覽 URL 也會要求認證

2. **停用預覽部署**：在 Cloudflare Pages 專案設定中，進入 **Settings → Builds & deployments → Preview deployments** → 選擇 **None**

### 8. 快取安全

本專案已透過 `_headers` 檔案設定 `Cache-Control: no-store, private`，確保 CDN 邊緣節點不會快取頁面內容。

如果你使用自訂網域且有啟用 Cloudflare CDN Proxy（橘色雲朵），建議額外確認：

1. 進入 **Caching → Configuration**
2. 確認 **Browser Cache TTL** 設為 **Respect Existing Headers**

## 進階設定（可選）

### 自訂登入頁面外觀

**Settings → Authentication → Login page customization**

可自訂 logo、背景色、標題文字。

### WARP Client 整合

如果你想要更無縫的體驗，可以安裝 Cloudflare WARP client，設定 Device Enrollment Policy，這樣在你的裝置上就不需要每次都手動登入。

### Service Token（API 存取）

如果需要程式化存取（例如自動化腳本），可以在 **Access → Service Auth** 建立 Service Token。
