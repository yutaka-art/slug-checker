# GitHub 利用可否チェック

GitHubのユーザー名とEnterprise Slugの利用可否を簡単にチェックできるWebツールです。GitHub OAuth認証に対応し、リアルタイムでの確認が可能です。

## 🔗 サイトURL

**https://slug-checker-labq.vercel.app/**

## 📋 機能

### 1. GitHub OAuth認証
- GitHubアカウントでのサインイン・ログアウト
- セキュアな認証状態管理
- ユーザー情報の表示（アバター、ユーザー名）

### 2. GitHubユーザー名チェック
- GitHub APIを使用してユーザー名の利用可否をリアルタイムで確認
- 形式バリデーション（英数字とハイフン、先頭・末尾ハイフン不可、最大39文字）
- 即座に結果を表示

### 3. Enterprise Slugチェック
- GitHub Enterprise組織のslugの利用可否を確認
- GitHub公式Enterprise作成ページへの直接リンク
- リアルタイムでのslug有効性確認

## 💡 使用方法

### GitHub認証
1. ページにアクセス
2. 「GitHubでサインイン」ボタンをクリック
3. GitHubの認証画面で許可
4. 自動的にアプリケーションに戻ります

### GitHubユーザー名の確認
1. 「GitHub ユーザー名チェック」セクションにユーザー名を入力
2. 「チェック」ボタンをクリック
3. 結果が即座に表示されます
   - ✅ **利用可能** - そのユーザー名は使用されていません
   - ❌ **利用できません** - そのユーザー名は既に使用されています

### Enterprise Slugの確認
1. GitHubアカウントでサインイン（必須）
2. 「🔗 GitHub Enterprise作成ページを開く」ボタンをクリック
3. 新しいタブでGitHub公式のEnterprise作成ページが開きます
4. 「Enterprise name」フィールドに希望するSlugを入力
5. リアルタイムで有効性が確認できます

## 🛠️ 技術仕様

### フロントエンド
- **HTML5**: セマンティックな構造
- **CSS3**: モジュール化されたスタイルシート
- **JavaScript**: ES6+、モジュール化されたアーキテクチャ
- **認証**: GitHub OAuth 2.0

### バックエンド
- **Vercel API Routes**: サーバーレス関数
- **Node.js**: 18.0.0以上
- **依存関係**: 
  - Express.js (ローカル開発用)
  - Axios (HTTP クライアント)
  - Cookie Parser (セッション管理)
  - Express Session (セッション管理)

### API
- **GitHub REST API v3**: ユーザー名チェック
- **GitHub OAuth API**: 認証機能

### ホスティング
- **Vercel**: 本番環境
- **GitHub Pages**: (旧仕様、現在は未使用)
- **対応ブラウザ**: モダンブラウザ全般（Chrome, Firefox, Safari, Edge）

## 📁 プロジェクト構成

```
slug-checker/
├── public/                 # 静的ファイル
│   ├── css/
│   │   └── styles.css     # メインスタイルシート
│   ├── js/
│   │   ├── auth.js        # GitHub認証クラス
│   │   └── main.js        # メインアプリケーションロジック
│   └── index.html         # メインHTML
├── api/                   # Vercel API Routes
│   └── auth/
│       ├── login.js       # OAuth ログイン
│       ├── callback.js    # OAuth コールバック
│       ├── user.js        # ユーザー情報取得
│       └── logout.js      # ログアウト
├── server.js              # ローカル開発サーバー
├── vercel.json           # Vercel設定
└── package.json          # 依存関係・スクリプト
```

## 📝 制限事項

### GitHubユーザー名チェック
- GitHub APIのレート制限（1時間あたり60リクエスト/IP）の対象
- ネットワーク接続が必要

### Enterprise Slugチェック
- GitHubアカウントでのサインインが必要
- GitHub公式サイトでの手動確認方式
- セキュリティ上、iframe埋め込みは不可

### 認証機能
- Vercel環境変数の設定が必要（GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET）
- ローカル開発時はモック認証のみ対応

## 🔒 プライバシー・セキュリティ

- OAuth認証はGitHub公式の仕組みを使用
- セッション情報はVercelサーバー上で安全に管理
- 入力されたデータはローカルのブラウザ内でのみ処理
- GitHub APIへの通信は暗号化（HTTPS）
- アクセストークンは一時的なセッションのみで保存

## 🚀 開発・貢献

### 前提条件
- Node.js 18.0.0以上
- npm または yarn
- GitHubアカウント

### ローカル開発
```bash
# リポジトリをクローン
git clone https://github.com/yutaka-art/slug-checker.git

# ディレクトリに移動
cd slug-checker

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# ブラウザでアクセス
open http://localhost:3000
```

### 環境変数設定（Vercel）
```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Vercelデプロイ
```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel --prod
```

### 貢献方法
1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。

## 🙋‍♂️ サポート

問題や提案がある場合は、[Issues](https://github.com/yutaka-art/slug-checker/issues)で報告してください。

---

**バージョン**: 2.0.0 (OAuth対応・モジュール化)
