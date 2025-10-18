document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('productCarousel');
  const prevButton = document.getElementById('prevSlide');
  const nextButton = document.getElementById('nextSlide');

  if (carousel) {
    const cards = carousel.querySelectorAll('.product-card');
    const cardsPerView = 3;
    let cardIndex = 0;
    const totalSlides = Math.ceil(cards.length / cardsPerView);

    function updateCarousel() {
      const offset = (100 / cardsPerView) * cardIndex;
      carousel.style.transform = `translateX(-${offset}%)`;
      updatePagination();
    }

    function updatePagination() {
      const dotsContainer = document.getElementById('carouselPagination');
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === cardIndex);
      });
    }

    function initializePagination() {
      const dotsContainer = document.getElementById('carouselPagination');
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          cardIndex = i;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      }
    }

    nextButton?.addEventListener('click', () => {
      cardIndex = (cardIndex + 1) % totalSlides;
      updateCarousel();
    });

    prevButton?.addEventListener('click', () => {
      cardIndex = (cardIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    });

    initializePagination();
    updateCarousel();
  }

  // ======= ФУНКЦІОНАЛ КОШИКА =======
  const cartKey = 'shoppingCart';

  function loadCart() {
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  }

  function saveCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }

  function updateCartCount() {
    const cart = loadCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const el = document.getElementById('cartCount');
    if (el) el.textContent = count;
  }

  function addToCart(name, price, img) {
    const cart = loadCart();
    const existing = cart.find(item => item.name === name);
    if (existing) existing.quantity++;
    else cart.push({ name, price, img, quantity: 1 });
    saveCart(cart);
    updateCartCount();
    alert('✅ Товар додано до кошика!');
  }

  function removeFromCart(name) {
    let cart = loadCart();
    cart = cart.filter(item => item.name !== name);
    saveCart(cart);
    renderCart();
    updateCartCount();
  }

  function renderCart() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    const cart = loadCart();
    container.innerHTML = '';
    if (cart.length === 0) {
      container.innerHTML = '<p style="text-align:center;">Ваш кошик порожній 🛍️</p>';
      document.getElementById('totalPrice').textContent = '0 ₴';
      return;
    }

    let total = 0;
    cart.forEach(item => {
      const price = parseFloat(item.price.replace(/\D/g, ''));
      total += price * item.quantity;

      const card = document.createElement('div');
      card.classList.add('category-card');
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="category-img">
        <p>${item.name}</p>
        <p><strong>${item.price}</strong></p>
        <p>Кількість: ${item.quantity}</p>
        <button class="buy-button remove" data-name="${item.name}">Видалити</button>
      `;
      container.appendChild(card);
    });

    document.getElementById('totalPrice').textContent = `${total.toLocaleString('uk-UA')} ₴`;

    document.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', e => removeFromCart(e.target.dataset.name));
    });
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      localStorage.removeItem(cartKey);
      alert('🎉 Дякуємо за покупку! Ваше замовлення оформлено!');
      renderCart();
      updateCartCount();
    });
  }

  document.querySelectorAll('.buy-button').forEach(btn => {
    btn.addEventListener('click', e => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const name = card.querySelector('.product-name').textContent;
      const price = card.querySelector('.product-price').textContent;
      const img = card.querySelector('.product-img').src;
      addToCart(name, price, img);
    });
  });

  renderCart();
  updateCartCount();
});
