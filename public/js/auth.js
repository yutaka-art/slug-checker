/**
 * GitHub OAuth Authentication Handler
 * Handles user authentication, session management, and UI updates
 */

class GitHubSessionDetector {
    constructor() {
        this.isAuthenticated = false;
        this.user = null;
    }
    
    /**
     * Detect GitHub authentication state using Vercel OAuth API
     */
    async detectGitHubSession() {
        try {
            console.log('GitHub認証状態の検出を試行中...');
            
            const response = await fetch('/api/auth/user', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const responseData = await response.json();
                console.log('GitHub認証API応答:', responseData);
                
                if (responseData.authenticated && responseData.user) {
                    console.log('GitHub認証成功:', responseData.user);
                    this.setUser({
                        username: responseData.user.username,
                        avatar: responseData.user.avatar,
                        name: responseData.user.name || responseData.user.username
                    });
                    return true;
                } else {
                    console.log('認証されていません:', responseData);
                    return false;
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.log('GitHub API認証失敗:', response.status, errorData);
                return false;
            }
        } catch (error) {
            console.log('GitHub認証状態検出エラー:', error);
            return false;
        }
    }
    
    /**
     * Check for OAuth redirect parameters
     */
    checkForGitHubRedirect() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const auth = urlParams.get('auth');
        const error = urlParams.get('error');
        
        if (error) {
            console.error('OAuth認証エラー:', error);
            window.history.replaceState({}, document.title, window.location.pathname);
            return true;
        }
        
        if (code) {
            console.log('GitHub OAuthリダイレクトを検出:', { code, state });
            window.history.replaceState({}, document.title, window.location.pathname);
            return true;
        }
        
        if (auth === 'success') {
            console.log('GitHub認証成功フラグを検出');
            window.history.replaceState({}, document.title, window.location.pathname);
            console.log('認証成功後、1秒後にセッション情報を取得します...');
            setTimeout(async () => {
                console.log('セッション情報の取得を開始...');
                const success = await this.detectGitHubSession();
                if (!success) {
                    console.error('セッション情報の取得に失敗しました');
                    try {
                        const debugResponse = await fetch('/api/auth/user', {
                            method: 'GET',
                            credentials: 'include'
                        });
                        const debugData = await debugResponse.text();
                        console.log('デバッグ用API応答:', debugResponse.status, debugData);
                    } catch (debugError) {
                        console.error('デバッグAPI呼び出しエラー:', debugError);
                    }
                }
            }, 1000);
            return true;
        }
        
        return false;
    }
    
    /**
     * Set user information and update UI
     */
    setUser(userData) {
        this.user = userData;
        this.isAuthenticated = true;
        this.updateUI();
    }
    
    /**
     * Update authentication UI based on current state
     */
    updateUI() {
        const authDisplay = document.getElementById('authDisplay');
        const authStatus = document.getElementById('authStatus');
        
        if (this.isAuthenticated && this.user) {
            // 認証済みの場合
            if (authDisplay) {
                authDisplay.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${this.user.avatar}" alt="${this.user.username}" style="width: 24px; height: 24px; border-radius: 50%;">
                        <span style="color: #24292f; font-weight: 500;">${this.user.username}</span>
                        <a href="/api/auth/logout" style="color: #0969da; text-decoration: none; font-size: 12px;">ログアウト</a>
                    </div>
                `;
            }
            
            if (authStatus) {
                authStatus.innerHTML = `
                    <div style="background-color: #d4f8d4; border: 1px solid #4caf50; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin: 0 0 10px 0; color: #2e7d32;">✅ GitHub認証成功</h3>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <img src="${this.user.avatar}" alt="${this.user.username} Avatar" style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid #4caf50;">
                            <div>
                                <strong>ユーザー名:</strong> ${this.user.username}<br>
                                ${this.user.name ? `<strong>表示名:</strong> ${this.user.name}<br>` : ''}
                                <strong>認証状態:</strong> サインイン済み
                            </div>
                        </div>
                    </div>
                `;
            }
        } else {
            // 未認証の場合
            if (authDisplay) {
                authDisplay.innerHTML = `
                    <a href="/api/auth/login" 
                       style="
                           background-color: #0969da;
                           color: white;
                           text-decoration: none;
                           padding: 8px 16px;
                           border-radius: 6px;
                           font-size: 14px;
                           font-weight: 500;
                       ">
                       GitHubでサインイン
                    </a>
                `;
            }
            
            if (authStatus) {
                authStatus.innerHTML = `
                    <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin: 0 0 10px 0; color: #856404;">⚠️ GitHub認証が必要です</h3>
                        <p style="margin: 0; margin-bottom: 15px;">
                            Enterprise Slug確認機能を使用するには、GitHubアカウントでのサインインが必要です。
                        </p>
                        <a href="/api/auth/login" 
                           style="
                               display: inline-block;
                               background-color: #0969da;
                               color: white;
                               text-decoration: none;
                               padding: 10px 20px;
                               border-radius: 6px;
                               font-weight: 500;
                           ">
                           GitHubでサインイン
                        </a>
                    </div>
                `;
            }
        }
    }
    
    /**
     * Main authentication detection workflow
     */
    async detectAuthentication() {
        console.log('GitHub認証状態の検出を開始...');
        
        // OAuth認証コードの確認
        if (this.checkForGitHubRedirect()) {
            return;
        }
        
        // Vercel API経由での認証チェック
        const apiSuccess = await this.detectGitHubSession();
        if (apiSuccess) {
            return;
        }
        
        // 認証されていない場合のUI更新
        this.updateUI();
    }
}

// Export for use in main.js
window.GitHubSessionDetector = GitHubSessionDetector;