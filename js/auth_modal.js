// Quan ly dang nhap, dang ky va phan quyen tren Header
var SESSION_KEY = "sport_user";
var REGISTERED_KEY = "sportstore_registered_users";
var ADMIN_FLAG_KEY = "admin_logged_in";

function readRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function readStoreCustomers() {
  var list = [];
  try {
    list = JSON.parse(localStorage.getItem("sport_customers") || "[]");
  } catch (e) {}
  if (!list || list.length === 0) {
    if (typeof customers !== "undefined" && Array.isArray(customers)) {
      list = customers;
    }
  }
  var kq = [];
  if (Array.isArray(list)) {
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      var custId = c.customerId || c.id;
      kq.push({
        customerId: custId,
        id: custId,
        name: c.name,
        email: c.email,
        phone: c.phone,
        password: c.password || "123456",
        role: "user",
        tier: c.tier || "Standard",
        avatar: c.avatar || "https://i.pravatar.cc/160?img=32",
        address: c.address || "",
        points: c.points || 0,
        spent: c.spent || 0
      });
    }
  }
  return kq;
}

// Lay danh sach tat ca tai khoan (Admin + Khach hang)
function getAllUsersList() {
  var storeCustomers = readStoreCustomers();
  var registered = readRegisteredUsers();

  var adminAccount = {
    customerId: "ADMIN-001",
    id: "ADMIN-001",
    name: "Quản Trị Viên SportStore",
    email: "admin@sportstore.vn",
    phone: "0909876543",
    password: "admin",
    role: "admin",
    tier: "Administrator",
    avatar: "https://i.pravatar.cc/160?img=12",
    address: ""
  };

  return [adminAccount].concat(storeCustomers).concat(registered);
}

function getAuthSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch (error) {
    return null;
  }
}

function getPageUrl(fileName) {
  var pathParts = window.location.pathname.split("/");
  var isInsidePagesFolder = pathParts.indexOf("pages") !== -1;
  return isInsidePagesFolder ? fileName : "pages/" + fileName;
}

function openAuthModal(mode) {
  var modal = document.querySelector("[data-auth-modal]");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "dev5-auth-modal";
    modal.setAttribute("data-auth-modal", "");
    modal.innerHTML =
      '<div class="dev5-auth-box" role="dialog" aria-modal="true">' +
        '<button class="dev5-auth-close" type="button" data-auth-close aria-label="Đóng"><i class="fa-solid fa-xmark"></i></button>' +
        '<span class="dev5-eyebrow">TÀI KHOẢN SPORTSTORE</span>' +
        '<div class="dev5-auth-tabs" role="tablist">' +
          '<button type="button" class="dev5-auth-tab" data-auth-tab="login">ĐĂNG NHẬP</button>' +
          '<button type="button" class="dev5-auth-tab" data-auth-tab="register">ĐĂNG KÝ THÀNH VIÊN</button>' +
        '</div>' +
        '<p class="dev5-auth-message" data-auth-message aria-live="polite"></p>' +
        '<form data-auth-form novalidate></form>' +
        '<p class="dev5-auth-switch" data-auth-switch></p>' +
      '</div>';
    document.body.appendChild(modal);

    modal.onclick = function (event) {
      var target = event.target;
      if (target === modal || (target.closest && target.closest("[data-auth-close]"))) {
        modal.classList.remove("is-open");
      }

      var switchButton = target.closest ? target.closest("[data-auth-switch-button]") : null;
      if (switchButton) renderAuthModal(switchButton.getAttribute("data-auth-switch-button"));

      var tabButton = target.closest ? target.closest("[data-auth-tab]") : null;
      if (tabButton) renderAuthModal(tabButton.getAttribute("data-auth-tab"));

      var demoChoice = target.closest ? target.closest("[data-auth-demo]") : null;
      if (demoChoice) {
        loginAsDemo(demoChoice.getAttribute("data-auth-demo"));
      }

      var submitBtn = target.closest ? target.closest('button[type="submit"]') : null;
      if (submitBtn) {
        submitAuthForm(event);
      }
    };
  }
  renderAuthModal(mode);
  modal.classList.add("is-open");
  var firstInput = modal.querySelector("input");
  if (firstInput) firstInput.focus();
}

function renderAuthModal(mode) {
  var modal = document.querySelector("[data-auth-modal]");
  var register = mode === "register";
  modal.setAttribute("data-auth-mode", mode);

  var tabs = modal.querySelectorAll("[data-auth-tab]");
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].getAttribute("data-auth-tab") === mode) {
      tabs[i].classList.add("is-active");
    } else {
      tabs[i].classList.remove("is-active");
    }
  }

  var formHtml = "";
  var switchHtml = "";

  if (register) {
    formHtml =
      '<label>Họ và tên<input name="name" minlength="2" maxlength="80" required autocomplete="name"></label>' +
      '<label>Email<input name="email" type="email" placeholder="tenban@example.com" required autocomplete="email"></label>' +
      '<label>Số điện thoại<input name="phone" inputmode="numeric" pattern="0[0-9]{9}" maxlength="10" required autocomplete="tel"></label>' +
      '<label>Mật khẩu<input name="password" type="password" minlength="8" required autocomplete="new-password"></label>' +
      '<label>Nhập lại mật khẩu<input name="confirmPassword" type="password" minlength="8" required autocomplete="new-password"></label>' +
      '<button class="dev5-primary-button" type="submit">Đăng ký</button>';

    switchHtml = 'Đã có tài khoản? <button type="button" data-auth-switch-button="login">Đăng nhập</button>';
  } else {
    formHtml =
      '<label>Email / SĐT<input name="email" type="text" placeholder="nguyenvana@gmail.com" required autocomplete="username"></label>' +
      '<label>Mật khẩu<input name="password" type="password" placeholder="••••••••" required autocomplete="current-password"></label>' +
      '<div class="dev5-auth-btn-row" style="margin-top: 14px;">' +
        '<button class="dev5-primary-button" type="submit">Đăng nhập</button>' +
      '</div>';

    switchHtml = 'Chưa có tài khoản? <button type="button" data-auth-switch-button="register">Đăng ký ngay</button>';
  }

  modal.querySelector("[data-auth-form]").innerHTML = formHtml;
  modal.querySelector("[data-auth-switch]").innerHTML = switchHtml;
  var msgEl = modal.querySelector("[data-auth-message]");
  msgEl.textContent = "";
  msgEl.style.color = "#dc2626";
}

function loginAsDemo(role) {
  var users = getAllUsersList();
  var targetRole = role === "admin" ? "admin" : "user";
  var user = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].role === targetRole) {
      user = users[i];
      break;
    }
  }
  if (!user) return;

  var isAdmin = user.role === "admin";
  var activeId = user.customerId || user.id;
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    customerId: activeId,
    id: activeId,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    tier: user.tier || (isAdmin ? "Administrator" : "Standard"),
    avatar: user.avatar || "",
    address: user.address || ""
  }));

  localStorage.setItem(ADMIN_FLAG_KEY, isAdmin ? "true" : "false");

  var modal = document.querySelector("[data-auth-modal]");
  if (modal) {
    var message = modal.querySelector("[data-auth-message]");
    if (message) {
      message.textContent = "Đăng nhập thành công (" + user.name + ").";
    }
  }

  updateAuthButtons();

  setTimeout(function () {
    window.location.href = getPageUrl("dev5_user.html");
  }, 250);
}

// So khop Email hoac So dien thoai
function isMatchAccount(item, input) {
  if (!item || !input) return false;
  var userEmail = (item.email || "").toLowerCase().trim();
  var userPhone = String(item.phone || "").trim();
  var target = String(input).toLowerCase().trim();
  return userEmail === target || userPhone === target;
}

function validateRegistration(form) {
  var name = form.name.value.trim();
  var password = form.password.value;
  var email = form.email.value.trim().toLowerCase();
  var phone = form.phone.value.trim();

  if (!name) return "Vui lòng nhập họ và tên.";
  if (name.length < 2) return "Họ tên phải có ít nhất 2 ký tự.";
  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) return "Email không đúng định dạng.";
  if (!phone) return "Vui lòng nhập số điện thoại.";
  if (phone.length !== 10 || phone.charAt(0) !== "0" || isNaN(phone)) return "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.";
  if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự.";
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return "Mật khẩu phải gồm cả chữ và số.";
  if (password !== form.confirmPassword.value) return "Mật khẩu xác nhận không trùng khớp.";
  return "";
}

function validateLogin(form) {
  var account = form.email.value.trim();
  var password = form.password.value;
  if (!account) return "Vui lòng nhập email hoặc số điện thoại.";
  if (!password) return "Vui lòng nhập mật khẩu.";
  return "";
}

function submitAuthForm(event) {
  event.preventDefault();
  var modal = document.querySelector("[data-auth-modal]");
  var form = modal ? modal.querySelector("[data-auth-form]") : document.querySelector("form");
  var message = modal.querySelector("[data-auth-message]");
  var mode = modal.getAttribute("data-auth-mode");
  message.textContent = "";
  message.style.color = "#dc2626";

  var accountInput = form.email ? form.email.value.trim().toLowerCase() : "";
  var validationError = mode === "register" ? validateRegistration(form) : validateLogin(form);

  if (validationError) {
    message.textContent = validationError;
    return;
  }

  var allUsers = getAllUsersList();

  if (mode === "register") {
    var phone = form.phone.value.trim();
    for (var i = 0; i < allUsers.length; i++) {
      if (isMatchAccount(allUsers[i], accountInput)) {
        message.textContent = "Email này đã được đăng ký.";
        return;
      }
      if (isMatchAccount(allUsers[i], phone)) {
        message.textContent = "Số điện thoại này đã được đăng ký.";
        return;
      }
    }

    var regId = "KH-" + String(Date.now()).slice(-4);
    var newUser = {
      customerId: regId,
      id: regId,
      name: form.name.value.trim(),
      email: accountInput,
      password: form.password.value,
      phone: phone,
      role: "user",
      tier: "Member",
      avatar: "https://i.pravatar.cc/160?img=47"
    };

    var registered = readRegisteredUsers();
    registered.push(newUser);
    localStorage.setItem(REGISTERED_KEY, JSON.stringify(registered));

    try {
      var storeCusts = JSON.parse(localStorage.getItem("sport_customers") || "[]");
      if (Array.isArray(storeCusts)) {
        storeCusts.push({
          customerId: regId,
          id: regId,
          name: newUser.name,
          phone: newUser.phone,
          email: newUser.email,
          password: newUser.password,
          tier: "Standard",
          points: 0,
          spent: 0,
          joinDate: new Date().toISOString().split("T")[0],
          status: "active",
          avatar: newUser.avatar,
          address: "Chưa cập nhật"
        });
        localStorage.setItem("sport_customers", JSON.stringify(storeCusts));
      }
    } catch (e) {}

    message.style.color = "#16a34a";
    message.textContent = "Đăng ký thành công. Bạn có thể đăng nhập ngay.";
    setTimeout(function () { renderAuthModal("login"); }, 600);
    return;
  }

  // Xu ly dang nhap
  var userFound = null;
  for (var j = 0; j < allUsers.length; j++) {
    if (isMatchAccount(allUsers[j], accountInput) && allUsers[j].password === form.password.value) {
      userFound = allUsers[j];
      break;
    }
  }

  if (!userFound) {
    message.textContent = "Email/SĐT hoặc mật khẩu không đúng.";
    return;
  }

  var isAdmin = userFound.role === "admin";
  var activeId = userFound.customerId || userFound.id;
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    customerId: activeId,
    id: activeId,
    name: userFound.name,
    email: userFound.email,
    phone: userFound.phone || "",
    role: userFound.role,
    tier: userFound.tier || (isAdmin ? "Administrator" : "Standard"),
    avatar: userFound.avatar || "",
    address: userFound.address || ""
  }));

  localStorage.setItem(ADMIN_FLAG_KEY, isAdmin ? "true" : "false");

  message.style.color = "#16a34a";
  message.textContent = "Đăng nhập thành công.";
  updateAuthButtons();

  setTimeout(function () {
    window.location.href = getPageUrl("dev5_user.html");
  }, 250);
}

function setHiddenState(el, isHidden) {
  if (!el) return;
  if (isHidden) {
    el.classList.add("dev5-hidden");
  } else {
    el.classList.remove("dev5-hidden");
  }
}

function updateAuthButtons() {
  var currentSession = getAuthSession();
  var profile = document.querySelector("[data-auth-profile]");
  var isAdmin = localStorage.getItem(ADMIN_FLAG_KEY) === "true" || (currentSession && currentSession.role === "admin");

  if (currentSession) {
    localStorage.setItem(ADMIN_FLAG_KEY, currentSession.role === "admin" ? "true" : "false");
  }

  var loginBtns = document.querySelectorAll('[data-auth-action="login"], [data-auth-action="register"]');
  for (var i = 0; i < loginBtns.length; i++) {
    setHiddenState(loginBtns[i], Boolean(currentSession));
  }

  var logoutBtns = document.querySelectorAll('[data-auth-action="logout"]');
  for (var j = 0; j < logoutBtns.length; j++) {
    setHiddenState(logoutBtns[j], !currentSession);
  }

  var adminLinks = document.querySelectorAll("[data-admin-link]");
  for (var k = 0; k < adminLinks.length; k++) {
    setHiddenState(adminLinks[k], !isAdmin);
  }

  var profileWrap = document.querySelector("[data-auth-profile-wrap]");
  setHiddenState(profileWrap, !currentSession);

  if (profile) {
    setHiddenState(profile, !currentSession);
    if (currentSession) {
      var nameEl = profile.querySelector("[data-header-name]");
      var avatarEl = profile.querySelector("[data-header-avatar]");
      if (nameEl) nameEl.textContent = currentSession.name;
      if (avatarEl) {
        avatarEl.src = currentSession.avatar || "https://i.pravatar.cc/80?img=47";
      }
    }
  }

  var overviewLink = document.querySelector('[data-action-tab="overview"], [data-admin-menu-link]');
  var ordersLink = document.querySelector('[data-action-tab="orders"]');

  if (isAdmin) {
    if (overviewLink) {
      overviewLink.innerHTML = '<i class="fa-solid fa-sliders"></i> Quản Lý Cài Đặt';
      overviewLink.href = getPageUrl("dev5_user.html");
      overviewLink.setAttribute("data-admin-menu-link", "");
      overviewLink.removeAttribute("data-action-tab");
    }
    if (ordersLink) {
      ordersLink.classList.add("dev5-hidden");
    }
  } else {
    if (overviewLink) {
      overviewLink.textContent = "Tài Khoản Của Tôi";
      overviewLink.href = getPageUrl("dev5_user.html?tab=overview");
      overviewLink.setAttribute("data-action-tab", "overview");
      overviewLink.removeAttribute("data-admin-menu-link");
    }
    if (ordersLink) {
      ordersLink.classList.remove("dev5-hidden");
    }
  }
}

document.addEventListener("click", function (event) {
  var target = event.target;
  if (!target || !target.closest) return;

  var adminTarget = target.closest('[data-admin-link], a[href*="admin.html"]');
  if (adminTarget) {
    if (localStorage.getItem(ADMIN_FLAG_KEY) !== "true") {
      event.preventDefault();
      openAuthModal("login");
      return;
    }
  }

  var demoBtn = target.closest("[data-auth-demo]");
  if (demoBtn) {
    loginAsDemo(demoBtn.getAttribute("data-auth-demo"));
    return;
  }

  var action = target.closest("[data-auth-action]");
  if (!action) return;

  var actionType = action.getAttribute("data-auth-action");
  if (actionType === "logout") {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("sport_user");
    localStorage.removeItem(ADMIN_FLAG_KEY);

    updateAuthButtons();

    var isUserPage = window.location.pathname.indexOf("dev5_user.html") !== -1;
    if (isUserPage) {
      var isInsidePages = window.location.pathname.indexOf("/pages/") !== -1;
      window.location.href = isInsidePages ? "../index.html" : "index.html";
    } else {
      window.location.reload();
    }
  } else {
    openAuthModal(actionType);
  }
});

updateAuthButtons();

window.sportStoreAuth = {
  getSession: getAuthSession,
  session: getAuthSession,
  updateButtons: updateAuthButtons,
  loginAsDemo: loginAsDemo,
  openModal: openAuthModal
};
