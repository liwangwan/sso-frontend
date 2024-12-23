document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const resetForm = document.getElementById('resetForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthLevel = document.getElementById('strengthLevel');
    const strengthText = document.getElementById('strengthText');
    const phoneInput = document.getElementById('phone');
    const sendCodeBtn = document.querySelector('.send-code-btn');
    const submitBtn = document.querySelector('.submit-btn');
    const modal = document.getElementById('tipsModal');
    const closeBtn = document.querySelector('.close-btn');

    // 检查是否为移动设备
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // 显示说明弹窗（仅在移动端）
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

    // 密码强度检测
    function checkPasswordStrength(password) {
        let score = 0;
        
        // 长度检查
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        
        // 包含数字
        if (/\d/.test(password)) score++;
        
        // 包含小写字母
        if (/[a-z]/.test(password)) score++;
        
        // 包含大写字母
        if (/[A-Z]/.test(password)) score++;
        
        // 包含特殊字符
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

        return score;
    }

    // 更新密码强度显示
    function updateStrengthIndicator(password) {
        const score = checkPasswordStrength(password);
        
        strengthLevel.className = 'strength-level';
        if (score <= 2) {
            strengthLevel.classList.add('weak');
            strengthText.textContent = '密码强度：弱';
        } else if (score <= 4) {
            strengthLevel.classList.add('medium');
            strengthText.textContent = '密码强度：中';
        } else {
            strengthLevel.classList.add('strong');
            strengthText.textContent = '密码强度：强';
        }

        // 检查密码是否满足所有要求
        const isValid = password.length >= 8 && 
                       /[A-Z]/.test(password) && 
                       /[a-z]/.test(password) && 
                       /\d/.test(password) && 
                       /[!@#$%^&*(),.?":{}|<>]/.test(password);

        passwordInput.setCustomValidity(isValid ? '' : '密码必须包含大小写字母、数字和特殊字符');
    }

    // 密码输入事件
    passwordInput.addEventListener('input', function() {
        updateStrengthIndicator(this.value);
        
        // 如果确认密码已经输入，则同时检查确认密码
        if (confirmPasswordInput.value) {
            checkPasswordMatch();
        }
    });

    // 检查密码匹配
    function checkPasswordMatch() {
        if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordInput.setCustomValidity('两次输入的密码不一致');
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    }

    // 确认密码输入事件
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);

    // 发送验证码
    let countdown = 60;
    let timer = null;

    sendCodeBtn.addEventListener('click', function() {
        const phone = phoneInput.value;

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

    // 表单提交
    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            phone: phoneInput.value,
            verificationCode: document.getElementById('verificationCode').value,
            newPassword: passwordInput.value
        };

        // 模拟重置密码请求
        simulateResetPassword(formData);
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

        const existingError = resetForm.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        resetForm.insertBefore(errorDiv, submitBtn);

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // 模拟发送验证码
    function simulateSendCode(phone) {
        console.log('验证码已发送到手机:', phone);
        showError('验证码已发送，测试验证码为：123456');
    }

    // 模拟重置密码请求
    function simulateResetPassword(formData) {
        submitBtn.disabled = true;
        submitBtn.textContent = '重置中...';

        setTimeout(() => {
            console.log('重置密码信息:', formData);
            // 这里应该是实际的重置密码请求
            // 模拟重置成功
            if (formData.verificationCode === '123456') {
                showError('密码重置成功！正在跳转到登录页面...');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showError('验证码错误');
                submitBtn.disabled = false;
                submitBtn.textContent = '重置密码';
            }
        }, 1000);
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
}); 