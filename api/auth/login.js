// GitHub OAuth ログインを開始するエンドポイント

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // GitHub Apps OAuth設定
    const clientId = process.env.GITHUB_CLIENT_ID;
    
    // リダイレクトURIを動的に生成
    const host = req.headers.host;
    const protocol = host && host.includes('localhost') ? 'http' : 'https';
    const redirectUri = `${protocol}://${host}/api/auth/callback`;

    console.log('Generated redirect URI:', redirectUri);

    if (!clientId) {
      console.error('GITHUB_CLIENT_ID environment variable is not set');
      return res.status(500).json({ error: 'OAuth configuration error' });
    }

    // ランダムなstate値を生成（CSRF攻撃防止）
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // stateをセッションまたはクッキーに保存（簡易実装）
    res.setHeader('Set-Cookie', `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);

    // GitHub OAuth認証URLを構築
    const githubOAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubOAuthUrl.searchParams.append('client_id', clientId);
    githubOAuthUrl.searchParams.append('redirect_uri', redirectUri);
    githubOAuthUrl.searchParams.append('scope', 'user:email read:user'); // 必要な権限のみ
    githubOAuthUrl.searchParams.append('state', state);

    console.log('GitHub OAuth login initiated:', {
      clientId: clientId.substring(0, 10) + '...',
      redirectUri,
      state
    });

    // GitHubの認証ページにリダイレクト
    res.redirect(302, githubOAuthUrl.toString());

  } catch (error) {
    console.error('OAuth login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}