// ログアウト処理エンドポイント
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // セッションクッキーを削除
    res.setHeader('Set-Cookie', [
      'github_session=; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
      'oauth_state=; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
    ]);

    res.status(200).json({ 
      success: true, 
      message: 'Logged out successfully' 
    });

    console.log('User logged out successfully');

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Logout failed',
      message: error.message 
    });
  }
}