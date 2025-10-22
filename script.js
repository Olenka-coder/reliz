document.addEventListener("DOMContentLoaded", () => {
  const cartCount = document.getElementById("cartCount");

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartCount) cartCount.textContent = cart.length;
  }
  updateCartCount();

  // Додавання у кошик
  document.querySelectorAll(".buy-button").forEach(btn => {
    btn.addEventListener("click", () => {
      if(btn.classList.contains('remove-btn')) return; // кнопки видалення не обробляємо тут
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      const img = btn.dataset.img;

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push({ name, price, img });
      localStorage.setItem("cart", JSON.stringify(cart));

      updateCartCount();
      alert(`${name} додано в кошик!`);
    });
  });

  // Відображення у кошику
  const cartItems = document.getElementById("cartItems");
  if (cartItems) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      cartItems.innerHTML = "<p style='text-align:center;'>Ваш кошик порожній</p>";
    } else {
      let total = 0;
      cartItems.innerHTML = cart.map((item, i) => {
        total += item.price;
        return `
          <div class="product-card">
            <img src="${item.img}" class="product-img">
            <p class="product-name">${item.name}</p>
            <p class="product-price">${item.price} грн</p>
            <button class="buy-button remove-btn" data-index="${i}">Видалити</button>
          </div>
        `;
      }).join("");
      document.getElementById("totalPrice").textContent = `Загальна сума: ${total} грн`;

      // Видалення без reload
      document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const index = btn.dataset.index;
          cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          btn.parentElement.remove();
          updateCartCount();
          // Перерахунок суми
          let newTotal = cart.reduce((sum, item) => sum + item.price, 0);
          document.getElementById("totalPrice").textContent = `Загальна сума: ${newTotal} грн`;
        });
      });
    }

    // Оформлення
    const checkout = document.getElementById("checkoutBtn");
    if (checkout) {
      checkout.addEventListener("click", () => {
        if(cart.length === 0){
          alert("Ваш кошик порожній!");
          return;
        }
        alert("Дякуємо за покупку! Ваше замовлення оформлено ❤️");
        localStorage.removeItem("cart");
        cartItems.innerHTML = "<p style='text-align:center;'>Ваш кошик порожній</p>";
        document.getElementById("totalPrice").textContent = `Загальна сума: 0 грн`;
        updateCartCount();
      });
    }
  }
});
