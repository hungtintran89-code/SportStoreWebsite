(function () {
  'use strict';

  var SESSION_KEY = 'sportstore_auth';
  var REGISTERED_KEY = 'sportstore_registered_users';
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
      });
    }
    return usersPromise.then(function (users) {
      return users.concat(readRegisteredUsers());
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
        '<h2 id="auth-title" data-auth-title></h2>' +
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
      });
      modal.querySelector('[data-auth-form]').addEventListener('submit', submitForm);
    }
    renderModal(mode);
    modal.classList.add('is-open');
    modal.querySelector('input').focus();
  }

  function renderModal(mode) {
    var modal = document.querySelector('[data-auth-modal]');
    var register = mode === 'register';
    modal.dataset.authMode = mode;
    modal.querySelector('[data-auth-title]').textContent = register ? 'Tạo tài khoản' : 'Đăng nhập';
    modal.querySelector('[data-auth-form]').innerHTML = register
      ? '<label>Họ và tên<input name="name" minlength="2" maxlength="80" required autocomplete="name"></label>' +
        '<label>Email<input name="email" type="email" placeholder="tenban@example.com" required autocomplete="email"></label>' +
        '<label>Số điện thoại<input name="phone" inputmode="numeric" pattern="0[0-9]{9}" maxlength="10" required autocomplete="tel"></label>' +
        '<label>Mật khẩu<input name="password" type="password" minlength="8" required autocomplete="new-password"></label>' +
        '<label>Nhập lại mật khẩu<input name="confirmPassword" type="password" minlength="8" required autocomplete="new-password"></label>' +
        '<button class="dev5-primary-button" type="submit">Đăng ký</button>'
      : '<label>Email<input name="email" type="email" placeholder="tenban@example.com" required autocomplete="email"></label>' +
        '<label>Mật khẩu<input name="password" type="password" required autocomplete="current-password"></label>' +
        '<button class="dev5-primary-button" type="submit">Đăng nhập</button>';
    modal.querySelector('[data-auth-switch]').innerHTML = register
      ? 'Đã có tài khoản? <button type="button" data-auth-switch-button="login">Đăng nhập</button>'
      : 'Chưa có tài khoản? <button type="button" data-auth-switch-button="register">Đăng ký ngay</button>';
    modal.querySelector('[data-auth-hint]').innerHTML = '';
    modal.querySelector('[data-auth-message]').textContent = '';
    bindFieldValidation(modal.querySelector('[data-auth-form]'), register);
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

    fieldNames.forEach(function (fieldName) {
      form[fieldName].addEventListener('blur', function () {
        var modal = document.querySelector('[data-auth-modal]');
        var message = modal.querySelector('[data-auth-message]');
        var error = register
          ? getRegistrationFieldError(form, fieldName)
          : fieldName === 'email'
            ? (!form.email.value.trim()
              ? 'Vui lòng nhập email.'
              : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim())
                ? 'Email không đúng định dạng.'
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
    var email = form.email.value.trim();
    var password = form.password.value;

    if (!email) return 'Vui lòng nhập email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email không đúng định dạng.';
    if (!password) return 'Vui lòng nhập mật khẩu.';
    return '';
  }

  function submitForm(event) {
    event.preventDefault();
    var form = event.currentTarget;
    var modal = document.querySelector('[data-auth-modal]');
    var message = modal.querySelector('[data-auth-message]');
    var mode = modal.dataset.authMode;
    var email = form.email.value.trim().toLowerCase();
    message.textContent = '';

    var validationError = mode === 'register'
      ? validateRegistration(form)
      : validateLogin(form);

    if (validationError) {
      message.textContent = validationError;
      return;
    }

    if (mode === 'register') {
      loadUsers().then(function (users) {
        var phone = form.phone.value.trim();

        if (users.some(function (user) { return user.email.toLowerCase() === email; })) {
          throw new Error('Email này đã được đăng ký.');
        }
        if (users.some(function (user) { return user.phone === phone; })) {
          throw new Error('Số điện thoại này đã được đăng ký.');
        }
        var newUser = {
          id: 'u-' + Date.now(),
          name: form.name.value.trim(),
          email: email,
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
      var user = users.find(function (item) {
        return item.email.toLowerCase() === email && item.password === form.password.value;
      });
      if (!user) throw new Error('Email hoặc mật khẩu không đúng.');
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        id: user.id, name: user.name, email: user.email, role: user.role,
        tier: user.tier, avatar: user.avatar
      }));
      message.textContent = 'Đăng nhập thành công.';
      setTimeout(function () {
        var destination = user.role === 'admin'
          ? getPageUrl('admin.html')
          : getPageUrl('dev5_user.html');
        window.location.href = destination;
      }, 250);
    }).catch(function (error) { message.textContent = error.message; });
  }

  function updateAuthButtons() {
    var currentSession = getSession();
    var profile = document.querySelector('[data-auth-profile]');

    document.querySelectorAll('[data-auth-action="login"], [data-auth-action="register"]').forEach(function (button) {
      button.classList.toggle('dev5-hidden', Boolean(currentSession));
    });
    document.querySelectorAll('[data-auth-action="logout"]').forEach(function (button) {
      button.classList.toggle('dev5-hidden', !currentSession);
    });
    document.querySelectorAll('[data-admin-link]').forEach(function (link) {
      link.classList.toggle('dev5-hidden', !currentSession || currentSession.role !== 'admin');
    });

    if (profile) {
      profile.classList.toggle('dev5-hidden', !currentSession);

      if (currentSession) {
        profile.querySelector('[data-header-name]').textContent = currentSession.name;
        profile.querySelector('[data-header-avatar]').src = currentSession.avatar
          || 'https://i.pravatar.cc/80?img=47';
      }
    }
  }

  document.addEventListener('click', function (event) {
    var action = event.target.closest('[data-auth-action]');
    if (!action) return;
    if (action.dataset.authAction === 'logout') {
      localStorage.removeItem(SESSION_KEY);
      window.location.href = 'dev5_user.html';
    } else {
      openModal(action.dataset.authAction);
    }
  });

  document.addEventListener('DOMContentLoaded', updateAuthButtons);
  window.sportStoreAuth = { getSession: getSession, session: getSession, updateButtons: updateAuthButtons };
}());