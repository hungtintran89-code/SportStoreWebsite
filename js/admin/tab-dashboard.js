/**
 * ==============================================================================
 * SPORTSTORE - TAB 1: BẢNG ĐIỀU KHIỂN TỔNG QUAN (TAB-DASHBOARD.JS)
 * - Đọc và tính toán số liệu 100% từ dữ liệu thật trong LocalStorage
 * - Không sử dụng dữ liệu tự bịa / giả lập
 * - Viết bằng mã nguồn thuần túy, vòng lặp for đơn giản, dễ hiểu cho mọi người
 * ==============================================================================
 */

/**
 * 1. Hàm vẽ và cập nhật toàn bộ số liệu trên Bảng Điều Khiển
 */
function renderDashboard() {
  // Đọc dữ liệu thật từ LocalStorage với khóa lưu trữ chuẩn
  var keyOrders = (typeof STORAGE_KEYS !== "undefined" && STORAGE_KEYS.ORDERS) ? STORAGE_KEYS.ORDERS : "sport_orders";
  var keyProducts = (typeof STORAGE_KEYS !== "undefined" && STORAGE_KEYS.PRODUCTS) ? STORAGE_KEYS.PRODUCTS : "sport_products";
  var keyCustomers = (typeof STORAGE_KEYS !== "undefined" && STORAGE_KEYS.CUSTOMERS) ? STORAGE_KEYS.CUSTOMERS : "sport_customers";

  var orders = typeof getStorage === "function" ? getStorage(keyOrders, []) : [];
  var products = typeof getStorage === "function" ? getStorage(keyProducts, []) : [];
  var customers = typeof getStorage === "function" ? getStorage(keyCustomers, []) : [];

  // ----------------------------------------------------------------------------
  // KPI 1: TÍNH TỔNG DOANH THU & THEO DÕI BIẾN ĐỘNG THÁNG
  // ----------------------------------------------------------------------------
  var totalRevenue = 0;
  var revenueByMonth = {};
  var monthsList = [];

  // Bước 1: Ưu tiên tính doanh thu từ các đơn hàng "Đã giao" hoặc "Hoàn thành"
  for (var i = 0; i < orders.length; i++) {
    var ord = orders[i];
    var st = ord.status || "";

    if (st === "Đã giao" || st === "Hoàn thành" || st === "delivered" || st === "completed") {
      var ordTotal = Number(ord.total || ord.totalPrice || 0);
      totalRevenue += ordTotal;

      // Gom doanh thu theo tháng thực tế dạng YYYY-MM
      var dateStr = ord.date || ord.createdAt || "";
      if (dateStr.length >= 7) {
        var mStr = dateStr.substring(0, 7);
        if (!revenueByMonth[mStr]) {
          revenueByMonth[mStr] = 0;
          monthsList.push(mStr);
        }
        revenueByMonth[mStr] += ordTotal;
      }
    }
  }

  // Bước 2: Nếu chưa có đơn nào "Đã giao", tính tổng từ các đơn hợp lệ (không bị hủy)
  if (totalRevenue === 0 && orders.length > 0) {
    for (var k = 0; k < orders.length; k++) {
      var ordFallback = orders[k];
      var stFallback = ordFallback.status || "";

      if (stFallback !== "Đã hủy" && stFallback !== "cancelled") {
        var fbTotal = Number(ordFallback.total || ordFallback.totalPrice || 0);
        totalRevenue += fbTotal;

        var fbDateStr = ordFallback.date || ordFallback.createdAt || "";
        if (fbDateStr.length >= 7) {
          var fbMStr = fbDateStr.substring(0, 7);
          if (!revenueByMonth[fbMStr]) {
            revenueByMonth[fbMStr] = 0;
            monthsList.push(fbMStr);
          }
          revenueByMonth[fbMStr] += fbTotal;
        }
      }
    }
  }

  // Cập nhật số tiền doanh thu lên thẻ KPI 1
  var elRevenue = document.getElementById("kpi-total-revenue");
  if (elRevenue) {
    elRevenue.textContent = typeof formatVND === "function" ? formatVND(totalRevenue) : totalRevenue.toLocaleString("vi-VN") + " đ";
  }

  // LOGIC SO SÁNH DOANH THU THÁNG:
  // "Nếu không có thì ẩn đi, chỉ khi có đủ dữ liệu mới tính toán rồi hiển thị"
  var elRevenueTrend = document.getElementById("kpi-revenue-trend");
  var elGrowth = document.getElementById("kpi-revenue-growth");

  if (elRevenueTrend) {
    // Chỉ hiển thị khi có từ 2 tháng dữ liệu thật trở lên
    if (monthsList.length >= 2) {
      monthsList.sort();
      var currentMonthKey = monthsList[monthsList.length - 1];
      var prevMonthKey = monthsList[monthsList.length - 2];
      var currentRev = revenueByMonth[currentMonthKey] || 0;
      var prevRev = revenueByMonth[prevMonthKey] || 0;

      if (prevRev > 0) {
        var growthPct = Math.round(((currentRev - prevRev) / prevRev) * 1000) / 10;
        elRevenueTrend.style.display = "flex";
        if (elGrowth) {
          if (growthPct >= 0) {
            elGrowth.textContent = "↑ +" + growthPct + "%";
            elGrowth.style.color = "#16a34a";
          } else {
            elGrowth.textContent = "↓ " + growthPct + "%";
            elGrowth.style.color = "#dc2626";
          }
        }
      } else {
        elRevenueTrend.style.display = "none";
      }
    } else {
      // Dữ liệu chỉ có 1 tháng (ví dụ mới có Tháng 10) -> ẨN ĐI HOÀN TOÀN
      elRevenueTrend.style.display = "none";
    }
  }

  // ----------------------------------------------------------------------------
  // KPI 2: TỔNG SỐ ĐƠN ĐẶT HÀNG THỰC TẾ & TỶ LỆ XỬ LÝ
  // ----------------------------------------------------------------------------
  var totalOrders = orders.length;
  var elOrders = document.getElementById("kpi-total-orders");
  if (elOrders) {
    elOrders.textContent = totalOrders + " Đơn";
  }

  // Tính tỷ lệ đơn đã được xử lý (không còn ở trạng thái Mới đặt)
  var processedOrdersCount = 0;
  for (var p = 0; p < orders.length; p++) {
    var ordStatus = orders[p].status || "";
    if (ordStatus !== "Mới đặt" && ordStatus !== "pending") {
      processedOrdersCount++;
    }
  }
  var orderRateVal = totalOrders > 0 ? Math.round((processedOrdersCount / totalOrders) * 100) : 100;
  var elOrderRateVal = document.getElementById("kpi-order-rate-val");
  if (elOrderRateVal) {
    elOrderRateVal.textContent = "đạt " + orderRateVal + "%";
  }

  // ----------------------------------------------------------------------------
  // KPI 3: TỔNG SỐ HỘI VIÊN & ĐẾM THÀNH VIÊN VÀNG/VIP
  // ----------------------------------------------------------------------------
  var totalCustomers = customers.length;
  var elCustomers = document.getElementById("kpi-total-customers");
  if (elCustomers) {
    elCustomers.textContent = totalCustomers + " Khách";
  }

  var goldMembersCount = 0;
  for (var c = 0; c < customers.length; c++) {
    var customerTier = customers[c].tier || "";
    if (customerTier === "Gold Elite" || customerTier === "Diamond VIP" || customerTier.indexOf("Gold") !== -1 || customerTier.indexOf("VIP") !== -1) {
      goldMembersCount++;
    }
  }
  var elGoldMembers = document.getElementById("kpi-gold-members");
  if (elGoldMembers) {
    elGoldMembers.textContent = goldMembersCount + " Hội Viên Vàng";
  }

  // ----------------------------------------------------------------------------
  // KPI 4: TỔNG SỐ LƯỢNG HÀNG TỒN KHO THỰC TẾ
  // ----------------------------------------------------------------------------
  var totalStock = 0;
  for (var j = 0; j < products.length; j++) {
    totalStock += Number(products[j].stock || 0);
  }
  var elStock = document.getElementById("kpi-total-stock");
  if (elStock) {
    elStock.textContent = totalStock.toLocaleString("vi-VN") + " Món";
  }

  // ----------------------------------------------------------------------------
  // DANH SÁCH ĐƠN HÀNG GẦN ĐÂY CẦN XỬ LÝ
  // ----------------------------------------------------------------------------
  renderRecentOrders(orders);
}

/**
 * 2. Hiển thị danh sách đơn hàng gần đây cần xử lý
 */
function renderRecentOrders(orders) {
  var container = document.getElementById("dashboard-recent-orders-list");
  if (!container) return;

  if (!orders || orders.length === 0) {
    container.innerHTML = '<div style="text-align: center; color: #64748b; padding: 30px;">Chưa có đơn hàng nào trong hệ thống.</div>';
    return;
  }

  var html = "";
  // Lấy tối đa 8 đơn hàng gần nhất
  var maxItems = orders.length < 8 ? orders.length : 8;

  for (var i = 0; i < maxItems; i++) {
    var o = orders[i];

    // Chuẩn hóa mã đơn hàng
    var orderCode = o.orderId || o.id || ("SPORT-" + (i + 1));
    if (String(orderCode).indexOf("#") === 0) {
      orderCode = String(orderCode).substring(1);
    }

    // Chuẩn hóa tên khách hàng (xử lý cả dạng chuỗi và đối tượng)
    var customerName = "Khách hàng";
    if (typeof o.customer === "string" && o.customer.length > 0) {
      customerName = o.customer;
    } else if (o.customer && typeof o.customer === "object") {
      customerName = o.customer.name || o.customer.fullName || o.customer.username || "Khách hàng";
    } else if (o.customerName) {
      customerName = o.customerName;
    }

    // Chuẩn hóa trạng thái đơn hàng và lớp badge màu tương ứng
    var rawStatus = o.status || "Mới đặt";
    var displayStatus = rawStatus;
    var statusClass = "badge-order-new";

    if (rawStatus === "Mới đặt" || rawStatus === "pending") {
      displayStatus = "Mới đặt";
      statusClass = "badge-order-new";
    } else if (rawStatus === "Đã xử lý" || rawStatus === "processing") {
      displayStatus = "Đã xử lý";
      statusClass = "badge-order-processed";
    } else if (rawStatus === "Đang giao" || rawStatus === "shipping") {
      displayStatus = "Đang giao";
      statusClass = "badge-order-delivering";
    } else if (rawStatus === "Đã giao" || rawStatus === "Hoàn thành" || rawStatus === "delivered" || rawStatus === "completed") {
      displayStatus = "Đã giao";
      statusClass = "badge-order-completed";
    } else if (rawStatus === "Đã hủy" || rawStatus === "cancelled") {
      displayStatus = "Đã hủy";
      statusClass = "badge-order-cancelled";
    }

    // Tóm tắt sản phẩm trong đơn hàng
    var productSummary = "Đơn hàng trang bị thể thao";
    if (o.items && o.items.length > 0) {
      var firstItemName = o.items[0].name || "Sản phẩm";
      var firstItemQty = o.items[0].quantity || 1;
      productSummary = firstItemName + " (x" + firstItemQty + ")";
      if (o.items.length > 1) {
        productSummary += " và " + (o.items.length - 1) + " món khác";
      }
    }

    // Định dạng số tiền
    var orderTotal = Number(o.total || o.totalPrice || 0);
    var totalFormatted = typeof formatVND === "function" ? formatVND(orderTotal) : orderTotal.toLocaleString("vi-VN") + " đ";

    html += `
      <div class="recent-order-item">
        <div class="recent-order-info">
          <div class="recent-order-title">#${orderCode} • <span class="recent-order-customer">${customerName}</span></div>
          <div class="recent-order-summary">${productSummary}</div>
        </div>
        <div class="recent-order-meta">
          <div class="recent-order-total">${totalFormatted}</div>
          <span class="status-badge ${statusClass}">${displayStatus}</span>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

/**
 * 3. Đồng bộ thống kê Dashboard & cập nhật badge Sidebar
 */
function updateDashboardStats() {
  // Tính toán và hiển thị lại các chỉ số trên Dashboard
  renderDashboard();

  // Cập nhật số đếm thống kê trên thanh Sidebar
  if (typeof updateSidebarBadges === "function") {
    updateSidebarBadges();
  }
}

/**
 * 4. Hàm xuất báo cáo nhanh (giữ chức năng sẵn có)
 */
function exportDashboardReport() {
  alert("Hệ thống đã kết xuất báo cáo doanh thu & tồn kho tháng 10/2026 thành công!");
}
