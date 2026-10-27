(function () {
  "use strict";

  /* ---------- 1. HẰNG SỐ & BIẾN TRẠNG THÁI ---------- */
  const STORAGE_ORDERS_KEY = "sport_orders";
  const STORAGE_USER_CARTS_KEY = "sport_carts_by_user";
  const STORAGE_CART_OWNER_KEY = "sport_cart_owner";
  const MAX_QTY = 10;

  const SHIP_FIELDS = ["fullName", "phone", "email", "address"];
  const CARD_FIELDS = ["cardNumber", "cardHolder", "cardExpiry", "cardCvv"];

  let cartItems = [];
  let savedAddress = null;
  let paymentMethod = "COD";

  const getById = (id) => document.getElementById(id);

  // Hàm đọc JSON cho các khóa LocalStorage ngoài giỏ hàng (user, address, orders)
  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  // Gộp các sản phẩm trùng ID + Size + Màu và giới hạn số lượng 1..MAX_QTY
  function normalizeCartList(list) {
    if (!Array.isArray(list)) return [];
    const merged = [];
    list.forEach((item) => {
      if (!item || item.id === undefined) return;
      const size = item.size || "Mặc định";
      const color = item.color || "Tiêu chuẩn";
      const qty = Math.min(MAX_QTY, Math.max(1, Number(item.quantity) || 1));

      const exist = merged.find(
        (m) => m.id === item.id && m.size === size && m.color === color,
      );
      if (exist) {
        exist.quantity = Math.min(MAX_QTY, exist.quantity + qty);
      } else {
        merged.push({
          ...item,
          size: size,
          color: color,
          quantity: qty,
        });
      }
    });
    return merged;
  }

  /* ---------- 2. ĐỒNG BỘ GIỎ HÀNG RIÊNG THEO TỪNG TÀI KHOẢN ---------- */
  function getCurrentUser() {
    if (window.SportAuth && typeof window.SportAuth.getCurrentUser === 'function') {
      return window.SportAuth.getCurrentUser();
    }
    return readJson('sportstore_auth_user', null);
  }

  function getUserKey(u) {
    if (!u) return "guest";
    return String(
      u.id || u.userId || u.email || u.username || u.phone || "guest",
    ).toLowerCase();
  }

  function syncUserCart() {
    const user = getCurrentUser();
    const currentKey = getUserKey(user);
    const lastOwner = localStorage.getItem(STORAGE_CART_OWNER_KEY);
    const cartsMap = readJson(STORAGE_USER_CARTS_KEY, {});
    const rawCart = normalizeCartList(getCart());

    // 1. Chưa đăng nhập: cất giỏ của chủ cũ (nếu sport_cart chưa bị xóa) rồi làm trống hiển thị
    if (!user) {
      if (lastOwner && lastOwner !== "guest" && rawCart.length > 0) {
        cartsMap[lastOwner] = rawCart;
        localStorage.setItem(STORAGE_USER_CARTS_KEY, JSON.stringify(cartsMap));
      }
      localStorage.setItem(STORAGE_CART_OWNER_KEY, "guest");
      saveCart([]);
      return [];
    }

    // 2. Vừa đăng nhập hoặc chuyển từ tài khoản A sang tài khoản B
    if (lastOwner !== currentKey) {
      const prevSaved = normalizeCartList(cartsMap[lastOwner] || []);
      const userSaved = normalizeCartList(cartsMap[currentKey] || []);

      // Kiểm tra xem sport_cart hiện tại có còn giữ nguyên giỏ của chủ cũ (lastOwner) không
      const isPrevCartIntact =
        prevSaved.length > 0 &&
        prevSaved.every((p) => {
          const found = rawCart.find(
            (r) => r.id === p.id && r.size === p.size && r.color === p.color,
          );
          return found && Number(found.quantity) >= Number(p.quantity);
        });

      rawCart.forEach((item) => {
        const inPrev = prevSaved.find(
          (p) =>
            p.id === item.id && p.size === item.size && p.color === item.color,
        );
        const itemQty = Number(item.quantity) || 1;
        // Nếu giỏ cũ vẫn còn trong sport_cart thì chỉ lấy phần chênh lệch mới thêm;
        // Nếu giỏ cũ đã được làm trống lúc đăng xuất thì toàn bộ rawCart là của tài khoản mới
        const addQty = !isPrevCartIntact
          ? itemQty
          : !inPrev
            ? itemQty
            : Math.max(0, itemQty - (Number(inPrev.quantity) || 0));

        if (addQty > 0) {
          const exist = userSaved.find(
            (u) =>
              u.id === item.id &&
              u.size === item.size &&
              u.color === item.color,
          );
          if (exist) {
            exist.quantity = Math.min(
              MAX_QTY,
              (Number(exist.quantity) || 1) + addQty,
            );
          } else {
            userSaved.push({
              ...item,
              quantity: Math.min(MAX_QTY, addQty),
            });
          }
        }
      });

      cartsMap[currentKey] = userSaved;
    } else {
      // Đang ở cùng 1 tài khoản: nếu sport_cart bị trang khác xóa rỗng lúc đăng xuất/đăng nhập lại thì khôi phục từ cartsMap
      const saved = normalizeCartList(cartsMap[currentKey] || []);
      cartsMap[currentKey] = rawCart.length > 0 ? rawCart : saved;
    }

    localStorage.setItem(STORAGE_USER_CARTS_KEY, JSON.stringify(cartsMap));
    localStorage.setItem(STORAGE_CART_OWNER_KEY, currentKey);
    saveCart(cartsMap[currentKey]);
    return cartsMap[currentKey];
  }

  function updateCartStorage() {
    const user = getCurrentUser();
    if (!user) return;
    const cartsMap = readJson(STORAGE_USER_CARTS_KEY, {});
    cartsMap[getUserKey(user)] = cartItems;
    localStorage.setItem(STORAGE_USER_CARTS_KEY, JSON.stringify(cartsMap));
    saveCart(cartItems);
  }

  /* ---------- 3. TÍNH TIỀN & HIỂN THỊ GIAO DIỆN ---------- */
  function getSubtotal() {
    return cartItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );
  }

  function render() {
    const user = getCurrentUser();
    const authEl = getById("d4Auth");
    const emptyEl = getById("d4Empty");
    const layoutEl = getById("d4Layout");
    const successEl = getById("d4Success");

    // 1. Chưa đăng nhập -> Hiện màn hình khóa yêu cầu đăng nhập
    if (!user) {
      authEl.hidden = false;
      emptyEl.hidden = true;
      layoutEl.hidden = true;
      successEl.hidden = true;
      return;
    }
    authEl.hidden = true;

    // 2. Nếu vừa đặt hàng xong -> Giữ màn hình xem lại đơn hàng
    if (!successEl.hidden) {
      emptyEl.hidden = true;
      layoutEl.hidden = true;
      return;
    }

    // 3. Đã đăng nhập -> Kiểm tra giỏ hàng
    const hasItems = cartItems.length > 0;
    emptyEl.hidden = hasItems;
    layoutEl.hidden = !hasItems;
    if (!hasItems) return;

    const totalCount = cartItems.reduce(
      (sum, i) => sum + Number(i.quantity),
      0,
    );
    getById("d4ItemCount").textContent = totalCount + " món";

    getById("d4Items").innerHTML = cartItems
      .map(
        (item, idx) => `
      <tr>
        <td data-label="Sản phẩm">
          <div class="d4-prod">
            <img src="${item.image}" alt="${item.name}" width="64" height="64">
            <div>
              <p class="d4-prod-name">${item.name}</p>
              <p class="d4-prod-variant">Size: ${item.size || "Mặc định"} | Màu: ${item.color || "Tiêu chuẩn"}</p>
            </div>
          </div>
        </td>
        <td data-label="Đơn giá">${formatMoney(item.price)}</td>
        <td data-label="Số lượng">
          <div class="d4-qty">
            <button type="button" data-action="dec" data-index="${idx}" ${item.quantity <= 1 ? "disabled" : ""}>−</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="inc" data-index="${idx}" ${item.quantity >= MAX_QTY ? "disabled" : ""}>+</button>
          </div>
        </td>
        <td data-label="Thành tiền" class="d4-line-total">${formatMoney(item.price * item.quantity)}</td>
        <td>
          <button type="button" class="d4-remove" data-action="remove" data-index="${idx}">✕</button>
        </td>
      </tr>`,
      )
      .join("");

    const total = getSubtotal();
    getById("d4Subtotal").textContent = formatMoney(total);
    getById("d4Total").textContent = formatMoney(total);
  }

  /* ---------- 4. ĐỊA CHỈ TỪ TÀI KHOẢN HOẶC NHẬP MỚI ---------- */
  function isAddressOfUser(addr, user) {
    if (!addr || typeof addr !== "object" || !user) return false;
    const uId = String(user.id || user.userId || "").toLowerCase();
    const aId = String(addr.userId || addr.id || "").toLowerCase();
    if (uId && aId) return uId === aId;

    const uEmail = String(user.email || "").toLowerCase();
    const aEmail = String(addr.email || "").toLowerCase();
    if (uEmail && aEmail) return uEmail === aEmail;

    const uPhone = String(user.phone || "");
    const aPhone = String(addr.phone || "");
    if (uPhone && aPhone) return uPhone === aPhone;

    return getUserKey(addr) === getUserKey(user);
  }

  function switchAddressMode(mode) {
    const isSaved = mode === "saved" && Boolean(savedAddress);
    getById("d4RadioSaved").checked = isSaved;
    getById("d4RadioNew").checked = !isSaved;
    getById("d4LblAddrSaved").classList.toggle("selected", isSaved);
    getById("d4LblAddrNew").classList.toggle("selected", !isSaved);

    getById("d4SavedBox").hidden = !isSaved;
    getById("d4Fields").hidden = isSaved;

    SHIP_FIELDS.forEach((id) => {
      getById(id).value = isSaved ? savedAddress[id] || "" : "";
      showError(id, "");
    });

    if (isSaved && savedAddress.province) {
      const provSelect = getById("province");
      const matchedOpt = Array.from(provSelect.options).find(
        (opt) =>
          opt.value === savedAddress.province ||
          opt.text === savedAddress.province,
      );
      if (matchedOpt) provSelect.value = matchedOpt.value;
    }
  }

  function loadSavedAddress() {
    const user = getCurrentUser();
    if (!user) return;

    const rawAddr = readJson(STORAGE_ADDR_KEY, null);
    let addrObj = {};

    if (Array.isArray(rawAddr)) {
      addrObj = rawAddr.find((a) => isAddressOfUser(a, user)) || {};
    } else if (rawAddr && typeof rawAddr === "object") {
      if (isAddressOfUser(rawAddr, user)) addrObj = rawAddr;
    }

    const merged = {
      ...user,
      ...addrObj,
      fullName: addrObj.fullName || user.fullName || user.name || "",
      email: addrObj.email || user.email || "",
      phone: addrObj.phone || user.phone || "",
      address: addrObj.address || user.address || "",
    };

    if (merged.fullName && merged.phone && merged.email && merged.address) {
      savedAddress = merged;
      getById("d4AddrMode").hidden = false;
      getById("d4SavedText").innerHTML = `
        <span class="d4-saved-badge">✓ Địa chỉ mặc định trong tài khoản</span><br>
        <strong>${merged.fullName} • ${merged.phone} • ${merged.email}</strong><br>
        🏠 ${merged.address}`;
      switchAddressMode("saved");
    } else {
      savedAddress = null;
      getById("d4AddrMode").hidden = true;
      switchAddressMode("new");
      if (merged.fullName) getById("fullName").value = merged.fullName;
      if (merged.phone) getById("phone").value = merged.phone;
      if (merged.email) getById("email").value = merged.email;
    }
  }

  /* ---------- 5. KIỂM TRA FORM & XỬ LÝ ĐẶT HÀNG ---------- */
  function validateField(id) {
    const val = getById(id).value.trim();
    if (id === "fullName" && (val.length < 2 || /\d/.test(val)))
      return "Nhập họ tên hợp lệ (không chứa số).";
    if (id === "phone" && !/^0\d{9}$/.test(val))
      return "SĐT gồm 10 chữ số, bắt đầu bằng 0.";
    if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      return "Email chưa đúng định dạng.";
    if (id === "address" && val.length < 5)
      return "Vui lòng nhập địa chỉ chi tiết.";
    if (id === "cardNumber" && !/^\d{12,19}$/.test(val.replace(/\s+/g, "")))
      return "Số thẻ gồm 12-19 chữ số.";
    if (id === "cardHolder" && (val.length < 3 || /\d/.test(val)))
      return "Vui lòng nhập tên chủ thẻ hợp lệ (không chứa số).";
    if (id === "cardExpiry" && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(val))
      return "Nhập đúng dạng MM/YY (VD: 08/28).";
    if (id === "cardCvv" && !/^\d{3,6}$/.test(val))
      return "Mã CVV gồm 3-6 chữ số.";
    return "";
  }

  function showError(id, msg) {
    const errEl = getById("err-" + id);
    const inputEl = getById(id);
    if (errEl && inputEl) {
      errEl.textContent = msg;
      inputEl.classList.toggle("invalid", Boolean(msg));
    }
  }

  function handleOrderSubmit(e) {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) {
      showToast("Vui lòng đăng nhập để đặt hàng!", "danger");
      render();
      return;
    }
    if (!cartItems.length) return;

    let hasShipError = false;
    let hasCardError = false;

    SHIP_FIELDS.forEach((id) => {
      const msg = validateField(id);
      showError(id, msg);
      if (msg) hasShipError = true;
    });

    if (paymentMethod === "ONLINE") {
      CARD_FIELDS.forEach((id) => {
        const msg = validateField(id);
        showError(id, msg);
        if (msg) hasCardError = true;
      });
    }

    if (hasShipError || hasCardError) {
      if (hasShipError) {
        getById("d4RadioSaved").checked = false;
        getById("d4RadioNew").checked = true;
        getById("d4LblAddrSaved").classList.remove("selected");
        getById("d4LblAddrNew").classList.add("selected");
        getById("d4Fields").hidden = false;
        getById("d4SavedBox").hidden = true;
      }
      showToast("Vui lòng kiểm tra lại thông tin nhập liệu!", "danger");
      return;
    }

    const total = getSubtotal();
    const orders = readJson(STORAGE_ORDERS_KEY, []);
    const maxId = orders.reduce((max, o) => {
      const num = parseInt(String(o?.id || "").replace(/\D/g, ""), 10) || 0;
      return Math.max(max, num);
    }, 0);

    const newOrder = {
      id: "DH-" + String(maxId + 1).padStart(4, "0"),
      userId:
        user.id || user.userId || user.email || user.username || user.phone,
      createdAt: new Date().toISOString(),
      status: "pending",
      items: [...cartItems],
      subtotal: total,
      discount: 0,
      shippingFee: 0,
      total: total,
      paymentMethod: paymentMethod,
      customer: {
        fullName: getById("fullName").value.trim(),
        phone: getById("phone").value.trim(),
        email: getById("email").value.trim(),
        province: getById("province").selectedOptions[0].text,
        address: getById("address").value.trim(),
        note: getById("note").value.trim(),
      },
    };

    orders.push(newOrder);
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));

    // Xóa giỏ hàng sau khi mua & hiển thị màn hình Xem lại đơn hàng
    cartItems = [];
    updateCartStorage();
    showToast("Đặt hàng thành công!", "success");

    getById("d4Empty").hidden = true;
    getById("d4Layout").hidden = true;
    getById("d4Success").hidden = false;
    getById("d4OrderCode").textContent = newOrder.id;
    getById("d4OrderTotal").textContent = formatMoney(newOrder.total);
    getById("d4OrderNote").textContent = newOrder.customer.note
      ? "Ghi chú giao hàng: " + newOrder.customer.note
      : "";

    getById("d4OrderReview").innerHTML = `
      <h3>📋 Chi tiết đơn đặt hàng vừa mua</h3>
      <div class="d4-review-info">
        <strong>Người nhận:</strong> ${newOrder.customer.fullName} • <strong>SĐT:</strong> ${newOrder.customer.phone}<br>
        <strong>Địa chỉ:</strong> ${newOrder.customer.address}, ${newOrder.customer.province}<br>
        <strong>Thanh toán:</strong> ${newOrder.paymentMethod}
      </div>
      <div class="d4-review-items">
        ${newOrder.items
          .map(
            (i) => `
          <div class="d4-review-item">
            <div class="d4-review-item-left">
              <img src="${i.image}" alt="${i.name}">
              <div>
                <strong>${i.name}</strong><br>
                <small>Size: ${i.size || "Mặc định"} • SL: ${i.quantity} ×${formatMoney(i.price)}</small>
              </div>
            </div>
            <strong>${formatMoney(i.price * i.quantity)}</strong>
          </div>`,
          )
          .join("")}
      </div>
      <div class="d4-review-totals">
        <div class="d4-review-row"><span>Tạm tính:</span><strong>${formatMoney(newOrder.subtotal)}</strong></div>
        <div class="d4-review-row"><span>Phí vận chuyển:</span><strong>Miễn phí</strong></div>
        <div class="d4-review-row grand"><span>Tổng thanh toán:</span><strong>${formatMoney(newOrder.total)}</strong></div>
      </div>`;
  }

  /* ---------- 6. GẮN SỰ KIỆN & KHỞI CHẠY ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    cartItems = syncUserCart();
    loadSavedAddress();
    render();

    if (!getCurrentUser()) {
      showToast("Vui lòng đăng nhập để sử dụng giỏ hàng!", "danger");
    }

    // Tăng, giảm, xóa sản phẩm trong giỏ
    getById("d4Items").addEventListener("click", function (e) {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const idx = Number(btn.dataset.index);
      const act = btn.dataset.action;

      if (act === "inc" && cartItems[idx].quantity < MAX_QTY)
        cartItems[idx].quantity++;
      else if (act === "dec" && cartItems[idx].quantity > 1)
        cartItems[idx].quantity--;
      else if (act === "remove") {
        cartItems.splice(idx, 1);
        showToast("Đã xóa sản phẩm khỏi giỏ hàng!", "info");
      }

      updateCartStorage();
      render();
    });

    // Đổi phương thức thanh toán
    getById("d4PayList").addEventListener("change", function (e) {
      paymentMethod = e.target.value;
      getById("d4QrBox").hidden = paymentMethod !== "QR";
      getById("d4OnlineBox").hidden = paymentMethod !== "ONLINE";
      document.querySelectorAll(".d4-pay-option").forEach((lbl) => {
        lbl.classList.toggle("selected", lbl.querySelector("input").checked);
      });
    });

    // Đổi chế độ địa chỉ (Từ tài khoản / Nhập mới)
    getById("d4AddrMode").addEventListener("change", (e) =>
      switchAddressMode(e.target.value),
    );
    getById("d4EditAddr").addEventListener("click", () =>
      switchAddressMode("new"),
    );

    // Xóa lỗi đỏ khi gõ sửa lại và xử lý nút Đặt hàng
    getById("d4Form").addEventListener("input", (e) => {
      if (e.target.id) showError(e.target.id, "");
    });
    getById("d4OnlineBox").addEventListener("input", (e) => {
      if (e.target.id) showError(e.target.id, "");
    });
    getById("d4Form").addEventListener("submit", handleOrderSubmit);
  });
})();
