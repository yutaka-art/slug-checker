// ユーザー情報を取得するエンドポイント
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // クッキーからセッション情報を取得
    const cookies = parseCookies(req.headers.cookie || '');
    const sessionCookie = cookies.github_session;

    if (!sessionCookie) {
      return res.status(401).json({ 
        authenticated: false, 
        error: 'No session found' 
      });
    }

    // セッション情報をデコード
    const sessionData = JSON.parse(Buffer.from(sessionCookie, 'base64').toString());

    // ユーザー情報を返す（アクセストークンは除外）
    const { accessToken, ...userInfo } = sessionData;

    res.status(200).json({
      authenticated: true,
      user: userInfo
    });

  } catch (error) {
    console.error('User info error:', error);
    res.status(500).json({ 
      authenticated: false, 
      error: 'Session decode error' 
    });
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