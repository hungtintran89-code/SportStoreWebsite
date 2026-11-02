
var STORAGE_KEYS = {
  PRODUCTS: "sport_products",
  CATEGORIES: "sport_categories",
  ORDERS: "sport_orders",
  CUSTOMERS: "sport_customers",
  IMPORTS: "sport_imports"
};

// 2. Hàm đọc dữ liệu
function getStorage(key) {
  var data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// 3. Hàm lưu dữ liệu
function setStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// 4. Hàm nạp dữ liệu ban đầu
function initSportStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS) && typeof products !== "undefined") {
    setStorage(STORAGE_KEYS.PRODUCTS, products);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES) && typeof categories !== "undefined") {
    setStorage(STORAGE_KEYS.CATEGORIES, categories);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS) && typeof orders !== "undefined") {
    setStorage(STORAGE_KEYS.ORDERS, orders);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS) && typeof customers !== "undefined") {
    setStorage(STORAGE_KEYS.CUSTOMERS, customers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.IMPORTS) && typeof imports !== "undefined") {
    setStorage(STORAGE_KEYS.IMPORTS, imports);
  }
}

// 5. Hàm tiện ích đổi số thành tiền Việt (ví dụ: 5000000 -> 5.000.000 đ)
function formatVND(number) {
  return (Number(number) || 0).toLocaleString("vi-VN") + " đ";
}

// 6. Hàm tiện ích định dạng ngày Việt Nam (YYYY-MM-DD -> DD/MM/YYYY)
function formatDateVN(dateStr) {
  if (!dateStr) return "";
  var parts = String(dateStr).split("-");
  if (parts.length === 3) {
    return parts[2] + "/" + parts[1] + "/" + parts[0];
  }
  return dateStr;
}

// Tự động chạy khi nạp file
initSportStorage();
