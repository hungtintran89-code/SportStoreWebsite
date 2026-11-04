// 3. TAB 1: BẢNG ĐIỀU KHIỂN & DOANH THU (DASHBOARD)
function hienThiDashboardAdmin() {
  var dsDon = layDuLieuAdmin("sport_orders");
  var dsKhach = layDuLieuAdmin("sport_customers");
  var dsSp = layDuLieuAdmin("sport_products");

  var tongDoanhThu = 0;
  for (var i = 0; i < dsDon.length; i++) {
    if (dsDon[i].status !== "Đã hủy") {
      tongDoanhThu = tongDoanhThu + Number(dsDon[i].total || 0);
    }
  }

  var tongTonKho = 0;
  for (var j = 0; j < dsSp.length; j++) {
    tongTonKho = tongTonKho + Number(dsSp[j].stock || 0);
  }

  if (document.getElementById("kpi-total-revenue")) document.getElementById("kpi-total-revenue").textContent = formatMoney(tongDoanhThu);
  if (document.getElementById("kpi-total-orders")) document.getElementById("kpi-total-orders").textContent = dsDon.length + " Đơn";
  if (document.getElementById("kpi-total-customers")) document.getElementById("kpi-total-customers").textContent = dsKhach.length + " Khách";
  if (document.getElementById("kpi-total-stock")) document.getElementById("kpi-total-stock").textContent = tongTonKho + " Món";

  // Hiển thị 4 đơn hàng mới nhất
  var khungDonGanDay = document.getElementById("dashboard-recent-orders-list");
  if (khungDonGanDay) {
    var html = "";
    var soLuong = dsDon.length > 4 ? 4 : dsDon.length;
    for (var k = dsDon.length - 1; k >= dsDon.length - soLuong; k--) {
      var d = dsDon[k];
      var ten = (d.customer && d.customer.name) ? d.customer.name : (d.fullName || d.customer || "Khách hàng");
      var ngay = d.date || (d.createdAt ? d.createdAt.split("T")[0] : "Hôm nay");
      html += `
        <div class="dash-recent-order-row">
          <div>
            <strong>#${d.orderId || d.id}</strong> - ${ten}
            <div class="dash-recent-order-meta">${ngay} | ${d.paymentMethod || "Tiền mặt"}</div>
          </div>
          <div class="dash-recent-order-right">
            <div class="dash-recent-order-price">${formatMoney(d.total)}</div>
            <span class="nav-badge badge-blue">${d.status || "Mới đặt"}</span>
          </div>
        </div>
      `;
    }
    if (dsDon.length === 0) html = "<p class='dash-recent-empty'>Chưa có đơn hàng nào.</p>";
    khungDonGanDay.innerHTML = html;
  }
}

