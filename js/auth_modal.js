/**
 * ==========================================================================
 * SPORTSTORE AUTHENTICATION MODULE (CLIENT-SIDE AUTH & MODAL)
 * Quản lý trạng thái Đăng Nhập / Đăng Ký / Khách Hàng (Guest) toàn hệ thống
 * ==========================================================================
 */

(function () {
  'use strict';

  const AUTH_STORAGE_KEY = 'sportstore_auth_user';

  // Dữ liệu người dùng mẫu mặc định để đăng nhập nhanh demo
  const DEMO_USER = {
    name: 'Trần Hùng Tín',
    email: 'hungtintran89@gmail.com',
    phone: '0912345678',
    membershipTier: 'Hội Viên Vàng (Gold Elite)',
    rewardPoints: 860,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  };

  /**
   * Lấy người dùng hiện tại (nếu null là Khách vãng lai)
   */
  function getCurrentUser() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Lỗi đọc auth user:', e);
    }
    return null;
  }

  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    updateNavbars();
    updateAdminButtonVisibility();
    updateUserPageIfPresent();
  }


  /**
   * Khởi tạo giao diện Modal và lắng nghe sự kiện
   */
  document.addEventListener('DOMContentLoaded', () => {
    injectAuthModalDOM();
    updateNavbars();
    updateUserPageIfPresent();
    setupModalListeners();
  });

  /**
   * Tự động tiêm HTML Modal vào cuối <body> nếu chưa có
   */
  function injectAuthModalDOM() {
    if (document.getElementById('sport-auth-modal-overlay')) return;

    const modalHTML = `
      <div id="sport-auth-modal-overlay" class="sport-auth-modal-overlay">
        <div class="sport-auth-modal">
          <button id="sport-auth-close-btn" class="sport-auth-close-btn" title="Đóng">&times;</button>
          
          <!-- Header Modal -->
          <div class="sport-auth-header">
            <div class="sport-auth-logo">
              <span class="auth-icon">⚡</span>
              <span>SPORT<span class="accent">STORE</span></span>
            </div>
            <p class="sport-auth-tagline">Trang bị đẳng cấp - Bứt phá giới hạn thể thao</p>
            
            <!-- Tab Chuyển đổi Đăng nhập / Đăng ký -->
            <div class="sport-auth-tab-switch">
              <button id="sport-tab-btn-login" class="sport-auth-tab-btn active" data-tab="login">Đăng Nhập</button>
              <button id="sport-tab-btn-register" class="sport-auth-tab-btn" data-tab="register">Đăng Ký Thành Viên</button>
            </div>
          </div>

          <!-- Body Modal -->
          <div class="sport-auth-body">
            
            <!-- FORM 1: ĐĂNG NHẬP -->
            <form id="sport-login-form" class="sport-auth-form-panel active">
              <div class="sport-auth-form-group">
                <label for="sport-login-account">Email hoặc Số điện thoại:</label>
                <input type="text" id="sport-login-account" placeholder="Ví dụ: hungtintran89@gmail.com hoặc admin" required>
              </div>

              <div class="sport-auth-form-group">
                <div class="sport-auth-sub-row">
                  <label for="sport-login-pass">Mật khẩu:</label>
                  <a href="javascript:void(0)" id="sport-btn-forgot" class="sport-auth-forgot-link">Quên mật khẩu?</a>
                </div>
                <div class="sport-pass-wrap">
                  <input type="password" id="sport-login-pass" placeholder="••••••••" required>
                  <button type="button" class="sport-toggle-pass-btn" title="Hiện/Ẩn mật khẩu">👁️</button>
                </div>
              </div>

              <div class="sport-auth-remember-row">
                <label class="sport-auth-remember-label">
                  <input type="checkbox" id="sport-login-remember" checked> Ghi nhớ đăng nhập
                </label>
              </div>

              <button type="submit" class="btn-sport btn-primary sport-auth-submit-btn">
                🚀 Đăng Nhập Ngay
              </button>

              <!-- Phân cách -->
              <div class="sport-auth-divider">
                <span>Hoặc tiếp tục với</span>
              </div>

              <!-- Đăng nhập mạng xã hội -->
              <div class="sport-social-row">
                <button type="button" class="sport-social-btn btn-google" id="sport-social-google">
                  <span class="social-icon-google">G</span> Google
                </button>
                <button type="button" class="sport-social-btn btn-facebook" id="sport-social-fb">
                  <span class="social-icon-fb">f</span> Facebook
                </button>
              </div>

              <!-- Nút tiện ích trải nghiệm demo nhanh cho giảng viên/người chấm -->
              <div class="sport-quick-demo-box">
                <button type="button" id="sport-btn-quick-demo" class="sport-btn-quick-demo">
                  ⚡ Đăng nhập nhanh tài khoản Mẫu (1-Click)
                </button>
              </div>

              <div class="sport-auth-footer-text">
                Chưa có tài khoản? <a href="javascript:void(0)" id="sport-link-to-register">Đăng ký thành viên mới</a>
              </div>
            </form>

            <!-- FORM 2: ĐĂNG KÝ -->
            <form id="sport-register-form" class="sport-auth-form-panel">
              <div class="sport-register-reward-banner">
                🎁 Tặng ngay <strong>Voucher giảm 200.000đ</strong> và <strong>100 điểm thưởng</strong> khi đăng ký!
              </div>

              <div class="sport-auth-form-group">
                <label for="sport-reg-name">Họ và Tên đầy đủ: <span class="req-star">*</span></label>
                <input type="text" id="sport-reg-name" placeholder="Ví dụ: Nguyễn Văn A" required>
              </div>

              <div class="sport-auth-form-row">
                <div class="sport-auth-form-group">
                  <label for="sport-reg-phone">Số điện thoại (10 số): <span class="req-star">*</span></label>
                  <input type="tel" id="sport-reg-phone" placeholder="Ví dụ: 0912345678" required>
                </div>
                <div class="sport-auth-form-group">
                  <label for="sport-reg-email">Email liên hệ: <span class="req-star">*</span></label>
                  <input type="email" id="sport-reg-email" placeholder="Ví dụ: user@gmail.com" required>
                </div>
              </div>

              <div class="sport-auth-form-row">
                <div class="sport-auth-form-group">
                  <label for="sport-reg-pass">Mật khẩu (ít nhất 6 ký tự): <span class="req-star">*</span></label>
                  <div class="sport-pass-wrap">
                    <input type="password" id="sport-reg-pass" placeholder="••••••••" required>
                  </div>
                </div>
                <div class="sport-auth-form-group">
                  <label for="sport-reg-repass">Xác nhận mật khẩu: <span class="req-star">*</span></label>
                  <div class="sport-pass-wrap">
                    <input type="password" id="sport-reg-repass" placeholder="••••••••" required>
                  </div>
                </div>
              </div>

              <div class="sport-auth-remember-row">
                <label class="sport-auth-remember-label">
                  <input type="checkbox" id="sport-reg-agree" checked required> Tôi đồng ý với điều khoản sử dụng & chính sách hội viên SportStore
                </label>
              </div>

              <button type="submit" class="btn-sport btn-primary sport-auth-submit-btn">
                ✨ Hoàn Tất Đăng Ký Tài Khoản
              </button>

              <div class="sport-auth-footer-text">
                Đã có tài khoản? <a href="javascript:void(0)" id="sport-link-to-login">Đăng nhập tại đây</a>
              </div>
            </form>

          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  /**
   * Cập nhật Navbar trên tất cả các trang
   */
  function updateNavbars() {
    const user = getCurrentUser();
    const navActions = document.querySelectorAll('.sport-nav-actions');

    navActions.forEach((container) => {
      // Tìm hoặc tạo vùng auth
      let authArea = container.querySelector('.sport-auth-nav-area');
      if (!authArea) {
        authArea = document.createElement('div');
        authArea.className = 'sport-auth-nav-area';
        
        // Chèn vào vị trí phù hợp (trước giỏ hàng hoặc sau admin)
        const userBtn = container.querySelector('a[href*="dev5_user.html"]');
        if (userBtn) {
          container.replaceChild(authArea, userBtn);
        } else {
          container.appendChild(authArea);
        }
      }

      // Xác định đường dẫn tương đối đến dev5_user.html
      const isPagesDir = window.location.pathname.includes('/pages/');
      const userLink = isPagesDir ? 'dev5_user.html' : 'pages/dev5_user.html';

      if (user) {
        // ĐÃ ĐĂNG NHẬP
        authArea.innerHTML = `
          <div class="sport-user-logged-wrap">
            <a href="${userLink}" class="sport-user-logged-pill" title="Hồ sơ tài khoản: ${user.name}">
              <span class="user-pill-avatar">👤</span>
              <span class="user-pill-name">${user.name.split(' ').pop()}</span>
            </a>
            <button class="sport-btn-logout-icon" title="Đăng xuất tài khoản">🚪</button>
          </div>
        `;

        const logoutBtn = authArea.querySelector('.sport-btn-logout-icon');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?')) {
              localStorage.removeItem('admin_logged_in');
              setCurrentUser(null);
              showToast('Đã đăng xuất tài khoản thành công! Bạn đang duyệt web dưới dạng Khách.', 'info');
            }
          });
        }
      } else {
        // LÀ KHÁCH (CHƯA ĐĂNG NHẬP)
        authArea.innerHTML = `
          <div class="sport-guest-nav-btns">
            <button class="btn-sport btn-outline sport-btn-nav-login">
              🔑 Đăng Nhập
            </button>
            <button class="btn-sport btn-primary sport-btn-nav-register">
              ✨ Đăng Ký
            </button>
          </div>
        `;

        const loginBtn = authArea.querySelector('.sport-btn-nav-login');
        const regBtn = authArea.querySelector('.sport-btn-nav-register');

        if (loginBtn) {
          loginBtn.addEventListener('click', () => openModal('login'));
        }
        if (regBtn) {
          regBtn.addEventListener('click', () => openModal('register'));
        }
      }
    });

    // Cập nhật phân quyền nút Admin trên Header
    updateAdminButtonVisibility();
  }

  /**
   * Phân quyền hiển thị nút Admin trên Header:
   * Mặc định khi vào trang web (Khách) hoặc User thường: ẨN nút Admin.
   * Khi đăng nhập tài khoản có quyền Admin (admin / 123456): HIỂN THỊ nút Admin.
   */
  function updateAdminButtonVisibility() {
    const adminBtns = document.querySelectorAll('.nav-admin-btn, #header-nav-admin-btn');
    const user = getCurrentUser();
    const isAdminLogged = localStorage.getItem('admin_logged_in') === 'true' || 
                          (user && (user.role === 'admin' || user.account === 'admin' || user.email === 'admin@sportstore.vn'));
    
    adminBtns.forEach((btn) => {
      if (isAdminLogged) {
        btn.classList.add('is-admin-visible');
      } else {
        btn.classList.remove('is-admin-visible');
      }
    });
  }

  /**
   * Cập nhật giao diện trang Hồ Sơ (dev5_user.html) nếu đang đứng tại trang đó
   */
  function updateUserPageIfPresent() {
    const isUserPage = document.querySelector('.dev5-user-wrapper');
    if (!isUserPage) return;

    const user = getCurrentUser();
    const guestBanner = document.getElementById('dev5-guest-notice-banner');

    if (!user) {
      // Hiển thị banner nhắc nhở đăng nhập ở đầu trang
      if (!guestBanner) {
        const portalLayout = document.querySelector('.dev5-portal-layout');
        if (portalLayout) {
          const banner = document.createElement('div');
          banner.id = 'dev5-guest-notice-banner';
          banner.className = 'dev5-guest-notice-banner';
          banner.innerHTML = `
            <div class="guest-notice-inner">
              <div class="guest-notice-left">
                <span class="guest-notice-icon">👋</span>
                <div>
                  <h4 class="guest-notice-title">BẠN ĐANG XEM TRANG DƯỚI TƯ CÁCH KHÁCH HÀNG (CHƯA ĐĂNG NHẬP)</h4>
                  <p class="guest-notice-desc">Hãy đăng nhập hoặc tạo tài khoản để đồng bộ đơn hàng, tích lũy điểm thưởng và cấu hình sổ địa chỉ nhận hàng!</p>
                </div>
              </div>
              <div class="guest-notice-actions">
                <button class="btn-sport btn-primary" onclick="window.SportAuth.openModal('login')">🔑 Đăng Nhập Ngay</button>
                <button class="btn-sport btn-outline sport-btn-nav-login" onclick="window.SportAuth.quickDemoLogin()">⚡ Dùng Tài Khoản Mẫu</button>
              </div>
            </div>
          `;
          portalLayout.parentNode.insertBefore(banner, portalLayout);
        }
      }
    } else {
      if (guestBanner) guestBanner.remove();
    }
  }

  /**
   * Thiết lập tương tác cho Modal Đăng Nhập / Đăng Ký
   */
  function setupModalListeners() {
    const overlay = document.getElementById('sport-auth-modal-overlay');
    const closeBtn = document.getElementById('sport-auth-close-btn');
    const tabLogin = document.getElementById('sport-tab-btn-login');
    const tabRegister = document.getElementById('sport-tab-btn-register');
    const formLogin = document.getElementById('sport-login-form');
    const formRegister = document.getElementById('sport-register-form');
    const linkToReg = document.getElementById('sport-link-to-register');
    const linkToLogin = document.getElementById('sport-link-to-login');
    const btnQuickDemo = document.getElementById('sport-btn-quick-demo');
    const btnGoogle = document.getElementById('sport-social-google');
    const btnFb = document.getElementById('sport-social-fb');

    if (!overlay) return;

    // Đóng khi bấm X hoặc click ngoài modal
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // Chuyển Tab
    function switchTab(tab) {
      if (tab === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        formLogin.classList.add('active');
        formRegister.classList.remove('active');
      } else {
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
        formLogin.classList.remove('active');
        formRegister.classList.add('active');
      }
    }

    if (tabLogin) tabLogin.addEventListener('click', () => switchTab('login'));
    if (tabRegister) tabRegister.addEventListener('click', () => switchTab('register'));
    if (linkToReg) linkToReg.addEventListener('click', () => switchTab('register'));
    if (linkToLogin) linkToLogin.addEventListener('click', () => switchTab('login'));

    // Toggle hiển thị mật khẩu
    document.querySelectorAll('.sport-toggle-pass-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const inp = btn.previousElementSibling;
        if (inp.type === 'password') {
          inp.type = 'text';
          btn.textContent = '🔒';
        } else {
          inp.type = 'password';
          btn.textContent = '👁️';
        }
      });
    });

    // Submit Đăng Nhập
    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const account = document.getElementById('sport-login-account').value.trim();
        const pass = document.getElementById('sport-login-pass').value;

        if (!account || !pass) {
          showToast('Vui lòng điền đầy đủ tài khoản và mật khẩu!', 'error');
          return;
        }

        // Kiểm tra nếu là tài khoản Admin
        const isAdmin = (account.toLowerCase() === 'admin' && pass === '123456');

        // Tạo user đăng nhập
        const loggedUser = {
          account: account,
          name: isAdmin ? 'Admin Quản Trị' : (account.includes('@') ? account.split('@')[0].toUpperCase() : 'Khách Hàng'),
          email: isAdmin ? 'admin@sportstore.vn' : (account.includes('@') ? account : 'khachhang@sportstore.vn'),
          phone: !account.includes('@') ? account : '0912345678',
          role: isAdmin ? 'admin' : 'customer',
          membershipTier: isAdmin ? 'Ban Quản Trị Hệ Thống' : 'Hội Viên Thân Thiết (Silver)',
          rewardPoints: isAdmin ? 9999 : 100
        };

        if (isAdmin) {
          localStorage.setItem('admin_logged_in', 'true');
        }

        setCurrentUser(loggedUser);
        closeModal();
        if (isAdmin) {
          showToast(`Đăng nhập Quản Trị Viên thành công! Đã kích hoạt quyền Admin.`, 'success');
        } else {
          showToast(`Đăng nhập thành công! Chào mừng ${loggedUser.name} quay trở lại SportStore.`, 'success');
        }
      });
    }

    // Submit Đăng Ký
    if (formRegister) {
      formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('sport-reg-name').value.trim();
        const phone = document.getElementById('sport-reg-phone').value.trim();
        const email = document.getElementById('sport-reg-email').value.trim();
        const pass = document.getElementById('sport-reg-pass').value;
        const repass = document.getElementById('sport-reg-repass').value;

        if (pass.length < 6) {
          showToast('Mật khẩu phải chứa ít nhất 6 ký tự!', 'error');
          return;
        }
        if (pass !== repass) {
          showToast('Mật khẩu xác nhận không trùng khớp!', 'error');
          return;
        }

        const newUser = {
          name: name,
          email: email,
          phone: phone,
          membershipTier: 'Hội Viên Mới (Newbie)',
          rewardPoints: 100
        };

        // Lưu đồng thời địa chỉ mặc định từ thông tin đăng ký
        const defaultAddress = {
          name: name,
          phone: phone,
          email: email,
          provinceZone: 'hanoi',
          provinceName: 'Hà Nội (Nội thành - Hỏa tốc 2h)',
          shippingFee: 25000,
          address: 'Chưa cập nhật địa chỉ chi tiết'
        };
        try {
          localStorage.setItem('sportstore_user_address', JSON.stringify(defaultAddress));
        } catch (err) {}

        setCurrentUser(newUser);
        closeModal();
        showToast(`🎉 Đăng ký thành công! Chào mừng bạn gia nhập SportStore với 100 điểm thưởng.`, 'success');
      });
    }

    // Đăng nhập nhanh tài khoản mẫu
    if (btnQuickDemo) {
      btnQuickDemo.addEventListener('click', () => {
        setCurrentUser(DEMO_USER);
        closeModal();
        showToast(`Đã đăng nhập tài khoản mẫu: ${DEMO_USER.name} (Hội viên VIP)`, 'success');
      });
    }

    // Đăng nhập Google / Facebook mock
    if (btnGoogle) {
      btnGoogle.addEventListener('click', () => {
        const googleUser = {
          name: 'Google User',
          email: 'google.sport@gmail.com',
          phone: '0988112233',
          membershipTier: 'Hội Viên Tiêu Chuẩn',
          rewardPoints: 150
        };
        setCurrentUser(googleUser);
        closeModal();
        showToast('Đăng nhập Google thành công!', 'success');
      });
    }

    if (btnFb) {
      btnFb.addEventListener('click', () => {
        const fbUser = {
          name: 'Facebook User',
          email: 'facebook.sport@gmail.com',
          phone: '0977223344',
          membershipTier: 'Hội Viên Tiêu Chuẩn',
          rewardPoints: 150
        };
        setCurrentUser(fbUser);
        closeModal();
        showToast('Đăng nhập Facebook thành công!', 'success');
      });
    }
  }

  function openModal(tab = 'login') {
    const overlay = document.getElementById('sport-auth-modal-overlay');
    if (!overlay) return;
    overlay.classList.add('show');
    
    const tabLogin = document.getElementById('sport-tab-btn-login');
    const tabRegister = document.getElementById('sport-tab-btn-register');
    const formLogin = document.getElementById('sport-login-form');
    const formRegister = document.getElementById('sport-register-form');

    if (tab === 'login') {
      if (tabLogin) tabLogin.classList.add('active');
      if (tabRegister) tabRegister.classList.remove('active');
      if (formLogin) formLogin.classList.add('active');
      if (formRegister) formRegister.classList.remove('active');
    } else {
      if (tabLogin) tabLogin.classList.remove('active');
      if (tabRegister) tabRegister.classList.add('active');
      if (formLogin) formLogin.classList.remove('active');
      if (formRegister) formRegister.classList.add('active');
    }
  }

  function closeModal() {
    const overlay = document.getElementById('sport-auth-modal-overlay');
    if (overlay) overlay.classList.remove('show');
  }

  function showToast(message, type = 'success') {
    const container = document.getElementById('sport-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `sport-toast ${type}`;
    const icon = type === 'success' ? '✔' : type === 'error' ? '✖' : 'ℹ';

    toast.innerHTML = `
      <div class="sport-toast-item-inner">
        <span class="sport-toast-icon">${icon}</span>
        <div>${message}</div>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Xuất API công khai lên window để bất kỳ module nào cũng gọi được
  window.SportAuth = {
    openModal: openModal,
    closeModal: closeModal,
    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser,
    quickDemoLogin: function () {
      setCurrentUser(DEMO_USER);
      showToast(`Đã kích hoạt tài khoản mẫu: ${DEMO_USER.name}`, 'success');
    },
    logout: function () {
      setCurrentUser(null);
      showToast('Đã đăng xuất.', 'info');
    }
  };

})();
