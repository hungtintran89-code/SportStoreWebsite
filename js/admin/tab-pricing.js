/**
 * ==============================================================================
 * SPORTSTORE - TAB 6: QUẢN LÝ GIÁ BÁN & LỢI NHUẬN (TAB-PRICING.JS)
 * Chuẩn Bareme SGU (0.5 Điểm):
 *  - Bảng hiển thị: Tên SP, Loại SP, Giá vốn (lấy từ phiếu nhập), % Lợi nhuận, Giá bán
 *  - Cho phép cập nhật % lợi nhuận theo loại hoặc từng SP
 *  - Tự động tính: Giá bán = Giá vốn * (1 + %Lợi nhuận/100)
 *  - Thao tác trực tiếp trên LocalStorage
 * ==============================================================================
 */

/**
 * Vẽ bảng quản lý giá bán & % lợi nhuận
 */
function renderPricingTable() {
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var tbody = document.getElementById("admin-pricing-tbody");
  if (!tbody) return;

  var filterCategory = "";
  var selectCategory = document.getElementById("pricing-filter-category");
  if (selectCategory) filterCategory = selectCategory.value;

  // Điền dropdown môn thể thao cho bộ lọc và cập nhật hàng loạt
  populatePricingCategorySelects();

  tbody.innerHTML = "";

  for (var i = 0; i < products.length; i++) {
    var p = products[i];

    if (filterCategory && filterCategory !== "ALL") {
      if (p.category !== filterCategory && p.categoryId !== filterCategory)
        continue;
    }

    var cost = Number(p.costPrice) || Math.round(p.price * 0.7);
    var profit = Number(p.profitPercent) || 30;
    var salePrice = Math.round(cost * (1 + profit / 100));

    var tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <img src="${p.image}" class="table-img" alt="${p.name}">
      </td>
      <td>
        <div class="item-title">${p.name}</div>
        <div class="item-code">Mã: ${p.code || "SP-" + p.id}</div>
      </td>
      <td><span class="nav-badge badge-blue">${p.category}</span></td>
      <td><strong class="text-cost">${formatVND(cost)}</strong></td>
      <td>
        <div class="profit-input-wrap">
          <input type="number" id="profit-input-${p.id}" value="${profit}" min="0" max="500"
            class="profit-percent-input"
            oninput="recalculatePriceRow(${p.id}, ${cost})"
          >
          <span class="profit-unit">%</span>
        </div>
      </td>
      <td>
        <strong id="sale-price-preview-${p.id}" class="text-sale-price">
          ${formatVND(salePrice)}
        </strong>
      </td>
      <td>
        <button type="button" class="btn-action btn-edit" onclick="applySingleProductPrice(${p.id})" title="Lưu giá bán cho sản phẩm này">
          Cập Nhật
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

/**
 * Đổ danh mục vào thẻ select của Tab giá bán
 */
function populatePricingCategorySelects() {
  var categories = getStorage(STORAGE_KEYS.CATEGORIES, []);
  var selectFilter = document.getElementById("pricing-filter-category");
  var selectBatch = document.getElementById("batch-pricing-category");

  if (selectFilter && selectFilter.options.length <= 1) {
    var htmlFilter = `<option value="ALL">Tất cả môn thể thao</option>`;
    for (var i = 0; i < categories.length; i++) {
      htmlFilter += `<option value="${categories[i].name}">${categories[i].name}</option>`;
    }
    selectFilter.innerHTML = htmlFilter;
  }

  if (selectBatch && selectBatch.options.length === 0) {
    var htmlBatch = "";
    for (var j = 0; j < categories.length; j++) {
      htmlBatch += `<option value="${categories[j].name}">${categories[j].icon} ${categories[j].name}</option>`;
    }
    selectBatch.innerHTML = htmlBatch;
  }
}

/**
 * Tự động tính toán lại Giá bán xem trước khi người dùng gõ % lợi nhuận
 * Công thức Bareme: Giá bán = Giá vốn * (1 + %Lợi nhuận/100)
 */
function recalculatePriceRow(productId, costPrice) {
  var inputProfit = document.getElementById("profit-input-" + productId);
  var previewEl = document.getElementById("sale-price-preview-" + productId);
  if (!inputProfit || !previewEl) return;

  var profit = Number(inputProfit.value) || 0;
  var newPrice = Math.round(costPrice * (1 + profit / 100));
  previewEl.textContent = formatVND(newPrice);
}

/**
 * Lưu giá bán mới cho từng sản phẩm đơn lẻ
 * @param {number} productId
 */
function applySingleProductPrice(productId) {
  var inputProfit = document.getElementById("profit-input-" + productId);
  if (!inputProfit) return;

  var profit = Number(inputProfit.value) || 0;
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);

  for (var i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      var cost =
        Number(products[i].costPrice) || Math.round(products[i].price * 0.7);
      products[i].profitPercent = profit;
      // Công thức Bareme SGU
      products[i].price = Math.round(cost * (1 + profit / 100));
      break;
    }
  }

  setStorage(STORAGE_KEYS.PRODUCTS, products);
  alert(
    "Thành công: Đã cập nhật giá bán mới dựa trên " + profit + "% lợi nhuận!",
  );
  renderPricingTable();
}

/**
 * Cập nhật % lợi nhuận đồng loạt theo Loại sản phẩm theo Bareme SGU
 */
function applyBatchCategoryPricing() {
  var selectBatch = document.getElementById("batch-pricing-category");
  var inputBatchProfit = document.getElementById("batch-pricing-profit");
  if (!selectBatch || !inputBatchProfit) return;

  var categoryName = selectBatch.value;
  var newProfit = Number(inputBatchProfit.value);

  if (isNaN(newProfit) || newProfit < 0) {
    alert("Vui lòng nhập % lợi nhuận hợp lệ (>= 0)!");
    return;
  }

  if (
    !confirm(
      "Áp dụng mức lợi nhuận " +
        newProfit +
        "% cho TẤT CẢ sản phẩm thuộc môn [" +
        categoryName +
        "]? Toàn bộ giá bán sẽ được tự động tính lại.",
    )
  ) {
    return;
  }

  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var updatedCount = 0;

  for (var i = 0; i < products.length; i++) {
    if (products[i].category === categoryName) {
      var cost =
        Number(products[i].costPrice) || Math.round(products[i].price * 0.7);
      products[i].profitPercent = newProfit;
      products[i].price = Math.round(cost * (1 + newProfit / 100));
      updatedCount++;
    }
  }

  setStorage(STORAGE_KEYS.PRODUCTS, products);
  alert(
    "Thành công: Đã tự động cập nhật giá bán mới cho " +
      updatedCount +
      " sản phẩm môn [" +
      categoryName +
      "]!",
  );
  renderPricingTable();
}

/**
 * Lọc bảng giá khi thay đổi dropdown danh mục
 */
function filterPricing() {
  renderPricingTable();
}
