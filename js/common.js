/**
 * ==========================================================================
 * SPORTSTORE - CÁC HÀM TIỆN ÍCH DÙNG CHUNG (COMMON.JS)
 * Dành cho toàn bộ 5 thành viên sử dụng chung.
 * Viết bằng JavaScript thuần (Vanilla JS), đơn giản, rõ nghĩa, đọc là hiểu ngay!
 * ==========================================================================
 */

// Tên khóa lưu trữ trong LocalStorage
const STORAGE_CART_KEY = 'sport_cart';       // Khóa lưu giỏ hàng
const STORAGE_USER_KEY = 'sport_user';       // Khóa lưu thông tin đăng nhập
const STORAGE_ADDR_KEY = 'sport_address';    // Khóa lưu sổ địa chỉ nhận hàng

/**
 * 1. HÀM ĐỊNH DẠNG TIỀN TỆ (VND)
 * Nhận vào: Một con số (ví dụ: 1500000)
 * Trả về: Chuỗi tiền tệ dễ nhìn (ví dụ: "1.500.000 ₫")
 * Cách dùng: formatMoney(1500000);
 */
function formatMoney(amount) {
  if (!amount || isNaN(amount)) return '0 ₫';
  return Number(amount).toLocaleString('vi-VN') + ' ₫';
}

/**
 * 2. HÀM LẤY DANH SÁCH GIỎ HÀNG TỪ LOCALSTORAGE
 * Trả về: Mảng các sản phẩm trong giỏ hàng (nếu chưa có thì trả về mảng rỗng [])
 * Cách dùng: const cart = getCart();
 */
function getCart() {
  try {
    const data = localStorage.getItem(STORAGE_CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Lỗi khi đọc giỏ hàng:', error);
    return [];
  }
}

/**
 * 3. HÀM LƯU DANH SÁCH GIỎ HÀNG VÀO LOCALSTORAGE
 * Nhận vào: Mảng giỏ hàng mới
 * Tự động: Lưu vào máy và cập nhật số lượng hiển thị trên Header
 * Cách dùng: saveCart(newCart);
 */
function saveCart(cartArray) {
  try {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartArray));
    updateCartBadge(); // Cập nhật ngay số lượng trên nút giỏ hàng
  } catch (error) {
    console.error('Lỗi khi lưu giỏ hàng:', error);
  }
}

/**
 * 4. HÀM THÊM SẢN PHẨM VÀO GIỎ HÀNG (DÙNG CHO DEV 1, DEV 2, DEV 3)
 * Nhận vào: Đối tượng sản phẩm { id, name, price, image, size, color }
 * Cách dùng:
 * addToCart({ id: 101, name: "Giày Nike Vaporfly", price: 3840000, image: "anh.jpg", size: 42 });
 */
function addToCart(product, quantityToAdd = 1) {
  const cart = getCart();

  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa (cùng ID và cùng Size)
  const existingItem = cart.find(item => 
    item.id === product.id && item.size === product.size
  );

  if (existingItem) {
    // Nếu đã có thì tăng số lượng lên
    existingItem.quantity += quantityToAdd;
  } else {
    // Nếu chưa có thì thêm mới vào mảng
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      size: product.size || 'Mặc định',
      color: product.color || 'Tiêu chuẩn',
      quantity: quantityToAdd
    });
  }

  // Lưu lại vào LocalStorage
  saveCart(cart);

  // Hiển thị thông báo nhỏ thành công góc màn hình
  showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
}

/**
 * 5. HÀM CẬP NHẬT SỐ LƯỢNG TRÊN ICON GIỎ HÀNG Ở HEADER
 * Tự động đếm tổng số lượng sản phẩm trong giỏ và hiển thị vào thẻ có class .cart-badge
 */
function updateCartBadge() {
  const cart = getCart();
  // Tính tổng số lượng tất cả món hàng
  let totalCount = 0;
  for (let i = 0; i < cart.length; i++) {
    totalCount += Number(cart[i].quantity) || 1;
  }

  // Tìm tất cả các thẻ hiển thị số lượng giỏ hàng trên trang
  const badgeElements = document.querySelectorAll('.cart-badge, #cartBadge');
  badgeElements.forEach(badge => {
    badge.textContent = totalCount;
    // Nếu giỏ hàng có đồ thì hiện nổi bật
    if (totalCount > 0) {
      badge.style.display = 'inline-block';
    }
  });
}

/**
 * 6. HÀM HIỂN THỊ THÔNG BÁO NHẸ GÓC MÀN HÌNH (TOAST NOTIFICATION)
 * Nhận vào: 
 *   - message: Nội dung thông báo (ví dụ: "Áp mã giảm giá thành công!")
 *   - type: Loại thông báo ('success' màu xanh lá, 'danger' màu đỏ, mặc định màu xanh dương)
 * Cách dùng: showToast("Chào mừng bạn!", "success");
 */
function showToast(message, type = 'info') {
  // Tìm hoặc tạo khung chứa thông báo nếu chưa có
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  // Tạo thẻ thông báo
  const toast = document.createElement('div');
  toast.className = `toast-message toast-${type}`;

  // Chọn biểu tượng theo loại
  let icon = '🔔';
  if (type === 'success') icon = '✅';
  if (type === 'danger') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Tự động biến mất sau 3 giây
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * 7. TỰ ĐỘNG CHẠY KHI TRANG WEB VỪA TẢI XONG
 * - Cập nhật số lượng giỏ hàng
 * - Tự động sáng đèn menu trang hiện tại
 */
document.addEventListener('DOMContentLoaded', function () {
  // 1. Cập nhật số lượng giỏ hàng ngay khi mở bất kỳ trang nào
  updateCartBadge();

  // 2. Tự động kiểm tra URL để sáng đèn menu active
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace('../', '').replace('pages/', ''))) {
      link.classList.add('active');
    }
  });
});
