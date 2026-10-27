/**
 * ==============================================================================
 * SPORTSTORE - KHỞI TẠO & ĐỒNG BỘ DỮ LIỆU LOCALSTORAGE (INIT-STORAGE.JS)
 * ==============================================================================
 * Chuẩn Bareme SGU:
 *  - Chạy local file:/// (không fetch JSON tránh lỗi CORS).
 *  - Tự động nạp dữ liệu từ data store (28 sản phẩm, 6 phân loại, 7 phiếu nhập...) vào LocalStorage.
 *  - Toàn bộ CRUD (thêm, sửa, xóa, tìm kiếm) thao tác trực tiếp trên LocalStorage.
 *  - Cung cấp các hàm tiện ích getStorage, setStorage, formatVND, formatDateVN.
 */

// Định nghĩa các KEY lưu trong LocalStorage
var STORAGE_KEYS = {
  CATEGORIES: "sport_categories",
  PRODUCTS: "sport_products",
  IMPORTS: "sport_imports",
  ORDERS: "sport_orders",
  CUSTOMERS: "sport_customers",
  ADMIN_LOGGED: "admin_logged_in",
  VOUCHERS: "sport_vouchers",
  CART: "sport_cart",
  USER: "sport_user"
};

/**
 * Hàm lấy dữ liệu từ LocalStorage (Tự parse JSON)
 */
function getStorage(key, defaultData) {
  if (typeof localStorage === "undefined") return defaultData || [];
  var raw = localStorage.getItem(key);
  if (!raw) {
    return defaultData || [];
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Lỗi parse LocalStorage key: " + key, e);
    return defaultData || [];
  }
}

/**
 * Hàm lưu dữ liệu vào LocalStorage (Tự stringify JSON)
 */
function setStorage(key, data) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Lỗi ghi LocalStorage key: " + key, e);
  }
}

/**
 * Hàm tự động nạp dữ liệu từ data store hoặc biến MOCK_* sang LocalStorage
 * Tự động đồng bộ và nâng cấp dữ liệu nếu phiên bản cũ hoặc bị lệch trường
 */
function initSportStorage() {
  var DATA_VERSION = "sport_data_2026_v5";
  var currentVersion = localStorage.getItem("sport_data_version");

  // Kiểm tra xem dữ liệu trong LocalStorage có bị lỗi định dạng cũ không
  var existingImports = getStorage(STORAGE_KEYS.IMPORTS, []);
  var existingCustomers = getStorage(STORAGE_KEYS.CUSTOMERS, []);
  var existingProducts = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var needMigration = false;

  // Nếu imports thiếu importId hoặc customers thiếu id hoặc products quá ít (bản cũ <= 8 sp)
  if (existingImports.length > 0 && !existingImports[0].importId) {
    needMigration = true;
  }
  if (existingCustomers.length > 0 && !existingCustomers[0].id) {
    needMigration = true;
  }
  if (existingProducts.length > 0 && existingProducts.length <= 8 && typeof products !== "undefined" && products.length > 8) {
    needMigration = true;
  }
  // Kiểm tra ảnh tạ dumbbell cũ hoặc ảnh lệch
  if (existingProducts.length > 0 && JSON.stringify(existingProducts).includes("photo-1584735935682")) {
    needMigration = true;
  }

  var isNewVersion = currentVersion !== DATA_VERSION;

  // 1. Nạp Danh mục loại sản phẩm
  if (isNewVersion || needMigration || !localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    var catSource = (typeof categories !== "undefined" && categories.length > 0) ? categories : (typeof MOCK_CATEGORIES !== "undefined" ? MOCK_CATEGORIES : null);
    if (catSource) setStorage(STORAGE_KEYS.CATEGORIES, catSource);
  }

  // 2. Nạp Danh sách sản phẩm (28 sản phẩm chuẩn)
  if (isNewVersion || needMigration || !localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    var prodSource = (typeof products !== "undefined" && products.length > 0) ? products : (typeof MOCK_PRODUCTS !== "undefined" ? MOCK_PRODUCTS : null);
    if (prodSource) setStorage(STORAGE_KEYS.PRODUCTS, prodSource);
  }

  // 3. Nạp Danh sách phiếu nhập hàng (7 phiếu chuẩn)
  if (isNewVersion || needMigration || !localStorage.getItem(STORAGE_KEYS.IMPORTS)) {
    var impSource = (typeof imports !== "undefined" && imports.length > 0) ? imports : (typeof MOCK_IMPORTS !== "undefined" ? MOCK_IMPORTS : null);
    if (impSource) setStorage(STORAGE_KEYS.IMPORTS, impSource);
  }

  // 4. Nạp Danh sách đơn hàng (7 đơn chuẩn)
  if (isNewVersion || needMigration || !localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    var ordSource = (typeof orders !== "undefined" && orders.length > 0) ? orders : (typeof MOCK_ORDERS !== "undefined" ? MOCK_ORDERS : null);
    if (ordSource) setStorage(STORAGE_KEYS.ORDERS, ordSource);
  }

  // 5. Nạp Danh sách khách hàng (6 khách hàng chuẩn)
  if (isNewVersion || needMigration || !localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    var custSource = (typeof customers !== "undefined" && customers.length > 0) ? customers : (typeof MOCK_CUSTOMERS !== "undefined" ? MOCK_CUSTOMERS : null);
    if (custSource) setStorage(STORAGE_KEYS.CUSTOMERS, custSource);
  }

  // 6. Cờ đăng nhập admin mặc định
  if (localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED) === null) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED, "true");
  }

  // Đánh dấu phiên bản dữ liệu chuẩn
  localStorage.setItem("sport_data_version", DATA_VERSION);
}

/**
 * Hàm khôi phục toàn bộ dữ liệu về trạng thái mặc định của SportStore
 * Rất tiện lợi cho reviewer/giáo viên muốn làm mới toàn bộ 28 sản phẩm
 */
function resetStorageToDefault() {
  if (
    confirm(
      "Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu về trạng thái chuẩn của SportStore (28 sản phẩm, 6 phân loại, 7 phiếu nhập, 7 đơn hàng)?",
    )
  ) {
    var catData = (typeof categories !== "undefined") ? categories : (typeof MOCK_CATEGORIES !== "undefined" ? MOCK_CATEGORIES : []);
    var prodData = (typeof products !== "undefined") ? products : (typeof MOCK_PRODUCTS !== "undefined" ? MOCK_PRODUCTS : []);
    var impData = (typeof imports !== "undefined") ? imports : (typeof MOCK_IMPORTS !== "undefined" ? MOCK_IMPORTS : []);
    var ordData = (typeof orders !== "undefined") ? orders : (typeof MOCK_ORDERS !== "undefined" ? MOCK_ORDERS : []);
    var custData = (typeof customers !== "undefined") ? customers : (typeof MOCK_CUSTOMERS !== "undefined" ? MOCK_CUSTOMERS : []);

    setStorage(STORAGE_KEYS.CATEGORIES, catData);
    setStorage(STORAGE_KEYS.PRODUCTS, prodData);
    setStorage(STORAGE_KEYS.IMPORTS, impData);
    setStorage(STORAGE_KEYS.ORDERS, ordData);
    setStorage(STORAGE_KEYS.CUSTOMERS, custData);
    localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED, "true");
    localStorage.setItem("sport_data_version", "sport_data_2026_v2");
    alert("Đã khôi phục toàn bộ dữ liệu chuẩn (28 sản phẩm) thành công!");
    location.reload();
  }
}

/**
 * Hàm format tiền tệ VNĐ (ví dụ: 5290000 -> "5.290.000 đ")
 */
function formatVND(number) {
  var num = Number(number) || 0;
  return num.toLocaleString("vi-VN") + " đ";
}

/**
 * Hàm format ngày hiển thị (YYYY-MM-DD -> DD/MM/YYYY)
 */
function formatDateVN(dateStr) {
  if (!dateStr) return "";
  var cleanStr = dateStr.split(" ")[0]; // Bỏ phần giờ nếu có
  var parts = cleanStr.split("-");
  if (parts.length === 3) {
    return parts[2] + "/" + parts[1] + "/" + parts[0];
  }
  return dateStr;
}

// Tự động kích hoạt nạp storage ngay khi nạp file script này
initSportStorage();
