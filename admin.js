// Check authentication immediately when page loads
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Tab functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            // Load appropriate data based on tab
            switch(tabId) {
                case 'dashboard':
                    updateDashboardStats();
                    break;
                case 'products':
                    loadProducts();
                    break;
                case 'customers':
                    loadCustomerDetails();
                    break;
                case 'announcements':
                    loadAnnouncements();
                    break;
                case 'coupons':
                    loadCoupons();
                    break;
            }
        });
    });
}

// Product management
function initProductManagement() {
    const productForm = document.getElementById('product-form');
    const logoInput = document.getElementById('product-logo');
    const logoPreview = document.getElementById('logo-preview');

    // Logo preview
    logoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                logoPreview.innerHTML = `<img src="${e.target.result}" alt="Product Logo">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Form submission
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const product = {
            id: Date.now(),
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            rating: parseFloat(document.getElementById('product-rating').value),
            price: parseFloat(document.getElementById('product-price').value),
            image: logoPreview.querySelector('img')?.src || '',
            category: 'GENERAL', // Default category
            reviews: 0, // Default reviews count
            date: new Date().toISOString()
        };

        // Save product
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));

        // Reset form and show notification
        productForm.reset();
        logoPreview.innerHTML = '<i class="fas fa-image"></i>';
        showNotification('Product added successfully!');
        loadProducts();
    });
}

// Update dashboard stats
function updateDashboardStats() {
    console.log('Updating dashboard stats from server via /get-orders...');
    // Fetch orders from the server
    // *** IMPORTANT: Using the provided server URL ***
    fetch('http://de1.bot-hosting.net:20197/get-orders')
        .then(response => {
            if (!response.ok) {
                console.error('Error fetching orders for stats from server:', response.status, response.statusText);
                // Don't throw here, just log and let the function proceed with empty data
                return [];
            }
            return response.json();
        })
        .then(orders => {
            console.log('Orders received from server for stats:', orders);
            // --- Your existing logic to process the 'orders' array for stats starts here ---
            const uniqueCustomers = new Set(orders.map(order => order.email).filter(email => email)); // Use email for unique count

            // Find the elements first and check if they exist
            const totalOrdersElement = document.getElementById('total-orders');
            const totalRevenueElement = document.getElementById('total-revenue');
            const totalCustomersElement = document.getElementById('total-customers');
            const activeUsersElement = document.getElementById('active-users');
            const pendingOrdersElement = document.getElementById('pending-orders');
            const completedOrdersElement = document.getElementById('completed-orders');

            // Update total orders
            if(totalOrdersElement) totalOrdersElement.textContent = orders.length;

            // Calculate and update total revenue
            const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
            if(totalRevenueElement) totalRevenueElement.textContent = `₹${totalRevenue.toFixed(2)}`;

            // Update total customers
            if(totalCustomersElement) totalCustomersElement.textContent = uniqueCustomers.size;

            // Update live counters (often these might represent recent/online activity, but using total unique for now)
            if(activeUsersElement) activeUsersElement.textContent = uniqueCustomers.size;

            if(pendingOrdersElement) pendingOrdersElement.textContent =
                orders.filter(order => !order.status || order.status === 'pending').length;

            if(completedOrdersElement) completedOrdersElement.textContent =
                orders.filter(order => order.status === 'completed').length;

            // Note: Customer Activity section is handled by loadCustomerActivity()
        })
        .catch((error) => {
            // Handle network errors
            console.error('Network or unexpected error fetching orders for stats:', error);
            // Optionally update stats elements to show error or set to 0
        });
}

// Announcement system
function initAnnouncementSystem() {
    const announcementForm = document.getElementById('announcement-form');
    const announcementList = document.getElementById('announcement-list');

    announcementForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const announcement = {
            id: Date.now(),
            title: document.getElementById('announcement-title').value,
            message: document.getElementById('announcement-message').value,
            date: new Date().toISOString()
        };

        // Save announcement
        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        announcements.unshift(announcement);
        localStorage.setItem('announcements', JSON.stringify(announcements));

        // Reset form and show notification
        announcementForm.reset();
        showNotification('Announcement posted successfully!');
        loadAnnouncements();
    });
}

// Load data functions
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const productsList = document.getElementById('products-list');

    if (products.length === 0) {
        productsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>No products yet</p>
            </div>
        `;
        return;
    }

    productsList.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-logo">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-meta">
                    <span class="rating">
                        <i class="fas fa-star"></i> ${product.rating}
                    </span>
                    <span class="price">₹${product.price.toFixed(2)}</span>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function loadAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    const announcementList = document.getElementById('announcement-list');

    if (announcements.length === 0) {
        announcementList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bullhorn"></i>
                <p>No announcements yet</p>
            </div>
        `;
        return;
    }

    announcementList.innerHTML = announcements.map(announcement => `
        <div class="announcement-item">
            <div class="announcement-header">
                <h3>${announcement.title}</h3>
                <span class="announcement-date">${new Date(announcement.date).toLocaleString()}</span>
            </div>
            <p>${announcement.message}</p>
        </div>
    `).join('');
}

// Product actions
function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Populate form with product data
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-rating').value = product.rating;
    document.getElementById('product-price').value = product.price;
    document.getElementById('logo-preview').innerHTML = `<img src="${product.image}" alt="${product.name}">`;

    // Scroll to form
    document.querySelector('.product-form').scrollIntoView({ behavior: 'smooth' });
}

function deleteProduct(productId) {
    console.log('deleteProduct called with id:', productId);
    if (!confirm('Are you sure you want to delete this product?')) return;
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedProducts = products.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    showNotification('Product deleted successfully!');
    loadProducts();
}

// Coupon System
function initCouponSystem() {
    const couponForm = document.getElementById('coupon-form');
    
    couponForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const coupon = {
            id: Date.now(),
            code: document.getElementById('coupon-code').value.toUpperCase(),
            type: document.getElementById('discount-type').value,
            value: parseFloat(document.getElementById('discount-value').value),
            expiry: document.getElementById('coupon-expiry').value,
            createdAt: new Date().toISOString()
        };

        // Save coupon
        const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
        
        // Check if coupon code already exists
        if (coupons.some(c => c.code === coupon.code)) {
            showNotification('Coupon code already exists!', 'error');
            return;
        }

        coupons.push(coupon);
        localStorage.setItem('coupons', JSON.stringify(coupons));

        // Reset form and show notification
        couponForm.reset();
        showNotification('Coupon created successfully!');
        loadCoupons();
    });

    // Initial load
    loadCoupons();
}

function loadCoupons() {
    const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
    const couponList = document.getElementById('coupon-list');

    if (coupons.length === 0) {
        couponList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-ticket-alt"></i>
                <p>No coupons yet</p>
            </div>
        `;
        return;
    }

    couponList.innerHTML = coupons.map(coupon => `
        <div class="coupon-card">
            <div class="coupon-header">
                <h3>${coupon.code}</h3>
                <button class="btn-delete" onclick="deleteCoupon('${coupon.code}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="coupon-details">
                <p>
                    <strong>Discount:</strong> 
                    ${coupon.type === 'percentage' ? coupon.value + '%' : '₹' + coupon.value}
                </p>
                <p>
                    <strong>Expires:</strong> 
                    ${new Date(coupon.expiry).toLocaleDateString()}
                </p>
            </div>
        </div>
    `).join('');
}

function deleteCoupon(code) {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
    const updatedCoupons = coupons.filter(c => c.code !== code);
    localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
    
    showNotification('Coupon deleted successfully!');
    loadCoupons();
}

// Update announcement functions
function deleteAnnouncement(id) {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    const updatedAnnouncements = announcements.filter(a => a.id !== id);
    localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
    
    showNotification('Announcement deleted successfully!');
    loadAnnouncements();
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

// Load customer details
function loadCustomerDetails() {
    console.log('Loading customer details from server via /get-orders...');
    const usersList = document.getElementById('users-list');

    if (!usersList) {
        console.log('Users list element not found!');
        return;
    }

    // Fetch orders from the server
    // *** IMPORTANT: Using the provided server URL ***
    fetch('http://de1.bot-hosting.net:20197/get-orders')
        .then(response => {
            if (!response.ok) {
                console.error('Error fetching orders from server:', response.status, response.statusText);
                 usersList.innerHTML = '<p class="error-message">Error loading customers. Could not fetch data from server.</p>';
                // Throw an error so the following .then block is skipped
                throw new Error('Failed to fetch orders from server.');
            }
            return response.json(); // Parse the JSON response (array of orders)
        })
        .then(orders => {
            console.log('Orders received from server for details:', orders);

            // --- Your existing logic to process the 'orders' array starts here ---
            // Group orders by customer email (or username)
            const customerOrders = orders.reduce((acc, order) => {
                 // Use email for grouping, but fall back to username if email is missing
                const key = order.email || order.username;
                if (!key) return acc; // Skip if no key

                if (!acc[key]) {
                    acc[key] = {
                        // Use both email and username if available, prioritize email for display if desired
                        email: order.email || 'N/A',
                        name: order.username || 'N/A', // Use username for display
                        totalSpent: 0,
                        orders: [],
                        lastOrder: null,
                        totalItems: 0
                    };
                }
                // Ensure order.total is treated as a number
                 acc[key].totalSpent += parseFloat(order.total) || 0;
                acc[key].orders.push(order);
                 // Ensure item.quantity is treated as a number
                acc[key].totalItems += (order.items || []).reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);

                // Ensure order.date is a valid date for comparison
                const orderDate = new Date(order.date);
                if (!acc[key].lastOrder || (orderDate instanceof Date && !isNaN(orderDate) && new Date(acc[key].lastOrder.date) < orderDate)) {
                     acc[key].lastOrder = order;
                 }

                return acc;
            }, {});

            const customers = Object.values(customerOrders);
            console.log('Processed customer data for display:', customers);

            if (customers.length === 0) {
                console.log('No customers found, showing empty state');
                usersList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <p>No customers yet</p>
                    </div>
                `;
                return;
            }

            // Render customer cards based on the 'customers' array
             usersList.innerHTML = customers.map(customer => `
                 <div class="customer-card">
                     <div class="customer-header">
                         <div class="customer-avatar">
                             <i class="fas fa-user-circle"></i>
                         </div>
                         <div class="customer-info">
                             <h3>${customer.name}</h3>
                             <p class="customer-email">
                                 <i class="fas fa-envelope"></i>
                                 ${customer.email}
                             </p>
                         </div>
                     </div>
                     <div class="customer-stats">
                         <div class="stat-item">
                             <div class="stat-icon">
                                 <i class="fas fa-shopping-bag"></i>
                             </div>
                             <div class="stat-details">
                                 <span class="stat-value">${customer.orders.length}</span>
                                 <span class="stat-label">Total Orders</span>
                             </div>
                         </div>
                         <div class="stat-item">
                             <div class="stat-icon">
                                 <i class="fas fa-box"></i>
                             </div>
                             <div class="stat-details">
                                 <span class="stat-value">${customer.totalItems}</span>
                                 <span class="stat-label">Items Ordered</span>
                             </div>
                         </div>
                         <div class="stat-item">
                             <div class="stat-icon">
                                 <i class="fas fa-rupee-sign"></i>
                             </div>
                             <div class="stat-details">
                                 <span class="stat-value">₹${customer.totalSpent.toFixed(2)}</span>
                                 <span class="stat-label">Total Spent</span>
                             </div>
                         </div>
                         <div class="stat-item">
                             <div class="stat-icon">
                                 <i class="fas fa-clock"></i>
                             </div>
                             <div class="stat-details">
                                  <span class="stat-value">${customer.lastOrder && customer.lastOrder.date ? new Date(customer.lastOrder.date).toLocaleDateString() : 'N/A'}</span>
                                 <span class="stat-label">Last Order</span>
                             </div>
                         </div>
                     </div>
                     <div class="customer-orders">
                         <h4>Recent Orders</h4>
                          ${customer.orders.length > 0 ? customer.orders.slice(0, 3).map(order => `
                             <div class="order-item">
                                 <div class="order-header">
                                     <span class="order-id">${order.items && order.items.length > 0 ? order.items.map(item => item.name).join(', ') : 'No items'}</span>
                                      <span class="order-date">${order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</span>
                                 </div>
                                 <div class="order-items">
                                     ${(order.items || []).map(item => `
                                         <div class="order-product">
                                             <span class="product-name">${item.name || 'N/A'}</span>
                                              <span class="product-quantity">x${item.quantity || 0}</span>
                                              <span class="product-price">₹${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                                         </div>
                                     `).join('')}
                                 </div>
                                 <div class="order-footer">
                                     <span class="order-total">₹${parseFloat(order.total || 0).toFixed(2)}</span>
                                     <span class="order-status ${order.status || 'pending'}">${order.status || 'Pending'}</span>
                                 </div>
                             </div>
                         `).join('') : '<p>No recent orders.</p>'}
                     </div>
                 </div>
             `).join('');


        })
        .catch((error) => {
            // Error handled in the .then block, but this catches network issues etc.
            console.error('Network or unexpected error fetching orders:', error);
             if(usersList && usersList.innerHTML === '') { // Only update if no error message from .then
                 usersList.innerHTML = '<p class="error-message">An unexpected error occurred while loading customers.</p>';
             }
        });
}

// Update the initAdminPanel function to include customer details loading
function initAdminPanel() {
    if (!checkAuth()) return;
    
    initTabs();
    initProductManagement();
    initAnnouncementSystem();
    initCouponSystem();
    updateDashboardStats();
    loadProducts();
    loadAnnouncements();
    loadCoupons();
    loadCustomerDetails();
    
    // Add event listener for user search
    const userSearch = document.getElementById('user-search');
    if (userSearch) {
        userSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const customerCards = document.querySelectorAll('.customer-card');
            
            customerCards.forEach(card => {
                const customerName = card.querySelector('h3').textContent.toLowerCase();
                const customerEmail = card.querySelector('.customer-email').textContent.toLowerCase();
                
                if (customerName.includes(searchTerm) || customerEmail.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Setup logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });

    // Update admin name
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
        document.querySelector('.admin-name').textContent = `Welcome, ${user.name}`;
    }

    // Remove loader
    document.querySelector('.loader').style.display = 'none';

    // Set up periodic updates
    setInterval(updateDashboardStats, 5000);
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initAdminPanel);

function patchOrdersForItems() {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    let patched = false;
    orders = orders.map(order => {
        if (!order.items) {
            order.items = [];
            patched = true;
        }
        return order;
    });
    if (patched) {
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}

// Patch orders before loading customer details
patchOrdersForItems();

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

function resetDashboardStats() {
    if (!confirm('Are you sure you want to reset dashboard stats? This will clear all orders and customers.')) return;
    localStorage.removeItem('orders');
    localStorage.removeItem('customers');
    // Optionally reset other stats keys if used
    showNotification('Dashboard stats reset!');
    // Refresh dashboard UI (assuming a function loadDashboard exists)
    if (typeof loadDashboard === 'function') loadDashboard();
}
window.resetDashboardStats = resetDashboardStats;

function resetAllCustomers() {
    if (!confirm('Are you sure you want to reset all customer data? This will clear data from the server file and cannot be undone.')) return;

    // Send request to server to clear orders file
    // *** IMPORTANT: Using the provided server URL ***
    fetch('http://de1.bot-hosting.net:20197/clear-orders', {
        method: 'POST', // Use POST as defined in server code
        // No body needed for this request
    })
    .then(response => {
        if (!response.ok) {
            console.error('Error clearing orders on server:', response.status, response.statusText);
             return response.json().then(errorData => {
                 throw new Error(errorData.message || 'Failed to clear customer data on server.');
             });
        }
        return response.json(); // Parse the response
    })
    .then(data => {
        console.log('Server response after clearing:', data.message);
        showNotification('Customer data reset!', 'success');

        // After successfully clearing on the server, update the frontend display
        // We can simply call the load functions to refetch the now empty data
        loadCustomerDetails();
        updateDashboardStats();
         // If loadCustomerActivity is separate, call it too
         loadCustomerActivity();
    })
    .catch((error) => {
        console.error('Error sending clear request to server:', error);
        showNotification('An error occurred while resetting customer data: ' + error.message, 'error');
    });
}
window.resetAllCustomers = resetAllCustomers;

function resetCustomerActivity() {
    if (!confirm('Are you sure you want to reset all customer activity?')) return;
    localStorage.removeItem('activity');
    showNotification('Customer activity reset!');
    // Refresh activity UI if a function exists
    if (typeof loadCustomerActivity === 'function') loadCustomerActivity();
}
window.resetCustomerActivity = resetCustomerActivity;

function loadCustomerActivity() {
    console.log('Loading customer activity from server via /get-orders...');
    const activityList = document.getElementById('users-list'); // Assuming activity is displayed here or similar element

    if (!activityList) {
         console.log('Activity list element not found!');
         return;
     }

    // Fetch orders from the server (same endpoint as customer details/stats)
    // *** IMPORTANT: Using the provided server URL ***
    fetch('http://de1.bot-hosting.net:20197/get-orders')
        .then(response => {
            if (!response.ok) {
                console.error('Error fetching activity from server:', response.status, response.statusText);
                 activityList.innerHTML = '<p class="error-message">Error loading activity.</p>';
                 throw new Error('Failed to fetch activity from server.');
            }
            return response.json(); // Parse the JSON response (array of orders)
        })
        .then(orders => {
              console.log('Orders received from server for activity:', orders);
              // Transform orders into activity messages
              // Sort by date descending for most recent activity first
              const activity = orders.map(order => ({
                  message: `Order placed by ${order.username || 'N/A'} (${order.email || 'N/A'}) for ₹${parseFloat(order.total || 0).toFixed(2)}`,
                  date: order.date // Assuming order has a date property
              })).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date


             if (activity.length === 0) {
                 activityList.innerHTML = `
                     <div class="empty-state">
                         <i class="fas fa-users"></i>
                         <p>No customer activity yet</p>
                     </div>
                 `;
                 return;
             }

             // Render activity items
             activityList.innerHTML = activity.map(act => `
                 <div class="activity-item">
                     <span>${act.message}</span>
                     <span class="activity-date">${new Date(act.date).toLocaleString()}</span>
                 </div>
             `).join('');
         })
         .catch((error) => {
             console.error('Network or unexpected error fetching activity:', error);
             if(activityList && activityList.innerHTML === '') { // Only update if no error message from .then
                activityList.innerHTML = '<p class="error-message">An unexpected error occurred while loading activity.</p>';
             }
         });
}
window.loadCustomerActivity = loadCustomerActivity;

// Remove the automatic call to loadCustomerActivity
// if (document.getElementById('users-list')) {
//     loadCustomerActivity();
// } 