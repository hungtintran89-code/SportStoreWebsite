// ===================================================
// HỆ THỐNG ĐIỀU HƯỚNG CHUYỂN TAB TRANG ADMIN
// ===================================================

// 1. Thu thập tất cả các nút bấm menu bên trái và các tab nội dung bên phải
const sidebarNavButtons = document.querySelectorAll(".left .nav-item");
const contentTabPanes = document.querySelectorAll(".right .tab-pane");

// 2. Dùng vòng lặp duyệt qua từng nút bấm để gán sự kiện click
sidebarNavButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // Bước 2.1: Lấy tên ID của tab cần mở từ thuộc tính 'data-tab' của nút vừa bấm
    const targetTabId = this.getAttribute("data-tab");

    // Nếu nút không có data-tab thì không làm gì cả
    if (!targetTabId) return;

    // Bước 2.2: Xóa class 'active' khỏi TẤT CẢ các nút menu bên trái
    sidebarNavButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    // Bước 2.3: Thêm class 'active' vào DUY NHẤT nút vừa được click (để sáng nút)
    this.classList.add("active");

    // Bước 2.4: Ẩn TẤT CẢ các khối nội dung bên phải (bằng cách xóa class active)
    contentTabPanes.forEach((btn) => {
      btn.classList.remove("active");
    });

    // Bước 2.5: Tìm đúng thẻ tab cần hiện theo ID và kích hoạt nó
    const activeContent = document.getElementById(targetTabId);
    if (activeContent) {
      activeContent.classList.add("active");
    }
    // Bước 2.6 (Tùy chọn): Lưu lại tab đang xem vào sessionStorage
    // Để khi người dùng lỡ tay bấm F5 vẫn giữ nguyên tab đang xem mà không bị văng ra tab đầu!
    sessionStorage.setItem("current_admin_tab", targetTabId);
  });
});

const savedTabId = sessionStorage.getItem("current_admin_tab");
if (savedTabId) {
  const savedButton = document.querySelector(
    `.left .nav-item[data-tab="${savedTabId}"]`,
  );
  if (savedButton) {
    savedButton.click(); // Giả lập hành vi bấm chuột vào nút đó
  }
}
