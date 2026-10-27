(function () {
  'use strict';

  const productId = 'p1';

  function renderProduct(data) {
    const gallery = document.querySelector('[data-gallery]');
    const mainImage = document.querySelector('[data-main-image]');
    const title = document.querySelector('[data-title]');
    const tag = document.querySelector('[data-tag]');
    const price = document.querySelector('[data-price]');
    const rating = document.querySelector('[data-rating]');
    const reviews = document.querySelector('[data-reviews]');
    const sizeButtons = document.querySelectorAll('[data-size]');
    const swatches = document.querySelectorAll('[data-color]');
    const specList = document.querySelector('[data-specs]');
    const compareGrid = document.querySelector('[data-compare]');

    if (!gallery || !mainImage || !title || !price) return;

    title.textContent = data.name;
    tag.textContent = data.badge || 'BESTSELLER';
    price.textContent = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.price);
    rating.textContent = data.rating + ' / 5';
    reviews.textContent = data.reviewCount + ' đánh giá';
    mainImage.src = data.gallery[0];
    mainImage.alt = data.name;

    gallery.innerHTML = data.gallery
      .map((src, index) => `
        <button class="thumb" type="button" data-thumb="${index}">
          <img src="${src}" alt="${data.name} ${index + 1}" />
        </button>
      `)
      .join('');

    gallery.querySelectorAll('[data-thumb]').forEach((button, idx) => {
      button.addEventListener('click', () => {
        mainImage.src = data.gallery[idx];
      });
    });

    sizeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        sizeButtons.forEach((el) => el.classList.remove('active'));
        button.classList.add('active');
      });
    });

    swatches.forEach((button) => {
      button.addEventListener('click', () => {
        swatches.forEach((el) => el.classList.remove('active'));
        button.classList.add('active');
      });
    });

    specList.innerHTML = data.specs
      .map(([label, value]) => `<div><strong>${label}:</strong> ${value}</div>`)
      .join('');

    compareGrid.innerHTML = data.comparison
      .map((item) => `
        <article class="compare-card">
          <img src="${item.image}" alt="${item.name}" />
          <h3>${item.name}</h3>
          <ul>
            <li>Giá: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</li>
            <li>Đánh giá: ${item.rating}/5</li>
            <li>${item.note}</li>
          </ul>
        </article>
      `)
      .join('');

    const addToCartButton = document.querySelector('[data-add-cart]');
    if (addToCartButton) {
      addToCartButton.addEventListener('click', () => {
        const selectedSize = document.querySelector('.size-btn.active')?.textContent?.trim() || 'Mặc định';
        const selectedColor = document.querySelector('.swatch.active')?.textContent?.trim() || 'Standard';
        const product = {
          id: data.id,
          name: data.name,
          price: data.price,
          image: data.gallery[0],
          size: selectedSize,
          color: selectedColor,
          quantity: 1
        };

        const currentCart = getCart();
        const existing = currentCart.find((item) => item.id === product.id && item.size === product.size);
        if (existing) {
          existing.quantity += 1;
        } else {
          currentCart.push(product);
        }
        saveCart(currentCart);
        showToast(`Thêm ${data.name} vào giỏ hàng!`, 'success');
      });
    }
  }

  fetch('../data/dev3_details.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Cannot load product data');
      }
      return response.json();
    })
    .then((json) => renderProduct(json[productId]))
    .catch((error) => {
      console.error(error);
      const productTitle = document.querySelector('[data-title]');
      if (productTitle) {
        productTitle.textContent = 'Không thể tải dữ liệu sản phẩm';
      }
    });
})();
