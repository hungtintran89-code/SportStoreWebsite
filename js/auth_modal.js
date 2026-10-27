(function () {
  'use strict';

  var SESSION_KEY = 'sportstore_auth';
  var REGISTERED_KEY = 'sportstore_registered_users';
  var ADMIN_FLAG_KEY = 'admin_logged_in';
  var DATA_URL = '../data/dev5_user.json';
  var usersPromise;
  var currentResetUser = null;

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
      }).catch(function (err) {
        // Fallback an toàn nếu fetch thất bại hoặc offline
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
      var all = (users || []).concat(readRegisteredUsers());

      // Đồng bộ trạng thái và mật khẩu mới từ Quản trị viên (Admin)
      try {
        var adminAccounts = JSON.parse(localStorage.getItem('sportstore_admin_users') || '[]');
        if (adminAccounts.length) {
          all = all.map(function (u) {
            var matched = adminAccounts.find(function (au) {
              return au.id === u.id || au.email === u.email;
            });
            if (matched) {
              return Object.assign({}, u, matched);
            }
            return u;
          });
        }
      } catch (e) {}

      return all;
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
      modal.innerHTML = '<div class="dev5-auth-box" role="dialog" aria-modal="true" aria-labelledby="auth-title">' +
        '<button class="dev5-auth-close" type="button" data-auth-close aria-label="Đóng">×</button>' +
        '<span class="dev5-eyebrow">SPORTSTORE ACCOUNT</span>' +
        '<div class="dev5-auth-tabs" role="tablist">' +
        '  <button type="button" class="dev5-auth-tab" data-auth-tab="login">ĐĂNG NHẬP</button>' +
        '  <button type="button" class="dev5-auth-tab" data-auth-tab="register">ĐĂNG KÝ THÀNH VIÊN</button>' +
        '</div>' +
        '<h2 id="auth-title" data-auth-title class="dev5-hidden"></h2>' +
        '<p class="dev5-auth-message" data-auth-message aria-live="polite"></p>' +
        '<form data-auth-form novalidate></form>' +
        '<p class="dev5-auth-switch" data-auth-switch></p>' +
        '<p class="dev5-auth-hint" data-auth-hint></p>' +
        '</div>';
      document.body.appendChild(modal);
      modal.addEventListener('click', function (event) {
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

        var forgotBtn = event.target.closest('[data-auth-forgot]');
        if (forgotBtn) {
          renderModal('forgot');
        }
      });
      modal.querySelector('[data-auth-form]').addEventListener('submit', submitForm);
    }
    renderModal(mode);
    modal.classList.add('is-open');
    var firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  }

  function renderModal(mode, extraData) {
    var modal = document.querySelector('[data-auth-modal]');
    var register = mode === 'register';
    var isForgot = mode === 'forgot';
    var isReset = mode === 'reset';
    modal.dataset.authMode = mode;

    modal.querySelectorAll('[data-auth-tab]').forEach(function (tab) {
      tab.classList.toggle('is-active', tab.dataset.authTab === mode);
    });

    var tabsWrapper = modal.querySelector('.dev5-auth-tabs');
    if (tabsWrapper) {
      tabsWrapper.style.display = (isForgot || isReset) ? 'none' : 'flex';
    }

    var titleEl = modal.querySelector('[data-auth-title]');
    if (titleEl) {
      if (register) {
        titleEl.textContent = 'Tạo tài khoản';
        titleEl.classList.add('dev5-hidden');
      } else if (isForgot) {
        titleEl.textContent = 'Quên mật khẩu';
        titleEl.classList.remove('dev5-hidden');
      } else if (isReset) {
        titleEl.textContent = 'Đặt lại mật khẩu mới';
        titleEl.classList.remove('dev5-hidden');
      } else {
        titleEl.textContent = 'Đăng nhập';
        titleEl.classList.add('dev5-hidden');
      }
    }

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
    } else if (isForgot) {
      formHtml = '<p style="font-size: 13px; color: #64748b; margin-bottom: 14px; line-height: 1.5;">' +
        'Nhập <strong>Email hoặc Số điện thoại</strong> của bạn để hệ thống kiểm tra tài khoản trước khi cho phép đặt mật khẩu mới:' +
        '</p>' +
        '<label>Email hoặc Số điện thoại' +
        '  <input name="forgotAccount" type="text" placeholder="nguyenvana@gmail.com hoặc 090..." required autocomplete="username">' +
        '</label>' +
        '<button class="dev5-primary-button" type="submit" style="margin-top: 14px;">🔍 Xác thực tài khoản</button>';

      switchHtml = '<button type="button" data-auth-switch-button="login">← Quay lại Đăng nhập</button>';
    } else if (isReset) {
      var displayName = extraData ? (extraData.name + ' (' + extraData.email + ')') : '';
      formHtml = '<div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px;">' +
        '  <div style="color: #166534; font-size: 12px; font-weight: 700;">✅ TÀI KHOẢN HỢP LỆ:</div>' +
        '  <div style="color: #15803d; font-size: 13px; font-weight: 600; margin-top: 3px;">' + displayName + '</div>' +
        '</div>' +
        '<label>Mật khẩu mới (tối thiểu 8 ký tự, gồm cả chữ và số)' +
        '  <input name="newPassword" type="password" minlength="8" required placeholder="••••••••" autocomplete="new-password">' +
        '</label>' +
        '<label>Nhập lại mật khẩu mới' +
        '  <input name="confirmNewPassword" type="password" minlength="8" required placeholder="••••••••" autocomplete="new-password">' +
        '</label>' +
        '<button class="dev5-primary-button" type="submit" style="margin-top: 14px;">💾 Xác nhận lưu mật khẩu mới</button>';

      switchHtml = '<button type="button" data-auth-switch-button="login">← Hủy, quay lại Đăng nhập</button>';
    } else {
      // login mode
      formHtml = '<label>Email / SĐT<input name="email" type="text" placeholder="nguyenvana@gmail.com" required autocomplete="username"></label>' +
        '<label>Mật khẩu<input name="password" type="password" placeholder="••••••••" required autocomplete="current-password"></label>' +
        '<div style="display:flex;justify-content:flex-end;margin-top:-4px;margin-bottom:10px;">' +
        '  <button type="button" data-auth-forgot style="background:none;border:none;color:#0284c7;font-size:12px;cursor:pointer;padding:0;font-weight:600;">Quên mật khẩu?</button>' +
        '</div>' +
        '<div class="dev5-auth-btn-row">' +
        '  <button class="dev5-primary-button" type="submit">Đăng nhập</button>' +
        '  <button class="dev5-demo-button" type="button" data-auth-demo-toggle>⚡ Đăng Nhập Nhanh 1-Click (Demo)</button>' +
        '</div>' +
        '<div class="dev5-demo-options dev5-hidden" data-demo-options>' +
        '  <button type="button" class="dev5-demo-choice" data-auth-demo="admin">⚙️ 1-Click Admin </button>' +
        '  <button type="button" class="dev5-demo-choice" data-auth-demo="user">👤 1-Click User </button>' +
        '</div>';

      switchHtml = 'Chưa có tài khoản? <button type="button" data-auth-switch-button="register">Đăng ký ngay</button>';
    }

    modal.querySelector('[data-auth-form]').innerHTML = formHtml;
    modal.querySelector('[data-auth-switch]').innerHTML = switchHtml;
    modal.querySelector('[data-auth-hint]').innerHTML = '';
    var msgEl = modal.querySelector('[data-auth-message]');
    msgEl.textContent = '';
    msgEl.style.color = '#dc2626';

    bindFieldValidation(modal.querySelector('[data-auth-form]'), register);
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

      // ĐIỀU KIỆN RÀNG BUỘC CỜ HIỆU: Kiểm tra tài khoản có bị block không
      if (isAccountBlocked(user)) {
        throw new Error('Tài khoản của bạn đã bị BLOCK bởi Quản trị viên! Không thể đăng nhập.');
      }

      var isAdmin = user.role === 'admin';
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tier: user.tier,
        avatar: user.avatar
      }));

      // Thiết lập cờ hiệu admin_logged_in
      if (isAdmin) {
        localStorage.setItem(ADMIN_FLAG_KEY, 'true');
      } else {
        localStorage.setItem(ADMIN_FLAG_KEY, 'false');
      }

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

  function cleanPhoneStr(p) {
    return String(p || '').replace(/[\s\.\-]+/g, '');
  }

  // HÀM SO KHỚP TÀI KHOẢN THÔNG MINH (Email, SĐT, và tự sửa lỗi gõ nhầm domain như @gna1l.com)
  function isMatchAccount(item, input) {
    if (!item || !input) return false;
    var userEmail = (item.email || '').toLowerCase().trim();
    var userPhone = cleanPhoneStr(item.phone);
    var target = String(input).toLowerCase().trim();
    var targetClean = cleanPhoneStr(target);

    // 1. Khớp chính xác Email hoặc Số điện thoại
    if (userEmail === target || (userPhone && userPhone === targetClean)) return true;

    // 2. Khớp số điện thoại dù có đầu +84 hay khoảng trắng
    if (userPhone && targetClean) {
      var p1 = userPhone.replace(/^\+84/, '0');
      var p2 = targetClean.replace(/^\+84/, '0');
      if (p1 === p2) return true;
    }

    // 3. Khớp nếu cùng tên tài khoản trước dấu @ (xử lý lỗi gõ nhầm tên miền như gna1l.com thay vì gmail.com)
    if (userEmail.indexOf('@') !== -1 && target.indexOf('@') !== -1) {
      var uParts = userEmail.split('@');
      var tParts = target.split('@');
      if (uParts[0] && tParts[0] && uParts[0] === tParts[0]) {
        return true;
      }
    }
    return false;
  }

  // HÀM KIỂM TRA TOÀN DIỆN CỜ HIỆU BỊ BLOCK / KHÓA BỞI ADMIN
  function isAccountBlocked(user) {
    if (!user) return false;
    var email = (user.email || '').toLowerCase();
    var id = user.id || '';

    // 1. Kiểm tra cờ hiệu đơn lẻ trực tiếp trong LocalStorage
    if (localStorage.getItem('user_blocked_' + email) === 'true') return true;
    if (id && localStorage.getItem('user_blocked_' + id) === 'true') return true;

    // 2. Kiểm tra thuộc tính trạng thái trên user
    if (user.is_blocked === true || user.status === 'blocked' || user.status === 'locked' || user.isLocked === true) {
      return true;
    }

    // 3. Kiểm tra trong danh sách admin đã cập nhật (sportstore_admin_users)
    try {
      var adminAccounts = JSON.parse(localStorage.getItem('sportstore_admin_users') || '[]');
      var matchedAdmin = adminAccounts.find(function (au) {
        return (au.id && au.id === id) || (au.email && au.email.toLowerCase() === email);
      });
      if (matchedAdmin) {
        if (matchedAdmin.status === 'blocked' || matchedAdmin.status === 'locked' || matchedAdmin.is_blocked === true || matchedAdmin.isLocked === true) {
          return true;
        }
      }
    } catch (e) {}

    // 4. Kiểm tra trong danh sách khóa phụ (nếu có)
    try {
      var lockedList = JSON.parse(localStorage.getItem('sportstore_locked_accounts') || '[]');
      if (lockedList.includes(email) || (id && lockedList.includes(id))) return true;
    } catch (e) {}

    return false;
  }

  function getRegistrationFieldError(form, fieldName) {
    var field = form[fieldName];
    var value = field.value.trim();

    if (fieldName === 'name') {
      if (!value) return 'Vui lòng nhập họ và tên.';
      if (value.length < 2) return 'Họ tên phải có ít nhất 2 ký tự.';
    }
    if (fieldName === 'email') {
      if (!value) return 'Vui lòng nhập email.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email không đúng định dạng.';
    }
    if (fieldName === 'phone') {
      if (!value) return 'Vui lòng nhập số điện thoại.';
      if (!/^0[0-9]*$/.test(value)) return 'Số điện thoại chỉ được chứa chữ số và bắt đầu bằng 0.';
      if (value.length < 10) return 'Số điện thoại chưa đủ 10 số (hiện có ' + value.length + ' số).';
      if (value.length > 10) return 'Số điện thoại không được vượt quá 10 số (hiện có ' + value.length + ' số).';
    }
    if (fieldName === 'password') {
      if (field.value.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự.';
      if (!/[A-Za-z]/.test(field.value) || !/[0-9]/.test(field.value)) {
        return 'Mật khẩu phải gồm cả chữ và số.';
      }
    }
    if (fieldName === 'confirmPassword') {
      if (!field.value) return 'Vui lòng nhập lại mật khẩu.';
      if (field.value !== form.password.value) return 'Mật khẩu xác nhận không trùng khớp.';
    }
    return '';
  }

  function bindFieldValidation(form, register) {
    var fieldNames = register
      ? ['name', 'email', 'phone', 'password', 'confirmPassword']
      : ['email', 'password'];

    // Ràng buộc số điện thoại: CHỈ ĐƯỢC NHẬP SỐ, tự động chặn ngay khi gõ chữ
    if (register && form.phone) {
      form.phone.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
      });
    }

    fieldNames.forEach(function (fieldName) {
      form[fieldName].addEventListener('blur', function () {
        var modal = document.querySelector('[data-auth-modal]');
        var message = modal.querySelector('[data-auth-message]');
        var error = register
          ? getRegistrationFieldError(form, fieldName)
          : fieldName === 'email'
            ? (!form.email.value.trim()
              ? 'Vui lòng nhập email hoặc SĐT.'
              : '')
            : (!form.password.value ? 'Vui lòng nhập mật khẩu.' : '');

        message.textContent = error;
      });
    });
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
    if (!/^0[0-9]*$/.test(phone)) return 'Số điện thoại chỉ được chứa chữ số và bắt đầu bằng 0.';
    if (phone.length < 10) return 'Số điện thoại chưa đủ 10 số (hiện có ' + phone.length + ' số).';
    if (phone.length > 10) return 'Số điện thoại không được vượt quá 10 số (hiện có ' + phone.length + ' số).';
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
    var form = event.currentTarget;
    var modal = document.querySelector('[data-auth-modal]');
    var message = modal.querySelector('[data-auth-message]');
    var mode = modal.dataset.authMode;
    message.textContent = '';
    message.style.color = '#dc2626';

    // 1. XỬ LÝ QUÊN MẬT KHẨU: TÌM KIẾM TÀI KHOẢN (CHỈ CÓ THÌ MỚI CHO ĐẶT MỚI)
    if (mode === 'forgot') {
      var inputEl = form.querySelector('input[name="forgotAccount"]') || (form.elements && form.elements.forgotAccount) || form.forgotAccount;
      var forgotAccount = inputEl ? inputEl.value.trim().toLowerCase() : '';
      if (!forgotAccount) {
        message.textContent = 'Vui lòng nhập Email hoặc Số điện thoại!';
        return;
      }

      loadUsers().then(function (users) {
        // Gộp toàn bộ tài khoản cả từ JSON và trực tiếp từ LocalStorage
        var allUsers = (users || []).concat(readRegisteredUsers());
        var user = allUsers.find(function (item) {
          return isMatchAccount(item, forgotAccount);
        });

        if (!user) {
          // BÁO LỖI LÊN MÀN HÌNH NẾU KHÔNG TÌM THẤY TÀI KHOẢN
          message.textContent = '❌ Không tìm thấy tài khoản với Email hoặc SĐT này!';
          return;
        }

        if (isAccountBlocked(user)) {
          message.textContent = '❌ Tài khoản này đã bị Quản trị viên KHÓA (Block), không thể đặt lại mật khẩu!';
          return;
        }

        // Tự động sửa email nếu người dùng vô tình gõ nhầm khi đăng ký (như gna1l.com -> gmail.com)
        if (forgotAccount.indexOf('@') !== -1 && forgotAccount.indexOf('gmail.com') !== -1) {
          if (user.email && user.email.indexOf('@') !== -1 && user.email.split('@')[0] === forgotAccount.split('@')[0]) {
            user.email = forgotAccount;
          }
        }

        // TÀI KHOẢN CÓ TỒN TẠI VÀ HỢP LỆ -> CHO PHÉP ĐẶT MẬT KHẨU MỚI
        currentResetUser = user;
        renderModal('reset', user);
      }).catch(function (error) {
        message.textContent = error.message;
      });
      return;
    }

    // 2. XỬ LÝ ĐẶT LẠI MẬT KHẨU MỚI
    if (mode === 'reset') {
      var newPass = form.newPassword ? form.newPassword.value : '';
      var confirmPass = form.confirmNewPassword ? form.confirmNewPassword.value : '';

      if (!newPass) {
        message.textContent = 'Vui lòng nhập mật khẩu mới.';
        return;
      }
      if (newPass.length < 8) {
        message.textContent = 'Mật khẩu mới phải có ít nhất 8 ký tự.';
        return;
      }
      if (!/[A-Za-z]/.test(newPass) || !/[0-9]/.test(newPass)) {
        message.textContent = 'Mật khẩu mới phải gồm cả chữ và số.';
        return;
      }
      if (newPass !== confirmPass) {
        message.textContent = 'Mật khẩu xác nhận không trùng khớp!';
        return;
      }

      if (!currentResetUser) {
        message.textContent = 'Phiên khôi phục đã hết hạn. Vui lòng thử lại.';
        renderModal('forgot');
        return;
      }

      // Cập nhật mật khẩu mới
      currentResetUser.password = newPass;

      try {
        var registered = readRegisteredUsers();
        var found = registered.find(function (u) {
          return u.id === currentResetUser.id || (u.email && u.email.toLowerCase() === currentResetUser.email.toLowerCase()) || isMatchAccount(u, currentResetUser.email);
        });
        if (found) {
          found.password = newPass;
          found.email = currentResetUser.email; // Chuẩn hóa lại email sạch
        } else {
          registered.push(currentResetUser);
        }
        localStorage.setItem(REGISTERED_KEY, JSON.stringify(registered));
      } catch (e) {}

      try {
        var adminAccounts = JSON.parse(localStorage.getItem('sportstore_admin_users') || '[]');
        var matchAdm = adminAccounts.find(function (u) {
          return u.id === currentResetUser.id || (u.email && u.email.toLowerCase() === currentResetUser.email.toLowerCase()) || isMatchAccount(u, currentResetUser.email);
        });
        if (matchAdm) {
          matchAdm.password = newPass;
          matchAdm.email = currentResetUser.email;
          localStorage.setItem('sportstore_admin_users', JSON.stringify(adminAccounts));
        }
      } catch (e) {}

      message.style.color = '#16a34a';
      message.textContent = '✅ Đặt lại mật khẩu thành công! Đang chuyển về Đăng nhập...';

      setTimeout(function () {
        currentResetUser = null;
        renderModal('login');
      }, 1500);
      return;
    }

    var accountInput = form.email ? form.email.value.trim().toLowerCase() : '';
    var validationError = mode === 'register'
      ? validateRegistration(form)
      : validateLogin(form);

    if (validationError) {
      message.textContent = validationError;
      return;
    }

    if (mode === 'register') {
      loadUsers().then(function (users) {
        var allUsers = (users || []).concat(readRegisteredUsers());
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
          phone: form.phone.value.trim(),
          role: 'user',
          tier: 'Member',
          avatar: 'https://i.pravatar.cc/160?img=47'
        };
        var registered = readRegisteredUsers();
        registered.push(newUser);
        localStorage.setItem(REGISTERED_KEY, JSON.stringify(registered));
        message.textContent = 'Đăng ký thành công. Bạn có thể đăng nhập ngay.';
        setTimeout(function () { renderModal('login'); }, 500);
      }).catch(function (error) { message.textContent = error.message; });
      return;
    }

    loadUsers().then(function (users) {
      var allUsers = (users || []).concat(readRegisteredUsers());
      var user = allUsers.find(function (item) {
        return isMatchAccount(item, accountInput) && item.password === form.password.value;
      });
      if (!user) throw new Error('Email/SĐT hoặc mật khẩu không đúng.');

      // ĐIỀU KIỆN RÀNG BUỘC CỜ HIỆU: Kiểm tra tài khoản có bị block không
      if (isAccountBlocked(user)) {
        throw new Error('Tài khoản của bạn đã bị BLOCK bởi Quản trị viên! Không thể đăng nhập.');
      }

      var isAdmin = user.role === 'admin';
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tier: user.tier,
        avatar: user.avatar
      }));

      // Thiết lập cờ hiệu admin_logged_in = 'true' khi là admin
      if (isAdmin) {
        localStorage.setItem(ADMIN_FLAG_KEY, 'true');
      } else {
        localStorage.setItem(ADMIN_FLAG_KEY, 'false');
      }

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

    // Đồng bộ cờ hiệu vào localStorage nếu có session
    if (currentSession) {
      if (currentSession.role === 'admin') {
        localStorage.setItem(ADMIN_FLAG_KEY, 'true');
      } else {
        localStorage.setItem(ADMIN_FLAG_KEY, 'false');
      }
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

    // Tự động kiểm tra cờ hiệu: Nếu tài khoản đang đăng nhập vừa bị Admin khóa -> lập tức đăng xuất
    checkCurrentSessionBlocked();
  }

  function checkCurrentSessionBlocked() {
    var session = getSession();
    if (!session) return;
    if (isAccountBlocked(session)) {
      localStorage.removeItem(SESSION_KEY);
      alert('⚠️ TÀI KHOẢN ĐÃ BỊ BLOCK: Quản trị viên vừa khóa tài khoản này. Hệ thống sẽ tự động đăng xuất!');
      window.location.reload();
    }
  }

  document.addEventListener('click', function (event) {
    // 1. Kiểm tra cờ hiệu admin_logged_in !== 'true' khi bấm vào link Admin
    var adminTarget = event.target.closest('[data-admin-link], a[href*="admin.html"]');
    if (adminTarget) {
      if (localStorage.getItem(ADMIN_FLAG_KEY) !== 'true') {
        event.preventDefault();
        window.location.href = getPageUrl('admin_login.html');
        return;
      }
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
  });

  // Hỗ trợ gán / đọc biến cờ hiệu trực tiếp admin_logged_in = 'true'
  try {
    Object.defineProperty(window, 'admin_logged_in', {
      get: function () {
        return localStorage.getItem(ADMIN_FLAG_KEY) || 'false';
      },
      set: function (val) {
        var strVal = String(val);
        var oldVal = localStorage.getItem(ADMIN_FLAG_KEY);
        if (oldVal !== strVal) {
          localStorage.setItem(ADMIN_FLAG_KEY, strVal);
          updateAuthButtons();
        }
      },
      configurable: true
    });
  } catch (e) {
    window.admin_logged_in = localStorage.getItem(ADMIN_FLAG_KEY) || 'false';
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateAuthButtons();
    initAdminLoginForm();
  });

  function initAdminLoginForm() {
    var form = document.getElementById('adminLoginForm');
    if (!form) return;

    var emailInput = document.getElementById('adminEmail');
    var passwordInput = document.getElementById('adminPassword');
    var errorBox = document.getElementById('errorMessage');
    var btnFillDemo = document.getElementById('btnFillDemo');

    if (btnFillDemo) {
      btnFillDemo.addEventListener('click', function () {
        if (emailInput) emailInput.value = 'admin@sportstore.vn';
        if (passwordInput) passwordInput.value = 'admin123';
        if (emailInput) emailInput.focus();
      });
    }

    form.addEventListener('submit', function (event) {
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

      loadUsers().then(function (users) {
        var allUsers = (users || []).concat(readRegisteredUsers());
        var adminUser = allUsers.find(function (u) {
          return isMatchAccount(u, email) && u.password === password;
        });

        if (!adminUser) {
          throw new Error('Tài khoản hoặc mật khẩu quản trị viên không chính xác.');
        }

        if (adminUser.role !== 'admin') {
          throw new Error('Từ chối truy cập: Đây là tài khoản khách hàng, không có quyền vào cổng Quản trị.');
        }

        var isBlocked = adminUser.is_blocked === true ||
                        adminUser.status === 'blocked' ||
                        adminUser.status === 'locked' ||
                        localStorage.getItem('user_blocked_' + adminUser.email.toLowerCase()) === 'true' ||
                        localStorage.getItem('user_blocked_' + adminUser.id) === 'true';

        if (isBlocked) {
          throw new Error('Tài khoản Quản trị này đang bị khóa (Blocked).');
        }

        localStorage.setItem(ADMIN_FLAG_KEY, 'true');
        localStorage.setItem(SESSION_KEY, JSON.stringify({
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
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
    });
  }

  window.sportStoreAuth = {
    getSession: getSession,
    session: getSession,
    updateButtons: updateAuthButtons,
    loginAsDemo: loginAsDemo
  };
}());