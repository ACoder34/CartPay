// Product Data
const products = [
    {
        id: 1,
        name: "DISCORD NITRO TOKEN 1 MONTH",
        price: 25,
        category: "DISCORD",
        image: "https://teknolojikampusu.com/wp-content/uploads/2024/10/discord-nitro-jpg.webp",
        rating: 5,
        reviews: 156,
        description: "Token Is Only Use For Boost Any Server "
    },
    {
        id: 2,
        name: "PRIME VIDEO ",
        price: 100,
        category: "OTTS",
        image: "https://i0.wp.com/amazingcollections.net/wp-content/uploads/2018/04/Prime-Video-6-Month.jpg?fit=1080%2C1080&ssl=1",
        rating: 5,
        reviews: 98,
        description: "Prime Video Is Nfa Non Full Access Account 6 Month Warranty"
    },
    {
        id: 3,
        name: "DISCORD 1 MONTH NITRO PROMO CODE",
        price: 20,
        category: "DISCORD",
        image: "https://teknolojikampusu.com/wp-content/uploads/2024/10/discord-nitro-jpg.webp",
        rating: 5,
        reviews: 234,
        description: "Promo Code Is Use For Claim Nitro In Your Account "
    },
    {
        id: 4,
        name: "14x 1 MONTH BOOST",
        price: 200,
        category: "DISCORD",
        image: "https://cdn-offer-photos.zeusx.com/5d084d6d-7f07-4c9a-8098-710570ad4ea6.jpg",
        rating: 5,
        reviews: 234,
        description: "14x Boost 1 Month Warranty"
    },
    {
        id: 5,
        name: "DISCORD 1 MONTH NITRO ID (FA)",
        price: 80,
        category: "DISCORD",
        image: "https://static.raffall.com/raffalls/354684/1710241211.png",
        rating: 5,
        reviews: 234,
        description: "Full Access Account Email Password Changble"
    },
    {
        id: 6,
        name: "Minecraft Nfa Account",
        price: 20,
        category: "MINECRAFT",
        image: "https://i0.wp.com/nerdbot.com/wp-content/uploads/2022/02/Survival-games-Minecraft-mojang-studios.jpg?fit=1920%2C1080&ssl=1",
        rating: 5,
        reviews: 234,
        description: "Mc Account is Teampory Non Full Access Account "
    },
    {
        id: 7,
        name: "Minecraft Home Cape",
        price: 70,
        category: "MINECRAFT",
        image: "https://staticg.sportskeeda.com/editor/2025/03/e01b4-17423678839153-1920.jpg?w=1460",
        rating: 5,
        reviews: 234,
        description: "Minecraft Cape You Can Claim It From Minecraft.net We Provide You A Redeem Code "
    },
    {
        id: 8,
        name: "Minecraft Menace Cape",
        price: 100,
        category: "MINECRAFT",
        image: "https://staticg.sportskeeda.com/editor/2025/03/9b9be-17423681550367-1920.jpg?w=1460",
        rating: 5,
        reviews: 234,
        description: "Minecraft Cape You Can Claim It From Minecraft.net We Provide You A Redeem Code"
    }
];

// Initialize products in localStorage
function initializeProducts() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(products));
    }
}

// Load and display products
function loadProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;

    // Get products from localStorage or use default products
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const productsToDisplay = storedProducts.length > 0 ? storedProducts : products;

    productsContainer.innerHTML = productsToDisplay.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-meta">
                    <div class="rating">
                        ${generateStars(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                    <div class="price">₹${product.price.toFixed(2)}</div>
                </div>
                <div class="product-buttons">
                    <button type="button" onclick="addToCart(${product.id})" class="add-to-cart">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                    ${isAdmin() ? `<button type="button" onclick="deleteProduct(${product.id})" class="delete-product"><i class='fas fa-trash'></i> Delete</button>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Cart functionality
function addToCart(productId) {
    console.log('Adding to cart:', productId); // Debug log
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    
    // Show success animation on button
    const button = document.querySelector(`.product-card:has(button[onclick*="${productId}"]) .add-to-cart`);
    if (button) {
        button.innerHTML = '<i class="fas fa-check"></i> Added';
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            button.disabled = false;
        }, 2000);
    }
    
    showNotification('Item added to cart!');
}

function updateCart() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Update cart count
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            if (cartSubtotal) cartSubtotal.textContent = '₹0.00';
            if (cartTotal) cartTotal.textContent = '₹0.00';
            return;
        }

        let subtotal = 0;
        cartItems.innerHTML = cart.map(item => {
            subtotal += item.price * item.quantity;
            return `
                <div class="cart-item">
                    <div class="item-info">
                        <h3>${item.name}</h3>
                        <p>₹${item.price.toFixed(2)} × ${item.quantity}</p>
                    </div>
                    <div class="item-actions">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="quantity-btn">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="quantity-btn">+</button>
                        <button onclick="removeFromCart(${item.id})" class="remove-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `₹${subtotal.toFixed(2)}`;
    }
}

function calculateDiscount(subtotal, coupon) {
    if (coupon.type === 'percentage') {
        return (subtotal * coupon.value) / 100;
    }
    return Math.min(coupon.value, subtotal); // For fixed amount
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    showNotification('Item removed from cart');
}

function clearCart() {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    localStorage.removeItem('cart');
    localStorage.removeItem('activeCoupon');
    updateCart();
    showNotification('Cart cleared');
}

function applyCoupon() {
    const code = document.getElementById('coupon-input').value.trim().toUpperCase();
    if (!code) {
        showNotification('Please enter a coupon code', 'error');
        return;
    }
    
    const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
    const coupon = coupons.find(c => c.code === code);
    
    if (!coupon) {
        showNotification('Invalid coupon code', 'error');
        return;
    }
    
    if (new Date(coupon.expiry) < new Date()) {
        showNotification('Coupon has expired', 'error');
        return;
    }
    
    localStorage.setItem('activeCoupon', JSON.stringify(coupon));
    showNotification('Coupon applied successfully!');
    updateCart();
}

// Update showNotification to handle different types
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Cart dropdown toggle
document.addEventListener('DOMContentLoaded', function() {
    const cartLink = document.getElementById('cart-link');
    const cartDropdown = document.getElementById('cart-dropdown');
    
    if (cartLink && cartDropdown) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            cartDropdown.classList.toggle('show');
        });
        
        // Close cart dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!cartLink.contains(e.target) && !cartDropdown.contains(e.target)) {
                cartDropdown.classList.remove('show');
            }
        });
    }
    
    // Initialize cart
    updateCart();
});

// DOM Elements
const productGrid = document.getElementById('product-grid');
const gameFilter = document.getElementById('game-filter');
const sortFilter = document.getElementById('sort-filter');
const cartCount = document.querySelector('.cart-count');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
const authButtons = document.querySelector('.auth-buttons');
const loader = document.querySelector('.loader');
const scrollProgress = document.querySelector('.scroll-progress');

// Generate star rating display
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Handle loader
document.onreadystatechange = function() {
    const loader = document.querySelector('.loader');
    if (document.readyState !== 'complete') {
        document.body.style.visibility = 'hidden';
        loader.style.visibility = 'visible';
    } else {
        setTimeout(() => {
            loader.style.opacity = '0';
            document.body.style.visibility = 'visible';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    }
};

// Initialize the page
function init() {
    console.log('Initializing page...'); // Debug log
    initializeProducts();
    loadProducts();
    setupScrollProgress();
    setupEventListeners();
    setupMobileMenu();
    checkAuth();
}

function setupScrollProgress() {
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            scrollProgress.style.width = `${scrolled}%`;
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    const cartLink = document.querySelector('.cart-link');
    const cartDropdown = document.querySelector('.cart-dropdown');
    const clearCartBtn = document.querySelector('.clear-cart');
    const gameFilter = document.getElementById('game-filter');
    const sortFilter = document.getElementById('sort-filter');

    // Cart link click
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Cart clicked'); // Debug log
            cartDropdown.classList.toggle('active');
        });
    }

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (cartDropdown && cartDropdown.classList.contains('active')) {
            if (!e.target.closest('.cart-container')) {
                cartDropdown.classList.remove('active');
            }
        }
    });

    // Clear cart button
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            localStorage.setItem('cart', '[]');
            updateCart();
            showNotification('Cart cleared');
            if (cartDropdown) {
                cartDropdown.classList.remove('active');
            }
        });
    }

    // Game filter
    if (gameFilter) {
        gameFilter.addEventListener('change', filterProducts);
    }
    
    // Sort filter
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
}

// Setup mobile menu
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav ul');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });

        // Close menu when clicking on a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
}

// Filter and sort products
function filterProducts() {
    let filteredProducts = [...products];
    
    // Filter by game
    const selectedGame = gameFilter.value;
    if (selectedGame !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === selectedGame);
    }
    
    // Sort products
    const sortBy = sortFilter.value;
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
    }
    
    displayProducts(filteredProducts);
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// User Authentication
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authButtons = document.querySelector('.auth-buttons');
    const userProfile = document.querySelector('.user-profile');
    const adminPanelLink = document.querySelector('.admin-panel-link');

    if (user) {
        // Hide auth buttons
        if (authButtons) {
            authButtons.style.display = 'none';
        }

        // Show user profile
        if (userProfile) {
            userProfile.style.display = 'flex';
            userProfile.querySelector('.user-name').textContent = user.name;
            userProfile.querySelector('.user-role').textContent = user.role === 'admin' ? 'Admin' : 'User';
        }

        // Show admin panel link only for admin users
        if (adminPanelLink) {
            if (user.role === 'admin') {
                adminPanelLink.style.display = 'flex';
            } else {
                adminPanelLink.style.display = 'none';
            }
        }

        // Add logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.onclick = function() {
                localStorage.removeItem('user');
                window.location.reload();
            };
        }
    } else {
        // Show auth buttons
        if (authButtons) {
            authButtons.style.display = 'flex';
        }

        // Hide user profile
        if (userProfile) {
            userProfile.style.display = 'none';
        }

        // Hide admin panel link
        if (adminPanelLink) {
            adminPanelLink.style.display = 'none';
        }
    }
}

// Admin Panel
function showAdminPanel() {
    const adminPanel = document.createElement('div');
    adminPanel.className = 'admin-panel';
    adminPanel.innerHTML = `
        <h2>Admin Panel</h2>
        <div class="order-list" id="admin-order-list">
            <!-- Orders will be dynamically added here -->
        </div>
    `;
    document.body.appendChild(adminPanel);

    // Load orders
    loadOrders();
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderList = document.getElementById('admin-order-list');

    if (orders.length === 0) {
        orderList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <p>No orders yet</p>
            </div>
        `;
        return;
    }

    orderList.innerHTML = orders.map(order => `
        <div class="order-item">
            <h3>Order from ${order.username}</h3>
            <p>Email: ${order.email}</p>
            <p>Items: ${order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</p>
            <p class="order-total">Total: ₹${order.total.toFixed(2)}</p>
            <p>Date: ${new Date(order.date).toLocaleString()}</p>
        </div>
    `).join('');
}

// Coupon logic for checkout
function getCoupons() {
    return JSON.parse(localStorage.getItem('coupons') || '[]');
}
function findCoupon(code) {
    const coupons = getCoupons();
    return coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
}

// Update checkout form submission
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    const couponInput = document.getElementById('coupon');
    const applyCouponBtn = document.getElementById('apply-coupon');
    const couponStatus = document.getElementById('coupon-status');
    const discountDisplay = document.getElementById('discount-display');
    const totalAfterDiscount = document.getElementById('total-after-discount');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    let appliedCoupon = null;
    let discount = 0;
    // Calculate cart total
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalAmount) {
        cartTotalAmount.textContent = `₹${cartTotal.toFixed(2)}`;
    }
    function updateDiscount() {
        const amount = cartTotal;
        if (appliedCoupon) {
            if (appliedCoupon.type === 'percent') {
                discount = amount * (appliedCoupon.value / 100);
            } else {
                discount = Math.min(appliedCoupon.value, amount);
            }
        } else {
            discount = 0;
        }
        discountDisplay.textContent = `₹${discount.toFixed(2)}`;
        totalAfterDiscount.textContent = `₹${(amount - discount).toFixed(2)}`;
    }
    if (applyCouponBtn) {
        applyCouponBtn.onclick = function() {
            const code = couponInput.value.trim();
            const coupon = findCoupon(code);
            if (coupon) {
                appliedCoupon = coupon;
                couponStatus.textContent = `Coupon applied: ${coupon.code} (${coupon.type === 'percent' ? coupon.value + '% off' : '₹' + coupon.value + ' off'})`;
                couponStatus.style.color = 'green';
            } else {
                appliedCoupon = null;
                couponStatus.textContent = 'Invalid coupon code';
                couponStatus.style.color = 'red';
            }
            updateDiscount();
        };
    }
    updateDiscount();
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const transactionId = document.getElementById('transaction-id').value;
            const amount = cartTotal;
            if (!username || !email || !transactionId || !amount || amount <= 0) {
                alert('Please fill in all required fields');
                return;
            }
            // Calculate discount and total
            let coupon = appliedCoupon ? appliedCoupon.code : null;
            let discountValue = discount;
            let total = amount - discountValue;
            // Create order (include items for admin panel)
            const order = {
                username,
                email,
                transactionId,
                amount,
                discount: discountValue,
                total,
                coupon,
                date: new Date().toISOString(),
                status: 'pending',
                items: cart // <-- include items in order
            };
            // Save order
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            // Show success popup
            const successPopup = document.getElementById('success-popup');
            if (successPopup) {
                successPopup.style.display = 'flex';
            }
        });
    }
    // Check authentication on page load
    checkAuth();
});

// Add this new function for deleting products
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedProducts = products.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    showNotification('Product deleted successfully!');
    loadProducts();
}

// Add edit product functionality
function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }

    // Create and show edit modal
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <div class="edit-modal-content">
            <h2>Edit Product</h2>
            <form id="edit-product-form">
                <div class="form-group">
                    <label for="edit-name">Product Name</label>
                    <input type="text" id="edit-name" value="${product.name}" required>
                </div>
                <div class="form-group">
                    <label for="edit-description">Description</label>
                    <textarea id="edit-description" required>${product.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="edit-price">Price (₹)</label>
                    <input type="number" id="edit-price" value="${product.price}" required>
                </div>
                <div class="form-group">
                    <label for="edit-rating">Rating (1-5)</label>
                    <input type="number" id="edit-rating" value="${product.rating}" min="1" max="5" step="0.1" required>
                </div>
                <div class="form-group">
                    <label for="edit-category">Category</label>
                    <input type="text" id="edit-category" value="${product.category}" required>
                </div>
                <div class="form-buttons">
                    <button type="submit" class="save-btn">Save Changes</button>
                    <button type="button" class="cancel-btn" onclick="closeEditModal()">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Handle form submission
    const form = document.getElementById('edit-product-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedProduct = {
            ...product,
            name: document.getElementById('edit-name').value,
            description: document.getElementById('edit-description').value,
            price: parseFloat(document.getElementById('edit-price').value),
            rating: parseFloat(document.getElementById('edit-rating').value),
            category: document.getElementById('edit-category').value
        };

        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index] = updatedProduct;
            localStorage.setItem('products', JSON.stringify(products));
            showNotification('Product updated successfully!');
            closeEditModal();
            loadProducts();
        }
    });
}

function closeEditModal() {
    const modal = document.querySelector('.edit-modal');
    if (modal) {
        modal.remove();
    }
}

// Call init when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

function isAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user && user.role === 'admin';
}

window.deleteProduct = deleteProduct; 