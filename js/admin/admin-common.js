/* ==============================================================================
   SPORTSTORE - js/admin/admin-common.js
   Tiện ích lưu trữ, điều phối SPA tabs, cập nhật badges và quản lý modal Admin
============================================================================== */

// 1. TIỆN ÍCH ĐỌC VÀ GHI DỮ LIỆU LOCALSTORAGE CHO ADMIN
function layDuLieuAdmin(khoa) {
  var chuoi = localStorage.getItem(khoa);
  if (!chuoi) return [];
  try {
    return JSON.parse(chuoi);
  } catch (e) {
    return [];
  }
}

function luuDuLieuAdmin(khoa, duLieu) {
  localStorage.setItem(khoa, JSON.stringify(duLieu));
}

// 2. CHUYỂN TAB VÀ ĐÓNG MỞ POPUP ADMIN
function chuyenTabAdmin(tenTab, nutBam) {
  var cacTab = document.querySelectorAll(".admin-tab-content");
  for (var i = 0; i < cacTab.length; i++) {
    cacTab[i].classList.remove("active");
  }

  var cacNut = document.querySelectorAll(".admin-nav-item");
  for (var j = 0; j < cacNut.length; j++) {
    cacNut[j].classList.remove("active");
  }

  var tabChon = document.getElementById("tab-" + tenTab);
  if (tabChon) tabChon.classList.add("active");

  if (nutBam) {
    nutBam.classList.add("active");
  } else {
    var nutTheoId = document.getElementById("nav-" + tenTab);
    if (nutTheoId) nutTheoId.classList.add("active");
  }

  // Tùy theo tab nào mà gọi hàm vẽ dữ liệu của tab đó
  if (tenTab === "dashboard") hienThiDashboardAdmin();
  else if (tenTab === "customer") hienThiBangKhachHangAdmin();
  else if (tenTab === "category") hienThiBangDanhMucAdmin();
  else if (tenTab === "product") hienThiBangSanPhamAdmin();
  else if (tenTab === "import") hienThiBangNhapHang();
  else if (tenTab === "pricing") hienThiBangGiaBanAdmin();
  else if (tenTab === "order") hienThiBangDonHangAdmin();
  else if (tenTab === "inventory") hienThiBangTonKhoAdmin();

  capNhatSoDemMenuAdmin();
}

function moModalAdmin(idModal) {
  var modal = document.getElementById(idModal);
  if (modal) modal.classList.add("show");
}

function dongModalAdmin(idModal) {
  var modal = document.getElementById(idModal);
  if (modal) modal.classList.remove("show");
}

function capNhatSoDemMenuAdmin() {
  var dsLoai = layDuLieuAdmin("sport_categories");
  var dsSp = layDuLieuAdmin("sport_products");
  var dsNhap = layDuLieuAdmin("sport_imports");
  var dsDon = layDuLieuAdmin("sport_orders");
  var dsKhach = layDuLieuAdmin("sport_customers");

  var bLoai = document.getElementById("badge-count-categories");
  var bSp = document.getElementById("badge-count-products");
  var bNhap = document.getElementById("badge-count-imports");
  var bDon = document.getElementById("badge-count-orders");
  var bKhach = document.getElementById("badge-count-customers");

  if (bLoai) bLoai.textContent = dsLoai.length;
  if (bSp) bSp.textContent = dsSp.length;
  if (bNhap) bNhap.textContent = dsNhap.length;
  if (bDon) bDon.textContent = dsDon.length;
  if (bKhach) bKhach.textContent = dsKhach.length;
}

