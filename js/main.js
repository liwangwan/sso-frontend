document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const passwordLoginForm = document.getElementById('passwordLoginForm');
    const phoneLoginForm = document.getElementById('phoneLoginForm');
    const modal = document.getElementById('tipsModal');
    const closeBtn = document.querySelector('.close-btn');
    const tabs = document.querySelectorAll('.tab-item');
    const sendCodeBtn = document.querySelector('.send-code-btn');

    // 检查是否为移动设备
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // 显示温馨提示弹窗（仅在移动端）
    if (isMobile()) {
        setTimeout(() => {
            modal.style.display = 'block';
        }, 500);
    }

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        if (isMobile()) {
            modal.style.display = 'block';
        } else {
            modal.style.display = 'none';
        }
    });

    // 关闭弹窗
    closeBtn.addEventListener('click', () => {
        if (isMobile()) {
            modal.style.display = 'none';
        }
    });

    // 点击弹窗外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === modal && isMobile()) {
            modal.style.display = 'none';
        }
    });

    // 切换登录方式
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.dataset.tab;
            
            // 更新标签状态
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 更新表单显示
            if (tabType === 'password') {
                passwordLoginForm.classList.add('active');
                phoneLoginForm.classList.remove('active');
            } else {
                phoneLoginForm.classList.add('active');
                passwordLoginForm.classList.remove('active');
            }
        });
    });

    // 密码登录表单提交
    passwordLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            showError('请填写完整的登录信息');
            return;
        }

        simulatePasswordLogin(username, password);
    });

    // 手机验证码登录表单提交
    phoneLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const phone = document.getElementById('phone').value;
        const code = document.getElementById('verificationCode').value;

        if (!phone || !code) {
            showError('请填写完整的登录信息');
            return;
        }

        if (!/^1[3-9]\d{9}$/.test(phone)) {
            showError('请输入正确的手机号码');
            return;
        }

        simulatePhoneLogin(phone, code);
    });

    // 发送验证码
    let countdown = 60;
    let timer = null;

    sendCodeBtn.addEventListener('click', function() {
        const phone = document.getElementById('phone').value;

        if (!phone) {
            showError('请输入手机号码');
            return;
        }

        if (!/^1[3-9]\d{9}$/.test(phone)) {
            showError('请输入正确的手机号码');
            return;
        }

        // 开始倒计时
        this.disabled = true;
        this.textContent = `${countdown}秒后重新发送`;
        timer = setInterval(() => {
            countdown--;
            this.textContent = `${countdown}秒后重新发送`;
            if (countdown === 0) {
                clearInterval(timer);
                this.disabled = false;
                this.textContent = '获取验证码';
                countdown = 60;
            }
        }, 1000);

        // 模拟发送验证码
        simulateSendCode(phone);
    });

    // 第三方登录点击处理
    const otherLoginOptions = document.querySelector('.other-login-options');
    otherLoginOptions.addEventListener('click', function(e) {
        const loginItem = e.target.closest('.other-login-item');
        if (!loginItem) return;

        const loginType = loginItem.title;
        handleThirdPartyLogin(loginType);
    });
});

// 显示错误信息
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: #ff4d4f;
        font-size: 14px;
        margin-bottom: 10px;
        text-align: center;
        animation: fadeIn 0.3s ease-out;
    `;
    errorDiv.textContent = message;

    const activeForm = document.querySelector('.login-form.active');
    const existingError = activeForm.querySelector('.error-message');
    
    if (existingError) {
        existingError.remove();
    }

    activeForm.insertBefore(errorDiv, activeForm.querySelector('.login-btn'));

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// 模拟密码登录
function simulatePasswordLogin(username, password) {
    const loginBtn = passwordLoginForm.querySelector('.login-btn');
    loginBtn.disabled = true;
    loginBtn.textContent = '登录中...';

    setTimeout(() => {
        if (username === 'admin' && password === '123456') {
            window.location.href = '/dashboard';
        } else {
            showError('用户名或密码错误');
            loginBtn.disabled = false;
            loginBtn.textContent = '登 录';
        }
    }, 1000);
}

// 模拟手机验证码登录
function simulatePhoneLogin(phone, code) {
    const loginBtn = phoneLoginForm.querySelector('.login-btn');
    loginBtn.disabled = true;
    loginBtn.textContent = '登录中...';

    setTimeout(() => {
        if (code === '123456') {
            window.location.href = '/dashboard';
        } else {
            showError('验证码错误');
            loginBtn.disabled = false;
            loginBtn.textContent = '登 录';
        }
    }, 1000);
}

// 模拟发送验证码
function simulateSendCode(phone) {
    console.log('验证码已发送到手机:', phone);
    showError('验证码已发送，测试验证码为：123456');
}

// 处理第三方登录
function handleThirdPartyLogin(loginType) {
    showError(`${loginType}功能开发中...`);
}

// 添加输入框动画效果
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.3s';
    });

    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
}); 