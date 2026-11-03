// 1. Kiểm tra quyền Admin khi vào trang
function kiemTraDangNhapAdmin() {

  var daDangNhap = localStorage.getItem("admin_logged_in") ;

  if (daDangNhap !== "true") {
    alert("Vui lòng đăng nhập với quyền Quản Trị Viên để tiếp tục!");
    window.location.href = "../index.html";
  }
}
function dangXuatAdmin(){
  var xacNhan = confirm("Bạn có chắc chắn muỗn đăng xuất không?");

  if( xacNhan ){

    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("sport_user");

    alert("Đã đăng xuất thành công!");
    window.location.href = "../index.html";
  }
}

// 2. Chuyển đổi giữa các Tab (Dashboard, Sản phẩm, Đơn hàng...)
function switchTab(tabName, btnElement) {

  var tatCaNoiDungTab = document.querySelectorAll(".admin-tab-content") ;
  for( let i = 0 ; i < tatCaNoiDungTab.length ;i++){
    tatCaNoiDungTab[i].classList.remove("active") ;
  }

  var tatCaNutMenu = document.querySelectorAll(".admin-nav-item") ;
  for( let i = 0  ; i < tatCaNutMenu.length ;i++){
    tatCaNutMenu[i].classList.remove("active") ;
  }

  var tabCanHien = document.getElementById("tab-" + tabName);
  if( tabCanHien ){
    tabCanHien.classList.add("active");
  }

  if (btnElement) {
    btnElement.classList.add("active");
  } else {
    var matchingNav = document.querySelector(".admin-nav-item[onclick*=\"switchTab('" + tabName + "'\"]");
    if (matchingNav) {
      matchingNav.classList.add("active");
    }
  }

  if (tabName === "dashboard") {
    if (typeof updateDashboardStats === "function") updateDashboardStats();
    if (typeof renderDashboard === "function") renderDashboard();
  }
  else if (tabName === "customer") {
    if (typeof renderCustomerTable === "function") renderCustomerTable();
  }
  else if (tabName === "category") {
    if (typeof renderCategoryTable === "function") renderCategoryTable();
  }
  else if (tabName === "product") {
    if (typeof renderProductTable === "function") renderProductTable();
  }
  else if (tabName === "import") {
    if (typeof renderImportTable === "function") renderImportTable();
  }
  else if (tabName === "pricing") {
    if (typeof renderPricingTable === "function") renderPricingTable();
  }
  else if (tabName === "order") {
    if (typeof renderOrderTable === "function") renderOrderTable();
  }
  else if (tabName === "inventory") {
    if (typeof renderInventoryTable === "function") renderInventoryTable();
  }
  updateSidebarBadges();
}

function updateSidebarBadges() {
  var danhSachLoaiSP = typeof getStorage === "function" ? getStorage("sport_categories") : [];
  var danhSachSP = typeof getStorage === "function" ? getStorage("sport_products") : [];
  var danhSachPhieuNhap = typeof getStorage === "function" ? getStorage("sport_imports") : [];
  var danhSachDonHang = typeof getStorage === "function" ? getStorage("sport_orders") : [];
  var danhSachKhachHang = typeof getStorage === "function" ? getStorage("sport_customers") : [];

  var badgeConfigs = [
    { el: document.getElementById("badge-count-categories"), count: danhSachLoaiSP.length },
    { el: document.getElementById("badge-count-products"), count: danhSachSP.length },
    { el: document.getElementById("badge-count-imports"), count: danhSachPhieuNhap.length },
    { el: document.getElementById("badge-count-orders"), count: danhSachDonHang.length },
    { el: document.getElementById("badge-count-customers"), count: danhSachKhachHang.length }
  ];

  // Dùng vòng for truyền thống duyệt cập nhật từng badge
  for (var i = 0; i < badgeConfigs.length; i++) {
    var cfg = badgeConfigs[i];
    if (cfg.el) {
      if (cfg.count <= 0) {
        cfg.el.style.display = "none";
      } else {
        cfg.el.style.display = "inline-flex";
        cfg.el.textContent = cfg.count > 99 ? "99+" : cfg.count;
      }
    }
  }
}


// 3. Mở và Đóng popup modal
function openModal(modalId) {
  var hopThoai = document.getElementById(modalId);
  if (hopThoai) {
    hopThoai.classList.add("show");
  }
}

function closeModal(modalId) {
  var hopThoai = document.getElementById(modalId);
  if (hopThoai) {
    hopThoai.classList.remove("show");
  }
}

/**
 * 4. Tự động cuộn mượt tới tiêu đề bảng dữ liệu khi tra cứu/lọc xong trên Mobile
 */
function scrollToAdminTable(tabId) {
  // Chỉ xử lý khi ở màn hình nhỏ / mobile
  if (window.innerWidth > 1024) return;
  var tabEl = document.getElementById(tabId);
  if (!tabEl) return;

  // Với tab tồn kho hoặc các tab có nhiều sub-section, ưu tiên lấy table-card đang hiển thị
  var allCards = tabEl.querySelectorAll(".admin-table-card");
  var tableTarget = null;
  for (var i = 0; i < allCards.length; i++) {
    var card = allCards[i];
    var parentSec = card.closest(".inventory-section");
    if (!parentSec || parentSec.style.display !== "none") {
      tableTarget = card;
      break;
    }
  }
  if (!tableTarget) {
    tableTarget = tabEl.querySelector(".admin-table-card") || tabEl.querySelector(".admin-table");
  }
  if (!tableTarget) return;

  setTimeout(function () {
    // 1. Đóng băng: Đảm bảo bảng bên trong luôn hiển thị từ đầu với thead cố định
    if (typeof tableTarget.scrollTo === "function") {
      tableTarget.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      tableTarget.scrollTop = 0;
    }

    // 2. Kiểm tra nếu bảng đã nằm trong tầm nhìn thì đóng băng giữ nguyên, không trượt toàn trang
    var tabRect = tabEl.getBoundingClientRect();
    var targetRect = tableTarget.getBoundingClientRect();

    // Chỉ cuộn container nếu tiêu đề bảng bị khuất dưới đáy màn hình
    if (targetRect.top > tabRect.bottom - 70) {
      var offset = targetRect.top - tabRect.top + tabEl.scrollTop - 6;
      if (offset > 0 && typeof tabEl.scrollTo === "function") {
        tabEl.scrollTo({ top: offset, behavior: "smooth" });
      }
    }
  }, 100);
}


window.addEventListener("DOMContentLoaded", function () {
  // 1. Kiểm tra quyền Admin
  // kiemTraDangNhapAdmin();
  // 2. Cập nhật số đếm thống kê menu
  updateSidebarBadges();
  // 3. Mặc định mở Tab Tổng Quan (Dashboard) đầu tiên
  switchTab("dashboard");
});
