// ログアウト処理エンドポイント
export default function handler(req, res) {
  // GETとPOSTの両方を受け付ける
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // セッションクッキーを安全に削除（セキュリティ強化版）
    const secureLogoutCookies = [
      'github_session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/',
      'oauth_state=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
    ];
    
    res.setHeader('Set-Cookie', secureLogoutCookies);

    console.log('User logged out successfully');

    // GETリクエストの場合はリダイレクト、POSTの場合はJSONレスポンス
    if (req.method === 'GET') {
      res.redirect(302, '/');
    } else {
      res.status(200).json({ 
        success: true, 
        message: 'Logged out successfully' 
      });
    }

  } catch (error) {
    console.error('Logout error:', error);
    
    if (req.method === 'GET') {
      res.redirect(302, '/?error=logout_failed');
    } else {
      res.status(500).json({ 
        error: 'Logout failed',
        message: error.message 
      });
    }
  }
}