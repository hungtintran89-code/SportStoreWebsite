// Key luu du lieu trong localStorage cua nhom
var STORAGE_KEYS = {
  PRODUCTS: "sport_products",
  CATEGORIES: "sport_categories",
  ORDERS: "sport_orders",
  CUSTOMERS: "sport_customers",
  IMPORTS: "sport_imports",
  DATA_VERSION: "sport_data_version"
};

var CURRENT_DATA_VERSION = "v2026_multisport_v6_real100";

// Ham doc du lieu tu localStorage (co fallback ve bien global neu localStorage day)
function getStorage(key) {
  try {
    var data = localStorage.getItem(key);
    if (data) {
      var parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  if (key === STORAGE_KEYS.PRODUCTS && typeof products !== "undefined") return products;
  if (key === STORAGE_KEYS.CATEGORIES && typeof categories !== "undefined") return categories;
  if (key === STORAGE_KEYS.ORDERS && typeof orders !== "undefined") return orders;
  if (key === STORAGE_KEYS.CUSTOMERS && typeof customers !== "undefined") return customers;
  if (key === STORAGE_KEYS.IMPORTS && typeof imports !== "undefined") return imports;
  return [];
}

// Ham luu du lieu vao localStorage
function setStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Khong the luu localStorage:", e);
  }
}

// Ham nap du lieu ban dau (tu dong cap nhat khi co phien ban du lieu moi 1295 san pham)
function initSportStorage() {
  var savedVer = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
  var needReset = (savedVer !== CURRENT_DATA_VERSION);

  var currentProds = getStorage(STORAGE_KEYS.PRODUCTS);
  if (!Array.isArray(currentProds) || currentProds.length < 1200 || !currentProds[0] || !currentProds[0].filterAttrs) {
    needReset = true;
  }

  if ((needReset || !localStorage.getItem(STORAGE_KEYS.PRODUCTS)) && typeof products !== "undefined") {
    setStorage(STORAGE_KEYS.PRODUCTS, products);
  }
  if ((needReset || !localStorage.getItem(STORAGE_KEYS.CATEGORIES)) && typeof categories !== "undefined") {
    setStorage(STORAGE_KEYS.CATEGORIES, categories);
  }
  if ((needReset || !localStorage.getItem(STORAGE_KEYS.ORDERS)) && typeof orders !== "undefined") {
    setStorage(STORAGE_KEYS.ORDERS, orders);
  }
  if ((needReset || !localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) && typeof customers !== "undefined") {
    setStorage(STORAGE_KEYS.CUSTOMERS, customers);
  }
  if ((needReset || !localStorage.getItem(STORAGE_KEYS.IMPORTS)) && typeof imports !== "undefined") {
    setStorage(STORAGE_KEYS.IMPORTS, imports);
  }

  if (needReset) {
    try {
      localStorage.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION);
    } catch (e) {}
  }
}

// Ham doi so sang tien Viet (vd: 500000 -> 500.000 đ)
function formatVND(number) {
  return (Number(number) || 0).toLocaleString("vi-VN") + " đ";
}

initSportStorage();
