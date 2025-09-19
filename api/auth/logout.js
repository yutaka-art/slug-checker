// ログアウト処理エンドポイント
export default function handler(req, res) {
  // GETとPOSTの両方を受け付ける
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // セッションクッキーを削除
    res.setHeader('Set-Cookie', [
      'github_session=; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
      'oauth_state=; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
    ]);

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