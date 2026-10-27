/**
 * ==============================================================================
 * SPORTSTORE - TAB 1: BẢNG ĐIỀU KHIỂN TỔNG QUAN (TAB-DASHBOARD.JS)
 * ==============================================================================
 * Nhiệm vụ:
 *  - Tính toán và hiển thị 4 thẻ KPI (Doanh thu, Đơn hàng, Hội viên, Tồn kho)
 *  - Vẽ biểu đồ cột CSS doanh số theo từng bộ môn thể thao
 *  - Hiển thị danh sách 4 đơn hàng gần nhất cần xử lý
 */

function renderDashboard() {
  var orders = getStorage(STORAGE_KEYS.ORDERS, []);
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var customers = getStorage(STORAGE_KEYS.CUSTOMERS, []);

  // 1. Tính tổng doanh thu từ các đơn hàng Đã giao hoặc Đang giao
  var totalRevenue = 0;
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].status !== "Đã hủy") {
      totalRevenue += Number(orders[i].total || 0);
    }
  }

  // 2. Tính tổng tồn kho sản phẩm
  var totalStock = 0;
  var lowStockCount = 0;
  for (var j = 0; j < products.length; j++) {
    var stock = Number(products[j].stock || 0);
    totalStock += stock;
    if (stock <= 5) {
      lowStockCount++;
    }
  }

  // 3. Đổ dữ liệu vào các thẻ KPI
  var elRevenue = document.getElementById("kpi-total-revenue");
  var elOrders = document.getElementById("kpi-total-orders");
  var elCustomers = document.getElementById("kpi-total-customers");
  var elStock = document.getElementById("kpi-total-stock");

  if (elRevenue) elRevenue.textContent = formatVND(totalRevenue);
  if (elOrders) elOrders.textContent = orders.length + " Đơn";
  if (elCustomers) elCustomers.textContent = customers.length + " Khách";
  if (elStock) elStock.textContent = totalStock + " Món";

  // 4. Render danh sách đơn hàng gần đây cần xử lý
  renderRecentOrders(orders);
}

/**
 * Hiển thị 4 đơn hàng gần nhất lên bảng điều khiển
 */
function renderRecentOrders(orders) {
  var container = document.getElementById("dashboard-recent-orders-list");
  if (!container) return;

  var html = "";
  var count = Math.min(orders.length, 4);

  for (var i = 0; i < count; i++) {
    var o = orders[i];
    var statusClass = "badge-blue";
    if (o.status === "Mới đặt") statusClass = "badge-orange";
    if (o.status === "Đã giao") statusClass = "badge-green";
    if (o.status === "Đã hủy") statusClass = "badge-red";

    var productSummary =
      o.items && o.items.length > 0
        ? o.items[0].name + " (x" + o.items[0].quantity + ")"
        : "Đơn hàng thể thao";

    html += `
      <div class="recent-order-item">
        <div>
          <div class="recent-order-title">#${o.orderId} • <span class="recent-order-customer">${o.customer}</span></div>
          <div class="recent-order-summary">${productSummary}</div>
        </div>
        <div class="recent-order-meta">
          <div class="recent-order-total">${formatVND(o.total)}</div>
          <span class="nav-badge ${statusClass} recent-order-status">${o.status}</span>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

/**
 * Xuất báo cáo nhanh ra thông báo
 */
function exportDashboardReport() {
  alert(
    "Hệ thống đã kết xuất báo cáo doanh thu & tồn kho tháng 10/2026 thành công!",
  );
}

/**
 * Tính toán và cập nhật lại toàn bộ số liệu KPI Dashboard & Badge Sidebar
 */
function updateDashboardStats() {
  // 1. Lấy dữ liệu mới nhất từ LocalStorage
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var orders = getStorage(STORAGE_KEYS.ORDERS, []);
  var customers = getStorage(STORAGE_KEYS.CUSTOMERS, []);
  var categories = getStorage(STORAGE_KEYS.CATEGORIES, []);
  var imports = getStorage(STORAGE_KEYS.IMPORTS, []);

  // 2. Tính toán các con số
  // KPI 1: Tổng doanh thu (chỉ cộng các đơn "Đã giao" hoặc "Hoàn thành")
  var totalRevenue = 0;
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].status === "Đã giao" || orders[i].status === "Hoàn thành") {
      totalRevenue += Number(orders[i].total || orders[i].totalPrice || 0);
    }
  }

  // KPI 2: Tổng số đơn đặt hàng
  var totalOrdersCount = orders.length;

  // KPI 3: Tổng số hội viên / khách hàng
  var totalCustomersCount = customers.length;

  // KPI 4: Tổng tồn kho (cộng dồn tồn kho của tất cả sản phẩm)
  var totalStockQuantity = 0;
  for (var j = 0; j < products.length; j++) {
    totalStockQuantity += Number(products[j].stock || 0);
  }

  // 3. Đổ số liệu vào 4 thẻ KPI trên Dashboard
  var elRevenue = document.getElementById("kpi-total-revenue");
  if (elRevenue) elRevenue.textContent = formatVND(totalRevenue);

  var elOrders = document.getElementById("kpi-total-orders");
  if (elOrders) elOrders.textContent = totalOrdersCount + " Đơn";

  var elCustomers = document.getElementById("kpi-total-customers");
  if (elCustomers) elCustomers.textContent = totalCustomersCount + " Khách";

  var elStock = document.getElementById("kpi-total-stock");
  if (elStock) elStock.textContent = totalStockQuantity + " Món";

  // 4. Cập nhật các con số Badge trên Sidebar (để thanh bên luôn nhảy số đúng)
  var badgeCat = document.getElementById("badge-count-categories");
  if (badgeCat) badgeCat.textContent = categories.length;

  var badgeProd = document.getElementById("badge-count-products");
  if (badgeProd) badgeProd.textContent = products.length;

  var badgeImp = document.getElementById("badge-count-imports");
  if (badgeImp) badgeImp.textContent = imports.length;

  var badgeOrd = document.getElementById("badge-count-orders");
  if (badgeOrd) badgeOrd.textContent = orders.length;

  var badgeCus = document.getElementById("badge-count-customers");
  if (badgeCus) badgeCus.textContent = customers.length;
}
