(function () {
  "use strict";

  /* ---------- 1. HẰNG SỐ ---------- */
  const DATA_URL = "../data/dev4_checkout.json"; // file dữ liệu riêng của Dev 4
  const KEY_ARCHIVE = "sport_carts_by_user"; // kho giỏ theo ID: { "U001": [...], "U002": [...] }
  const KEY_OWNER = "sport_cart_owner"; // ghi nhớ ai đang là chủ của giỏ "sport_cart"
  const GUEST_ID = "guest"; // "ID" tạm cho khách chưa đăng nhập
  const MAX_QTY = 10; // mỗi dòng tối đa 10 sản phẩm
  const KEY_ORDERS = "sport_orders"; // danh sách đơn hàng (Dev 5 đọc làm lịch sử, lọc theo userId)
  const REQUIRE_LOGIN = true; // true: phải đăng nhập mới đặt được hàng
  const LOGIN_PAGE = "dev5_user.html"; // trang đăng nhập để chuyển hướng
  const DEFAULT_SIZE = "Mặc định"; // 2 giá trị mặc định do addToCart (common.js) tự điền,
  const DEFAULT_COLOR = "Tiêu chuẩn"; // sẽ không hiển thị cho đỡ rối mắt

  /* ---------- 2. TRẠNG THÁI CỦA TRANG ---------- */
  const state = {
    data: null, // dữ liệu từ JSON
    ownerId: GUEST_ID, // ID chủ giỏ hàng hiện tại
    items: [], // các dòng sản phẩm trong giỏ của chủ đó
    provinceId: "", // tỉnh đang chọn (để tính phí ship)
    coupon: null, // mã giảm giá đang áp dụng
    paymentId: "", // phương thức thanh toán đang chọn
    addrOwner: null, // ID người đã nạp địa chỉ đã lưu (tránh nạp lại làm mất chữ đang gõ)
    finished: false, // true sau khi đặt hàng xong
  };

  /* ---------- 3. HÀM TIỆN ÍCH ---------- */
  const $ = (id) => document.getElementById(id); // viết tắt của document.getElementById

  function escapeHtml(s) {
    // chặn chèn HTML/JS lạ khi in chuỗi lên trang (kể cả trong thuộc tính "...")
    const div = document.createElement("div");
    div.textContent = s == null ? "" : String(s);
    return div.innerHTML.replace(/"/g, "&quot;");
  }

  function placeholderImage() {
    // ảnh dự phòng (SVG vẽ sẵn) khi ảnh sản phẩm thiếu/lỗi
    const svg =
      "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>" +
      "<rect width='100%' height='100%' rx='16' fill='#e4f3fc'/>" +
      "<text x='50%' y='54%' font-size='52' text-anchor='middle' dominant-baseline='middle'>🏷️</text></svg>";
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  function showAlert(message) {
    // hiện dòng cảnh báo đỏ phía trên trang
    const box = $("d4Alert");
    box.textContent = message;
    box.hidden = false;
  }

  function hasCommon() {
    // kiểm tra common.js đã được nạp chưa (typeof không gây lỗi nếu chưa khai báo)
    return (
      typeof getCart === "function" &&
      typeof saveCart === "function" &&
      typeof formatMoney === "function" &&
      typeof showToast === "function" &&
      typeof STORAGE_USER_KEY === "string"
    );
  }

  /* ---------- 4. NGƯỜI DÙNG & GIỎ HÀNG THEO ID ---------- */
  function getOwnerId() {
    const raw = localStorage.getItem(STORAGE_USER_KEY);

    if (!raw) return GUEST_ID;

    try {
      const user = JSON.parse(raw);
      return user && user.id ? String(user.id) : GUEST_ID;
    } catch (err) {
      console.warn("Dữ liệu người dùng không hợp lệ:", err);
      return GUEST_ID;
    }
  }

  function readArchive() {
    // đọc kho giỏ theo ID, luôn trả về object (lỗi/chưa có -> {})
    try {
      const data = JSON.parse(localStorage.getItem(KEY_ARCHIVE));
      return data && typeof data === "object" && !Array.isArray(data)
        ? data
        : {};
    } catch (err) {
      return {};
    }
  }

  function normalizeItems(rawList) {
    // Làm sạch dữ liệu giỏ + gộp các dòng trùng (cùng id + size + màu)
    const map = new Map(); // Map nhớ thứ tự thêm vào; khóa = "id|size|màu"
    (Array.isArray(rawList) ? rawList : []).forEach((raw) => {
      if (!raw || raw.id == null) return; // thiếu id -> bỏ
      const price = Number(raw.price);
      if (!Number.isFinite(price) || price < 0) return; // giá sai -> bỏ
      const qty = Math.max(1, Number(raw.quantity) || 1); // số lượng tối thiểu 1
      const key = [raw.id, raw.size, raw.color].join("|");
      const old = map.get(key);
      if (old) {
        old.quantity += qty; // dòng trùng -> cộng dồn
      } else {
        // giữ nguyên kiểu dữ liệu gốc của id/size/color để addToCart (so sánh ===) của bạn khác vẫn khớp
        map.set(key, {
          key: key,
          id: raw.id,
          name: raw.name || "Sản phẩm",
          image: raw.image || "",
          price: price,
          quantity: qty,
          size: raw.size,
          color: raw.color,
        });
      }
    });
    return [...map.values()].map((it) => {
      it.quantity = Math.min(it.quantity, MAX_QTY); // chặn số lượng quá lớn
      return it;
    });
  }

  function persist(archive) {
    // Ghi giỏ hiện tại vào 2 nơi: "sport_cart" (cho cả nhóm dùng) và kho theo ID (của riêng giỏ này)
    const plain = state.items.map(({ key, ...rest }) => rest); // bỏ trường "key" nội bộ
    saveCart(plain); // hàm của common.js: lưu sport_cart + cập nhật số trên icon giỏ
    const store = archive || readArchive();
    store[state.ownerId] = plain;
    try {
      localStorage.setItem(KEY_ARCHIVE, JSON.stringify(store));
    } catch (err) {
      console.error("Không lưu được giỏ theo ID:", err);
    }
  }

  function syncCartOwner() {
    // Đồng bộ: giỏ "sport_cart" phải thuộc đúng người đang đăng nhập.
    // (Dev 1-3 luôn ghi vào sport_cart qua addToCart, nên trang này tự đổi giỏ khi đổi tài khoản.)
    const owner = getOwnerId();
    const archive = readArchive();
    const prev = localStorage.getItem(KEY_OWNER); // chủ trước đó của sport_cart (null = lần đầu)
    let list = getCart(); // giỏ đang nằm trong sport_cart

    if (prev !== null && prev !== owner) {
      // ĐÃ ĐỔI TÀI KHOẢN (đăng nhập / đăng xuất / người khác đăng nhập)
      archive[prev] = list; // cất giỏ của người trước vào kho
      if (prev === GUEST_ID) {
        list = (archive[owner] || []).concat(list); // khách vừa đăng nhập -> gộp giỏ khách vào giỏ tài khoản
        archive[GUEST_ID] = []; // dọn giỏ khách
      } else {
        list = archive[owner] || []; // lấy lại giỏ riêng của người này
      }
    }

    state.ownerId = owner;
    state.items = normalizeItems(list);
    persist(archive);
    localStorage.setItem(KEY_OWNER, owner);
  }

  /* ---------- 5. TÍNH TIỀN ---------- */
  function calcDiscount(coupon, subtotal) {
    // Tiền giảm của mã (mã freeship xử lý ở phí ship, không tính ở đây)
    if (!coupon || subtotal < (coupon.minOrder || 0)) return 0; // chưa đủ điều kiện tối thiểu
    if (coupon.type === "fixed") return Math.min(coupon.value, subtotal); // giảm cố định, không vượt tổng tiền hàng
    if (coupon.type === "percent") {
      const raw = Math.round((subtotal * coupon.value) / 100);
      return coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw; // giảm % có trần
    }
    return 0;
  }

  function calcTotals() {
    const subtotal = state.items.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0,
    ); // tạm tính
    const discount = calcDiscount(state.coupon, subtotal);
    const province = state.data.provinces.find(
      (p) => p.id === state.provinceId,
    );
    const threshold = Number(state.data.freeShipThreshold) || 0;
    const byAmount = threshold > 0 && subtotal >= threshold; // miễn phí ship theo giá trị đơn (tính trên tạm tính)
    const byCoupon =
      !!state.coupon &&
      state.coupon.type === "freeship" &&
      subtotal >= (state.coupon.minOrder || 0);
    const freeShip = subtotal > 0 && (byAmount || byCoupon);
    const shipping = freeShip || !province ? 0 : province.fee; // chưa chọn tỉnh -> chưa tính phí
    return {
      subtotal: subtotal,
      discount: discount,
      shipping: shipping,
      freeShip: freeShip,
      baseFee: province ? province.fee : 0, // phí gốc theo tỉnh (gạch đi khi được miễn phí)
      hasProvince: !!province,
      total: Math.max(0, subtotal - discount + shipping),
    };
  }

  /* ---------- 6. VẼ GIAO DIỆN ---------- */
  function variantText(it) {
    // "Size: 42 EU | Màu: Cam Neon" (bỏ giá trị mặc định)
    const parts = [];
    if (it.size && it.size !== DEFAULT_SIZE) parts.push("Size: " + it.size);
    if (it.color && it.color !== DEFAULT_COLOR) parts.push("Màu: " + it.color);
    return parts.join(" | ");
  }

  function renderItems() {
    $("d4Items").innerHTML = state.items
      .map((it) => {
        const k = escapeHtml(it.key);
        return (
          "<tr>" +
          '<td data-label="Sản phẩm"><div class="d4-prod">' +
          '<img src="' +
          escapeHtml(it.image || placeholderImage()) +
          '" alt="' +
          escapeHtml(it.name) +
          '" width="56" height="56">' +
          '<div><p class="d4-prod-name">' +
          escapeHtml(it.name) +
          "</p>" +
          '<p class="d4-prod-variant">' +
          escapeHtml(variantText(it)) +
          "</p></div></div></td>" +
          '<td data-label="Đơn giá">' +
          formatMoney(it.price) +
          "</td>" +
          '<td data-label="Số lượng"><div class="d4-qty">' +
          '<button type="button" data-action="dec" data-key="' +
          k +
          '" aria-label="Giảm số lượng"' +
          (it.quantity <= 1 ? " disabled" : "") +
          ">−</button>" +
          "<span>" +
          it.quantity +
          "</span>" +
          '<button type="button" data-action="inc" data-key="' +
          k +
          '" aria-label="Tăng số lượng"' +
          (it.quantity >= MAX_QTY ? " disabled" : "") +
          ">+</button>" +
          "</div></td>" +
          '<td data-label="Thành tiền" class="d4-line-total">' +
          formatMoney(it.price * it.quantity) +
          "</td>" +
          '<td><button type="button" class="d4-remove" data-action="remove" data-key="' +
          k +
          '" aria-label="Xóa ' +
          escapeHtml(it.name) +
          ' khỏi giỏ">✕</button></td>' +
          "</tr>"
        );
      })
      .join("");
  }

  function renderSummary() {
    const t = calcTotals();
    $("d4Subtotal").textContent = formatMoney(t.subtotal);
    $("d4Discount").textContent = "-" + formatMoney(t.discount);
    $("d4Shipping").innerHTML = t.freeShip
      ? (t.baseFee
          ? '<s class="d4-strike">' + formatMoney(t.baseFee) + "</s>"
          : "") + "Miễn phí"
      : t.hasProvince
        ? formatMoney(t.shipping)
        : "Chọn tỉnh/thành để tính";
    $("d4Total").textContent = formatMoney(t.total);
    const gap = (Number(state.data.freeShipThreshold) || 0) - t.subtotal; // còn thiếu bao nhiêu để được free ship
    $("d4FreeShipHint").textContent =
      !t.freeShip && gap > 0
        ? "Mua thêm " + formatMoney(gap) + " để được miễn phí vận chuyển."
        : "";
  }

  function render() {
    if (state.finished) return; // đã đặt xong: giữ màn hình "thành công"
    const count = state.items.reduce((sum, it) => sum + it.quantity, 0);
    const has = state.items.length > 0;
    $("d4ItemCount").textContent = count + " món";
    $("d4Empty").hidden = has; // giỏ trống -> hiện màn "giỏ hàng trống"
    $("d4Layout").hidden = !has;
    if (!has) return;
    renderItems();
    checkCouponStillValid(); // đổi giỏ có thể làm mã hết đủ điều kiện
    renderSummary();
  }

  function fillProvinces() {
    $("province").innerHTML = state.data.provinces
      .map(
        (p) =>
          '<option value="' +
          escapeHtml(p.id) +
          '">' +
          escapeHtml(p.name) +
          " - " +
          formatMoney(p.fee) +
          "</option>",
      )
      .join("");
    state.provinceId = defaultProvinceId(); // chọn sẵn tỉnh đầu tiên để phí ship tính vào tổng ngay
    $("province").value = state.provinceId;
  }

  /* ---------- 7. THAO TÁC TRÊN GIỎ ---------- */
  function changeQty(key, delta) {
    const item = state.items.find((it) => it.key === key);
    if (!item) return;
    const next = item.quantity + delta;
    if (next < 1 || next > MAX_QTY) return; // muốn bỏ hẳn thì bấm nút xóa
    item.quantity = next;
    persist();
    render();
  }

  function removeItem(key) {
    const item = state.items.find((it) => it.key === key);
    if (!item) return;
    state.items = state.items.filter((it) => it.key !== key);
    persist();
    render();
    // showToast của common.js chèn bằng innerHTML nên phải escape tên sản phẩm
    showToast(
      'Đã bỏ "' + escapeHtml(item.name) + '" ra khỏi giỏ hàng!',
      "info",
    );
  }

  function bindEvents() {
    // Ủy quyền sự kiện: 1 listener trên <tbody> lo hết nút +, −, xóa (kể cả nút vẽ lại về sau)
    $("d4Items").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const action = btn.dataset.action;
      if (action === "inc") changeQty(btn.dataset.key, 1);
      else if (action === "dec") changeQty(btn.dataset.key, -1);
      else if (action === "remove") removeItem(btn.dataset.key);
    });

    // Ảnh lỗi -> thay ảnh dự phòng. Sự kiện "error" của <img> không nổi bọt nên phải bắt ở pha capture (true)
    $("d4Items").addEventListener(
      "error",
      (e) => {
        if (e.target.tagName === "IMG" && !e.target.dataset.failed) {
          e.target.dataset.failed = "1"; // đánh dấu để không lặp vô hạn nếu ảnh dự phòng cũng lỗi
          e.target.src = placeholderImage();
        }
      },
      true,
    );

    $("province").addEventListener("change", (e) => {
      state.provinceId = e.target.value;
      renderSummary();
    });

    // Tab khác đổi giỏ/tài khoản, hoặc quay lại trang bằng nút Back -> nạp lại cho luôn đúng
    const refresh = () => {
      syncCartOwner();
      loadSavedAddress(); // đổi tài khoản -> nạp địa chỉ của người mới
      render();
    };
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_CART_KEY || e.key === STORAGE_USER_KEY) refresh();
    });
    window.addEventListener("pageshow", (e) => {
      if (e.persisted) refresh();
    });
  }

  /* ---------- 8. MÃ GIẢM GIÁ ---------- */
  function setCouponMsg(html, type) {
    // html phải được escape ở nơi gọi; type: "ok" (xanh) | "bad" (đỏ) | rỗng
    const el = $("d4CouponMsg");
    // báo lỗi khi đang áp một mã khác: nhắc là mã cũ vẫn còn và cho phép bỏ
    const keep =
      type === "bad" && state.coupon
        ? " (vẫn đang áp dụng " +
          escapeHtml(state.coupon.code) +
          ') <button type="button" class="d4-link" data-remove-coupon>Bỏ mã</button>'
        : "";
    el.innerHTML = html + keep;
    el.className = "d4-coupon-msg" + (type ? " " + type : "");
  }

  function renderCouponChips() {
    // nút gợi ý mã lấy từ JSON, bấm vào là áp dụng luôn
    $("d4CouponChips").innerHTML = state.data.coupons
      .map(
        (c) =>
          '<button type="button" class="d4-chip" data-code="' +
          escapeHtml(c.code) +
          '" title="' +
          escapeHtml(c.desc || "") +
          '">' +
          escapeHtml(c.code) +
          " (" +
          escapeHtml(c.label || "") +
          ")</button>",
      )
      .join("");
  }

  function showCouponApplied() {
    const c = state.coupon;
    setCouponMsg(
      "✓ <strong>" +
        escapeHtml(c.code) +
        "</strong>: " +
        escapeHtml(c.desc || "") +
        ' <button type="button" class="d4-link" data-remove-coupon>Bỏ mã</button>',
      "ok",
    );
  }

  function applyCoupon(rawCode) {
    const code = String(rawCode || "")
      .trim()
      .toUpperCase(); // bỏ khoảng trắng, đổi sang chữ HOA
    if (!code) return setCouponMsg("Vui lòng nhập mã giảm giá.", "bad");
    const coupon = state.data.coupons.find((c) => c.code === code);
    if (!coupon) return setCouponMsg("Mã không hợp lệ hoặc đã hết hạn.", "bad");
    if (calcTotals().subtotal < (coupon.minOrder || 0)) {
      return setCouponMsg(
        "Đơn tối thiểu " +
          formatMoney(coupon.minOrder) +
          " mới dùng được mã này.",
        "bad",
      );
    }
    state.coupon = coupon;
    $("d4CouponInput").value = code;
    showCouponApplied();
    renderSummary();
    showToast("Áp dụng mã " + escapeHtml(code) + " thành công!", "success");
  }

  function removeCoupon(message) {
    state.coupon = null;
    $("d4CouponInput").value = "";
    setCouponMsg(message ? escapeHtml(message) : "", message ? "bad" : "");
    renderSummary();
  }

  function checkCouponStillValid() {
    // đổi số lượng / xóa hàng làm tổng tiền giảm -> mã có thể không còn đủ điều kiện
    if (state.coupon && calcTotals().subtotal < (state.coupon.minOrder || 0)) {
      removeCoupon(
        "Mã " + state.coupon.code + " đã được gỡ vì đơn chưa đủ điều kiện.",
      );
    }
  }

  /* ---------- 9. THANH TOÁN ---------- */
  function renderQr() {
    // chỉ hiện khung QR khi chọn "Chuyển khoản QR"
    $("d4QrBox").hidden = state.paymentId !== "QR";
    const b = state.data.bank || {};
    $("d4QrInfo").innerHTML =
      "<li><strong>Ngân hàng:</strong> " +
      escapeHtml(b.bankName) +
      "</li>" +
      "<li><strong>Chủ tài khoản:</strong> " +
      escapeHtml(b.accountName) +
      "</li>" +
      "<li><strong>Số tài khoản:</strong> " +
      escapeHtml(b.accountNumber) +
      "</li>" +
      "<li><strong>Nội dung:</strong> Mã đơn hàng + số điện thoại</li>";
  }

  function renderPayment() {
    const list = state.data.paymentMethods;
    if (!state.paymentId && list.length) state.paymentId = list[0].id; // mặc định chọn phương thức đầu tiên
    $("d4PayList").innerHTML = list
      .map(
        (m) =>
          '<label class="d4-pay-option' +
          (m.id === state.paymentId ? " selected" : "") +
          '">' +
          '<input type="radio" name="payment" value="' +
          escapeHtml(m.id) +
          '"' +
          (m.id === state.paymentId ? " checked" : "") +
          ">" +
          "<span><strong>" +
          escapeHtml(m.name) +
          "</strong>" +
          (m.badge
            ? ' <em class="d4-tag">' + escapeHtml(m.badge) + "</em>"
            : "") +
          "<small>" +
          escapeHtml(m.desc || "") +
          "</small></span></label>",
      )
      .join("");
    renderQr();
  }

  /* ---------- 10. ĐỊA CHỈ ĐÃ LƯU ---------- */
  const FIELD_IDS = ["fullName", "phone", "email", "province", "address"]; // các ô bắt buộc
  const fieldValue = (id) => $(id).value.trim(); // lấy giá trị ô, đã cắt khoảng trắng 2 đầu

  function readJson(key) {
    // đọc localStorage an toàn, lỗi/không có -> null
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (err) {
      return null;
    }
  }

  function getSavedAddress() {
    // Địa chỉ của người đang đăng nhập: ưu tiên sổ địa chỉ (sport_address), bổ sung từ hồ sơ (sport_user)
    if (state.ownerId === GUEST_ID) return null; // khách chưa có địa chỉ đã lưu
    let a = readJson(STORAGE_ADDR_KEY);
    if (Array.isArray(a)) {
      const mine = a.filter(
        (x) => x && (x.userId == null || String(x.userId) === state.ownerId),
      ); // chỉ lấy địa chỉ của mình
      a = mine.find((x) => x.isDefault || x.default) || mine[0]; // ưu tiên địa chỉ mặc định
    } else if (a && a.userId != null && String(a.userId) !== state.ownerId) {
      a = null; // địa chỉ của người khác
    }
    const user = readJson(STORAGE_USER_KEY);
    const src = Object.assign(
      {},
      user && typeof user === "object" ? user : {},
      a || {},
    ); // địa chỉ ghi đè hồ sơ
    const found = {
      fullName: src.fullName || src.name || src.receiver || "",
      phone: src.phone || "",
      email: src.email || "",
      address: src.address || src.detail || src.street || "",
      province: src.province || src.provinceId || src.city || "",
    };
    return found.fullName && found.phone && found.address ? found : null; // thiếu thông tin chính -> coi như chưa có
  }

  function findProvinceId(value) {
    // tỉnh lưu có thể là id ("hn") hoặc tên ("Hà Nội") -> đổi về id trong JSON
    const s = String(value || "")
      .trim()
      .toLowerCase();
    if (!s) return "";
    const p = state.data.provinces.find(
      (x) => x.id.toLowerCase() === s || x.name.toLowerCase().includes(s),
    );
    return p ? p.id : "";
  }

  function loadSavedAddress() {
    if (state.addrOwner === state.ownerId) return; // đã nạp cho người này rồi -> không ghi đè chữ đang gõ
    state.addrOwner = state.ownerId;
    FIELD_IDS.concat("note").forEach((id) => {
      if (id !== "province") $(id).value = ""; // đổi người -> xóa sạch ô cũ (tỉnh quay về mặc định ngay dưới)
      if (id !== "note") showFieldError(id, "");
    });
    state.provinceId = defaultProvinceId();
    $("province").value = state.provinceId;
    const a = getSavedAddress();
    if (!a) {
      $("d4SavedBox").hidden = true;
      $("d4Fields").hidden = false; // chưa có địa chỉ -> hiện form để nhập
    } else {
      $("fullName").value = a.fullName;
      $("phone").value = a.phone;
      $("email").value = a.email;
      $("address").value = a.address;
      state.provinceId = findProvinceId(a.province) || defaultProvinceId();
      $("province").value = state.provinceId;
      const p = state.data.provinces.find((x) => x.id === state.provinceId);
      $("d4SavedText").innerHTML =
        '<span class="d4-saved-badge">✓ Địa chỉ mặc định trong tài khoản</span><br>' +
        "<strong>" +
        escapeHtml([a.fullName, a.phone, a.email].filter(Boolean).join(" • ")) +
        "</strong><br>" +
        "🏠 " +
        escapeHtml(a.address) +
        "<br>" +
        "🚚 Khu vực giao hàng: " +
        escapeHtml(p ? p.name : "—") +
        (p ? " — Phí: " + formatMoney(p.fee) : "");
      $("d4SavedBox").hidden = false;
      $("d4Fields").hidden = true; // ẩn form, chỉ hiện thẻ địa chỉ; bấm "Đổi địa chỉ" để sửa
    }
    renderSummary(); // phí ship phụ thuộc tỉnh
  }

  /* ---------- 11. KIỂM TRA FORM ---------- */
  function checkField(id) {
    // trả về câu báo lỗi; chuỗi rỗng = hợp lệ
    const v = fieldValue(id);
    if (id === "fullName") {
      if (v.length < 2) return "Vui lòng nhập họ và tên (ít nhất 2 ký tự).";
      if (/\d/.test(v)) return "Họ tên không được chứa chữ số.";
    }
    if (id === "phone" && !/^0\d{9}$/.test(v))
      return "Số điện thoại gồm đúng 10 chữ số và bắt đầu bằng 0.";
    if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return "Email chưa đúng định dạng (ví dụ: ten@gmail.com).";
    if (id === "province" && !v) return "Vui lòng chọn tỉnh / thành phố.";
    if (id === "address" && v.length < 5)
      return "Vui lòng nhập địa chỉ chi tiết (số nhà, đường, phường/xã).";
    return "";
  }

  function showFieldError(id, message) {
    $("err-" + id).textContent = message;
    $(id).setAttribute("aria-invalid", message ? "true" : "false"); // cho trình đọc màn hình biết ô đang lỗi
    $(id).classList.toggle("invalid", !!message); // CSS tô viền đỏ
  }

  function validateForm() {
    let firstBad = null;
    FIELD_IDS.forEach((id) => {
      const msg = checkField(id);
      showFieldError(id, msg);
      if (msg && !firstBad) firstBad = id;
    });
    if (firstBad) {
      $("d4Fields").hidden = false; // đang ẩn form (dùng địa chỉ đã lưu) mà thiếu thông tin -> mở ra cho sửa
      $("d4SavedBox").hidden = true;
      $(firstBad).focus(); // đưa con trỏ tới ô lỗi đầu tiên
    }
    return !firstBad;
  }

  /* ---------- 12. ĐẶT HÀNG ---------- */
  function readOrders() {
    const o = readJson(KEY_ORDERS);
    return Array.isArray(o) ? o : [];
  }

  function nextOrderId(orders) {
    // DH-0001, DH-0002... lấy số lớn nhất đang có + 1 (không trùng kể cả khi từng xóa đơn)
    let max = 0;
    orders.forEach((o) => {
      const m = /^DH-(\d+)$/.exec(String(o && o.id));
      if (m) max = Math.max(max, Number(m[1]));
    });
    return "DH-" + String(max + 1).padStart(4, "0");
  }

  function showSuccess(order) {
    state.finished = true; // để render() không vẽ lại màn hình giỏ hàng
    $("d4Layout").hidden = true;
    $("d4Empty").hidden = true;
    $("d4Success").hidden = false;
    $("d4OrderCode").textContent = order.id;
    $("d4OrderTotal").textContent = formatMoney(order.total);
    $("d4OrderNote").textContent =
      order.paymentMethod === "QR"
        ? "Vui lòng chuyển khoản " +
          formatMoney(order.total) +
          " với nội dung là mã đơn hàng để chúng tôi xử lý nhanh nhất."
        : "Bạn sẽ thanh toán " +
          formatMoney(order.total) +
          " cho shipper khi nhận hàng.";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(e) {
    e.preventDefault(); // chặn form tự tải lại trang
    if (state.items.length === 0) return;
    if (REQUIRE_LOGIN && state.ownerId === GUEST_ID) {
      showToast("Vui lòng đăng nhập để đặt hàng.", "danger");
      setTimeout(() => {
        window.location.href = LOGIN_PAGE + "?redirect=dev4_checkout.html"; // Dev 5 đọc tham số này để quay lại giỏ hàng sau khi đăng nhập
      }, 1200);
      return;
    }
    if (!validateForm()) {
      showToast("Vui lòng kiểm tra lại thông tin nhận hàng.", "danger");
      return;
    }
    state.provinceId = fieldValue("province"); // đảm bảo phí ship tính đúng tỉnh trong ô
    const t = calcTotals();
    const province = state.data.provinces.find(
      (p) => p.id === state.provinceId,
    );
    const orders = readOrders();
    const order = {
      id: nextOrderId(orders),
      userId: state.ownerId, // gắn đơn với ID người dùng (Dev 5 lọc theo trường này)
      createdAt: new Date().toISOString(),
      status: "pending", // chờ xác nhận
      items: state.items.map(({ key, ...rest }) => rest), // bản chụp sản phẩm tại thời điểm mua
      subtotal: t.subtotal,
      discount: t.discount,
      shippingFee: t.shipping,
      total: t.total,
      coupon: state.coupon ? state.coupon.code : null,
      paymentMethod: state.paymentId,
      customer: {
        fullName: fieldValue("fullName"),
        phone: fieldValue("phone"),
        email: fieldValue("email"),
        provinceId: state.provinceId,
        province: province ? province.name : "",
        address: fieldValue("address"),
        note: fieldValue("note"),
      },
    };
    orders.push(order);
    try {
      localStorage.setItem(KEY_ORDERS, JSON.stringify(orders));
    } catch (err) {
      showToast("Không lưu được đơn hàng, vui lòng thử lại.", "danger");
      return; // lưu lỗi thì giữ nguyên giỏ hàng
    }
    state.items = []; // đặt xong -> làm trống giỏ của người này
    state.coupon = null;
    persist();
    showSuccess(order);
  }

  function bindCheckoutEvents() {
    $("d4Form").addEventListener("submit", handleSubmit); // nút "Xác nhận" ngoài form nhưng có form="d4Form" nên vẫn kích hoạt

    // mã giảm giá
    $("d4CouponApply").addEventListener("click", () =>
      applyCoupon($("d4CouponInput").value),
    );
    $("d4CouponInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyCoupon(e.target.value);
      }
    });
    $("d4CouponChips").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-code]");
      if (btn) applyCoupon(btn.dataset.code);
    });
    $("d4CouponMsg").addEventListener("click", (e) => {
      if (e.target.closest("[data-remove-coupon]")) removeCoupon();
    });

    // phương thức thanh toán (đổi class tại chỗ để không mất focus bàn phím)
    $("d4PayList").addEventListener("change", (e) => {
      if (e.target.name !== "payment") return;
      state.paymentId = e.target.value;
      $("d4PayList")
        .querySelectorAll(".d4-pay-option")
        .forEach((label) => {
          label.classList.toggle(
            "selected",
            label.querySelector("input").checked,
          );
        });
      renderQr();
    });

    // địa chỉ: mở form để sửa
    $("d4EditAddr").addEventListener("click", () => {
      $("d4Fields").hidden = false;
      $("d4SavedBox").hidden = true;
      $("fullName").focus();
    });

    // kiểm tra từng ô: khi rời ô thì báo lỗi; khi đang sửa ô đã lỗi thì cập nhật ngay
    $("d4Fields").addEventListener("focusout", (e) => {
      if (FIELD_IDS.includes(e.target.id))
        showFieldError(e.target.id, checkField(e.target.id));
    });
    $("d4Fields").addEventListener("input", (e) => {
      if (e.target.id === "phone")
        e.target.value = e.target.value.replace(/\D/g, ""); // chỉ cho gõ chữ số
      if (
        FIELD_IDS.includes(e.target.id) &&
        e.target.getAttribute("aria-invalid") === "true"
      ) {
        showFieldError(e.target.id, checkField(e.target.id));
      }
    });
  }

  /* ---------- 12b. TỈNH MẶC ĐỊNH ---------- */
  function defaultProvinceId() {
    // tỉnh chọn sẵn = tỉnh đầu danh sách, để phí ship luôn được tính vào tổng tiền
    const first = state.data.provinces[0];
    return first ? first.id : "";
  }

  /* ---------- 13. KHỞI ĐỘNG ---------- */
  async function init() {
    if (!hasCommon()) {
      showAlert(
        "Thiếu common.js: hãy nạp ../js/common.js trước dev4_checkout.js trong file HTML.",
      );
      return;
    }
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      state.data = await res.json();
    } catch (err) {
      console.error("Không đọc được dev4_checkout.json:", err);
      showAlert("Không tải được dữ liệu checkout. Vui lòng thử lại.");
      return;
    }
    fillProvinces();
    renderCouponChips();
    renderPayment();
    bindEvents();
    bindCheckoutEvents();
    syncCartOwner();
    loadSavedAddress(); // cần state.ownerId nên gọi sau syncCartOwner
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
