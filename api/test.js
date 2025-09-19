// テスト用APIエンドポイント
export default function handler(req, res) {
  console.log('Test API endpoint called');
  res.status(200).json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    environment: {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? 'Set' : 'Not set',
      VERCEL_URL: process.env.VERCEL_URL || 'Not set'
    }
  });
}