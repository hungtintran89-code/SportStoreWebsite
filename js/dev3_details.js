/**
 * ==============================================================================
 * SPORTSTORE - LOGIC TRANG CHI TIẾT SẢN PHẨM & SO SÁNH (DEV 3 - PRODUCT)
 * File: js/dev3_details.js
 * ==============================================================================
 * ĐẶC ĐIỂM KỸ THUẬT:
 *  - Kiến trúc Decoupled Vanilla JS (IIFE độc lập, an toàn).
 *  - 100% Chạy trực tiếp từ file:/// (Không dùng fetch() để triệt tiêu lỗi CORS).
 *  - Lấy dữ liệu sản phẩm động từ LocalStorage (sport_products) hoặc Database products.
 *  - Lấy chính xác ID truyền từ URL (?id=201, ?id=202...).
 *  - Đa góc nhìn (Gallery views): Bấm thumbnail để soi các góc chụp của sản phẩm.
 *  - Bộ chọn màu thông minh: Tự chuyển gam màu CSS theo tên gọi khi hover / active.
 *  - Bộ chọn số lượng (+ / -) tương tác mượt mà.
 *  - Nút yêu thích (Wishlist) tương tác tức thì.
 *  - Hiệu ứng Fly-to-Cart (ảnh sản phẩm bay vòng cung vào giỏ hàng trên Header).
 *  - BẢNG ĐỐI CHIẾU THÔNG SỐ ĐỐI KHÁNG (Dev 3 Rubric): 3 thẻ đối thủ chuẩn Lead Hover.
 *  - Chuyển đổi sản phẩm tức thì khi chọn đối thủ trong bảng so sánh.
 *  - Tương thích hoàn toàn với hệ thống giỏ hàng addToCart() tại js/common.js.
 * ==============================================================================
 */

(function () {
  'use strict';

  // Bảng từ điển dịch các nhãn thông số kỹ thuật sang tiếng Việt thân thiện
  var SPEC_LABELS = {
    weight: 'Trọng lượng',
    cushion: 'Công nghệ đệm',
    plate: 'Đĩa sợi carbon / Tấm trợ lực',
    surface: 'Mặt sân / Địa hình',
    drop: 'Độ dốc gót - mũi (Drop)',
    level: 'Cấp độ thi đấu',
    material: 'Chất liệu cấu tạo',
    studs: 'Loại đinh đế',
    upper: 'Chất liệu thân trên (Upper)',
    insole: 'Lót giày',
    tension: 'Mức căng cước tối đa',
    frame: 'Cấu tạo khung vợt',
    balance: 'Điểm cân bằng',
    flex: 'Độ dẻo thân vợt',
    closure: 'Khóa / Đai cố định',
    battery: 'Thời lượng pin GPS',
    waterproof: 'Chuẩn kháng nước',
    capacity: 'Dung tích',
    insulation: 'Thời gian giữ nhiệt',
    origin: 'Xuất xứ thương hiệu',
    design: 'Kiểu dáng thiết kế',
    gender: 'Đối tượng sử dụng'
  };

  /**
   * Phân tích tên màu để tạo bộ mã màu CSS hiển thị trực quan theo tên gọi
   */
  function parseColorTheme(colorStr) {
    if (!colorStr) {
      return {
        primary: '#0284c7',
        bgLight: '#f0f9ff',
        ring: 'rgba(2, 132, 199, 0.25)',
        dot: '#0284c7',
        textActive: '#0369a1'
      };
    }

    var c = colorStr.toLowerCase();

    // 1. Hồng / Pink
    if (c.includes('hồng') || c.includes('pink')) {
      return {
        primary: '#ec4899',
        bgLight: '#fdf2f8',
        ring: 'rgba(236, 72, 153, 0.35)',
        dot: '#ec4899',
        textActive: '#be185d'
      };
    }

    // 2. Cam / Đỏ Cam
    if (c.includes('đỏ cam') || c.includes('cam') || c.includes('orange')) {
      return {
        primary: '#ea580c',
        bgLight: '#fff7ed',
        ring: 'rgba(234, 88, 12, 0.35)',
        dot: '#ea580c',
        textActive: '#c2410c'
      };
    }

    // 3. Vàng / Yellow / Gold
    if (c.includes('vàng') || c.includes('yellow') || c.includes('gold')) {
      return {
        primary: '#d97706',
        bgLight: '#fefce8',
        ring: 'rgba(217, 119, 6, 0.35)',
        dot: '#f59e0b',
        textActive: '#b45309'
      };
    }

    // 4. Xanh Neon / Mint / Xanh lá / Chanh
    if (c.includes('neon') || c.includes('solar green') || c.includes('mint') || c.includes('xanh lục') || c.includes('chanh')) {
      return {
        primary: '#10b981',
        bgLight: '#ecfdf5',
        ring: 'rgba(16, 185, 129, 0.35)',
        dot: '#10b981',
        textActive: '#047857'
      };
    }

    // 5. Đỏ / Crimson
    if (c.includes('đỏ') || c.includes('red') || c.includes('crimson')) {
      return {
        primary: '#ef4444',
        bgLight: '#fef2f2',
        ring: 'rgba(239, 68, 68, 0.35)',
        dot: '#ef4444',
        textActive: '#b91c1c'
      };
    }

    // 6. Xanh Dương / Cyan / Navy
    if (c.includes('xanh') || c.includes('blue') || c.includes('cyan') || c.includes('navy')) {
      return {
        primary: '#0284c7',
        bgLight: '#f0f9ff',
        ring: 'rgba(2, 132, 199, 0.35)',
        dot: '#0284c7',
        textActive: '#0369a1'
      };
    }

    // 7. Đen / Black
    if (c.includes('đen') || c.includes('black') || c.includes('dark')) {
      return {
        primary: '#334155',
        bgLight: '#f8fafc',
        ring: 'rgba(51, 65, 85, 0.35)',
        dot: '#0f172a',
        textActive: '#0f172a'
      };
    }

    // 8. Trắng / White / Bạc / Grey
    if (c.includes('trắng') || c.includes('white') || c.includes('bạc') || c.includes('xám') || c.includes('grey')) {
      return {
        primary: '#64748b',
        bgLight: '#f8fafc',
        ring: 'rgba(100, 116, 139, 0.35)',
        dot: '#94a3b8',
        textActive: '#334155'
      };
    }

    return {
      primary: '#0284c7',
      bgLight: '#f0f9ff',
      ring: 'rgba(2, 132, 199, 0.25)',
      dot: '#0284c7',
      textActive: '#0369a1'
    };
  }

  /**
   * Định dạng tiền tệ VNĐ chuẩn
   */
  function formatCurrency(amount) {
    if (typeof amount === 'string') {
      amount = Number(amount.replace(/[^0-9]/g, ''));
    }
    var num = Number(amount) || 0;
    return num.toLocaleString('vi-VN') + ' đ';
  }

  /**
   * Lấy danh sách sản phẩm từ LocalStorage hoặc Database products
   */
  function loadProductsList() {
    var key = typeof STORAGE_KEYS !== 'undefined' && STORAGE_KEYS.PRODUCTS ? STORAGE_KEYS.PRODUCTS : 'sport_products';
    var defaultSource = (typeof products !== 'undefined' && products.length > 0) ? products : ((typeof MOCK_PRODUCTS !== 'undefined' && MOCK_PRODUCTS.length > 0) ? MOCK_PRODUCTS : []);

    if (typeof getStorage === 'function') {
      var stored = getStorage(key, null);
      if (stored && stored.length > 0) {
        return stored;
      }
    } else {
      try {
        var raw = localStorage.getItem(key);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return defaultSource;
  }

  /**
   * Lấy ID sản phẩm hiện tại từ Query Parameter trên URL (?id=...)
   */
  function getRequestedProductId() {
    try {
      var params = new URLSearchParams(window.location.search);
      var id = params.get('id') || params.get('productId') || params.get('code') || null;
      if (!id || id === 'null' || id === 'undefined' || !id.trim()) return null;
      return id.trim();
    } catch (e) {
      return null;
    }
  }

  /**
   * Tìm sản phẩm theo đúng ID số hoặc mã Code trong cơ sở dữ liệu
   */
  function findProduct(idOrCode, list) {
    if (!list || list.length === 0) return null;

    // Nếu không truyền ID trên URL -> Hiển thị sản phẩm đầu tiên trong danh sách
    if (!idOrCode) {
      return list[0];
    }

    var searchStr = String(idOrCode).trim().toLowerCase();

    // Tìm chính xác theo id số hoặc mã code (SP-201, 201...) trong Database
    var found = list.find(function (p) {
      return String(p.id).toLowerCase() === searchStr || (p.code && p.code.toLowerCase() === searchStr);
    });

    // Nếu tìm thấy trả về sản phẩm đó; nếu không tìm thấy (do bên khác truyền sai ID) thì fallback an toàn về list[0]
    return found || list[0];
  }

  /**
   * HIỆU ỨNG FLY-TO-CART (ẢNH BAY VÒNG CUNG VÀO GIỎ HÀNG TRÊN HEADER)
   */
  function triggerFlyToCartAnimation(sourceImgEl, callback) {
    var cartBtn = document.getElementById('header-cart-btn') || document.getElementById('header-cart-badge-count');
    if (!sourceImgEl || !cartBtn) {
      if (typeof callback === 'function') callback();
      return;
    }

    var imgRect = sourceImgEl.getBoundingClientRect();
    var cartRect = cartBtn.getBoundingClientRect();

    // Tạo bản sao hình ảnh bay lơ lửng
    var flyer = document.createElement('img');
    flyer.src = sourceImgEl.src;
    flyer.className = 'fly-to-cart-element';
    flyer.style.top = imgRect.top + 'px';
    flyer.style.left = imgRect.left + 'px';
    flyer.style.width = imgRect.width + 'px';
    flyer.style.height = imgRect.height + 'px';
    flyer.style.opacity = '0.92';
    document.body.appendChild(flyer);

    // Kích hoạt đường bay vòng cung sang góc trên bên phải
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var targetX = cartRect.left + cartRect.width / 2 - 16;
        var targetY = cartRect.top + cartRect.height / 2 - 16;
        flyer.style.top = targetY + 'px';
        flyer.style.left = targetX + 'px';
        flyer.style.width = '32px';
        flyer.style.height = '32px';
        flyer.style.opacity = '0.15';
        flyer.style.transform = 'scale(0.3) rotate(360deg)';
      });
    });

    // Dọn dẹp flyer và kích hoạt hiệu ứng nảy badge trên header
    setTimeout(function () {
      if (flyer.parentNode) {
        flyer.parentNode.removeChild(flyer);
      }

      var cartBadge = document.getElementById('header-cart-badge-count');
      if (cartBtn) {
        cartBtn.classList.remove('cart-bounce-active');
        void cartBtn.offsetWidth; // Reflow
        cartBtn.classList.add('cart-bounce-active');
        setTimeout(function () {
          cartBtn.classList.remove('cart-bounce-active');
        }, 650);
      }
      if (cartBadge) {
        cartBadge.classList.remove('badge-pulse-active');
        void cartBadge.offsetWidth; // Reflow
        cartBadge.classList.add('badge-pulse-active');
        setTimeout(function () {
          cartBadge.classList.remove('badge-pulse-active');
        }, 650);
      }

      if (typeof callback === 'function') callback();
    }, 750);
  }

  /**
   * Chuyển đổi sang xem sản phẩm khác ngay trong trang mà không reload (In-page Switch)
   */
  function switchToProduct(newId, allProducts) {
    var target = findProduct(newId, allProducts);
    if (!target) return;

    // 1. Render lại toàn bộ dữ liệu sản phẩm mới
    renderProduct(target, allProducts);

    // 2. Cập nhật URL trên thanh địa chỉ của trình duyệt
    try {
      var newUrl = window.location.pathname + '?id=' + target.id;
      window.history.pushState({ id: target.id }, '', newUrl);
    } catch (err) {}

    // 3. Cuộn mượt mà lên đầu trang để người xem thấy ngay thông số sản phẩm mới
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Hiển thị chi tiết sản phẩm lên giao diện
   */
  function renderProduct(data, allProducts) {
    var crumbTitle = document.querySelector('[data-crumb-title]');
    var gallery = document.querySelector('[data-gallery]');
    var mainImage = document.querySelector('[data-main-image]');
    var title = document.querySelector('[data-title]');
    var tag = document.querySelector('[data-tag]');
    var priceContainer = document.querySelector('[data-price]');
    var rating = document.querySelector('[data-rating]');
    var reviews = document.querySelector('[data-reviews]');
    var swatchesContainer = document.querySelector('.swatches');
    var sizesContainer = document.querySelector('.sizes');
    var currentColorLabel = document.getElementById('current-color-label');
    var currentSizeLabel = document.getElementById('current-size-label');
    var specList = document.querySelector('[data-specs]');
    var descEl = document.querySelector('[data-desc]');
    var featuresEl = document.querySelector('[data-features]');
    var compareGrid = document.querySelector('[data-compare]');
    var addToCartButton = document.querySelector('[data-add-cart]');
    var wishButton = document.querySelector('.wishlist-btn');

    var qtyMinus = document.querySelector('[data-qty-minus]');
    var qtyPlus = document.querySelector('[data-qty-plus]');
    var qtyInput = document.querySelector('[data-qty-input]');
    var currentQuantity = 1;

    if (!title || !priceContainer || !data) return;

    // 0. Cập nhật Breadcrumb
    if (crumbTitle) {
      crumbTitle.textContent = data.name;
    }

    // 1. Tên, Tag & Giá bán
    title.textContent = data.name;

    var badgeText = 'CHÍNH HÃNG';
    if (data.discount) {
      badgeText = 'GIẢM ' + data.discount.replace('-', '');
    } else if (data.isHot) {
      badgeText = 'HOT BESTSELLER';
    } else if (data.isNew) {
      badgeText = 'MỚI VỀ';
    }
    if (tag) tag.textContent = badgeText;

    var currentPrice = data.salePrice || data.price;
    if (data.salePrice && data.salePrice < data.price) {
      priceContainer.innerHTML =
        formatCurrency(currentPrice) +
        ' <span style="font-size: 1.1rem; color: #94a3b8; text-decoration: line-through; font-weight: 500; margin-left: 10px;">' +
        formatCurrency(data.price) +
        '</span>';
    } else {
      priceContainer.textContent = formatCurrency(currentPrice);
    }

    // 2. Đánh giá & Số lượt mua
    if (rating) rating.textContent = (data.rating || 5) + ' / 5';
    if (reviews) {
      var reviewText = (data.reviewCount || 0) + ' đánh giá';
      if (data.sold) {
        reviewText += ' • Đã bán ' + data.sold;
      }
      reviews.textContent = reviewText;
    }

    // 3. Khởi tạo danh sách ảnh Gallery & Sizes & Colors
    var imageList = data.gallery && data.gallery.length > 0 ? data.gallery : [data.image];
    var sizesList = data.sizes && data.sizes.length > 0 ? data.sizes : ['39', '40', '41', '42', '43'];
    var colorsList = data.colors && data.colors.length > 0 ? data.colors : ['Tiêu Chuẩn'];

    if (mainImage) {
      mainImage.src = imageList[0];
      mainImage.alt = data.name;
    }

    /**
     * HÀM PHẢN HỒI TRỰC QUAN TỨC THÌ
     */
    function updateSelectionFeedback() {
      var activeColorBtn = swatchesContainer ? swatchesContainer.querySelector('.swatch.active') : null;
      var activeSizeBtn = sizesContainer ? sizesContainer.querySelector('.size-btn.active') : null;

      var selColor = activeColorBtn ? activeColorBtn.getAttribute('data-color-name') : (colorsList[0] || 'Tiêu Chuẩn');
      var selSize = activeSizeBtn ? activeSizeBtn.textContent.trim() : (sizesList[0] || 'Mặc định');

      // 1. Cập nhật nhãn Màu sắc
      if (currentColorLabel) {
        currentColorLabel.textContent = selColor;
        var theme = parseColorTheme(selColor);
        currentColorLabel.style.color = theme.primary;
      }

      // 2. Cập nhật nhãn Kích cỡ
      if (currentSizeLabel) {
        currentSizeLabel.innerHTML =
          '<strong>' + selSize + '</strong> <span style="font-size: 11px; color: #16a34a; font-weight: 700; margin-left: 6px; background: #dcfce7; padding: 2px 8px; border-radius: 999px;">✔ Còn hàng (' + (data.stock || 15) + ' đôi)</span>';
      }
    }

    // 3.1 Render Gallery Thumbnails: Xem ảnh đa góc nhìn của sản phẩm
    if (gallery) {
      gallery.innerHTML = imageList
        .map(function (src, index) {
          return (
            '<button class="thumb ' +
            (index === 0 ? 'active' : '') +
            '" type="button" data-thumb="' +
            index +
            '" title="Xem góc chụp ' +
            (index + 1) +
            '">' +
            '<img src="' +
            src +
            '" alt="' +
            data.name +
            ' góc ' +
            (index + 1) +
            '" />' +
            '</button>'
          );
        })
        .join('');

      var thumbButtons = gallery.querySelectorAll('[data-thumb]');
      thumbButtons.forEach(function (button, idx) {
        button.addEventListener('click', function () {
          // 1. Đổi ảnh lớn sang góc ảnh vừa click
          if (mainImage) {
            mainImage.style.opacity = '0.35';
            setTimeout(function () {
              mainImage.src = imageList[idx];
              mainImage.style.opacity = '1';
            }, 100);
          }

          // 2. Active thumbnail được chọn
          thumbButtons.forEach(function (b) {
            b.classList.remove('active');
          });
          button.classList.add('active');

          // 3. ĐỒNG BỘ: Đổi màu theo giày (kích hoạt ô màu tương ứng)
          if (swatchesContainer) {
            var allColorBtns = swatchesContainer.querySelectorAll('[data-color]');
            if (allColorBtns.length > 0) {
              var targetColorIdx = idx % allColorBtns.length;
              allColorBtns.forEach(function (el) {
                el.classList.remove('active');
              });
              allColorBtns[targetColorIdx].classList.add('active');
            }
          }

          // 4. Cập nhật nhãn màu ngay lập tức
          updateSelectionFeedback();
        });
      });
    }

    // 4. Render Kích cỡ (Sizes)
    if (sizesContainer) {
      sizesContainer.innerHTML = sizesList
        .map(function (s, index) {
          return (
            '<button class="size-btn ' +
            (index === 0 ? 'active' : '') +
            '" type="button" data-size>' +
            s +
            '</button>'
          );
        })
        .join('');

      var sizeButtons = sizesContainer.querySelectorAll('[data-size]');
      sizeButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          sizeButtons.forEach(function (el) {
            el.classList.remove('active');
          });
          btn.classList.add('active');
          updateSelectionFeedback();
        });
      });
    }

    // 5. Render Màu sắc (Colors)
    if (swatchesContainer) {
      swatchesContainer.innerHTML = '';
      colorsList.forEach(function (c, index) {
        var theme = parseColorTheme(c);
        var btn = document.createElement('button');
        btn.className = 'swatch ' + (index === 0 ? 'active' : '');
        btn.type = 'button';
        btn.setAttribute('data-color', '');
        btn.setAttribute('data-color-name', c);
        btn.setAttribute('data-color-index', index);

        // Gán CSS variables
        btn.style.setProperty('--swatch-hover-bg', theme.bgLight);
        btn.style.setProperty('--swatch-hover-border', theme.primary);
        btn.style.setProperty('--swatch-hover-color', theme.textActive);
        btn.style.setProperty('--swatch-hover-shadow', theme.ring);
        btn.style.setProperty('--swatch-active-bg', theme.bgLight);
        btn.style.setProperty('--swatch-active-border', theme.primary);
        btn.style.setProperty('--swatch-active-color', theme.textActive);
        btn.style.setProperty('--swatch-active-ring', theme.ring);

        btn.innerHTML =
          '<span class="swatch-dot" style="display:inline-block; width:10px; height:10px; border-radius:50%; background:' +
          theme.dot +
          '; border:1px solid rgba(0,0,0,0.15); flex-shrink:0;"></span>' +
          c +
          '<span class="swatch-check" style="color:' +
          theme.primary +
          ';">✔</span>';

        btn.addEventListener('click', function () {
          var allColorBtns = swatchesContainer.querySelectorAll('[data-color]');
          allColorBtns.forEach(function (el) {
            el.classList.remove('active');
          });
          btn.classList.add('active');

          var targetImageIdx = index % imageList.length;
          if (mainImage) {
            mainImage.style.opacity = '0.35';
            setTimeout(function () {
              mainImage.src = imageList[targetImageIdx];
              mainImage.style.opacity = '1';
            }, 100);
          }

          if (gallery) {
            var thumbButtons = gallery.querySelectorAll('[data-thumb]');
            if (thumbButtons.length > 0) {
              var targetThumbIdx = index % thumbButtons.length;
              thumbButtons.forEach(function (b) {
                b.classList.remove('active');
              });
              thumbButtons[targetThumbIdx].classList.add('active');
            }
          }

          updateSelectionFeedback();
        });

        swatchesContainer.appendChild(btn);
      });
    }

    // Bộ chọn số lượng (+ / -)
    if (qtyInput) {
      qtyInput.value = '1';
      currentQuantity = 1;
    }
    if (qtyMinus) {
      qtyMinus.onclick = function () {
        if (currentQuantity > 1) {
          currentQuantity -= 1;
          if (qtyInput) qtyInput.value = currentQuantity;
        }
      };
    }
    if (qtyPlus) {
      qtyPlus.onclick = function () {
        if (currentQuantity < (data.stock || 99)) {
          currentQuantity += 1;
          if (qtyInput) qtyInput.value = currentQuantity;
        }
      };
    }

    updateSelectionFeedback();

    // 6. Mô tả sản phẩm & Đặc điểm nổi bật
    if (descEl && data.desc) {
      descEl.textContent = data.desc;
    }
    if (featuresEl) {
      if (data.features && data.features.length > 0) {
        featuresEl.innerHTML = data.features
          .map(function (feat) {
            return '<li>' + feat + '</li>';
          })
          .join('');
      } else {
        featuresEl.innerHTML = '<li>Chất liệu cao cấp, độ hoàn thiện tinh xảo đạt tiêu chuẩn quốc tế.</li>';
      }
    }

    // 7. Thông số kỹ thuật (Specs)
    if (specList) {
      if (Array.isArray(data.specs)) {
        specList.innerHTML = data.specs
          .map(function (pair) {
            return '<div><strong>' + pair[0] + ':</strong> ' + pair[1] + '</div>';
          })
          .join('');
      } else if (data.specs && typeof data.specs === 'object') {
        specList.innerHTML = Object.keys(data.specs)
          .map(function (k) {
            var label = SPEC_LABELS[k] || k;
            return '<div><strong>' + label + ':</strong> ' + data.specs[k] + '</div>';
          })
          .join('');
      } else {
        specList.innerHTML =
          '<div><strong>Thương hiệu:</strong> ' +
          (data.brand || 'SportStore') +
          '</div><div><strong>Danh mục:</strong> ' +
          (data.category || 'Thể thao') +
          '</div>';
      }
    }

    // 8. SO SÁNH ĐỐI THỦ CÙNG PHÂN KHÚC
    if (compareGrid && allProducts && allProducts.length > 0) {
      var sameCategory = allProducts.filter(function (p) {
        return p.id !== data.id && (p.categoryId === data.categoryId || p.category === data.category);
      });
      var rivals = sameCategory.slice(0, 3);
      if (rivals.length < 3) {
        allProducts.forEach(function (p) {
          if (p.id !== data.id && rivals.indexOf(p) === -1 && rivals.length < 3) {
            rivals.push(p);
          }
        });
      }

      compareGrid.innerHTML = rivals.map(function (p) {
        var pImg = (p.gallery && p.gallery[0]) || p.image;
        var pPrice = p.salePrice || p.price;
        var pWeight = (p.specs && p.specs.weight) ? p.specs.weight : '210g';
        var pCushion = (p.specs && p.specs.cushion) ? p.specs.cushion : 'Đệm thể thao';
        var pSurface = (p.specs && p.specs.surface) ? p.specs.surface : 'Đa năng';

        return (
          '<article class="compare-card">' +
            '<img src="' + pImg + '" alt="' + p.name + '" />' +
            '<div style="font-size: 11px; font-weight: 700; color: #0284c7; text-transform: uppercase; margin-bottom: 4px;">' + (p.brand || 'CHÍNH HÃNG') + '</div>' +
            '<h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin-bottom: 6px; line-height: 1.4;">' + p.name + '</h3>' +
            '<div style="font-size: 1.15rem; font-weight: 800; color: #0284c7; margin-bottom: 12px;">' + formatCurrency(pPrice) + '</div>' +
            '<div class="spec-list" style="margin-bottom: 18px; font-size: 0.88rem;">' +
              '<div><strong>⚖️ Trọng lượng:</strong> ' + pWeight + '</div>' +
              '<div><strong>☁️ Đệm:</strong> ' + pCushion + '</div>' +
              '<div><strong>🏃 Địa hình:</strong> ' + pSurface + '</div>' +
            '</div>' +
            '<button type="button" class="btn-compare-switch" data-switch-id="' + p.id + '" style="margin-top: auto; width: 100%; text-align: center;">Xem chi tiết sản phẩm này</button>' +
          '</article>'
        );
      }).join('');

      var switchButtons = compareGrid.querySelectorAll('[data-switch-id]');
      switchButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var targetId = btn.getAttribute('data-switch-id');
          if (targetId) {
            switchToProduct(targetId, allProducts);
          }
        });
      });
    }

    // 9. Nút "Thêm vào giỏ hàng" VỚI HIỆU ỨNG FLY-TO-CART
    if (addToCartButton) {
      addToCartButton.onclick = function () {
        var activeSizeBtn = document.querySelector('.size-btn.active');
        var activeColorBtn = document.querySelector('.swatch.active');
        var selectedSize = activeSizeBtn ? activeSizeBtn.textContent.trim() : 'Mặc định';
        var selectedColor = activeColorBtn ? (activeColorBtn.getAttribute('data-color-name') || activeColorBtn.textContent.replace('✔', '').trim()) : 'Tiêu chuẩn';

        var currentActiveImage = mainImage ? mainImage.src : (data.gallery && data.gallery[0]) || data.image;

        var cartProduct = {
          id: data.id,
          name: data.name,
          price: data.salePrice || data.price,
          image: currentActiveImage,
          size: selectedSize,
          color: selectedColor
        };

        // KÍCH HOẠT HIỆU ỨNG FLY-TO-CART
        triggerFlyToCartAnimation(mainImage, function () {
          if (typeof addToCart === 'function') {
            addToCart(cartProduct, currentQuantity);
          } else {
            var rawCart = localStorage.getItem('sport_cart');
            var cartArr = [];
            try {
              cartArr = rawCart ? JSON.parse(rawCart) : [];
            } catch (e) {
              cartArr = [];
            }
            var exist = cartArr.find(function (it) {
              return it.id === cartProduct.id && it.size === cartProduct.size && it.color === cartProduct.color;
            });
            if (exist) {
              exist.quantity += currentQuantity;
            } else {
              cartProduct.quantity = currentQuantity;
              cartArr.push(cartProduct);
            }
            localStorage.setItem('sport_cart', JSON.stringify(cartArr));

            var badge = document.getElementById('header-cart-badge-count');
            if (badge) {
              var totalCount = cartArr.reduce(function (sum, item) {
                return sum + (item.quantity || 1);
              }, 0);
              badge.textContent = totalCount;
            }

            if (typeof showToast === 'function') {
              showToast('Đã thêm ' + currentQuantity + 'x "' + data.name + '" vào giỏ hàng!', 'success');
            } else {
              alert('Đã thêm ' + currentQuantity + 'x "' + data.name + '" vào giỏ hàng!');
            }
          }
        });
      };
    }

    // 10. Nút "Yêu thích" (Toggle Heart Effect)
    if (wishButton) {
      var isWished = false;
      wishButton.onclick = function () {
        isWished = !isWished;
        if (isWished) {
          wishButton.textContent = '❤️';
          wishButton.style.borderColor = '#ef4444';
          wishButton.style.background = '#fef2f2';
          if (typeof showToast === 'function') {
            showToast('Đã thêm "' + data.name + '" vào danh sách yêu thích!', 'success');
          }
        } else {
          wishButton.textContent = '🤍';
          wishButton.style.borderColor = '#cbd5e1';
          wishButton.style.background = '#f8fafc';
          if (typeof showToast === 'function') {
            showToast('Đã bỏ yêu thích "' + data.name + '"', 'info');
          }
        }
      };
    }
  }

  /**
   * Khởi chạy chính khi trang được nạp
   */
  function initProductDetails() {
    var allProducts = loadProductsList();
    if (!allProducts || allProducts.length === 0) {
      var titleEl = document.querySelector('[data-title]');
      if (titleEl) {
        titleEl.textContent = 'Đang đồng bộ dữ liệu sản phẩm SportStore...';
      }
      return;
    }

    var targetId = getRequestedProductId();
    var currentProduct = findProduct(targetId, allProducts);
    renderProduct(currentProduct, allProducts);

    window.addEventListener('popstate', function () {
      var currentId = getRequestedProductId();
      var prod = findProduct(currentId, allProducts);
      if (prod) {
        renderProduct(prod, allProducts);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductDetails);
  } else {
    initProductDetails();
  }
})();
