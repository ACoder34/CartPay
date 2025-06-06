// DOM Elements
const checkoutItems = document.getElementById('checkout-items');
const checkoutTotalPrice = document.getElementById('checkout-total-price');
const paymentForm = document.getElementById('payment-form');
const loader = document.querySelector('.loader');

// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize checkout page
function init() {
    handleLoader();
    displayCheckoutItems();
    setupEventListeners();
}

function handleLoader() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1000);
    });
}

// Display checkout items
function displayCheckoutItems() {
    checkoutItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        checkoutItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        window.location.href = 'index.html';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `
            <div class="checkout-item-details">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
            </div>
            <div class="checkout-item-price">
                $${itemTotal.toFixed(2)}
            </div>
        `;
        checkoutItems.appendChild(checkoutItem);
    });

    checkoutTotalPrice.textContent = `₹${total.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `₹${total.toFixed(2)}`;
}

// Setup event listeners
function setupEventListeners() {
    // Card number formatting
    const cardNumber = document.getElementById('card-number');
    cardNumber.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = value;
    });

    // Expiry date formatting
    const expiry = document.getElementById('expiry');
    expiry.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });

    // CVV validation
    const cvv = document.getElementById('cvv');
    cvv.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Form submission
    paymentForm.addEventListener('submit', handlePayment);
}

// Handle payment submission
function handlePayment(e) {
    e.preventDefault();

    // Show loading state
    const submitBtn = paymentForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));

        // Show success message
        showNotification('Payment successful! Thank you for your purchase.');
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }, 2000);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function closePopup() {
    window.location.href = 'index.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', init); 