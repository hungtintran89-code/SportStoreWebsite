(function () {
  'use strict';

  var SESSION_KEY = 'sportstore_auth';
  var REGISTERED_KEY = 'sportstore_registered_users';
  var ADMIN_FLAG_KEY = 'admin_logged_in';
  var DATA_URL = '../data/dev5_user.json';
  var usersPromise;

  function readRegisteredUsers() {
    try {
      return JSON.parse(localStorage.getItem(REGISTERED_KEY) || '[]');
    } catch (error) {
      return [];
    }
  }

  function loadUsers() {
    if (!usersPromise) {
      usersPromise = fetch(DATA_URL).then(function (response) {
        if (!response.ok) throw new Error('Không thể tải dữ liệu tài khoản.');
        return response.json();
      }).then(function (data) {
        return data.users || [];
      }).catch(function () {
        return [
          {
            id: 'u-001',
            name: 'Nguyen Minh Anh',
            email: 'user@sportstore.vn',
            password: 'user123',
            role: 'user',
            tier: 'Gold',
            phone: '0901234567'
          },
          {
            id: 'a-001',
            name: 'SportStore Administrator',
            email: 'admin@sportstore.vn',
            password: 'admin123',
            role: 'admin',
            tier: 'Administrator',
            phone: '0909876543'
          }
        ];
      });
    }
    return usersPromise.then(function (users) {
      return (users || []).concat(readRegisteredUsers());
    });
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    } catch (error) {
      return null;
    }
  }

  function getPageUrl(fileName) {
    var pathParts = window.location.pathname.split('/');
    var isInsidePagesFolder = pathParts.indexOf('pages') !== -1;
    return isInsidePagesFolder ? fileName : 'pages/' + fileName;
  }

  function openModal(mode) {
    var modal = document.querySelector('[data-auth-modal]');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'dev5-auth-modal';
      modal.dataset.authModal = '';
      modal.innerHTML = '<div class="dev5-auth-box" role="dialog" aria-modal="true">' +
        '<button class="dev5-auth-close" type="button" data-auth-close aria-label="Đóng">×</button>' +
        '<span class="dev5-eyebrow">SPORTSTORE ACCOUNT</span>' +
        '<div class="dev5-auth-tabs" role="tablist">' +
        '  <button type="button" class="dev5-auth-tab" data-auth-tab="login">ĐĂNG NHẬP</button>' +
        '  <button type="button" class="dev5-auth-tab" data-auth-tab="register">ĐĂNG KÝ THÀNH VIÊN</button>' +
        '</div>' +
        '<p class="dev5-auth-message" data-auth-message aria-live="polite"></p>' +
        '<form data-auth-form novalidate></form>' +
        '<p class="dev5-auth-switch" data-auth-switch></p>' +
        '</div>';
      document.body.appendChild(modal);

      modal.onclick = function (event) {
        if (event.target === modal || event.target.closest('[data-auth-close]')) {
          modal.classList.remove('is-open');
        }
        var switchButton = event.target.closest('[data-auth-switch-button]');
        if (switchButton) renderModal(switchButton.dataset.authSwitchButton);

        var tabButton = event.target.closest('[data-auth-tab]');
        if (tabButton) renderModal(tabButton.dataset.authTab);

        var demoToggle = event.target.closest('[data-auth-demo-toggle]');
        if (demoToggle) {
          var options = modal.querySelector('[data-demo-options]');
          if (options) options.classList.toggle('dev5-hidden');
        }

        var demoChoice = event.target.closest('[data-auth-demo]');
        if (demoChoice) {
          loginAsDemo(demoChoice.dataset.authDemo);
        }

        var submitBtn = event.target.closest('button[type="submit"]');
        if (submitBtn) {
          submitForm(event);
        }
      };
    }
    renderModal(mode);
    modal.classList.add('is-open');
    var firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  }

  function renderModal(mode) {
    var modal = document.querySelector('[data-auth-modal]');
    var register = mode === 'register';
    modal.dataset.authMode = mode;

    modal.querySelectorAll('[data-auth-tab]').forEach(function (tab) {
      tab.classList.toggle('is-active', tab.dataset.authTab === mode);
    });

    var formHtml = '';
    var switchHtml = '';

    if (register) {
      formHtml = '<label>Họ và tên<input name="name" minlength="2" maxlength="80" required autocomplete="name"></label>' +
        '<label>Email<input name="email" type="email" placeholder="tenban@example.com" required autocomplete="email"></label>' +
        '<label>Số điện thoại<input name="phone" inputmode="numeric" pattern="0[0-9]{9}" maxlength="10" required autocomplete="tel"></label>' +
        '<label>Mật khẩu<input name="password" type="password" minlength="8" required autocomplete="new-password"></label>' +
        '<label>Nhập lại mật khẩu<input name="confirmPassword" type="password" minlength="8" required autocomplete="new-password"></label>' +
        '<button class="dev5-primary-button" type="submit">Đăng ký</button>';

      switchHtml = 'Đã có tài khoản? <button type="button" data-auth-switch-button="login">Đăng nhập</button>';
    } else {
      formHtml = '<label>Email / SĐT<input name="email" type="text" placeholder="nguyenvana@gmail.com" required autocomplete="username"></label>' +
        '<label>Mật khẩu<input name="password" type="password" placeholder="••••••••" required autocomplete="current-password"></label>' +
        '<div class="dev5-auth-btn-row" style="margin-top: 14px;">' +
        '  <button class="dev5-primary-button" type="submit">Đăng nhập</button>' +
        '  <button class="dev5-demo-button" type="button" data-auth-demo="user">⚡ Đăng nhập nhanh User</button>' +
        '</div>';

      switchHtml = 'Chưa có tài khoản? <button type="button" data-auth-switch-button="register">Đăng ký ngay</button>';
    }

    modal.querySelector('[data-auth-form]').innerHTML = formHtml;
    modal.querySelector('[data-auth-switch]').innerHTML = switchHtml;
    var msgEl = modal.querySelector('[data-auth-message]');
    msgEl.textContent = '';
    msgEl.style.color = '#dc2626';
  }

  function loginAsDemo(role) {
    loadUsers().then(function (users) {
      var targetRole = role === 'admin' ? 'admin' : 'user';
      var user = users.find(function (item) {
        return item.role === targetRole;
      });

      if (!user) {
        if (targetRole === 'admin') {
          user = {
            id: 'a-001',
            name: 'SportStore Administrator',
            email: 'admin@sportstore.vn',
            role: 'admin',
            tier: 'Administrator',
            avatar: 'https://i.pravatar.cc/160?img=68'
          };
        } else {
          user = {
            id: 'u-001',
            name: 'Nguyen Minh Anh',
            email: 'user@sportstore.vn',
            role: 'user',
            tier: 'Gold',
            avatar: 'https://i.pravatar.cc/160?img=47'
          };
        }
      }

      var isAdmin = user.role === 'admin';
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '0901234567',
        role: user.role,
        tier: user.tier,
        avatar: user.avatar
      }));

      localStorage.setItem(ADMIN_FLAG_KEY, isAdmin ? 'true' : 'false');

      var modal = document.querySelector('[data-auth-modal]');
      if (modal) {
        var message = modal.querySelector('[data-auth-message]');
        if (message) {
          message.textContent = 'Đăng nhập demo thành công (' + (isAdmin ? 'Admin' : 'Hội viên') + ').';
        }
      }

      updateAuthButtons();

      setTimeout(function () {
        var destination = isAdmin
          ? getPageUrl('admin.html')
          : getPageUrl('dev5_user.html');
        window.location.href = destination;
      }, 250);
    }).catch(function (error) {
      var modal = document.querySelector('[data-auth-modal]');
      if (modal) {
        var message = modal.querySelector('[data-auth-message]');
        if (message) message.textContent = error.message;
      }
    });
  }

  // So khớp Email hoặc Số điện thoại đơn giản
  function isMatchAccount(item, input) {
    if (!item || !input) return false;
    var userEmail = (item.email || '').toLowerCase().trim();
    var userPhone = String(item.phone || '').trim();
    var target = String(input).toLowerCase().trim();

    return userEmail === target || userPhone === target;
  }

  function validateRegistration(form) {
    var name = form.name.value.trim();
    var password = form.password.value;
    var email = form.email.value.trim().toLowerCase();
    var phone = form.phone.value.trim();

    if (!name) return 'Vui lòng nhập họ và tên.';
    if (name.length < 2) return 'Họ tên phải có ít nhất 2 ký tự.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email không đúng định dạng.';
    if (!phone) return 'Vui lòng nhập số điện thoại.';
    if (!/^0[0-9]{9}$/.test(phone)) return 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.';
    if (password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự.';
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return 'Mật khẩu phải gồm cả chữ và số.';
    if (password !== form.confirmPassword.value) return 'Mật khẩu xác nhận không trùng khớp.';
    return '';
  }

  function validateLogin(form) {
    var account = form.email.value.trim();
    var password = form.password.value;

    if (!account) return 'Vui lòng nhập email hoặc số điện thoại.';
    if (!password) return 'Vui lòng nhập mật khẩu.';
    return '';
  }

  function submitForm(event) {
    event.preventDefault();
    var modal = document.querySelector('[data-auth-modal]');
    var form = modal ? modal.querySelector('[data-auth-form]') : document.querySelector('form');
    var message = modal.querySelector('[data-auth-message]');
    var mode = modal.dataset.authMode;
    message.textContent = '';
    message.style.color = '#dc2626';

    var accountInput = form.email ? form.email.value.trim().toLowerCase() : '';
    var validationError = mode === 'register'
      ? validateRegistration(form)
      : validateLogin(form);

    if (validationError) {
      message.textContent = validationError;
      return;
    }

    if (mode === 'register') {
      loadUsers().then(function (allUsers) {
        var phone = form.phone.value.trim();

        if (allUsers.some(function (user) { return isMatchAccount(user, accountInput); })) {
          throw new Error('Email này đã được đăng ký.');
        }
        if (allUsers.some(function (user) { return isMatchAccount(user, phone); })) {
          throw new Error('Số điện thoại này đã được đăng ký.');
        }

        var newUser = {
          id: 'u-' + Date.now(),
          name: form.name.value.trim(),
          email: accountInput,
          password: form.password.value,
          phone: phone,
          role: 'user',
          tier: 'Member',
          avatar: 'https://i.pravatar.cc/160?img=47'
        };

        var registered = readRegisteredUsers();
        registered.push(newUser);
        localStorage.setItem(REGISTERED_KEY, JSON.stringify(registered));

        message.style.color = '#16a34a';
        message.textContent = 'Đăng ký thành công. Bạn có thể đăng nhập ngay.';
        setTimeout(function () { renderModal('login'); }, 600);
      }).catch(function (error) { message.textContent = error.message; });
      return;
    }

    // Đăng nhập
    loadUsers().then(function (allUsers) {
      var user = allUsers.find(function (item) {
        return isMatchAccount(item, accountInput) && item.password === form.password.value;
      });

      if (!user) throw new Error('Email/SĐT hoặc mật khẩu không đúng.');

      var isAdmin = user.role === 'admin';
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '0901234567',
        role: user.role,
        tier: user.tier,
        avatar: user.avatar
      }));

      localStorage.setItem(ADMIN_FLAG_KEY, isAdmin ? 'true' : 'false');

      message.style.color = '#16a34a';
      message.textContent = 'Đăng nhập thành công.';
      updateAuthButtons();

      setTimeout(function () {
        var destination = isAdmin
          ? getPageUrl('admin.html')
          : getPageUrl('dev5_user.html');
        window.location.href = destination;
      }, 250);
    }).catch(function (error) { message.textContent = error.message; });
  }

  function updateAuthButtons() {
    var currentSession = getSession();
    var profile = document.querySelector('[data-auth-profile]');
    var isAdmin = localStorage.getItem(ADMIN_FLAG_KEY) === 'true' ||
      (currentSession && currentSession.role === 'admin');

    if (currentSession) {
      localStorage.setItem(ADMIN_FLAG_KEY, currentSession.role === 'admin' ? 'true' : 'false');
    }

    document.querySelectorAll('[data-auth-action="login"], [data-auth-action="register"]').forEach(function (button) {
      button.classList.toggle('dev5-hidden', Boolean(currentSession));
    });
    document.querySelectorAll('[data-auth-action="logout"]').forEach(function (button) {
      button.classList.toggle('dev5-hidden', !currentSession);
    });
    document.querySelectorAll('[data-admin-link]').forEach(function (link) {
      link.classList.toggle('dev5-hidden', !isAdmin);
    });

    var profileWrap = document.querySelector('[data-auth-profile-wrap]');
    if (profileWrap) {
      profileWrap.classList.toggle('dev5-hidden', !currentSession);
    }

    if (profile) {
      profile.classList.toggle('dev5-hidden', !currentSession);

      if (currentSession) {
        var nameEl = profile.querySelector('[data-header-name]');
        var avatarEl = profile.querySelector('[data-header-avatar]');
        if (nameEl) nameEl.textContent = currentSession.name;
        if (avatarEl) {
          avatarEl.src = currentSession.avatar || 'https://i.pravatar.cc/80?img=47';
        }
      }
    }
  }

  document.onclick = function (event) {
    var adminTarget = event.target.closest('[data-admin-link], a[href*="admin.html"]');
    if (adminTarget) {
      if (localStorage.getItem(ADMIN_FLAG_KEY) !== 'true') {
        event.preventDefault();
        window.location.href = getPageUrl('admin_login.html');
        return;
      }
    }

    var demoBtn = event.target.closest('[data-auth-demo]');
    if (demoBtn) {
      loginAsDemo(demoBtn.dataset.authDemo);
      return;
    }

    var action = event.target.closest('[data-auth-action]');
    if (!action) return;

    if (action.dataset.authAction === 'logout') {
      localStorage.removeItem(SESSION_KEY);
      localStorage.setItem(ADMIN_FLAG_KEY, 'false');
      localStorage.removeItem(ADMIN_FLAG_KEY);
      updateAuthButtons();
      window.location.href = 'dev5_user.html';
    } else {
      openModal(action.dataset.authAction);
    }
  };

  updateAuthButtons();
  initAdminLoginForm();

  function initAdminLoginForm() {
    var form = document.getElementById('adminLoginForm');
    if (!form) return;

    var emailInput = document.getElementById('adminEmail');
    var passwordInput = document.getElementById('adminPassword');
    var errorBox = document.getElementById('errorMessage');
    var btnFillDemo = document.getElementById('btnFillDemo');
    var submitBtn = document.getElementById('submitBtn') || form.querySelector('button[type="submit"]');

    if (btnFillDemo) {
      btnFillDemo.onclick = function () {
        if (emailInput) emailInput.value = 'admin@sportstore.vn';
        if (passwordInput) passwordInput.value = 'admin123';

        // Bật cờ admin_logged_in = 'true', lưu thông tin Admin và chuyển sang admin.html
        loginAsDemo('admin');
      };
    }

    if (submitBtn) {
      submitBtn.onclick = function (event) {
        event.preventDefault();
        if (errorBox) {
          errorBox.style.display = 'none';
          errorBox.textContent = '';
        }

        var email = emailInput ? emailInput.value.trim().toLowerCase() : '';
        var password = passwordInput ? passwordInput.value : '';

        if (!email || !password) {
          if (errorBox) {
            errorBox.textContent = 'Vui lòng nhập đầy đủ tài khoản và mật khẩu quản trị.';
            errorBox.style.display = 'block';
          }
          return;
        }

        loadUsers().then(function (allUsers) {
          var adminUser = allUsers.find(function (u) {
            return isMatchAccount(u, email) && u.password === password;
          });

          if (!adminUser) {
            throw new Error('Tài khoản hoặc mật khẩu quản trị viên không chính xác.');
          }

          if (adminUser.role !== 'admin') {
            throw new Error('Từ chối truy cập: Đây là tài khoản khách hàng, không có quyền vào cổng Quản trị.');
          }

          localStorage.setItem(ADMIN_FLAG_KEY, 'true');
          localStorage.setItem(SESSION_KEY, JSON.stringify({
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
            phone: adminUser.phone || '0909876543',
            role: 'admin',
            tier: 'Administrator',
            avatar: adminUser.avatar || 'https://i.pravatar.cc/160?img=68'
          }));

          window.location.href = 'admin.html';
        }).catch(function (err) {
          if (errorBox) {
            errorBox.textContent = err.message;
            errorBox.style.display = 'block';
          }
        });
      };
    }
  }

  window.sportStoreAuth = {
    getSession: getSession,
    session: getSession,
    updateButtons: updateAuthButtons,
    loginAsDemo: loginAsDemo,
    openModal: openModal
  };
}());