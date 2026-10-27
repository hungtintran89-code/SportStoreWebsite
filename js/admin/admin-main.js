/**
 * Kiểm tra trạng thái đăng nhập khi vào trang admin.html
 */
function kiemTraDangNhapAdmin() {
  var logged = localStorage.getItem("admin_logged_in");

  if (logged !== "true") {
    alert("Vui lòng đăng nhập với quyền Quản Trị Viên để tiếp tục!");
    window.location.href = "login-admin.html";
  }
}

/**
 * Đăng xuất khỏi hệ thống
 */
function dangXuatAdmin() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang Quản trị không?")) {
    localStorage.removeItem("admin_logged_in");
    alert("Đã đăng xuất thành công!");
    window.location.href = "login-admin.html";
  }
}

/**
 * Chuyển đổi giữa các Tab quản trị theo chuẩn Bareme SGU
 */
function switchTab(tabName, btnElement) {
  // 1. Ẩn tất cả các khung nội dung tab
  var tabContents = document.querySelectorAll(".admin-tab-content");
  for (var i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove("active");
  }

  // 2. Gỡ class active khỏi tất cả các nút điều hướng sidebar
  var navItems = document.querySelectorAll(".admin-nav-item");
  for (var j = 0; j < navItems.length; j++) {
    navItems[j].classList.remove("active");
  }

  // 3. Hiển thị tab được chọn
  var targetTab = document.getElementById("tab-" + tabName);
  if (targetTab) {
    targetTab.classList.add("active");
  }

  // 4. Đánh dấu nút sidebar tương ứng active
  if (btnElement) {
    btnElement.classList.add("active");
  } else {
    var defaultBtn = document.getElementById("nav-" + tabName);
    if (defaultBtn) defaultBtn.classList.add("active");
  }

  // 5. Gọi hàm render tương ứng của tab đó (Mỗi tab làm việc độc lập)
  if (tabName === "dashboard" && typeof renderDashboard === "function") {
    updateDashboardStats();
    renderDashboard();
  } else if (
    tabName === "customer" &&
    typeof renderCustomerTable === "function"
  ) {
    renderCustomerTable();
  } else if (
    tabName === "category" &&
    typeof renderCategoryTable === "function"
  ) {
    renderCategoryTable();
  } else if (
    tabName === "product" &&
    typeof renderProductTable === "function"
  ) {
    renderProductTable();
  } else if (tabName === "import" && typeof renderImportTable === "function") {
    renderImportTable();
  } else if (
    tabName === "pricing" &&
    typeof renderPricingTable === "function"
  ) {
    renderPricingTable();
  } else if (tabName === "order" && typeof renderOrderTable === "function") {
    renderOrderTable();
  } else if (
    tabName === "inventory" &&
    typeof renderInventoryTable === "function"
  ) {
    renderInventoryTable();
  }

  // 6. Cập nhật lại số liệu badges trên Sidebar
  updateSidebarBadges();
}

/**
 * Cập nhật số lượng đếm trên Sidebar từ LocalStorage
 */
function updateSidebarBadges() {
  var cats = getStorage(STORAGE_KEYS.CATEGORIES, []);
  var prods = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var imps = getStorage(STORAGE_KEYS.IMPORTS, []);
  var ords = getStorage(STORAGE_KEYS.ORDERS, []);
  var custs = getStorage(STORAGE_KEYS.CUSTOMERS, []);

  var elCat = document.getElementById("badge-count-categories");
  var elProd = document.getElementById("badge-count-products");
  var elImp = document.getElementById("badge-count-imports");
  var elOrd = document.getElementById("badge-count-orders");
  var elCust = document.getElementById("badge-count-customers");

  if (elCat) elCat.textContent = cats.length;
  if (elProd) elProd.textContent = prods.length;
  if (elImp) elImp.textContent = imps.length;
  if (elOrd) elOrd.textContent = ords.length;
  if (elCust) elCust.textContent = custs.length;
}

/**
 * Đóng bất kỳ Modal nào bằng ID
 */
function closeModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
  }
}

/**
 * Mở bất kỳ Modal nào bằng ID
 */
function openModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("show");
  }
}

/**
 * Khởi tạo ứng dụng Admin khi tải xong trang
 */
window.addEventListener("DOMContentLoaded", function () {
  // 1. Kiểm tra đăng nhập
  kiemTraDangNhapAdmin();

  // 2. Cập nhật badges
  updateSidebarBadges();

  // 3. Mặc định mở Tab Dashboard hoặc Tab lưu trước đó
  switchTab("dashboard");
});
