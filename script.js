// Global variables and data
let products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 79.99,
        image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
        description: "High-quality wireless headphones with noise cancellation",
        category: "electronics",
        featured: true
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        price: 199.99,
        image: "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg",
        description: "Track your fitness goals with this advanced smartwatch",
        category: "electronics",
        featured: true
    },
    {
        id: 3,
        name: "Organic Cotton T-Shirt",
        price: 24.99,
        image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
        description: "Comfortable and sustainable organic cotton t-shirt",
        category: "clothing",
        featured: false
    },
    {
        id: 4,
        name: "Modern Coffee Maker",
        price: 149.99,
        image: "https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg",
        description: "Brew the perfect cup with this sleek coffee maker",
        category: "home",
        featured: true
    },
    {
        id: 5,
        name: "Classic Novel Collection",
        price: 34.99,
        image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
        description: "A collection of timeless literary classics",
        category: "books",
        featured: false
    },
    {
        id: 6,
        name: "Yoga Mat Premium",
        price: 49.99,
        image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg",
        description: "Non-slip premium yoga mat for your practice",
        category: "sports",
        featured: true
    },
    {
        id: 7,
        name: "Wireless Phone Charger",
        price: 29.99,
        image: "https://images.pexels.com/photos/4526413/pexels-photo-4526413.jpeg",
        description: "Fast wireless charging pad for all compatible devices",
        category: "electronics",
        featured: false
    },
    {
        id: 8,
        name: "Denim Jacket",
        price: 89.99,
        image: "https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg",
        description: "Classic denim jacket for timeless style",
        category: "clothing",
        featured: false
    },
    {
        id: 9,
        name: "Indoor Plant Set",
        price: 59.99,
        image: "https://images.pexels.com/photos/1055379/pexels-photo-1055379.jpeg",
        description: "Beautiful set of indoor plants to brighten your space",
        category: "home",
        featured: false
    },
    {
        id: 10,
        name: "Running Shoes",
        price: 119.99,
        image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
        description: "Lightweight running shoes for optimal performance",
        category: "sports",
        featured: true
    },
    {
        id: 11,
        name: "Bluetooth Speaker",
        price: 69.99,
        image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
        description: "Portable speaker with crystal clear sound quality",
        category: "electronics",
        featured: false
    },
    {
        id: 12,
        name: "Leather Wallet",
        price: 39.99,
        image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg",
        description: "Premium leather wallet with multiple card slots",
        category: "clothing",
        featured: false
    }
];

let cart = JSON.parse(localStorage.getItem('shopease-cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('shopease-user')) || null;
let filteredProducts = [...products];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateCartCount();
    updateAuthStatus();
    setupEventListeners();
    
    // Page-specific initialization
    const currentPage = getCurrentPage();
    switch(currentPage) {
        case 'index':
            loadFeaturedProducts();
            break;
        case 'products':
            loadAllProducts();
            break;
        case 'cart':
            loadCartItems();
            break;
        case 'payment':
            loadCheckoutItems();
            break;
        case 'login':
            setupLoginForm();
            break;
        case 'signup':
            setupSignupForm();
            break;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('products.html')) return 'products';
    if (path.includes('cart.html')) return 'cart';
    if (path.includes('payment.html')) return 'payment';
    if (path.includes('login.html')) return 'login';
    if (path.includes('signup.html')) return 'signup';
    if (path.includes('about.html')) return 'about';
    return 'index';
}

function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Filter functionality
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const clearFilters = document.getElementById('clear-filters');
    
    if (categoryFilter) categoryFilter.addEventListener('change', handleFilter);
    if (priceFilter) priceFilter.addEventListener('change', handleFilter);
    if (clearFilters) clearFilters.addEventListener('click', clearAllFilters);

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (!currentUser) {
                alert('Please login to proceed with checkout');
                window.location.href = 'login.html';
                return;
            }
            window.location.href = 'payment.html';
        });
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Authentication functions
function updateAuthStatus() {
    const authSection = document.getElementById('auth-section');
    const signupSection = document.getElementById('signup-section');
    
    if (currentUser) {
        if (authSection) {
            authSection.innerHTML = `
                <span class="nav-link">Welcome, ${currentUser.firstName}!</span>
                <button onclick="logout()" class="nav-link" style="background: none; border: none; cursor: pointer; color: inherit; font: inherit;">Logout</button>
            `;
        }
        if (signupSection) {
            signupSection.style.display = 'none';
        }
    } else {
        if (authSection) {
            authSection.innerHTML = '<a href="login.html" class="nav-link">Login</a>';
        }
        if (signupSection) {
            signupSection.style.display = 'block';
        }
    }
}

function logout() {
    localStorage.removeItem('shopease-user');
    currentUser = null;
    updateAuthStatus();
    window.location.href = 'index.html';
}

// Product display functions
function loadFeaturedProducts() {
    const featuredProductsGrid = document.getElementById('featured-products-grid');
    if (!featuredProductsGrid) return;
    
    const featuredProducts = products.filter(product => product.featured);
    displayProducts(featuredProducts, featuredProductsGrid);
}

function loadAllProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    displayProducts(filteredProducts, productsGrid);
}

function displayProducts(productsToShow, container) {
    if (!container) return;
    
    if (productsToShow.length === 0) {
        const noResults = document.getElementById('no-results');
        if (noResults) {
            noResults.style.display = 'block';
        }
        container.innerHTML = '';
        return;
    }
    
    const noResults = document.getElementById('no-results');
    if (noResults) {
        noResults.style.display = 'none';
    }
    
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Search and filter functions
function handleSearch() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    applyFilters(searchTerm);
}

function handleFilter() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    applyFilters(searchTerm);
}

function applyFilters(searchTerm = '') {
    const categoryFilter = document.getElementById('category-filter')?.value || '';
    const priceFilter = document.getElementById('price-filter')?.value || '';
    
    filteredProducts = products.filter(product => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
        
        // Price filter
        let matchesPrice = true;
        if (priceFilter) {
            const price = product.price;
            switch (priceFilter) {
                case '0-25':
                    matchesPrice = price <= 25;
                    break;
                case '25-50':
                    matchesPrice = price > 25 && price <= 50;
                    break;
                case '50-100':
                    matchesPrice = price > 50 && price <= 100;
                    break;
                case '100+':
                    matchesPrice = price > 100;
                    break;
            }
        }
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    loadAllProducts();
}

function clearAllFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    
    filteredProducts = [...products];
    loadAllProducts();
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    
    // Visual feedback
    const addButton = event.target;
    const originalText = addButton.textContent;
    addButton.textContent = 'Added!';
    addButton.classList.add('add-to-cart-animation');
    
    setTimeout(() => {
        addButton.textContent = originalText;
        addButton.classList.remove('add-to-cart-animation');
    }, 1000);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    loadCartItems();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartCount();
        updateCartSummary();
    }
}

function saveCart() {
    localStorage.setItem('shopease-cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        cartItemsContainer.innerHTML = '';
        return;
    }
    
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="quantity-control">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" 
                       onchange="updateQuantity(${item.id}, parseInt(this.value))" min="1">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');
    
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Checkout functions
function loadCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    if (!checkoutItems) return;
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div>
                <strong>${item.name}</strong>
                <br>
                <small>Quantity: ${item.quantity}</small>
            </div>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    updateCheckoutSummary();
}

function updateCheckoutSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutShipping = document.getElementById('checkout-shipping');
    const checkoutTax = document.getElementById('checkout-tax');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (checkoutSubtotal) checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (checkoutShipping) checkoutShipping.textContent = `$${shipping.toFixed(2)}`;
    if (checkoutTax) checkoutTax.textContent = `$${tax.toFixed(2)}`;
    if (checkoutTotal) checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

// Authentication form handlers
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');
        
        const users = JSON.parse(localStorage.getItem('shopease-users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('shopease-user', JSON.stringify(user));
            window.location.href = 'index.html';
        } else {
            if (errorDiv) {
                errorDiv.style.display = 'block';
                errorDiv.textContent = 'Invalid email or password. Please try again.';
            }
        }
    });
}

function setupSignupForm() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorDiv = document.getElementById('signup-error');
        
        // Validation
        if (password !== confirmPassword) {
            if (errorDiv) {
                errorDiv.style.display = 'block';
                errorDiv.textContent = 'Passwords do not match.';
            }
            return;
        }
        
        if (password.length < 6) {
            if (errorDiv) {
                errorDiv.style.display = 'block';
                errorDiv.textContent = 'Password must be at least 6 characters long.';
            }
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('shopease-users') || '[]');
        
        if (users.find(u => u.email === email)) {
            if (errorDiv) {
                errorDiv.style.display = 'block';
                errorDiv.textContent = 'An account with this email already exists.';
            }
            return;
        }
        
        const newUser = {
            id: Date.now(),
            firstName,
            lastName,
            email,
            password
        };
        
        users.push(newUser);
        localStorage.setItem('shopease-users', JSON.stringify(users));
        
        currentUser = newUser;
        localStorage.setItem('shopease-user', JSON.stringify(newUser));
        
        window.location.href = 'index.html';
    });
}

// Payment form handler
function setupPaymentForm() {
    const paymentForm = document.getElementById('payment-form');
    if (!paymentForm) return;
    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate payment processing
        const submitButton = paymentForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.innerHTML = '<span class="loading"></span> Processing...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            // Clear cart
            cart = [];
            saveCart();
            updateCartCount();
            
            // Generate order ID
            const orderId = 'SE' + Math.random().toString(36).substr(2, 9).toUpperCase();
            document.getElementById('order-id').textContent = orderId;
            
            // Show success modal
            document.getElementById('payment-modal').style.display = 'flex';
            
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}

// Payment modal handler
document.addEventListener('DOMContentLoaded', function() {
    const continueShoppingBtn = document.getElementById('continue-shopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            document.getElementById('payment-modal').style.display = 'none';
            window.location.href = 'index.html';
        });
    }
    
    setupPaymentForm();
});

// Card input formatting
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
            this.value = formattedValue;
        });
    }
    
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0,2) + '/' + value.substring(2,4);
            }
            this.value = value;
        });
    }
    
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').substr(0, 3);
        });
    }
});