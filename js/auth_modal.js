var KHOA_PHIEN_DANG_NHAP = "sport_user";
var KHOA_DANH_SACH_KHACH = "sport_customers";
var KHOA_CO_ADMIN = "admin_logged_in";

// Lấy thông tin tài khoản đang đăng nhập hiện tại
function laySessionUser() {
  var chuoi = localStorage.getItem(KHOA_PHIEN_DANG_NHAP);
  if (!chuoi) return null;
  try {
    return JSON.parse(chuoi);
  } catch (e) {
    return null;
  }
}

function layDanhSachTatCaUser() {
  var danhSach = [];

  // tài khoản admin
  var taiKhoanAdmin = {
    id: "ADMIN-001",
    customerId: "ADMIN-001",
    name: "Quản Trị Viên SportStore",
    email: "admin@sportstore.vn",
    phone: "0909876543",
    password: "admin",
    role: "admin",
    tier: "Administrator",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
  };
  danhSach.push(taiKhoanAdmin);

  //Lấy danh sách khách hàng từ LocalStorage
  var chuoiKhach = localStorage.getItem(KHOA_DANH_SACH_KHACH);
  if (chuoiKhach) {
    var dsKhach = JSON.parse(chuoiKhach);
    for (var i = 0; i < dsKhach.length; i++) {
      var k = dsKhach[i];
      danhSach.push({
        id: k.id || k.customerId,
        customerId: k.customerId || k.id,
        name: k.name,
        email: k.email,
        phone: k.phone,
        password: k.password || "123456",
        role: "user",
        tier: k.tier || "Standard",
        avatar: k.avatar || "https://i.pravatar.cc/80?img=47",
        address: k.address || ""
      });
    }
  }

  return danhSach;
}

// Hàm chuyển hướng trang tương đối chính xác (dù đang ở trang chủ hay trong pages)
function layDuongDanTrang(tenTrang) {
  var duongDan = window.location.pathname;
  var dangODanhMucPages = duongDan.indexOf("/pages/") !== -1;
  if (tenTrang === "index.html") {
    return dangODanhMucPages ? "../index.html" : "index.html";
  }
  if (dangODanhMucPages) {
    return tenTrang;
  } else {
    return "pages/" + tenTrang;
  }
}

// Hàm mở Modal Đăng nhập / Đăng ký
function moModalAuth(cheDo) {
  khoiTaoKhungModalNeuChuaCo();
  var modal = document.getElementById("dev5-modal-auth-root");
  if (modal) {
    modal.classList.add("is-open");
  }
  chuyenTabAuth(cheDo || "login");
}

// Hàm đóng Modal Đăng nhập / Đăng ký
function dongModalAuth() {
  var modal = document.getElementById("dev5-modal-auth-root");
  if (modal) {
    modal.classList.remove("is-open");
  }
}

function capNhatHeaderAuth() {
  var user = laySessionUser();
  var laAdmin = user && (user.role === "admin");
  // 1. Lấy tất cả các phần tử bằng getElementById cực kỳ rõ ràng
  var nutDangNhap = document.getElementById("sport-btn-open-login");
  var nutDangKy = document.getElementById("sport-btn-open-register");
  var nutDangXuat = document.getElementById("header-btn-logout");
  var cumThongTinUser = document.getElementById("header-user-wrap");
  var theTenUser = document.getElementById("header-user-name");
  var theAvatarUser = document.getElementById("header-user-avatar");
  var nutAdmin = document.getElementById("header-nav-admin-btn");
  var linkTrangCaNhan = document.getElementById("header-link-profile");
  var linkDonMua = document.getElementById("header-link-orders");
  // ==========================================================
  // TRƯỜNG HỢP 1: ĐÃ ĐĂNG NHẬP
  // ==========================================================
  if (user) {
    // Ẩn 2 nút Đăng nhập / Đăng ký
    if (nutDangNhap) nutDangNhap.classList.add("dev5-hidden");
    if (nutDangKy) nutDangKy.classList.add("dev5-hidden");
    // Hiện cụm tài khoản và nút Đăng xuất
    if (cumThongTinUser) cumThongTinUser.classList.remove("dev5-hidden");
    if (nutDangXuat) nutDangXuat.classList.remove("dev5-hidden");
    // Điền tên và ảnh đại diện
    if (theTenUser) theTenUser.textContent = user.name || "Tài khoản";
    if (theAvatarUser) theAvatarUser.src = user.avatar || "https://i.pravatar.cc/80?img=47";
    // --- PHÂN BIỆT ADMIN VÀ KHÁCH HÀNG ---
    if (laAdmin) {
      // 1. Hiện nút Admin trên Navbar và trỏ vào trang dev5_user.html
      if (nutAdmin) {
        nutAdmin.classList.remove("dev5-hidden");
        nutAdmin.href = layDuongDanTrang("dev5_user.html");
      }
      // 2. Menu dòng 1: Đổi thành "⚙️ Trang Quản Trị"
      if (linkTrangCaNhan) {
        linkTrangCaNhan.textContent = "⚙️ Trang Quản Trị";
        linkTrangCaNhan.href = layDuongDanTrang("dev5_user.html");
      }
      // 3. Menu dòng 2: Ẩn mục "Đơn Mua" đi
      if (linkDonMua) {
        linkDonMua.classList.add("dev5-hidden");
      }
    } else {
      // Là Khách hàng bình thường:
      if (nutAdmin) nutAdmin.classList.add("dev5-hidden");
      if (linkTrangCaNhan) {
        linkTrangCaNhan.textContent = "Tài Khoản Của Tôi";
        linkTrangCaNhan.href = layDuongDanTrang("dev5_user.html?tab=overview");
      }
      if (linkDonMua) {
        linkDonMua.classList.remove("dev5-hidden");
        linkDonMua.href = layDuongDanTrang("dev5_user.html?tab=orders");
      }
    }
  }
      // ==========================================================
      // TRƯỜNG HỢP 2: CHƯA ĐĂNG NHẬP (KHÁCH VÃNG LAI)
  // ==========================================================
  else {
    // Hiện nút Đăng nhập / Đăng ký
    if (nutDangNhap) nutDangNhap.classList.remove("dev5-hidden");
    if (nutDangKy) nutDangKy.classList.remove("dev5-hidden");
    // Ẩn cụm tài khoản, nút Đăng xuất và nút Admin
    if (cumThongTinUser) cumThongTinUser.classList.add("dev5-hidden");
    if (nutDangXuat) nutDangXuat.classList.add("dev5-hidden");
    if (nutAdmin) nutAdmin.classList.add("dev5-hidden");
  }
}

// Bấm chuyển đổi giữa 2 tab Đăng nhập và Đăng ký
function chuyenTabAuth(cheDo) {
  var tabLogin = document.getElementById("auth-tab-btn-login");
  var tabRegister = document.getElementById("auth-tab-btn-register");
  var formLogin = document.getElementById("auth-form-login");
  var formRegister = document.getElementById("auth-form-register");
  var dongThongBao = document.getElementById("auth-form-msg");

  // Xóa sạch thông báo lỗi cũ
  if (dongThongBao) {
    dongThongBao.textContent = "";
  }

  if (cheDo === "register") {
    if (tabLogin) tabLogin.classList.remove("is-active");
    if (tabRegister) tabRegister.classList.add("is-active");
    if (formLogin) formLogin.style.display = "none";
    if (formRegister) formRegister.style.display = "block";
  } else {
    if (tabLogin) tabLogin.classList.add("is-active");
    if (tabRegister) tabRegister.classList.remove("is-active");
    if (formLogin) formLogin.style.display = "block";
    if (formRegister) formRegister.style.display = "none";
  }
}

function xuLyDangNhap(event) {
  event.preventDefault(); // Ngăn trình duyệt tự tải lại trang

  var dongThongBao = document.getElementById("auth-form-msg");
  var oTaiKhoan = document.getElementById("auth-login-account");
  var oMatKhau = document.getElementById("auth-login-password");

  var taiKhoanNhap = oTaiKhoan ? oTaiKhoan.value.trim().toLowerCase() : "";
  var matKhauNhap = oMatKhau ? oMatKhau.value : "";

  // 1. Kiểm tra không được để trống
  if (taiKhoanNhap === "" || matKhauNhap === "") {
    dongThongBao.style.color = "#dc2626";
    dongThongBao.textContent = "Vui lòng nhập đầy đủ Email/Số điện thoại và Mật khẩu!";
  }

  // 2. Lấy toàn bộ danh sách user để so sánh
  var tatCaUser = layDanhSachTatCaUser();
  var userHopLe = null;

  // Dùng vòng lặp for cơ bản tìm người dùng
  for (var i = 0; i < tatCaUser.length; i++) {
    var u = tatCaUser[i];
    var emailUser = (u.email || "").toLowerCase().trim();
    var sdtUser = (u.phone || "").trim();

    // Khớp tài khoản (Email HOẶC SĐT) VÀ khớp mật khẩu
    if ((taiKhoanNhap === emailUser || taiKhoanNhap === sdtUser) && matKhauNhap === u.password) {
      userHopLe = u;
      break;
    }
  }

  // 3. Nếu không tìm thấy hoặc sai mật khẩu
  if (!userHopLe) {
    dongThongBao.style.color = "#dc2626";
    dongThongBao.textContent = "Tài khoản hoặc mật khẩu không chính xác!";
    return;
  }

  // 4. Đăng nhập thành công -> Lưu vào LocalStorage
  var laAdmin = (userHopLe.role === "admin");
  localStorage.setItem(KHOA_PHIEN_DANG_NHAP, JSON.stringify(userHopLe));
  localStorage.setItem(KHOA_CO_ADMIN, laAdmin ? "true" : "false");

  dongThongBao.style.color = "#16a34a";
  dongThongBao.textContent = "Đăng nhập thành công! Đang chuyển hướng...";

  capNhatHeaderAuth();

  dongModalAuth();
  window.location.reload();

  // Đợi 0.4 giây rồi chuyển trang
  // setTimeout(function () {
  //
  //   // if (laAdmin) {
  //   //   window.location.href = layDuongDanTrang("admin.html");
  //   // } else {
  //   //   // Nếu đang ở trang cá nhân thì tải lại trang, trang khác thì giữ nguyên
  //   //   if (window.location.pathname.indexOf("dev5_user.html") !== -1) {
  //   //     window.location.reload();
  //   //   }
  //   // }
  // }, 400);
}

// ==============================================================================
// 6. HÀM XỬ LÝ ĐĂNG KÝ THÀNH VIÊN
// ==============================================================================
function xuLyDangKy(event) {
  event.preventDefault();

  var dongThongBao = document.getElementById("auth-form-msg");
  var hoTen = document.getElementById("auth-reg-name").value.trim();
  var email = document.getElementById("auth-reg-email").value.trim().toLowerCase();
  var sdt = document.getElementById("auth-reg-phone").value.trim();
  var matKhau = document.getElementById("auth-reg-password").value;
  var matKhauXacNhan = document.getElementById("auth-reg-confirm").value;

  dongThongBao.style.color = "#dc2626";

  // 1. Kiểm tra các điều kiện nhập liệu bằng if / else
  if (hoTen.length < 2) {
    dongThongBao.textContent = "Họ và tên phải có ít nhất 2 ký tự!";
    return;
  }
  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    dongThongBao.textContent = "Email không đúng định dạng!";
    return;
  }
  if (sdt.length !== 10 || sdt.charAt(0) !== "0" || isNaN(sdt)) {
    dongThongBao.textContent = "Số điện thoại phải đủ 10 số và bắt đầu bằng số 0!";
    return;
  }
  if (matKhau.length < 6) {
    dongThongBao.textContent = "Mật khẩu phải có ít nhất 6 ký tự!";
    return;
  }
  if (matKhau !== matKhauXacNhan) {
    dongThongBao.textContent = "Mật khẩu nhập lại không trùng khớp!";
    return;
  }

  // 2. Dùng vòng lặp for kiểm tra xem Email hoặc SĐT đã tồn tại chưa
  var tatCaUser = layDanhSachTatCaUser();
  for (var i = 0; i < tatCaUser.length; i++) {
    if (tatCaUser[i].email.toLowerCase() === email) {
      dongThongBao.textContent = "Email này đã được đăng ký tài khoản!";
      return;
    }
    if (tatCaUser[i].phone === sdt) {
      dongThongBao.textContent = "Số điện thoại này đã được đăng ký!";
      return;
    }
  }

  // 3. Tạo thông tin khách hàng mới
  var maMoi = "KH-" + String(Date.now()).slice(-4);
  var khachHangMoi = {
    id: maMoi,
    customerId: maMoi,
    name: hoTen,
    email: email,
    phone: sdt,
    password: matKhau,
    role: "user",
    tier: "Standard",
    points: 0,
    spent: 0,
    avatar: "https://i.pravatar.cc/80?img=47",
    address: ""
  };

  // 4. Lưu vào danh sách sport_customers trong LocalStorage
  var dsHienTai = [];
  var chuoi = localStorage.getItem(KHOA_DANH_SACH_KHACH);
  if (chuoi) {
    dsHienTai = JSON.parse(chuoi);
  }
  dsHienTai.push(khachHangMoi);
  localStorage.setItem(KHOA_DANH_SACH_KHACH, JSON.stringify(dsHienTai));

  // 5. Báo thành công và chuyển sang form Đăng nhập
  dongThongBao.style.color = "#16a34a";
  dongThongBao.textContent = "Đăng ký thành công! Đang chuyển sang form đăng nhập...";

  setTimeout(function () {
    chuyenTabAuth("login");
    // Điền sẵn tài khoản vừa đăng ký vào form đăng nhập
    if (document.getElementById("auth-login-account")) {
      document.getElementById("auth-login-account").value = email;
    }
    if (document.getElementById("auth-login-password")) {
      document.getElementById("auth-login-password").value = "";
    }
  }, 1000);
}

// ==============================================================================
// 7. HÀM ĐĂNG XUẤT
// ==============================================================================
function dangXuat() {
  localStorage.removeItem(KHOA_PHIEN_DANG_NHAP);
  localStorage.removeItem(KHOA_CO_ADMIN);

  capNhatHeaderAuth();

  // Nếu đang đứng ở trang cá nhân hoặc admin thì quay về trang chủ
  var duongDan = window.location.pathname;
  if (duongDan.indexOf("dev5_user.html") !== -1 || duongDan.indexOf("admin.html") !== -1) {
    var dangODanhMucPages = duongDan.indexOf("/pages/") !== -1;
    window.location.href = dangODanhMucPages ? "../index.html" : "index.html";
  } else {
    window.location.reload();
  }
}

// ==============================================================================
// 8. HÀM KHỞI TẠO KHUNG HTML CỦA MODAL (Nạp tự động 1 lần, có sẵn onclick)
// ==============================================================================
function khoiTaoKhungModalNeuChuaCo() {
  if (document.getElementById("dev5-modal-auth-root")) return;

  var html = `
  <div id="dev5-modal-auth-root" class="dev5-auth-modal" onclick="if(event.target === this) dongModalAuth()">
    <div class="dev5-auth-box">
      <!-- Nút Đóng X -->
      <button class="dev5-auth-close" type="button" onclick="dongModalAuth()">×</button>
      
      <span class="dev5-eyebrow" style="display:block; text-align:center; font-size:11px; letter-spacing:1px; color:#64748b; font-weight:700; margin-bottom:8px;">SPORTSTORE ACCOUNT</span>

      <!-- 2 Nút Tab Đăng Nhập / Đăng Ký -->
      <div class="dev5-auth-tabs">
        <button type="button" id="auth-tab-btn-login" class="dev5-auth-tab is-active" onclick="chuyenTabAuth('login')">
          ĐĂNG NHẬP
        </button>
        <button type="button" id="auth-tab-btn-register" class="dev5-auth-tab" onclick="chuyenTabAuth('register')">
          ĐĂNG KÝ THÀNH VIÊN
        </button>
      </div>

      <!-- Dòng thông báo lỗi hoặc thành công -->
      <p id="auth-form-msg" style="min-height: 20px; font-size: 13px; font-weight: 600; text-align: center; margin: 8px 0;"></p>

      <!-- FORM 1: ĐĂNG NHẬP -->
      <form id="auth-form-login" onsubmit="xuLyDangNhap(event)">
        <label>
          Email hoặc Số điện thoại
          <input type="text" id="auth-login-account" class="" placeholder="Ví dụ: hungtintran89@gmail.com">
        </label>
        <label>
          Mật khẩu
          <input type="password" id="auth-login-password"  placeholder="••••••••">
        </label>
        <div style="margin-top: 16px;">
          <button class="dev5-primary-button" type="submit" style="width:100%; padding:11px; font-weight:700; cursor:pointer;">
            Đăng Nhập
          </button>
        </div>
        <p style="text-align: center; font-size: 13px; margin-top: 14px; color: #64748b;">
          Chưa có tài khoản? 
          <button type="button" onclick="chuyenTabAuth('register')" style="background:none; border:none; color:#0284c7; font-weight:700; cursor:pointer;">
            Đăng ký ngay
          </button>
        </p>
      </form>

      <!-- FORM 2: ĐĂNG KÝ THÀNH VIÊN -->
      <form id="auth-form-register" onsubmit="xuLyDangKy(event)" style="display: none;">
        <label>
          Họ và tên
          <input type="text" id="auth-reg-name" placeholder="Ví dụ: Trần Hùng Tín">
        </label>
        <label>
          Email
          <input type="email" id="auth-reg-email" placeholder="Ví dụ: tin@gmail.com">
        </label>
        <label>
          Số điện thoại
          <input type="tel" id="auth-reg-phone" placeholder="Ví dụ: 0359779974" maxlength="10">
        </label>
        <label>
          Mật khẩu (tối thiểu 6 ký tự)
          <input type="password" id="auth-reg-password" placeholder="••••••••">
        </label>
        <label>
          Nhập lại mật khẩu
          <input type="password" id="auth-reg-confirm" placeholder="••••••••">
        </label>
        <div style="margin-top: 16px;">
          <button class="dev5-primary-button" type="submit" style="width:100%; padding:11px; font-weight:700; cursor:pointer;">
            Đăng Ký
          </button>
        </div>
        <p style="text-align: center; font-size: 13px; margin-top: 14px; color: #64748b;">
          Đã có tài khoản? 
          <button type="button" onclick="chuyenTabAuth('login')" style="background:none; border:none; color:#0284c7; font-weight:700; cursor:pointer;">
            Đăng nhập
          </button>
        </p>
      </form>

    </div>
  </div>
  `;

  var hopChua = document.createElement("div");
  hopChua.innerHTML = html;
  document.body.appendChild(hopChua.firstElementChild);
}

// Cầu nối phụ hỗ trợ các trang cũ gọi window.sportStoreAuth (nếu có)
window.sportStoreAuth = {
  getSession: laySessionUser,
  session: laySessionUser,
  openModal: moModalAuth
};

document.addEventListener("DOMContentLoaded", function () {
  khoiTaoKhungModalNeuChuaCo();
  capNhatHeaderAuth();
});
