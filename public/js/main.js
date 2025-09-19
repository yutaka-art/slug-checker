/**
 * GitHub Slug Checker - Main Application Logic
 * Handles username validation and enterprise page interactions
 */

/**
 * Application State
 */
const App = {
    githubDetector: null,
    elements: {},
    
    /**
     * Initialize the application
     */
    init() {
        console.log('GitHub認証状態検出ページが読み込まれました');
        
        // Initialize authentication detector
        this.githubDetector = new GitHubSessionDetector();
        
        // Get DOM elements
        this.getElements();
        
        // Validate required elements
        if (!this.validateElements()) {
            return;
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start authentication detection
        this.githubDetector.detectAuthentication();
        
        console.log('アプリケーションの初期化が完了しました');
    },
    
    /**
     * Get references to DOM elements
     */
    getElements() {
        this.elements = {
            usernameInput: document.getElementById('usernameInput'),
            checkUsernameBtn: document.getElementById('checkUsernameBtn'),
            usernameResult: document.getElementById('usernameResult'),
            openEnterprisePageBtn: document.getElementById('openEnterprisePageBtn')
        };
    },
    
    /**
     * Validate that required elements exist
     */
    validateElements() {
        const required = ['usernameInput', 'checkUsernameBtn', 'usernameResult'];
        const missing = required.filter(id => !this.elements[id]);
        
        if (missing.length > 0) {
            console.error('必要な要素が見つかりません:', missing);
            document.body.innerHTML = '<h1>エラー: ページの要素が正しく読み込まれませんでした</h1>';
            return false;
        }
        
        console.log('すべての要素が正常に取得されました');
        return true;
    },
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Username check button
        this.elements.checkUsernameBtn.addEventListener('click', () => {
            this.checkUsername();
        });
        
        // Enterprise page button
        if (this.elements.openEnterprisePageBtn) {
            this.elements.openEnterprisePageBtn.addEventListener('click', () => {
                this.openEnterprisePage();
            });
        }
        
        // Enter key support for username input
        this.elements.usernameInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.checkUsername();
            }
        });
        
        console.log('すべてのイベントリスナーが設定されました');
    },
    
    /**
     * Validate username format
     */
    isValidUsername(username) {
        // 先頭/末尾ハイフン不可、英数字とハイフンのみ、1-39文字
        const pattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
        return pattern.test(username);
    },
    
    /**
     * Check username availability
     */
    async checkUsername() {
        const username = this.elements.usernameInput.value.trim();
        const resultDiv = this.elements.usernameResult;
        
        console.log('ユーザー名チェック開始:', username);
        
        // Clear previous results
        resultDiv.innerHTML = '';
        resultDiv.className = 'result';
        
        // Validate input
        if (!username) {
            this.showResult('error', 'ユーザー名を入力してください');
            return;
        }
        
        if (!this.isValidUsername(username)) {
            this.showResult('error', `
                ユーザー名の形式が正しくありません。<br>
                <strong>条件:</strong> 英数字とハイフンのみ、先頭・末尾にハイフン不可、1-39文字
            `);
            return;
        }
        
        // Show loading state
        this.elements.checkUsernameBtn.disabled = true;
        this.elements.checkUsernameBtn.textContent = 'チェック中...';
        
        try {
            // Check GitHub API
            const response = await fetch(`https://api.github.com/users/${username}`);
            
            if (response.status === 200) {
                const userData = await response.json();
                this.showResult('error', `
                    ❌ <strong>「${username}」は既に使用されています</strong><br>
                    <div style="margin-top: 10px; padding: 10px; background-color: #f6f8fa; border-radius: 6px;">
                        <strong>既存ユーザー情報:</strong><br>
                        🔗 <a href="${userData.html_url}" target="_blank" rel="noopener noreferrer">${userData.html_url}</a><br>
                        📅 作成日: ${new Date(userData.created_at).toLocaleDateString('ja-JP')}
                        ${userData.name ? `<br>👤 名前: ${userData.name}` : ''}
                        ${userData.company ? `<br>🏢 所属: ${userData.company}` : ''}
                    </div>
                `);
            } else if (response.status === 404) {
                this.showResult('success', `
                    ✅ <strong>「${username}」は利用可能です</strong><br>
                    このユーザー名でGitHubアカウントを作成できます。
                `);
            } else {
                throw new Error(`GitHub APIエラー: ${response.status}`);
            }
        } catch (error) {
            console.error('ユーザー名チェックエラー:', error);
            this.showResult('error', `
                エラーが発生しました: ${error.message}<br>
                しばらく時間をおいて再試行してください。
            `);
        } finally {
            // Reset button state
            this.elements.checkUsernameBtn.disabled = false;
            this.elements.checkUsernameBtn.textContent = 'チェック';
        }
    },
    
    /**
     * Show result message
     */
    showResult(type, message) {
        const resultDiv = this.elements.usernameResult;
        resultDiv.className = `result ${type}`;
        resultDiv.innerHTML = message;
    },
    
    /**
     * Open GitHub Enterprise creation page
     */
    openEnterprisePage() {
        console.log('Enterprise作成ページを開くボタンがクリックされました');
        const url = 'https://github.com/account/enterprises/new?users_type=metered_ghe';
        console.log('Enterprise作成ページを開きます:', url);
        window.open(url, '_blank', 'noopener,noreferrer');
    }
};

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});