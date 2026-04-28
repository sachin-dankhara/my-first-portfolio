const productContainer = document.getElementById("product-list");
const productModal = document.getElementById("product-modal");
const modalContent = document.querySelectorAll(".modal-content");
const modalBody = document.querySelector("#modal-body");
const closeBtn = document.querySelector(".close-button");
const cartTrigger = document.getElementById("cart-container");
const popup = document.getElementById("cartPopupOverlay");
const closePopup = document.querySelector(".cart-popup-close");
const cartModal = document.getElementById("cartPopupItems");

let cart = [];

const fetchData = async () => {
  try {
    const response = await fetch(
      "https://dummyjson.com/products/search?q=phone",
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    render(data.products);
  } catch (error) {
    console.error("Could not fetch data", error);
  }
};

const render = (data) => {
  if (!productContainer) {
    console.log("product container not found");
    return [];
  }
  if (closeBtn) {
    closeBtn.onclick = () => close();
  }
  productModal.addEventListener("click", (event) => {
    if (event.target === productModal) {
      close();
    }
  });

  productContainer.innerHTML = "";
  data.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("Product-card");

    card.innerHTML = `
    <img src = "${item.thumbnail}"/>
    <div class = "Product-info">
      <h3 class="Product-title">"${item.title}"</h3>
      <span class="Product-price">"${item.price}"</span>
      <button class="add-to-cart" data-id = "${item.id}">Add to cart</button>
    </div>
    </div>`;

    const btn = card.querySelector(".add-to-cart");

    btn.addEventListener("click", (event) => {
      event.stopPropagation();

      if (btn.disabled) return;
      addToCart(item);
      const originalText = btn.innerText;
      btn.innerText = "Added!";
      btn.style.backgroundColor = "#4CAF50";
      btn.disabled = true;

      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = "";
        btn.disabled = false;
      }, 1000);
    });

    card.onclick = () => openModal(item);

    productContainer.appendChild(card);
  });
};

const openModal = (product) => {
  modalBody.innerHTML = `
  <div class = "Product-card">
    <div class = "Product-image-side">
      <img src = "${product.thumbnail}"/>
      <h3 class="Product-title">"${product.title}"</h3>
    </div>

    <div class = "Product-info-side">
      <div class="">"${product.description}"</div>
      <span class="Product-price">"${product.price}"</span>
      <button class="add-to-cart" data-id = "${product.id}">Add to cart</button>
    </div>
  </div>`;
  productModal.style.display = "flex";

  const btn = modalBody.querySelector(".add-to-cart");
  btn.addEventListener("click", (event) => {
    if (btn.disabled) return;
    addToCart(product);
    const originalText = btn.innerText;
    btn.innerText = "Added!";
    btn.style.backgroundColor = "#4CAF50";
    btn.disabled = true;

    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.backgroundColor = "";
      btn.disabled = false;
    }, 1000);
  });
};

const close = () => {
  productModal.style.display = "none";
};

const addToCart = (product) => {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
  cartModalOpen();
};

const updateCartUI = () => {
  const cartItemsList = document.querySelector("#cart-items");
  const cartTotalDisplay = document.querySelector("#cart-total");

  const totalItem = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (cartItemsList) {
    cartItemsList.innerText = `Items: ${totalItem}`;
  }

  if (cartTotalDisplay) {
    cartTotalDisplay.innerText = `Total= $${totalPrice.toFixed(2)}`;
  }
};

const cartModalOpen = () => {
  cartModal.innerHTML = "";

  if (cart.length === 0) {
    cartModal.innerHTML = `<li>Your cart is empty</li>`;
    document.getElementById("cartPopupTotal").innerText = "0";
    return;
  }

  let grandtotal = 0;
  cartModal.innerHTML = "";
  cart.forEach((item) => {
    grandtotal += item.price * item.quantity;
    cartModal.innerHTML += `
    <div class="cart-popup-item">
      <img src="${item.thumbnail}" class="cart-item-img"/>

      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>

          <div class="cart-qty-controls">
            <button class="cart-qty-btn minus-btn" data-id="${item.id}">-</button>
            <span class="cart-qty">${item.quantity}</span>
            <button class="cart-qty-btn plus-btn" data-id="${item.id}">+</button>
          </div>
      </div>

      <div class="cart-item-price">
        $${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>`;
  });
  document.getElementById("cartPopupTotal").innerHTML = grandtotal.toFixed(2);
};

cartTrigger.onclick = () => {
  cartModalOpen();
  popup.classList.add("active");
};

closePopup.onclick = () => popup.classList.remove("active");

popup.onclick = (event) => {
  if (event.target === popup) {
    popup.classList.remove("active");
  }
};

const increaseQty = (id) => {
  const item = cart.find((p) => p.id === id);

  if (item) {
    item.quantity += 1;
  }
  cartModalOpen();
};
const decreaseQty = (id) => {
  const item = cart.find((p) => p.id === id);

  if (item) {
    item.quantity -= 1;

    if (item.quantity === 0) {
      cart = cart.filter((p) => p.id !== id);
    }
  }
  cartModalOpen();
};
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("plus-btn")) {
    increaseQty(Number(e.target.dataset.id));
  }

  if (e.target.classList.contains("minus-btn")) {
    decreaseQty(Number(e.target.dataset.id));
  }
});

fetchData();
