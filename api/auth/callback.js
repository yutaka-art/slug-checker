// GitHub OAuth コールバックを処理するエンドポイント
import crypto from 'crypto';

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

    // セッション情報をクッキーに保存（暗号化実装）
    const sessionData = {
      username: userData.login,
      name: userData.name,
      avatar: userData.avatar_url,
      id: userData.id,
      accessToken: accessToken, // 暗号化して保存
      timestamp: Date.now() // セッション作成時刻
    };

    // セッションデータを暗号化
    const sessionCookie = encryptSessionData(sessionData);
    
    // セキュアなクッキー設定（強化版）
    const cookieOptions = [
      `github_session=${sessionCookie}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`,
      'oauth_state=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
    ];
    
    res.setHeader('Set-Cookie', cookieOptions);

    // 認証成功をフロントエンドに伝えるためにリダイレクト
    res.redirect('/?auth=success');

  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`/?error=${encodeURIComponent('callback_error')}`);
  }
}

// セッションデータの暗号化機能
function encryptSessionData(data) {
  try {
    const sessionSecret = process.env.SESSION_SECRET;
    if (!sessionSecret) {
      console.warn('SESSION_SECRET not found, using base64 encoding instead of encryption');
      return Buffer.from(JSON.stringify(data)).toString('base64');
    }

    const algorithm = 'aes-256-gcm';
    const secretKey = crypto.createHash('sha256').update(sessionSecret).digest();
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipherGCM(algorithm, secretKey, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();
    
    const encryptedData = {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
      algorithm
    };
    
    return Buffer.from(JSON.stringify(encryptedData)).toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    // フォールバック: Base64エンコーディング
    return Buffer.from(JSON.stringify(data)).toString('base64');
  }
}

// セキュリティ強化されたクッキーパーサー
function parseCookies(cookieString) {
  const cookies = {};
  if (cookieString) {
    cookieString.split(';').forEach(cookie => {
      const [name, ...valueParts] = cookie.trim().split('=');
      if (name && valueParts.length > 0) {
        // 複数の = が含まれる場合を正しく処理
        cookies[name] = valueParts.join('=');
      }
    });
  }
  return cookies;
}