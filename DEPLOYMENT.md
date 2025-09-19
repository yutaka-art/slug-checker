# GitHub Slug Checker - Vercel Deployment Guide

## 🚀 デプロイ手順

### 1. GitHubリポジトリの準備
```bash
git add .
git commit -m "Add Vercel + GitHub OAuth implementation"
git push origin main
```

### 2. Vercelでのプロジェクト作成
1. [Vercel](https://vercel.com)にアクセス
2. GitHubアカウントでサインイン
3. "New Project" をクリック
4. このリポジトリ (`yutaka-art/slug-checker`) を選択
5. "Deploy" をクリック

### 3. Vercel環境変数の設定
Vercelダッシュボードで以下の環境変数を設定:

**重要**: プロジェクト設定の「Environment Variables」セクションで以下を追加してください:

| Name | Value |
|------|-------|
| `GITHUB_CLIENT_ID` | `Ov23li28227p184SWRCh` |
| `GITHUB_CLIENT_SECRET` | `5e05af0108961e594c3cc05e122ccba723c1c84c` |
| `SESSION_SECRET` | ランダムな文字列（例: `abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`) |

**設定手順:**
1. Vercelダッシュボードでプロジェクトを選択
2. "Settings" タブをクリック
3. "Environment Variables" セクションを選択
4. "Add New" ボタンで上記3つの変数を追加
5. 各変数の Environment を "Production", "Preview", "Development" 全てにチェック
6. "Save" をクリック

### 4. GitHub Apps設定の更新

**重要**: デプロイ後に以下を更新してください:

1. [GitHub Apps設定](https://github.com/settings/applications/3171683)にアクセス
2. "Authorization callback URL" を更新:
   - 現在: `http://localhost:8003/`
   - 新規: `https://your-app-name.vercel.app/api/auth/callback`
   - 新規: `https://slug-checker-labq.vercel.app/api/auth/callback`



例: `https://github-slug-checker.vercel.app/api/auth/callback`

### 5. 動作確認
1. デプロイ完了後、Vercel URLにアクセス
2. "GitHubでサインイン"ボタンをクリック
3. OAuth認証フローが正常に動作することを確認

## 🔧 アーキテクチャ

### ファイル構造
```
├── api/auth/          # Vercel API Routes
│   ├── login.js       # OAuth認証開始
│   ├── callback.js    # OAuth コールバック処理
│   ├── user.js        # ユーザー情報取得
│   └── logout.js      # ログアウト処理
├── public/            # 静的ファイル
│   └── index.html     # フロントエンド
├── package.json       # 依存関係
└── vercel.json        # Vercel設定

```

### OAuth フロー
1. ユーザーが"GitHubでサインイン"をクリック
2. `/api/auth/login` → GitHub OAuth認証ページにリダイレクト
3. ユーザーが認証許可
4. GitHub → `/api/auth/callback` にリダイレクト
5. 認証コードをアクセストークンに交換
6. ユーザー情報を取得してセッションに保存
7. フロントエンドにリダイレクト

## ⚠️ セキュリティ考慮事項

1. **Client Secret**: 環境変数で安全に管理
2. **Session Cookie**: HttpOnly, Secure, SameSite設定
3. **CSRF Protection**: State パラメータで検証
4. **Token Storage**: Base64エンコード（本番では暗号化推奨）

## 📱 使用方法

1. **GitHubサインイン**: 右上のボタンでOAuth認証
2. **ユーザー名チェック**: 認証状態に関係なく利用可能
3. **Enterprise Slug確認**: 認証後、Enterprise作成ページにアクセス
4. **ログアウト**: 右上のサインアウトボタン

## 🐛 トラブルシューティング

### OAuth認証エラー
- GitHub Apps設定でCallback URLが正しく設定されているか確認
- 環境変数が正しく設定されているか確認

### セッション関連エラー  
- SESSION_SECRETが設定されているか確認
- クッキーの設定を確認

### API呼び出しエラー
- Vercel Function Logsを確認
- ネットワーク設定を確認