/* =========================================================
   SportStore - js/dev4_checkout.js (Dev 4: Giỏ hàng & Thanh toán)
   Dùng chung từ common.js: readJson, getCurrentUser, getCart, saveCart,
   formatMoney, showToast, STORAGE_ADDR_KEY
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. HẰNG SỐ & BIẾN TRẠNG THÁI ---------- */
  const STORAGE_ORDERS_KEY = "sport_orders";
  const STORAGE_PRODUCTS_KEY = "sport_products";
  const MAX_QTY = 10;

  const SHIP_FIELDS = ["fullName", "phone", "email", "address"];
  const CARD_FIELDS = ["cardNumber", "cardHolder", "cardExpiry", "cardCvv"];

  let cartItems = [];
  let savedAddress = null;
  let paymentMethod = "COD";

  const getById = (id) => document.getElementById(id);

  /* ---------- 2. KIỂM TRA & TRỪ TỒN KHO ---------- */
  function getItemMaxLimit(item) {
    const products = readJson(STORAGE_PRODUCTS_KEY, []);
    const prod = Array.isArray(products)
      ? products.find((p) => p && String(p.id) === String(item.id))
      : null;

    if (prod && prod.stock !== undefined && Number(prod.stock) >= 0) {
      return Math.min(MAX_QTY, Number(prod.stock));
    }
    if (item && item.stock !== undefined && Number(item.stock) >= 0) {
      return Math.min(MAX_QTY, Number(item.stock));
    }
    return MAX_QTY;
  }

  function deductProductStock(orderedItems) {
    const list = readJson(STORAGE_PRODUCTS_KEY, null);
    if (!Array.isArray(list)) return;
    let changed = false;

    orderedItems.forEach((ordered) => {
      const prod = list.find((p) => p && String(p.id) === String(ordered.id));
      if (prod && prod.stock !== undefined) {
        prod.stock = Math.max(0, Number(prod.stock) - Number(ordered.quantity));
        changed = true;
      }
    });

    if (changed) {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(list));
    }
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

    if (!user) {
      authEl.hidden = false;
      emptyEl.hidden = true;
      layoutEl.hidden = true;
      successEl.hidden = true;
      return;
    }
    authEl.hidden = true;

    if (!successEl.hidden) {
      emptyEl.hidden = true;
      layoutEl.hidden = true;
      return;
    }

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
      .map((item, idx) => {
        const maxLimit = getItemMaxLimit(item);
        return `
      <tr>
        <td data-label="Sản phẩm">
          <div class="d4-prod">
            <img src="${item.image}" alt="${item.name}" width="64" height="64">
            <div>
              <p class="d4-prod-name">${item.name}</p>
              <p class="d4-prod-variant">
                Size: ${item.size || "Mặc định"} | Màu: ${item.color || "Tiêu chuẩn"}
              </p>
            </div>
          </div>
        </td>
        <td data-label="Đơn giá">${formatMoney(item.price)}</td>
        <td data-label="Số lượng">
          <div class="d4-qty">
            <button type="button" data-action="dec" data-index="${idx}" ${item.quantity <= 1 ? "disabled" : ""}>−</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="inc" data-index="${idx}" ${item.quantity >= maxLimit ? "disabled" : ""}>+</button>
          </div>
        </td>
        <td data-label="Thành tiền" class="d4-line-total">${formatMoney(item.price * item.quantity)}</td>
        <td>
          <button type="button" class="d4-remove" data-action="remove" data-index="${idx}">✕</button>
        </td>
      </tr>`;
      })
      .join("");

    const total = getSubtotal();
    getById("d4Subtotal").textContent = formatMoney(total);
    getById("d4Total").textContent = formatMoney(total);
  }

  /* ---------- 4. ĐỊA CHỈ TỪ TÀI KHOẢN HOẶC NHẬP MỚI ---------- */
  function isAddressOfUser(addr, user) {
    const cId = user && (user.customerId || user.id);
    const aId = addr && (addr.customerId || addr.userId);
    if (!addr || !user || !cId || !aId) return false;
    return String(aId) === String(cId);
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
    }

    const merged = {
      ...user,
      ...addrObj,
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
    if (id === "fullName" && (val.length < 2 || /\d/.test(val))) {
      return "Nhập họ tên hợp lệ (không chứa số).";
    }
    if (id === "phone" && !/^0\d{9}$/.test(val)) {
      return "SĐT gồm 10 chữ số, bắt đầu bằng 0.";
    }
    if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      return "Email chưa đúng định dạng.";
    }
    if (id === "address" && val.length < 5) {
      return "Vui lòng nhập địa chỉ chi tiết.";
    }
    if (id === "cardNumber" && !/^\d{12,19}$/.test(val.replace(/\s+/g, ""))) {
      return "Số thẻ gồm 12-19 chữ số.";
    }
    if (id === "cardHolder" && (val.length < 3 || /\d/.test(val))) {
      return "Vui lòng nhập tên chủ thẻ hợp lệ (không chứa số).";
    }
    if (id === "cardExpiry" && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(val)) {
      return "Nhập đúng dạng MM/YY (VD: 08/28).";
    }
    if (id === "cardCvv" && !/^\d{3,6}$/.test(val)) {
      return "Mã CVV gồm 3-6 chữ số.";
    }
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

    for (const item of cartItems) {
      const maxLimit = getItemMaxLimit(item);
      if (maxLimit <= 0) {
        showToast(`Sản phẩm "${item.name}" hiện đã hết hàng!`, "danger");
        return;
      }
      if (item.quantity > maxLimit) {
        item.quantity = maxLimit;
        saveCart(cartItems);
        render();
        showToast(
          `Sản phẩm "${item.name}" chỉ còn tối đa ${maxLimit} món trong kho!`,
          "danger",
        );
        return;
      }
    }

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
    const storedOrders = readJson(STORAGE_ORDERS_KEY, []);
    const orders = Array.isArray(storedOrders) ? storedOrders : [];
    const maxId = orders.reduce((max, o) => {
      const num =
        parseInt(String(o && o.id ? o.id : "").replace(/\D/g, ""), 10) || 0;
      return Math.max(max, num);
    }, 0);

    const custIdentifier = (user && (user.customerId || user.id)) || "KHACH-VANG-LAI";
    const newOrder = {
      orderId: "DH-" + String(maxId + 1).padStart(4, "0"),
      id: "DH-" + String(maxId + 1).padStart(4, "0"),
      customerId: custIdentifier,
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

    deductProductStock(cartItems);
    cartItems = [];
    saveCart([]);
    showToast("Đặt hàng thành công!", "success");

    getById("d4Empty").hidden = true;
    getById("d4Layout").hidden = true;
    getById("d4Success").hidden = false;
    getById("d4OrderCode").textContent = newOrder.id;
    getById("d4OrderTotal").textContent = formatMoney(newOrder.total);
    getById("d4OrderNote").textContent = newOrder.customer.note
      ? "Ghi chú giao hàng: " + newOrder.customer.note
      : "";

    const reviewItemsHtml = newOrder.items
      .map(
        (item) => `
      <div class="d4-review-item">
        <div class="d4-review-item-left">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <strong>${item.name}</strong><br>
            <small>
              Size: ${item.size || "Mặc định"} • SL: ${item.quantity} × ${formatMoney(item.price)}
            </small>
          </div>
        </div>
        <strong>${formatMoney(item.price * item.quantity)}</strong>
      </div>`,
      )
      .join("");

    getById("d4OrderReview").innerHTML = `
      <h3>📋 Chi tiết đơn đặt hàng vừa mua</h3>
      <div class="d4-review-info">
        <strong>Người nhận:</strong> ${newOrder.customer.fullName} • <strong>SĐT:</strong> ${newOrder.customer.phone}<br>
        <strong>Địa chỉ:</strong> ${newOrder.customer.address}, ${newOrder.customer.province}<br>
        <strong>Thanh toán:</strong> ${newOrder.paymentMethod}
      </div>
      <div class="d4-review-items">${reviewItemsHtml}</div>
      <div class="d4-review-totals">
        <div class="d4-review-row">
          <span>Tạm tính:</span>
          <strong>${formatMoney(newOrder.subtotal)}</strong>
        </div>
        <div class="d4-review-row">
          <span>Phí vận chuyển:</span>
          <strong>Miễn phí</strong>
        </div>
        <div class="d4-review-row grand">
          <span>Tổng thanh toán:</span>
          <strong>${formatMoney(newOrder.total)}</strong>
        </div>
      </div>`;
  }

  /* ---------- 6. GẮN SỰ KIỆN & KHỞI CHẠY ---------- */
  function initCheckout() {
    cartItems = getCart();
    loadSavedAddress();
    render();

    if (!getCurrentUser()) {
      showToast("Vui lòng đăng nhập để sử dụng giỏ hàng!", "danger");
    }

    getById("d4Items").onclick = function (e) {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const idx = Number(btn.dataset.index);
      const act = btn.dataset.action;
      const item = cartItems[idx];
      if (!item) return;

      const maxLimit = getItemMaxLimit(item);
      if (act === "inc") {
        if (item.quantity < maxLimit) {
          item.quantity++;
        } else {
          showToast(`Chỉ được mua tối đa ${maxLimit} sản phẩm này!`, "danger");
        }
      } else if (act === "dec" && item.quantity > 1) {
        item.quantity--;
      } else if (act === "remove") {
        cartItems.splice(idx, 1);
        showToast("Đã xóa sản phẩm khỏi giỏ hàng!", "info");
      }

      saveCart(cartItems);
      render();
    };

    document
      .querySelectorAll('#d4PayList input[name="payment"]')
      .forEach((radio) => {
        radio.onclick = function () {
          paymentMethod = this.value;
          getById("d4QrBox").hidden = paymentMethod !== "QR";
          getById("d4OnlineBox").hidden = paymentMethod !== "ONLINE";
          document.querySelectorAll(".d4-pay-option").forEach((label) => {
            label.classList.toggle(
              "selected",
              label.querySelector("input").checked,
            );
          });
        };
      });

    getById("d4RadioSaved").onclick = function () {
      switchAddressMode("saved");
    };
    getById("d4RadioNew").onclick = function () {
      switchAddressMode("new");
    };
    getById("d4EditAddr").onclick = function () {
      switchAddressMode("new");
    };

    getById("d4Form").oninput = function (e) {
      if (e.target.id) showError(e.target.id, "");
    };
    getById("d4OnlineBox").oninput = function (e) {
      if (e.target.id) showError(e.target.id, "");
    };

    getById("d4Form").onsubmit = handleOrderSubmit;
  }

  initCheckout();
})();
