// GitHub OAuth コールバックを処理するエンドポイント

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const query = Object.fromEntries(url.searchParams);
    const { code, state, error } = query;

    // エラーがある場合の処理
    if (error) {
      console.error('GitHub OAuth error:', error);
      return res.redirect(`/?error=${encodeURIComponent(error)}`);
    }

    if (!code || !state) {
      console.error('Missing code or state parameter');
      return res.redirect('/?error=invalid_request');
    }

    // state値の検証（CSRF攻撃防止）
    const cookies = parseCookies(req.headers.cookie || '');
    const savedState = cookies.oauth_state;
    
    if (!savedState || savedState !== state) {
      console.error('State validation failed:', { savedState, receivedState: state });
      return res.redirect('/?error=state_mismatch');
    }

    // GitHub Apps OAuth設定
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Missing GitHub OAuth configuration');
      return res.redirect('/?error=configuration_error');
    }

    // 認証コードをアクセストークンに交換
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Token exchange error:', tokenData);
      return res.redirect(`/?error=${encodeURIComponent(tokenData.error)}`);
    }

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('No access token received');
      return res.redirect('/?error=no_token');
    }

    // ユーザー情報を取得
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to fetch user info:', userResponse.status);
      return res.redirect('/?error=user_fetch_failed');
    }

    const userData = await userResponse.json();

    console.log('GitHub OAuth success:', {
      username: userData.login,
      id: userData.id,
      name: userData.name
    });

    // セッション情報をクッキーに保存（簡易実装）
    const sessionData = {
      username: userData.login,
      name: userData.name,
      avatar: userData.avatar_url,
      id: userData.id,
      accessToken: accessToken, // 注意: 実際の本番環境では暗号化推奨
    };

    const sessionCookie = Buffer.from(JSON.stringify(sessionData)).toString('base64');
    
    // セキュアなクッキー設定
    res.setHeader('Set-Cookie', [
      `github_session=${sessionCookie}; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`, // 7日間
      'oauth_state=; HttpOnly; Secure; SameSite=Lax; Max-Age=0' // state cookieを削除
    ]);

    // 認証成功をフロントエンドに伝えるためにリダイレクト
    res.redirect('/?auth=success');

  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`/?error=${encodeURIComponent('callback_error')}`);
  }
}

// 簡易的なクッキーパーサー
function parseCookies(cookieString) {
  const cookies = {};
  if (cookieString) {
    cookieString.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = value;
      }
    });
  }
  return cookies;
}