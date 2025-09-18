# GitHub 利用可否チェック

GitHubのユーザー名とEnterprise Slugの利用可否を簡単にチェックできるWebツールです。

## 🔗 サイトURL

**https://yutaka-art.github.io/slug-checker/**

## 📋 機能

### 1. GitHubユーザー名チェック
- GitHub APIを使用してユーザー名の利用可否をリアルタイムで確認
- 形式バリデーション（英数字とハイフン、先頭・末尾ハイフン不可、最大39文字）
- 即座に結果を表示

### 2. Enterprise Slugチェック
- GitHub Enterprise組織のslugの利用可否を確認
- 新しいタブでURLを開いて手動確認方式
- 404エラーで利用可能性を判定

## 💡 使用方法

### GitHubユーザー名の確認
1. 「GitHub ユーザー名チェック」セクションにユーザー名を入力
2. 「チェック」ボタンをクリック
3. 結果が即座に表示されます
   - ✅ **利用可能** - そのユーザー名は使用されていません
   - ❌ **利用できません** - そのユーザー名は既に使用されています

### Enterprise Slugの確認
⚠️ **重要**: 正確な判定のため、以下のいずれかを実行してください
- GitHubからサインアウトしてから使用
- **シークレット/プライベートブラウザモード**で開く

1. 「Enterprise Slug 存在確認」セクションにslugを入力
2. 「ページを開く」ボタンをクリック
3. 新しいタブで開いたページの結果を確認
   - **404エラー** → そのslugは利用可能
   - **ページ表示/ログイン画面** → そのslugは既に使用中

## 🛠️ 技術仕様

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **API**: GitHub REST API v3
- **ホスティング**: GitHub Pages
- **対応ブラウザ**: モダンブラウザ全般（Chrome, Firefox, Safari, Edge）

## 📝 制限事項

### GitHubユーザー名チェック
- GitHub APIのレート制限（1時間あたり60リクエスト/IP）の対象
- ネットワーク接続が必要

### Enterprise Slugチェック
- CORS制約により自動判定不可
- 手動での確認が必要
- GitHubサインイン状態により結果が変わる可能性

## 🔒 プライバシー

- 入力されたデータはローカルのブラウザ内でのみ処理
- サーバーへの個人情報送信なし
- GitHub APIへの通信は暗号化（HTTPS）

## 🚀 開発・貢献

### ローカル開発
```bash
# リポジトリをクローン
git clone https://github.com/yutaka-art/slug-checker.git

# ディレクトリに移動
cd slug-checker

# ローカルサーバーで開く（例：Python）
python -m http.server 8000

# ブラウザでアクセス
open http://localhost:8000
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

**作成者**: [yutaka-art](https://github.com/yutaka-art)  
**最終更新**: 2025年9月18日
