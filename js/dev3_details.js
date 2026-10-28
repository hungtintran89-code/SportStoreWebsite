/**
 * ==============================================================================
 * SPORTSTORE - LOGIC TRANG CHI TIẾT SẢN PHẨM & SO SÁNH (DEV 3 - PRODUCT)
 * File: js/dev3_details.js
 * ==============================================================================
 */

(function () {
  'use strict';

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
    if (c.includes('hồng') || c.includes('pink')) {
      return {
        primary: '#ec4899',
        bgLight: '#fdf2f8',
        ring: 'rgba(236, 72, 153, 0.35)',
        dot: '#ec4899',
        textActive: '#be185d'
      };
    }
    if (c.includes('đỏ cam') || c.includes('cam') || c.includes('orange')) {
      return {
        primary: '#ea580c',
        bgLight: '#fff7ed',
        ring: 'rgba(234, 88, 12, 0.35)',
        dot: '#ea580c',
        textActive: '#c2410c'
      };
    }
    if (c.includes('vàng') || c.includes('yellow') || c.includes('gold')) {
      return {
        primary: '#d97706',
        bgLight: '#fefce8',
        ring: 'rgba(217, 119, 6, 0.35)',
        dot: '#f59e0b',
        textActive: '#b45309'
      };
    }
    if (c.includes('neon') || c.includes('solar green') || c.includes('mint') || c.includes('xanh lục') || c.includes('chanh')) {
      return {
        primary: '#10b981',
        bgLight: '#ecfdf5',
        ring: 'rgba(16, 185, 129, 0.35)',
        dot: '#10b981',
        textActive: '#047857'
      };
    }
    if (c.includes('đỏ') || c.includes('red')) {
      return {
        primary: '#ef4444',
        bgLight: '#fef2f2',
        ring: 'rgba(239, 68, 68, 0.35)',
        dot: '#ef4444',
        textActive: '#b91c1c'
      };
    }
    if (c.includes('xanh') || c.includes('blue')) {
      return {
        primary: '#0284c7',
        bgLight: '#f0f9ff',
        ring: 'rgba(2, 132, 199, 0.25)',
        dot: '#0284c7',
        textActive: '#0369a1'
      };
    }
    if (c.includes('đen') || c.includes('black')) {
      return {
        primary: '#334155',
        bgLight: '#f8fafc',
        ring: 'rgba(51, 65, 85, 0.25)',
        dot: '#0f172a',
        textActive: '#0f172a'
      };
    }
    if (c.includes('trắng') || c.includes('white') || c.includes('bạc') || c.includes('xám')) {
      return {
        primary: '#64748b',
        bgLight: '#f8fafc',
        ring: 'rgba(100, 116, 139, 0.25)',
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

  function formatCurrency(amount) {
    if (typeof amount === 'string') {
      amount = Number(amount.replace(/[^0-9]/g, ''));
    }
    var num = Number(amount) || 0;
    return num.toLocaleString('vi-VN') + ' đ';
  }

  function loadProductsList() {
    var key = typeof STORAGE_KEYS !== 'undefined' && STORAGE_KEYS.PRODUCTS ? STORAGE_KEYS.PRODUCTS : 'sport_products';
    var defaultSource = (typeof products !== 'undefined' && products.length > 0) ? products : ((typeof MOCK_PRODUCTS !== 'undefined' && MOCK_PRODUCTS.length > 0) ? MOCK_PRODUCTS : []);

    if (typeof getStorage === 'function') {
      var stored = getStorage(key, null);
      if (stored && stored.length > 0) return stored;
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

  function findProduct(idOrCode, list) {
    if (!list || list.length === 0) return null;
    if (!idOrCode) return list[0];

    var searchStr = String(idOrCode).trim().toLowerCase();
    var found = list.find(function (p) {
      return String(p.id).toLowerCase() === searchStr || (p.code && p.code.toLowerCase() === searchStr);
    });
    return found || list[0];
  }

  function triggerFlyToCartAnimation(sourceImgEl, callback) {
    var cartBtn = document.getElementById('header-cart-btn') || document.getElementById('header-cart-badge-count');
    if (!sourceImgEl || !cartBtn) {
      if (typeof callback === 'function') callback();
      return;
    }

    var imgRect = sourceImgEl.getBoundingClientRect();
    var cartRect = cartBtn.getBoundingClientRect();

    var flyer = document.createElement('img');
    flyer.src = sourceImgEl.src;
    flyer.className = 'fly-to-cart-element';
    flyer.style.top = imgRect.top + 'px';
    flyer.style.left = imgRect.left + 'px';
    flyer.style.width = imgRect.width + 'px';
    flyer.style.height = imgRect.height + 'px';
    flyer.style.opacity = '0.92';
    document.body.appendChild(flyer);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var targetX = cartRect.left + cartRect.width / 2 - 16;
        var targetY = cartRect.top + cartRect.height / 2 - 16;
        flyer.style.top = targetY + 'px';
        flyer.style.left = targetX + 'px';
        flyer.style.width = '30px';
        flyer.style.height = '30px';
        flyer.style.opacity = '0.15';
        flyer.style.transform = 'scale(0.3) rotate(360deg)';
      });
    });

    setTimeout(function () {
      if (flyer.parentNode) {
        flyer.parentNode.removeChild(flyer);
      }

      var cartBadge = document.getElementById('header-cart-badge-count');
      if (cartBtn) {
        cartBtn.classList.remove('cart-bounce-active');
        void cartBtn.offsetWidth;
        cartBtn.classList.add('cart-bounce-active');
        setTimeout(function () {
          cartBtn.classList.remove('cart-bounce-active');
        }, 650);
      }
      if (cartBadge) {
        cartBadge.classList.remove('badge-pulse-active');
        void cartBadge.offsetWidth;
        cartBadge.classList.add('badge-pulse-active');
        setTimeout(function () {
          cartBadge.classList.remove('badge-pulse-active');
        }, 650);
      }

      if (typeof callback === 'function') callback();
    }, 750);
  }

  function switchToProduct(newId, allProducts) {
    var target = findProduct(newId, allProducts);
    if (!target) return;

    renderProduct(target, allProducts);

    try {
      var newUrl = window.location.pathname + '?id=' + target.id;
      window.history.pushState({ id: target.id }, '', newUrl);
    } catch (err) {}

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderProduct(data, allProducts) {
    var crumbTitle = document.querySelector('[data-crumb-title]');
    var galleryWrap = document.querySelector('[data-gallery]');
    var mainImage = document.querySelector('[data-main-image]');
    var counterBadge = document.querySelector('[data-gallery-counter]');
    var prevBtn = document.querySelector('[data-gallery-prev]');
    var nextBtn = document.querySelector('[data-gallery-next]');

    var title = document.querySelector('[data-title]');
    var tag = document.querySelector('[data-tag]');
    var stockText = document.querySelector('[data-stock-text]');
    var priceEl = document.querySelector('[data-price]');
    var oldPriceEl = document.querySelector('[data-old-price]');
    var ratingEl = document.querySelector('[data-rating]');
    var reviewsEl = document.querySelector('[data-reviews]');
    var soldEl = document.querySelector('[data-sold]');

    var currentColorLabel = document.getElementById('current-color-label');
    var currentSizeLabel = document.getElementById('current-size-label');
    var swatchesWrap = document.querySelector('[data-swatches-wrap]');
    var sizesWrap = document.querySelector('[data-sizes-wrap]');

    var descEl = document.querySelector('[data-desc]');
    var featuresEl = document.querySelector('[data-features]');
    var specsTable = document.querySelector('[data-specs]');
    var compareGrid = document.querySelector('[data-compare]');

    var addToCartBtn = document.querySelector('[data-add-cart]');
    var wishlistBtn = document.querySelector('.btn-wishlist-toggle');

    var qtyMinus = document.querySelector('[data-qty-minus]');
    var qtyPlus = document.querySelector('[data-qty-plus]');
    var qtyInput = document.querySelector('[data-qty-input]');
    var currentQuantity = 1;

    if (!title || !priceEl || !data) return;

    // Breadcrumb
    if (crumbTitle) crumbTitle.textContent = data.name;

    // Title & Badges
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
    if (stockText) stockText.textContent = 'Còn hàng (' + (data.stock || 15) + ' SP)';

    // Giá bán
    var currentPrice = data.salePrice || data.price;
    priceEl.textContent = formatCurrency(currentPrice);

    if (oldPriceEl) {
      if (data.salePrice && data.salePrice < data.price) {
        oldPriceEl.textContent = formatCurrency(data.price);
        oldPriceEl.style.display = 'inline';
      } else {
        oldPriceEl.style.display = 'none';
      }
    }

    // Ratings
    if (ratingEl) ratingEl.textContent = (data.rating || 5) + ' / 5';
    if (reviewsEl) reviewsEl.textContent = (data.reviewCount || 98) + ' đánh giá';
    if (soldEl) soldEl.textContent = 'Đã bán ' + (data.sold || 142);

    // Danh sách ảnh & sizes & colors
    var imageList = data.gallery && data.gallery.length > 0 ? data.gallery : [data.image];
    var sizesList = data.sizes && data.sizes.length > 0 ? data.sizes : ['39', '40', '41', '42', '42.5', '43', '44'];
    var colorsList = data.colors && data.colors.length > 0 ? data.colors : ['Tiêu Chuẩn'];

    // CHỈ HIỂN THỊ NÚT < >, HUY HIỆU 1/X VÀ THUMBNAILS KHI CÓ > 1 ẢNH
    var hasMultiple = imageList.length > 1;
    if (prevBtn) prevBtn.style.display = hasMultiple ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = hasMultiple ? 'flex' : 'none';
    if (counterBadge) counterBadge.style.display = hasMultiple ? 'block' : 'none';
    if (galleryWrap) galleryWrap.style.display = hasMultiple ? 'flex' : 'none';

    var currentImgIdx = 0;

    function showImage(idx) {
      if (idx < 0) idx = imageList.length - 1;
      if (idx >= imageList.length) idx = 0;
      currentImgIdx = idx;

      if (mainImage) {
        mainImage.style.opacity = '0.35';
        setTimeout(function () {
          mainImage.src = imageList[currentImgIdx];
          mainImage.style.opacity = '1';
        }, 80);
      }

      if (counterBadge && hasMultiple) {
        counterBadge.textContent = (currentImgIdx + 1) + '/' + imageList.length;
      }

      if (galleryWrap) {
        var thumbs = galleryWrap.querySelectorAll('.thumb-btn');
        thumbs.forEach(function (t, i) {
          t.classList.toggle('active', i === currentImgIdx);
        });
      }

      // ĐỒNG BỘ: Chọn swatch màu tương ứng & Đổi màu chữ label
      if (swatchesWrap) {
        var allSwatches = swatchesWrap.querySelectorAll('.swatch');
        if (allSwatches.length > 0) {
          var targetColorIdx = currentImgIdx % allSwatches.length;
          allSwatches.forEach(function (s, i) {
            s.classList.toggle('active', i === targetColorIdx);
          });
          var activeSwatch = allSwatches[targetColorIdx];
          if (activeSwatch && currentColorLabel) {
            var colorName = activeSwatch.getAttribute('data-color-name');
            currentColorLabel.textContent = colorName;
            var curTheme = parseColorTheme(colorName);
            currentColorLabel.style.color = curTheme.primary;
          }
        }
      }
    }

    // Gắn sự kiện nút < và >
    if (prevBtn) {
      prevBtn.onclick = function () { showImage(currentImgIdx - 1); };
    }
    if (nextBtn) {
      nextBtn.onclick = function () { showImage(currentImgIdx + 1); };
    }

    // Render Thumbnails
    if (galleryWrap && hasMultiple) {
      galleryWrap.innerHTML = imageList.map(function (src, idx) {
        return (
          '<button type="button" class="thumb-btn ' + (idx === 0 ? 'active' : '') + '" data-thumb="' + idx + '">' +
            '<img src="' + src + '" alt="' + data.name + ' góc ' + (idx + 1) + '" />' +
          '</button>'
        );
      }).join('');

      var thumbButtons = galleryWrap.querySelectorAll('.thumb-btn');
      thumbButtons.forEach(function (btn, idx) {
        btn.onclick = function () { showImage(idx); };
      });
    }

    // Colors - TỰ ĐỘNG GÁN MÀU HOVER / ACTIVE & CHECKMARK
    if (swatchesWrap) {
      swatchesWrap.innerHTML = '';
      colorsList.forEach(function (c, idx) {
        var theme = parseColorTheme(c);
        var btn = document.createElement('button');
        btn.className = 'swatch ' + (idx === 0 ? 'active' : '');
        btn.type = 'button';
        btn.setAttribute('data-swatch', idx);
        btn.setAttribute('data-color-name', c);

        btn.style.setProperty('--swatch-hover-bg', theme.bgLight);
        btn.style.setProperty('--swatch-hover-border', theme.primary);
        btn.style.setProperty('--swatch-hover-color', theme.textActive);
        btn.style.setProperty('--swatch-hover-shadow', theme.ring);
        btn.style.setProperty('--swatch-active-bg', theme.bgLight);
        btn.style.setProperty('--swatch-active-border', theme.primary);
        btn.style.setProperty('--swatch-active-color', theme.textActive);
        btn.style.setProperty('--swatch-active-ring', theme.ring);

        btn.innerHTML =
          '<span class="swatch-dot" style="background:' + theme.dot + '"></span>' +
          '<span>' + c + '</span>' +
          '<span class="swatch-check" style="color:' + theme.primary + '">✔</span>';

        btn.onclick = function () {
          var targetImgIdx = idx % imageList.length;
          showImage(targetImgIdx);
        };

        swatchesWrap.appendChild(btn);
      });

      if (currentColorLabel && colorsList[0]) {
        currentColorLabel.textContent = colorsList[0];
        var firstTheme = parseColorTheme(colorsList[0]);
        currentColorLabel.style.color = firstTheme.primary;
      }
    }

    // Khởi tạo hiển thị ảnh đầu tiên
    showImage(0);

    // Sizes
    if (sizesWrap) {
      sizesWrap.innerHTML = sizesList.map(function (s, idx) {
        return (
          '<button type="button" class="size-btn ' + (idx === 0 ? 'active' : '') + '" data-size="' + s + '">' +
            s +
          '</button>'
        );
      }).join('');

      if (currentSizeLabel && sizesList[0]) {
        currentSizeLabel.textContent = sizesList[0];
      }

      var sizeButtons = sizesWrap.querySelectorAll('.size-btn');
      sizeButtons.forEach(function (btn) {
        btn.onclick = function () {
          sizeButtons.forEach(function (s) { s.classList.remove('active'); });
          btn.classList.add('active');
          if (currentSizeLabel) {
            currentSizeLabel.textContent = btn.getAttribute('data-size');
          }
        };
      });
    }

    // Stepper
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

    // Tabs switching
    var tabBtns = document.querySelectorAll('.tab-nav-btn');
    tabBtns.forEach(function (tab) {
      tab.onclick = function () {
        tabBtns.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var targetId = tab.getAttribute('data-tab-target');
        var panels = document.querySelectorAll('.tab-panel');
        panels.forEach(function (p) {
          p.style.display = p.id === targetId ? 'block' : 'none';
        });
      };
    });

    // Content: Mô tả & Specs
    if (descEl && data.desc) descEl.textContent = data.desc;
    if (featuresEl) {
      if (data.features && data.features.length > 0) {
        featuresEl.innerHTML = data.features.map(function (f) {
          return '<li>' + f + '</li>';
        }).join('');
      } else {
        featuresEl.innerHTML = '<li>Chất liệu cao cấp, độ hoàn thiện tinh xảo đạt tiêu chuẩn quốc tế.</li>';
      }
    }

    if (specsTable) {
      var specsHtml = '';
      if (data.specs && typeof data.specs === 'object') {
        Object.keys(data.specs).forEach(function (k) {
          var label = SPEC_LABELS[k] || k;
          specsHtml += '<div class="spec-row"><div class="spec-key">' + label + '</div><div class="spec-val">' + data.specs[k] + '</div></div>';
        });
      }
      specsTable.innerHTML = specsHtml || '<div class="spec-row"><div class="spec-key">Thương hiệu</div><div class="spec-val">' + (data.brand || 'SportStore') + '</div></div>';
    }

    // Compare section (Sản phẩm cùng phân khúc - Chuẩn 3 đối thủ TV3)
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
        return (
          '<article class="rival-card-clean">' +
            '<div class="rival-img-box">' +
              '<img src="' + pImg + '" alt="' + p.name + '" />' +
            '</div>' +
            '<h4 class="rival-title" title="' + p.name + '">' + p.name + '</h4>' +
            '<div class="rival-price">' + formatCurrency(pPrice) + '</div>' +
            '<button type="button" class="btn-rival-detail" data-switch-id="' + p.id + '">Xem chi tiết</button>' +
          '</article>'
        );
      }).join('');

      var switchButtons = compareGrid.querySelectorAll('[data-switch-id]');
      switchButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var targetId = btn.getAttribute('data-switch-id');
          if (targetId) switchToProduct(targetId, allProducts);
        });
      });
    }

    // Add to cart with Fly-to-cart
    if (addToCartBtn) {
      addToCartBtn.onclick = function () {
        var activeSize = sizesWrap ? sizesWrap.querySelector('.size-btn.active') : null;
        var activeColor = swatchesWrap ? swatchesWrap.querySelector('.swatch.active') : null;
        var selSize = activeSize ? activeSize.getAttribute('data-size') : 'Mặc định';
        var selColor = activeColor ? activeColor.getAttribute('data-color-name') : 'Tiêu chuẩn';

        var currentActiveImage = mainImage ? mainImage.src : (data.gallery && data.gallery[0]) || data.image;

        var cartProduct = {
          id: data.id,
          name: data.name,
          price: data.salePrice || data.price,
          image: currentActiveImage,
          size: selSize,
          color: selColor
        };

        triggerFlyToCartAnimation(mainImage, function () {
          if (typeof addToCart === 'function') {
            addToCart(cartProduct, currentQuantity);
          } else {
            var rawCart = localStorage.getItem('sport_cart');
            var cartArr = [];
            try { cartArr = rawCart ? JSON.parse(rawCart) : []; } catch (e) { cartArr = []; }
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
              var totalCount = cartArr.reduce(function (sum, item) { return sum + (item.quantity || 1); }, 0);
              badge.textContent = totalCount;
            }
          }

          if (typeof showToast === 'function') {
            showToast('Đã thêm ' + currentQuantity + 'x "' + data.name + '" vào giỏ hàng!', 'success');
          } else {
            alert('Đã thêm ' + currentQuantity + 'x "' + data.name + '" vào giỏ hàng!');
          }
        });
      };
    }

    // Wishlist
    if (wishlistBtn) {
      var isWished = false;
      wishlistBtn.onclick = function () {
        isWished = !isWished;
        if (isWished) {
          wishlistBtn.textContent = '❤️';
          wishlistBtn.style.borderColor = '#ef4444';
          wishlistBtn.style.background = '#fef2f2';
          if (typeof showToast === 'function') showToast('Đã thêm vào danh sách yêu thích!', 'success');
        } else {
          wishlistBtn.textContent = '🤍';
          wishlistBtn.style.borderColor = '#cbd5e1';
          wishlistBtn.style.background = '#f8fafc';
        }
      };
    }
  }

  function initProductDetails() {
    var allProducts = loadProductsList();
    if (!allProducts || allProducts.length === 0) return;

    var targetId = getRequestedProductId();
    var currentProduct = findProduct(targetId, allProducts);
    renderProduct(currentProduct, allProducts);

    window.addEventListener('popstate', function () {
      var currentId = getRequestedProductId();
      var prod = findProduct(currentId, allProducts);
      if (prod) renderProduct(prod, allProducts);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductDetails);
  } else {
    initProductDetails();
  }
})();
