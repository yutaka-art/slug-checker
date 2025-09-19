const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 静的ファイルの配信
app.use(express.static('public'));

// APIエンドポイントのモック（開発環境用）
app.get('/api/auth/user', (req, res) => {
    // ローカルテスト用のモック応答
    res.json({
        authenticated: false,
        message: 'This is a local development mock. Deploy to Vercel for real GitHub OAuth.'
    });
});

app.get('/api/auth/login', (req, res) => {
    res.json({
        message: 'This is a local development mock. Deploy to Vercel for real GitHub OAuth.',
        redirectUrl: 'https://github.com/login/oauth/authorize'
    });
});

app.get('/api/auth/logout', (req, res) => {
    res.json({
        message: 'Logout mock for local development'
    });
});

// SPAのルーティング対応
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`🚀 Local development server running at http://localhost:${port}`);
    console.log(`📁 Serving files from: ${path.join(__dirname, 'public')}`);
    console.log(`⚠️  Note: GitHub OAuth will only work when deployed to Vercel`);
});