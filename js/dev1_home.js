/**
 * ==========================================================================
 * SPORTSTORE - DEV 1 MODULE: TRANG CHỦ & TRÌNH DIỄN THƯƠNG HIỆU (DEV1_HOME.JS)
 * Chuẩn chạy Local file:/// không phát sinh lỗi CORS
 * ==========================================================================
 */

(function () {
  'use strict';

  // State cục bộ riêng biệt của Dev 1
  var currentSlideIndex = 0;
  var slidesData = [];
  var sliderTimer = null;
  var trendingData = [];
  var activeTabId = 'bestseller';

  // Dữ liệu Mock trang chủ tĩnh chuẩn SGU (Hoạt động 100% offline trên file:///)
  var FALLBACK_HOME_DATA = {
    banners: [
      {
        id: 1,
        tag: "SIÊU PHẨM MÙA HÈ 2026",
        title: "BỨT PHÁ MỌI GIỚI HẠN TỐC ĐỘ",
        subtitle: "Bộ sưu tập giày marathon công nghệ đệm sợi Carbon mới nhất từ Nike & Adidas. Giảm ngay 30% cho hội viên.",
        btnText: "Khám Phá Bộ Sưu Tập",
        link: "pages/dev2_products.html",
        badge: "NEW RELEASE",
        bg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&auto=format&fit=crop&q=80"
      },
      {
        id: 2,
        tag: "CHINH PHỤC SÂN CỎ",
        title: "ĐỈNH CAO BÓNG ĐÁ CHUYÊN NGHIỆP",
        subtitle: "Trang bị thi đấu đẳng cấp thế giới: Giày đinh FG thế hệ mới, bóng chuẩn FIFA Quality Pro.",
        btnText: "Mua Sắm Ngay",
        link: "pages/dev2_products.html",
        badge: "HOT TREND",
        bg: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1600&auto=format&fit=crop&q=80"
      },
      {
        id: 3,
        tag: "QUẦN VỢT & CẦU LÔNG",
        title: "CÔNG PHÁ MỌI ĐƯỜNG CẦU",
        subtitle: "Vợt trợ lực sợi thủy tinh mật độ cao, độ cân bằng hoàn hảo cho từng cú đập uy lực.",
        btnText: "Xem Chi Tiết",
        link: "pages/dev2_products.html",
        badge: "EXCLUSIVE",
        bg: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1600&auto=format&fit=crop&q=80"
      }
    ],
    flashSale: {
      title: "⚡ FLASH SALE GIỜ VÀNG THỂ THAO",
      items: [
        {
          id: 101,
          name: "Giày Chạy Bộ Nike ZoomX Vaporfly 3",
          category: "Chạy Bộ",
          price: 5490000,
          salePrice: 3840000,
          discount: "-30%",
          rating: 4.9,
          sold: 68,
          stock: 100,
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
        },
        {
          id: 102,
          name: "Vợt Tennis Wilson Pro Staff v14",
          category: "Tennis",
          price: 5890000,
          salePrice: 4410000,
          discount: "-25%",
          rating: 4.8,
          sold: 32,
          stock: 50,
          image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&auto=format&fit=crop&q=80"
        },
        {
          id: 103,
          name: "Áo Đá Bóng Dri-FIT ADV Pro Match",
          category: "Bóng Đá",
          price: 1250000,
          salePrice: 750000,
          discount: "-40%",
          rating: 4.7,
          sold: 115,
          stock: 150,
          image: "https://images.unsplash.com/photo-1577210897949-1f56f943502f?w=600&auto=format&fit=crop&q=80"
        },
        {
          id: 104,
          name: "Quả Bóng Đá FIFA Quality Pro Match",
          category: "Bóng Đá",
          price: 950000,
          salePrice: 665000,
          discount: "-30%",
          rating: 4.9,
          sold: 89,
          stock: 120,
          image: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=600&auto=format&fit=crop&q=80"
        }
      ]
    },
    trendingCategories: [
      {
        id: "running",
        name: "Chạy Bộ Marathon",
        count: "140+ Sản phẩm",
        icon: "🏃‍♂️"
      },
      {
        id: "football",
        name: "Bóng Đá Sân Cỏ",
        count: "95+ Sản phẩm",
        icon: "⚽"
      },
      {
        id: "racket",
        name: "Cầu Lông & Tennis",
        count: "80+ Sản phẩm",
        icon: "🏸"
      },
      {
        id: "gym",
        name: "Gym & Thể Hình",
        count: "110+ Sản phẩm",
        icon: "🏋️‍♂️"
      }
    ],
    trendingTabs: [
      {
        tabId: "bestseller",
        title: "Bán Chạy Nhất",
        products: [
          {
            id: 111,
            name: "Giày Adidas Adizero Adios Pro 3",
            category: "Chạy Bộ",
            price: 5500000,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
            badge: "BEST SELLER"
          },
          {
            id: 112,
            name: "Giày Đá Bóng Adidas Predator Elite FG",
            category: "Bóng Đá",
            price: 3200000,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80",
            badge: "POPULAR"
          },
          {
            id: 113,
            name: "Vợt Cầu Lông Yonex Astrox 100ZZ",
            category: "Cầu Lông",
            price: 4350000,
            rating: 5.0,
            image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
            badge: "CHAMPION"
          },
          {
            id: 114,
            name: "Túi Trống Thể Thao Chống Nước Gym Pro",
            category: "Phụ Kiện",
            price: 680000,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
            badge: "TRENDING"
          }
        ]
      },
      {
        tabId: "newarrival",
        title: "Hàng Mới Về 2026",
        products: [
          {
            id: 115,
            name: "Đồng Hồ Đo Nhịp Tim Thể Thao Garmin Forerunner",
            category: "Công Nghệ",
            price: 8900000,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
            badge: "NEW TECH"
          },
          {
            id: 116,
            name: "Bình Nước Giữ Nhiệt Thể Thao Titan 1000ml",
            category: "Phụ Kiện",
            price: 420000,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
            badge: "NEW"
          },
          {
            id: 117,
            name: "Băng Cổ Chân Bảo Vệ Khớp Cao Cấp",
            category: "Bảo Hộ",
            price: 290000,
            rating: 4.6,
            image: "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=600&auto=format&fit=crop&q=80",
            badge: "NEW"
          },
          {
            id: 118,
            name: "Áo Khoác Gió Chạy Bộ Siêu Nhẹ Kháng Nước",
            category: "Thời Trang",
            price: 1490000,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80",
            badge: "NEW"
          }
        ]
      }
    ]
  };

  // Khởi tạo khi DOM sẵn sàng
  document.addEventListener('DOMContentLoaded', function () {
    initHomeModule();
    updateCartCountBadge();
  });

  function initHomeModule() {
    loadHomeData();
    initCountdownTimer();
    initNewsletterForm();
  }

  function getPageUrl(targetPage) {
    var isPagesDir = window.location.pathname.includes('/pages/');
    return isPagesDir ? targetPage : 'pages/' + targetPage;
  }

  /**
   * Nạp dữ liệu trang chủ không gây lỗi CORS
   */
  function loadHomeData() {
    function applyHomeData(data) {
      renderHeroCarousel(data.banners || []);
      renderFlashSale(data.flashSale ? data.flashSale.items : []);
      renderCategories(data.trendingCategories || []);
      initTrendingTabs(data.trendingTabs || []);
    }

    // Nếu chạy local file:///, áp dụng ngay dữ liệu tĩnh để tránh CORS
    if (window.location.protocol === 'file:') {
      applyHomeData(FALLBACK_HOME_DATA);
      return;
    }

    // Nếu chạy qua HTTP web server
    var jsonPath = window.location.pathname.includes('/pages/') ? '../data/dev1_home.json' : 'data/dev1_home.json';
    fetch(jsonPath)
      .then(function (res) {
        if (!res.ok) throw new Error('Không thể nạp dữ liệu dev1_home.json');
        return res.json();
      })
      .then(function (data) {
        applyHomeData(data);
      })
      .catch(function () {
        applyHomeData(FALLBACK_HOME_DATA);
      });
  }

  /**
   * 1. Render Hero Banner Carousel & Auto Slide
   */
  function renderHeroCarousel(banners) {
    slidesData = banners;
    var slidesContainer = document.getElementById('dev1-carousel-slides');
    var dotsContainer = document.getElementById('dev1-carousel-dots');
    if (!slidesContainer || !dotsContainer || banners.length === 0) return;

    slidesContainer.innerHTML = '';
    dotsContainer.innerHTML = '';

    for (var idx = 0; idx < banners.length; idx++) {
      var b = banners[idx];
      var slideEl = document.createElement('div');
      slideEl.className = 'dev1-slide-item ' + (idx === 0 ? 'active' : '');
      slideEl.style.backgroundImage = "url('" + (b.bg || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600") + "')";

      var slideLink = getPageUrl(b.link || 'dev2_products.html');
      slideEl.innerHTML = `
        <div class="dev1-slide-overlay"></div>
        <div class="dev1-slide-content">
          <span class="sport-badge badge-cyan dev1-slide-badge">${b.badge || 'SPORT EXCLUSIVE'}</span>
          <h1 class="dev1-slide-title">${b.title}</h1>
          <p class="dev1-slide-sub">${b.subtitle}</p>
          <div class="dev1-slide-tag-row">
            <a href="${slideLink}" class="btn-sport btn-primary">${b.btnText || 'Khám Phá Ngay'}</a>
            <span class="sport-badge badge-orange dev1-slide-tag-pill">${b.tag || 'HOT DEAL'}</span>
          </div>
        </div>
      `;
      slidesContainer.appendChild(slideEl);

      // Tạo dot indicator
      (function (i) {
        var dot = document.createElement('div');
        dot.className = 'dev1-dot ' + (i === 0 ? 'active' : '');
        dot.addEventListener('click', function () {
          goToSlide(i);
          restartSliderTimer();
        });
        dotsContainer.appendChild(dot);
      })(idx);
    }

    // Gắn sự kiện nút Prev / Next
    var prevBtn = document.getElementById('dev1-prev-slide');
    var nextBtn = document.getElementById('dev1-next-slide');

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goToSlide((currentSlideIndex - 1 + slidesData.length) % slidesData.length);
        restartSliderTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goToSlide((currentSlideIndex + 1) % slidesData.length);
        restartSliderTimer();
      });
    }

    startSliderTimer();
  }

  function goToSlide(index) {
    var slides = document.querySelectorAll('.dev1-slide-item');
    var dots = document.querySelectorAll('.dev1-dot');
    if (!slides.length) return;

    for (var i = 0; i < slides.length; i++) {
      slides[i].classList.remove('active');
    }
    for (var j = 0; j < dots.length; j++) {
      dots[j].classList.remove('active');
    }

    currentSlideIndex = index;
    if (slides[currentSlideIndex]) slides[currentSlideIndex].classList.add('active');
    if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');
  }

  function startSliderTimer() {
    sliderTimer = setInterval(function () {
      goToSlide((currentSlideIndex + 1) % slidesData.length);
    }, 4500);
  }

  function restartSliderTimer() {
    clearInterval(sliderTimer);
    startSliderTimer();
  }

  /**
   * 2. Flash Sale Countdown Timer
   */
  function initCountdownTimer() {
    var totalSeconds = 8 * 3600 + 45 * 60 + 27;

    var hoursEl = document.getElementById('dev1-hours');
    var minutesEl = document.getElementById('dev1-minutes');
    var secondsEl = document.getElementById('dev1-seconds');

    if (!hoursEl || !minutesEl || !secondsEl) return;

    setInterval(function () {
      if (totalSeconds <= 0) return;
      totalSeconds--;

      var h = Math.floor(totalSeconds / 3600);
      var m = Math.floor((totalSeconds % 3600) / 60);
      var s = totalSeconds % 60;

      hoursEl.textContent = String(h).padStart(2, '0');
      minutesEl.textContent = String(m).padStart(2, '0');
      secondsEl.textContent = String(s).padStart(2, '0');
    }, 1000);
  }

  /**
   * 3. Render sản phẩm Flash Sale
   */
  function renderFlashSale(items) {
    var grid = document.getElementById('dev1-flash-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var card = document.createElement('div');
      card.className = 'dev1-flash-card';
      var percentSold = Math.round((item.sold / item.stock) * 100);

      card.innerHTML = `
        <div class="dev1-card-media">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          <span class="dev1-card-discount-badge">${item.discount}</span>
        </div>
        <div class="dev1-card-body">
          <div class="dev1-card-cat">${item.category}</div>
          <h3 class="dev1-card-title">${item.name}</h3>
          <div class="dev1-price-row">
            <span class="dev1-sale-price">${formatCurrency(item.salePrice)}</span>
            <span class="dev1-old-price">${formatCurrency(item.price)}</span>
          </div>
          <div class="dev1-progress-bar">
            <div class="dev1-progress-fill" style="width: ${percentSold}%"></div>
          </div>
          <div class="dev1-flash-progress-meta">
            <span>Đã bán: ${item.sold}</span>
            <span>⭐ ${item.rating}</span>
          </div>
          <button type="button" class="btn-sport btn-accent dev1-btn-flash-buy dev1-btn-flash-buy-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.salePrice}" data-image="${item.image}">
            Săn Sale Ngay
          </button>
        </div>
      `;
      grid.appendChild(card);
    }

    // Sự kiện nút Săn Sale Ngay
    var flashButtons = grid.querySelectorAll('.dev1-btn-flash-buy');
    for (var k = 0; k < flashButtons.length; k++) {
      flashButtons[k].addEventListener('click', function (e) {
        var id = this.getAttribute('data-id');
        var name = this.getAttribute('data-name');
        var price = Number(this.getAttribute('data-price'));
        var image = this.getAttribute('data-image');
        addProductToCart({ id: id, name: name, price: price, image: image });
        showToast('Đã săn sale món "' + name + '" thành công!', 'success');
      });
    }
  }

  /**
   * 4. Render danh mục nổi bật
   */
  function renderCategories(categories) {
    var catGrid = document.getElementById('dev1-cat-grid');
    if (!catGrid) return;
    catGrid.innerHTML = '';

    for (var i = 0; i < categories.length; i++) {
      var cat = categories[i];
      var card = document.createElement('a');
      card.href = getPageUrl('dev2_products.html');
      card.className = 'dev1-cat-card';
      card.innerHTML = `
        <div class="dev1-cat-icon">${cat.icon}</div>
        <div>
          <div class="dev1-cat-title">${cat.name}</div>
          <div class="dev1-cat-count">${cat.count}</div>
        </div>
      `;
      catGrid.appendChild(card);
    }
  }

  /**
   * 5. Tab Trending Gears Switcher
   */
  function initTrendingTabs(tabs) {
    trendingData = tabs;
    var tabBtnsContainer = document.getElementById('dev1-tab-buttons');
    if (!tabBtnsContainer || !tabs.length) return;
    tabBtnsContainer.innerHTML = '';

    for (var idx = 0; idx < tabs.length; idx++) {
      (function (t, i) {
        var btn = document.createElement('button');
        btn.className = 'dev1-tab-btn ' + (i === 0 ? 'active' : '');
        btn.textContent = t.title;
        btn.addEventListener('click', function () {
          var allBtns = document.querySelectorAll('.dev1-tab-btn');
          for (var b = 0; b < allBtns.length; b++) {
            allBtns[b].classList.remove('active');
          }
          btn.classList.add('active');
          activeTabId = t.tabId;
          renderTrendingProducts(t.products);
        });
        tabBtnsContainer.appendChild(btn);
      })(tabs[idx], idx);
    }

    renderTrendingProducts(tabs[0].products);
  }

  function renderTrendingProducts(products) {
    var grid = document.getElementById('dev1-trending-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      var card = document.createElement('div');
      card.className = 'dev1-gear-card';
      card.innerHTML = `
        <div class="dev1-card-media">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          <span class="sport-badge badge-cyan dev1-card-badge">${p.badge}</span>
        </div>
        <div class="dev1-card-body">
          <div class="dev1-card-cat">${p.category}</div>
          <h3 class="dev1-card-title">${p.name}</h3>
          <div class="dev1-price-row">
            <span class="dev1-sale-price">${formatCurrency(p.price)}</span>
            <span class="dev1-rating-star">⭐ ${p.rating}</span>
          </div>
          <div class="dev1-card-btn-row">
            <a href="${getPageUrl('dev3_details.html')}?id=${p.id}" class="btn-sport btn-outline dev1-card-btn-detail">Chi Tiết</a>
            <button type="button" class="btn-sport btn-primary dev1-btn-add-cart dev1-card-btn-cart" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-image="${p.image}">+ Giỏ</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    }

    // Gắn sự kiện nút + Giỏ
    var addButtons = grid.querySelectorAll('.dev1-btn-add-cart');
    for (var k = 0; k < addButtons.length; k++) {
      addButtons[k].addEventListener('click', function (e) {
        var id = this.getAttribute('data-id');
        var name = this.getAttribute('data-name');
        var price = Number(this.getAttribute('data-price'));
        var image = this.getAttribute('data-image');
        addProductToCart({ id: id, name: name, price: price, image: image });
        showToast('Đã thêm "' + name + '" vào giỏ hàng!', 'success');
      });
    }
  }

  /**
   * Thêm sản phẩm vào giỏ hàng LocalStorage & cập nhật Badge Header
   */
  function addProductToCart(product) {
    try {
      var cartKey = 'sport_cart';
      var raw = localStorage.getItem(cartKey);
      var cart = raw ? JSON.parse(raw) : [];

      var found = false;
      for (var i = 0; i < cart.length; i++) {
        if (String(cart[i].id) === String(product.id)) {
          cart[i].quantity = (Number(cart[i].quantity) || 1) + 1;
          found = true;
          break;
        }
      }

      if (!found) {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }

      localStorage.setItem(cartKey, JSON.stringify(cart));
      updateCartCountBadge();
    } catch (err) {
      console.warn('Lỗi ghi giỏ hàng:', err);
    }
  }

  function updateCartCountBadge() {
    try {
      var cartKey = 'sport_cart';
      var raw = localStorage.getItem(cartKey);
      var cart = raw ? JSON.parse(raw) : [];
      var total = 0;
      for (var i = 0; i < cart.length; i++) {
        total += Number(cart[i].quantity) || 1;
      }
      var badge = document.getElementById('header-cart-badge-count');
      if (badge) {
        badge.textContent = total;
      }
    } catch (e) {}
  }

  /**
   * 6. Newsletter Form Validation & Toast
   */
  function initNewsletterForm() {
    var form = document.getElementById('dev1-nl-form');
    var emailInput = document.getElementById('dev1-email-input');
    if (!form || !emailInput) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = emailInput.value.trim();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        showToast('Vui lòng nhập định dạng email hợp lệ!', 'error');
        emailInput.focus();
        return;
      }

      showToast('Đăng ký thành công! Mã SPORT2026 đã gửi tới ' + email, 'success');
      form.reset();
    });
  }

  /**
   * Format tiền VNĐ
   */
  function formatCurrency(num) {
    return Number(num).toLocaleString('vi-VN') + ' ₫';
  }

  /**
   * Hiển thị Toast Notification góc phải màn hình
   */
  function showToast(message, type) {
    if (!type) type = 'success';
    var container = document.getElementById('sport-toast-container');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'sport-toast ' + type;
    var icon = type === 'success' ? '✔' : type === 'error' ? '✖' : 'ℹ';

    toast.innerHTML = `
      <div class="sport-toast-item-inner">
        <span class="sport-toast-icon">${icon}</span>
        <span>${message}</span>
      </div>
      <button class="sport-toast-close-btn">&times;</button>
    `;

    toast.querySelector('button').addEventListener('click', function () {
      toast.remove();
    });

    container.appendChild(toast);
    setTimeout(function () {
      if (toast.parentElement) toast.remove();
    }, 3500);
  }

})();
