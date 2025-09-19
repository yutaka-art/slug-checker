// ユーザー情報を取得するエンドポイント
import crypto from 'crypto';

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

    // セッション情報を復号化
    const sessionData = decryptSessionData(sessionCookie);
    
    if (!sessionData) {
      return res.status(401).json({ 
        authenticated: false, 
        error: 'Invalid session data' 
      });
    }

    // セッションの有効期限チェック（7日間）
    const sessionAge = Date.now() - (sessionData.timestamp || 0);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7日間（ミリ秒）
    
    if (sessionAge > maxAge) {
      return res.status(401).json({ 
        authenticated: false, 
        error: 'Session expired' 
      });
    }

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

// セッションデータの復号化機能
function decryptSessionData(encryptedCookie) {
  try {
    const sessionSecret = process.env.SESSION_SECRET;
    const encryptedData = JSON.parse(Buffer.from(encryptedCookie, 'base64').toString());
    
    // 暗号化されていない場合（フォールバック）
    if (typeof encryptedData === 'object' && !encryptedData.encrypted) {
      return encryptedData;
    }
    
    // SESSION_SECRETがない場合はBase64デコードのみ
    if (!sessionSecret) {
      console.warn('SESSION_SECRET not found, using base64 decoding');
      return JSON.parse(Buffer.from(encryptedCookie, 'base64').toString());
    }
    
    // 暗号化データの場合
    if (encryptedData.encrypted && encryptedData.iv && encryptedData.tag) {
      const algorithm = encryptedData.algorithm || 'aes-256-gcm';
      const secretKey = crypto.createHash('sha256').update(sessionSecret).digest();
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const tag = Buffer.from(encryptedData.tag, 'hex');
      
      const decipher = crypto.createDecipherGCM(algorithm, secretKey, iv);
      decipher.setAuthTag(tag);
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    }
    
    // フォールバック: 直接JSON.parse
    return encryptedData;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
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