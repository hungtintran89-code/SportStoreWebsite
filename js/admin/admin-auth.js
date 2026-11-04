/**
 * ==============================================================================
 * SPORTSTORE - js/admin/admin-auth.js
 * Module xác thực và đăng nhập độc lập dành riêng cho Quản Trị Viên (Admin Portal)
 * Hoạt động 100% Client-side, không dùng chung popup của người dùng.
 * ==============================================================================
 */

// Tài khoản Admin cố định theo yêu cầu hệ thống
var TAI_KHOAN_ADMIN_MAC_DINH = {
  id: "ADMIN-001",
  customerId: "ADMIN-001",
  name: "Quản Trị Viên SportStore",
  email: "admin@gmail.com",
  phone: "0909876543",
  password: "admin",
  role: "admin",
  status: "active"
};

/**
 * 1. Khởi tạo và kiểm tra quyền Admin khi tải trang
 */
function khoiTaoAdminAuth() {
  var daDangNhapAdmin = (localStorage.getItem("admin_logged_in") === "true");

  var manHinhLogin = document.getElementById("admin-login-screen");
  var manHinhPortal = document.getElementById("admin-portal-app");

  // Nếu đã có cờ admin_logged_in
  if (daDangNhapAdmin) {
    if (manHinhLogin) manHinhLogin.style.display = "none";
    if (manHinhPortal) manHinhPortal.style.display = "block";

    var tenAdminEl = document.getElementById("admin-header-user-name");
    if (tenAdminEl) tenAdminEl.textContent = "Quản Trị Viên SportStore";

    if (typeof capNhatSoDemMenuAdmin === "function") capNhatSoDemMenuAdmin();
    if (typeof chuyenTabAdmin === "function") chuyenTabAdmin("dashboard");
    return;
  }

  // Chưa đăng nhập hoặc không phải admin -> Hiển thị màn hình đăng nhập riêng của admin
  if (manHinhPortal) manHinhPortal.style.display = "none";
  if (manHinhLogin) manHinhLogin.style.display = "flex";

  // Reset form đăng nhập
  var msg = document.getElementById("admin-login-msg");
  if (msg) {
    msg.textContent = "";
    msg.className = "admin-login-msg";
  }
}

/**
 * 2. Xử lý sự kiện Submit Form Đăng Nhập Admin
 */
function xuLyDangNhapAdmin(event) {
  if (event) event.preventDefault();

  var oEmail = document.getElementById("admin-login-email");
  var oPassword = document.getElementById("admin-login-password");
  var msg = document.getElementById("admin-login-msg");
  var card = document.getElementById("admin-login-card");

  var emailNhap = oEmail ? oEmail.value.trim().toLowerCase() : "";
  var passwordNhap = oPassword ? oPassword.value : "";

  // 1. Kiểm tra trống
  if (!emailNhap || !passwordNhap) {
    if (msg) {
      msg.textContent = "⚠️ Vui lòng nhập đầy đủ Email và Mật khẩu Quản trị!";
      msg.className = "admin-login-msg error";
    }
    return;
  }

  // 2. Kiểm tra tài khoản admin hợp lệ
  var laAdminHopLe =
    (emailNhap === "admin@gmail.com" || emailNhap === "admin@sportstore.vn" || emailNhap === "admin") &&
    passwordNhap === "admin";

  if (!laAdminHopLe) {
    if (msg) {
      msg.textContent = "❌ Sai Email hoặc Mật khẩu Quản trị viên!";
      msg.className = "admin-login-msg error";
    }
    if (card) {
      card.classList.add("shake-anim");
      setTimeout(function () {
        card.classList.remove("shake-anim");
      }, 500);
    }
    return;
  }

  // Lưu session Admin vào LocalStorage
  localStorage.setItem("admin_logged_in", "true");

  if (msg) {
    msg.textContent = "✅ Đăng nhập Quản trị viên thành công! Đang vào hệ thống...";
    msg.className = "admin-login-msg success";
  }

  // Chuyển mượt mà vào giao diện Quản Trị SPA sau 350ms
  setTimeout(function () {
    khoiTaoAdminAuth();
  }, 350);
}

/**
 * 4. Ẩn / Hiện mật khẩu quản trị
 */
function toggleAdminPassword() {
  var oPassword = document.getElementById("admin-login-password");
  var eyeIcon = document.getElementById("admin-toggle-pwd-icon");
  if (!oPassword) return;

  if (oPassword.type === "password") {
    oPassword.type = "text";
    if (eyeIcon) eyeIcon.textContent = "🙈";
  } else {
    oPassword.type = "password";
    if (eyeIcon) eyeIcon.textContent = "👁️";
  }
}

/**
 * 5. Đăng xuất tài khoản Admin
 */
function dangXuatAdmin() {
  localStorage.removeItem("admin_logged_in");

  // Làm sạch form
  var oEmail = document.getElementById("admin-login-email");
  var oPassword = document.getElementById("admin-login-password");
  if (oEmail) oEmail.value = "";
  if (oPassword) oPassword.value = "";

  khoiTaoAdminAuth();

  var msg = document.getElementById("admin-login-msg");
  if (msg) {
    msg.textContent = "👋 Đã đăng xuất khỏi phiên làm việc Quản trị viên!";
    msg.className = "admin-login-msg info";
  }
}

// Tự động khởi tạo ngay khi trang tải xong DOM
document.addEventListener("DOMContentLoaded", khoiTaoAdminAuth);

