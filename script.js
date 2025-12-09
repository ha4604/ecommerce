// -------- SAMPLE PRODUCTS DATA --------
const products = [
  {
    id: 1,
    name: "Advanced Programming Book",
    price: 799,
    category: "books",
    rating: 4.5,
    icon: "📘",
    description: "Perfect companion for your coding semesters with clear explanations and examples."
  },
  {
    id: 2,
    name: "Wireless Mouse",
    price: 599,
    category: "electronics",
    rating: 4.2,
    icon: "🖱️",
    description: "Compact wireless mouse with smooth tracking and long battery life."
  },
  {
    id: 3,
    name: "Noise Cancelling Headphones",
    price: 1999,
    category: "electronics",
    rating: 4.7,
    icon: "🎧",
    description: "Focus on your lectures and music with immersive sound and comfort."
  },
  {
    id: 4,
    name: "Classic College Backpack",
    price: 899,
    category: "accessories",
    rating: 4.3,
    icon: "🎒",
    description: "Durable backpack with laptop sleeve and multiple compartments."
  },
  {
    id: 5,
    name: "Exam Notes Bundle",
    price: 299,
    category: "books",
    rating: 4.8,
    icon: "📒",
    description: "Handwritten style summarized notes to quickly revise for exams."
  },
  {
    id: 6,
    name: "USB Type-C Hub",
    price: 999,
    category: "electronics",
    rating: 4.4,
    icon: "🔌",
    description: "Expand your laptop ports with USB, HDMI, and card reader support."
  }
];

// -------- STATE --------
let cart = [];

// -------- DOM ELEMENTS --------
const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartCountEl = document.getElementById("cartCount");
const goToCheckoutBtn = document.getElementById("goToCheckout");

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".page-section");
const shopNowBtn = document.getElementById("shopNowBtn");

const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

// Modal
const productModal = document.getElementById("productModal");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModal");

// Checkout
const checkoutForm = document.getElementById("checkoutForm");
const summaryItems = document.getElementById("summaryItems");
const summarySubtotal = document.getElementById("summarySubtotal");
const summaryTotal = document.getElementById("summaryTotal");

// -------- RENDER PRODUCTS --------
function renderProducts() {
  const category = categoryFilter.value;
  const sort = sortFilter.value;

  let filtered = [...products];

  if (category !== "all") {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  productGrid.innerHTML = "";

  if (filtered.length === 0) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">${product.icon}</div>
      <div class="product-title">${product.name}</div>
      <div class="product-meta">
        <span class="product-price">₹${product.price}</span>
        <span>⭐ ${product.rating}</span>
      </div>
      <div class="product-actions">
        <button class="product-view" data-id="${product.id}">Details</button>
        <button class="btn-primary add-to-cart" data-id="${product.id}">Add</button>
      </div>
    `;

    productGrid.appendChild(card);
  });

  // Attach event listeners for the newly created buttons
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      addToCart(id);
    });
  });

  document.querySelectorAll(".product-view").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      openProductModal(id);
    });
  });
}

// -------- CART FUNCTIONS --------
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
}

function updateCartUI() {
  cartItemsContainer.innerHTML = "";
  let subtotal = 0;
  let itemCount = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.qty;
    itemCount += item.qty;

    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <div>
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">₹${item.price} × ${item.qty}</div>
        <div class="cart-qty">
          <button class="qty-btn" data-id="${item.id}" data-action="dec">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-action="inc">+</button>
          <button class="product-view" data-id="${item.id}" style="margin-left: auto;">Remove</button>
        </div>
      </div>
      <div>₹${item.price * item.qty}</div>
    `;

    cartItemsContainer.appendChild(row);
  });

  cartSubtotalEl.textContent = `₹${subtotal}`;
  cartCountEl.textContent = itemCount;

  // Update checkout summary too
  updateSummary();

  // Attach listeners for quantity & remove
  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      const action = btn.getAttribute("data-action");
      changeQuantity(id, action);
    });
  });

  document
    .querySelectorAll(".cart-item .product-view")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        removeFromCart(id);
      });
    });
}

function changeQuantity(productId, action) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  if (action === "inc") {
    item.qty += 1;
  } else if (action === "dec") {
    item.qty -= 1;
    if (item.qty <= 0) {
      cart = cart.filter((i) => i.id !== productId);
    }
  }

  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter((i) => i.id !== productId);
  updateCartUI();
}

// -------- CHECKOUT SUMMARY --------
function updateSummary() {
  summaryItems.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.qty;
    const div = document.createElement("div");
    div.className = "summary-item";
    div.innerHTML = `
      <span>${item.name} × ${item.qty}</span>
      <span>₹${item.price * item.qty}</span>
    `;
    summaryItems.appendChild(div);
  });

  summarySubtotal.textContent = `₹${subtotal}`;
  summaryTotal.textContent = `₹${subtotal}`; // you can add tax if you want
}

// -------- MODAL FUNCTIONS --------
function openProductModal(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  modalBody.innerHTML = `
    <div class="product-image" style="margin-bottom: 1rem;">${product.icon}</div>
    <div class="modal-product-title">${product.name}</div>
    <div class="modal-product-price">₹${product.price}</div>
    <div class="modal-product-desc">${product.description}</div>
    <button class="btn-primary" id="modalAddToCart">Add to Cart</button>
  `;

  document.getElementById("modalAddToCart").addEventListener("click", () => {
    addToCart(product.id);
    closeModal();
    openCart();
  });

  productModal.classList.remove("hidden");
}

function closeModal() {
  productModal.classList.add("hidden");
}

// -------- NAVIGATION --------
function showPage(pageId) {
  sections.forEach((sec) => {
    if (sec.id === pageId) {
      sec.classList.remove("hidden");
    } else {
      sec.classList.add("hidden");
    }
  });

  navLinks.forEach((link) => {
    if (link.getAttribute("data-page") === pageId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// -------- CART DRAWER OPEN/CLOSE --------
function openCart() {
  cartDrawer.classList.remove("hidden");
}

function closeCartDrawer() {
  cartDrawer.classList.add("hidden");
}

// -------- EVENT LISTENERS --------
cartToggle.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);

goToCheckoutBtn.addEventListener("click", () => {
  closeCartDrawer();
  showPage("checkout");
});

shopNowBtn.addEventListener("click", () => {
  showPage("products");
});

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = link.getAttribute("data-page");
    showPage(page);
  });
});

categoryFilter.addEventListener("change", renderProducts);
sortFilter.addEventListener("change", renderProducts);

// Modal close
closeModalBtn.addEventListener("click", closeModal);
productModal.addEventListener("click", (e) => {
  if (e.target === productModal) {
    closeModal();
  }
});

// Checkout submit
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Order placed successfully! (Demo for college project)");
  cart = [];
  updateCartUI();
  checkoutForm.reset();
  showPage("home");
});

// -------- INITIALIZE --------
renderProducts();
updateCartUI();
showPage("home");
