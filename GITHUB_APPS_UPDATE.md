# GitHub Apps設定の更新が必要

## 現在の状況
- 本番URL: `https://slug-checker-labq.vercel.app`
- GitHub Apps Client ID: `Ov23li28227p184SWRCh`

## GitHub Apps設定で更新が必要な項目

### 1. Callback URL (Authorization callback URL)
**現在の設定（推測）:** `http://localhost:8003/api/auth/callback`
**更新後の設定:** `https://slug-checker-labq.vercel.app/api/auth/callback`

### 2. Homepage URL（オプション）
**更新後の設定:** `https://slug-checker-labq.vercel.app`

## 更新手順

1. GitHubにサインインして、GitHub Appsの設定ページにアクセス:
   - https://github.com/settings/apps
   - または開発者設定 > GitHub Apps

2. 該当のアプリ（Client ID: `Ov23li28227p184SWRCh`）を選択

3. **General** タブで以下を更新:
   - **Homepage URL:** `https://slug-checker-labq.vercel.app`
   - **Authorization callback URL:** `https://slug-checker-labq.vercel.app/api/auth/callback`

4. **Save changes** をクリック

## 確認方法
設定更新後、以下の手順でOAuth認証が正常に動作することを確認:

1. `https://slug-checker-labq.vercel.app` にアクセス
2. "GitHubでサインイン" ボタンをクリック
3. GitHub認証ページにリダイレクトされることを確認
4. 認証完了後、元のページに戻ってユーザー情報が表示されることを確認

## トラブルシューティング
- エラーが発生する場合は、ブラウザの開発者ツールでコンソールを確認
- Vercelの環境変数が正しく設定されていることを確認
- GitHub Appsのコールバック URL設定を再確認