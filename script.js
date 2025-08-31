// Product data
const products = [
  {
    id: 1,
    name: "Yoga Mat",
    description: "Eco-friendly and non-slip yoga mat.",
    price: 29.99,
    image: "img/YogaMat.jpg",
    category: "sports",
    rating: 4.5,
    reviews: 4.5,
  },
  {
    id: 2,
    name: "Running Shoes",
    description: "Lightweight running shoes with...",
    price: 79.99,
    image: "img/R.jpg",
    category: "sports",
    rating: 4.7,
    reviews: 4.7,
  },
  {
    id: 3,
    name: "Electric Scooter",
    description: "Foldable electric scooter for...",
    price: 299.99,
    image: "img/ElectricScooter.jpg",
    category: "sports",
    rating: 4.3,
    reviews: 4.3,
  },
  {
    id: 4,
    name: "Fitness Tracker",
    description: "Track your steps, heart rate, and...",
    price: 79.99,
    image: "img/Fitness Tracker.jpg",
    category: "sports",
    rating: 4.5,
    reviews: 4.5,
  },
  {
    id: 5,
    name: "Wireless Headphones",
    description: "Premium noise-canceling headphones",
    price: 149.99,
    image: "img/Wireless.jpg",
    category: "electronics",
    rating: 4.8,
    reviews: 4.8,
  },
  {
    id: 6,
    name: "Smart Watch",
    description: "Advanced smartwatch with health monitoring",
    price: 199.99,
    image: "img/SmartWatch.jpg",
    category: "electronics",
    rating: 4.6,
    reviews: 4.6,
  },
  {
    id: 7,
    name: "Leathe rWallet",
    description: "Genuine leather wallet with multiple",
    price: 39.99,
    image: "img/leatherWallet.jpg",
    category: "fashion",
    rating: 4.4,
    reviews: 4.4,
  },
  {
    id: 8,
    name: "Coffee Maker",
    description: "Automatic drip coffee maker",
    price: 89.99,
    image: "img/CoffeeMaker.jpg",
    category: "home",
    rating: 4.5,
    reviews: 4.5,
  },
]

// Shopping cart
let cart = JSON.parse(localStorage.getItem("cart")) || []
let currentCategory = "sports"

// DOM elements
const productsGrid = document.getElementById("productsGrid")
const cartCount = document.getElementById("cartCount")
const cartSidebar = document.getElementById("cartSidebar")
const cartOverlay = document.getElementById("cartOverlay")
const cartItems = document.getElementById("cartItems")
const cartTotal = document.getElementById("cartTotal")

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  renderProducts()
  updateCartUI()
  setupCategoryFilters()
})

// Render products
function renderProducts(category = "sports") {
  const filteredProducts = category === "all" ? products : products.filter((product) => product.category === category)

  productsGrid.innerHTML = ""

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = '<div class="loading"><div class="spinner"></div></div>'
    setTimeout(() => {
      productsGrid.innerHTML =
        '<p style="text-align: center; color: #666; grid-column: 1/-1;">No products found in this category.</p>'
    }, 1000)
    return
  }

  filteredProducts.forEach((product) => {
    const productCard = createProductCard(product)
    productsGrid.appendChild(productCard)
  })
}

// Create product card
function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "product-card"

  const stars = generateStars(product.rating)

  card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-rating">
                <div class="stars">${stars}</div>
                <span class="rating-text">(${product.reviews})</span>
            </div>
            <div class="product-category">Sports & Fitness</div>
            <div class="product-footer">
                <span class="product-price">$${product.price}</span>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i>
                Add to Cart
            </button>
        </div>
    `

  return card
}

// Generate star rating
function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  let stars = ""

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star star"></i>'
  }

  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt star"></i>'
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star star empty"></i>'
  }

  return stars
}

// Setup category filters
function setupCategoryFilters() {
  const categoryBtns = document.querySelectorAll(".category-btn")

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      categoryBtns.forEach((b) => b.classList.remove("active", "selected"))

      // Add active class to clicked button
      this.classList.add("active")

      // Get category and render products
      const category = this.dataset.category
      currentCategory = category
      renderProducts(category)
    })
  })
}

// Add to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      ...product,
      quantity: 1,
    })
  }

  saveCart()
  updateCartUI()
  showAddToCartFeedback()
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  saveCart()
  updateCartUI()
}

// Update quantity
function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (!item) return

  item.quantity += change

  if (item.quantity <= 0) {
    removeFromCart(productId)
  } else {
    saveCart()
    updateCartUI()
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart))
}

// Update cart UI
function updateCartUI() {
  updateCartCount()
  renderCartItems()
  updateCartTotal()
}

// Update cart count
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems
  cartCount.style.display = totalItems > 0 ? "flex" : "none"
}

// Render cart items
function renderCartItems() {
  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <p>Your cart is empty</p>
            </div>
        `
    return
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Update cart total
function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  cartTotal.textContent = total.toFixed(2)
}

// Toggle cart sidebar
function toggleCart() {
  cartSidebar.classList.toggle("open")
  cartOverlay.classList.toggle("open")
  document.body.style.overflow = cartSidebar.classList.contains("open") ? "hidden" : "auto"
}

// Show add to cart feedback
function showAddToCartFeedback() {
  // Create a temporary notification
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `
  notification.innerHTML = '<i class="fas fa-check"></i> Added to cart!'

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 2000)
}

// Checkout function
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!")
    return
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  alert(
    `Thank you for your purchase!\n\nItems: ${itemCount}\nTotal: $${total.toFixed(2)}\n\nThis is a demo - no actual payment was processed.`,
  )

  // Clear cart
  cart = []
  saveCart()
  updateCartUI()
  toggleCart()
}

// Add CSS animation for notifications
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`
document.head.appendChild(style)

// Handle escape key to close cart
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && cartSidebar.classList.contains("open")) {
    toggleCart()
  }
})

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 768 && cartSidebar.classList.contains("open")) {
    cartSidebar.style.width = "400px"
  }
})
