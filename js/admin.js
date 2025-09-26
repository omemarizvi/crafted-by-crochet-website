// Admin Dashboard Management
class AdminManager {
    constructor() {
        this.isLoggedIn = false;
        this.currentView = 'dashboard';
        this.editingItem = null;
        
        this.initEventListeners();
        this.checkAuthStatus();
    }

    initEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Action buttons
        const addItemBtn = document.getElementById('addItemBtn');
        if (addItemBtn) {
            addItemBtn.addEventListener('click', () => this.showAddItemForm());
        }

        const viewOrdersBtn = document.getElementById('viewOrdersBtn');
        if (viewOrdersBtn) {
            viewOrdersBtn.addEventListener('click', () => this.toggleOrdersView());
        }

        const viewPopularityBtn = document.getElementById('viewPopularityBtn');
        if (viewPopularityBtn) {
            viewPopularityBtn.addEventListener('click', () => this.showPopularityStats());
        }

        const closePopularityBtn = document.getElementById('closePopularityBtn');
        if (closePopularityBtn) {
            closePopularityBtn.addEventListener('click', () => this.hidePopularityStats());
        }

        // Item form
        this.initItemForm();
        
        // Modal management
        this.initModals();
        
        // Mobile drawer buttons
        this.initMobileDrawerButtons();
        
        // Listen for new orders
        window.addEventListener('newOrderPlaced', () => {
            this.updateAnalytics();
            if (this.currentView === 'orders') {
                this.loadOrders();
            }
        });
    }

    checkAuthStatus() {
        // Check if user is already logged in (from localStorage)
        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        if (isLoggedIn) {
            this.login();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple authentication (in real app, this would be server-side)
        if (username === 'admin' && password === 'admin123') {
            this.login();
        } else {
            this.showToast('Invalid username or password');
        }
    }

    login() {
        this.isLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        
        // Hide login screen, show dashboard
        const loginScreen = document.getElementById('loginScreen');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'block';
        
        this.loadDashboard();
    }

    handleLogout() {
        this.isLoggedIn = false;
        localStorage.removeItem('adminLoggedIn');
        
        // Show login screen, hide dashboard
        const loginScreen = document.getElementById('loginScreen');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (loginScreen) loginScreen.style.display = 'flex';
        if (adminDashboard) adminDashboard.style.display = 'none';
    }

    loadDashboard() {
        // Products are already loaded in constructor
        this.updateAnalytics();
        this.loadItems();
        this.createTestOrderIfNeeded();
    }

    createTestOrderIfNeeded() {
        // No longer create test orders with sample data
        // Orders will only be created when customers place real orders
    }

    updateAnalytics() {
        const products = window.productManager.getAllProducts();
        const totalItems = products.length;
        const totalOrders = this.getOrdersCount();
        const popularCategory = this.getPopularCategory(products);
        
        // Update analytics display
        const totalItemsEl = document.getElementById('totalItems');
        const totalOrdersEl = document.getElementById('totalOrders');
        const popularCategoryEl = document.getElementById('popularCategory');
        
        if (totalItemsEl) totalItemsEl.textContent = totalItems;
        if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
        if (popularCategoryEl) popularCategoryEl.textContent = popularCategory;
    }

    getOrdersCount() {
        // Get orders from localStorage
        const orders = localStorage.getItem('diyCraftsOrders');
        if (orders) {
            return JSON.parse(orders).length;
        }
        return 0;
    }

    getPopularCategory(products) {
        if (!products || products.length === 0) {
            return 'No products';
        }
        
        const categoryCounts = {};
        products.forEach(product => {
            categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
        });
        
        if (Object.keys(categoryCounts).length === 0) {
            return 'No categories';
        }
        
        const popular = Object.keys(categoryCounts).reduce((a, b) => 
            categoryCounts[a] > categoryCounts[b] ? a : b
        );
        
        return this.formatCategory(popular);
    }

    formatCategory(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    loadItems() {
        const itemsGrid = document.getElementById('itemsGrid');
        if (itemsGrid) {
            const products = window.productManager.getAllProducts();
            console.log('Loading items in admin panel:', products.length, 'products');
            itemsGrid.innerHTML = products.map(product => this.createItemCard(product)).join('');
        }
    }

    createItemCard(product) {
        const stockClass = product.stock === 0 ? 'out-of-stock' : 'in-stock';
        const stockText = product.stock === 0 ? 'Out of Stock' : `${product.stock} available`;
        
        return `
            <div class="item-card">
                <div class="item-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">No Image</text></svg>'">
                </div>
                <div class="item-info">
                    <div class="item-name">${product.name}</div>
                    <div class="item-category">${this.formatCategory(product.category)}</div>
                    <div class="item-price">Rs ${product.price}</div>
                    <div class="item-stock ${stockClass}">${stockText}</div>
                    <div class="item-actions">
                        <button class="btn btn-primary" onclick="adminManager.editItem(${product.id})">Edit</button>
                        <button class="btn btn-secondary" onclick="adminManager.deleteItem(${product.id})">Delete</button>
                        <button class="btn btn-secondary" onclick="adminManager.toggleStock(${product.id})">
                            ${product.stock > 0 ? 'Mark Sold' : 'Mark Available'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showAddItemForm() {
        this.editingItem = null;
        this.showItemModal();
    }

    editItem(itemId) {
        const product = window.productManager.getProductById(itemId);
        if (product) {
            this.editingItem = product;
            this.showItemModal();
        }
    }

    showItemModal() {
        const modal = document.getElementById('itemModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('itemForm');
        
        if (modal) {
            if (this.editingItem) {
                modalTitle.textContent = 'Edit Item';
                this.populateForm(this.editingItem);
            } else {
                modalTitle.textContent = 'Add New Item';
                form.reset();
            }
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    populateForm(product) {
        document.getElementById('itemName').value = product.name;
        document.getElementById('itemCategory').value = product.category;
        document.getElementById('itemPrice').value = product.price;
        document.getElementById('itemStock').value = product.stock;
        
        // Handle image display for editing
        if (product.image) {
            const preview = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');
            previewImg.src = product.image;
            preview.style.display = 'block';
        }
    }

    initItemForm() {
        const form = document.getElementById('itemForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleItemSubmit(e));
        }

        const cancelBtn = document.getElementById('cancelItemBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeItemModal());
        }

        // Image preview functionality
        const imageInput = document.getElementById('itemImage');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImagePreview(e));
        }
    }

    handleImagePreview(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
        }
    }

    convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    async handleItemSubmit(e) {
        e.preventDefault();
        console.log('Form submit triggered');
        
        const imageFile = document.getElementById('itemImage').files[0];
        let imageData = null;
        
        if (imageFile) {
            imageData = await this.convertImageToBase64(imageFile);
        } else if (this.editingItem && this.editingItem.image) {
            // Keep existing image if no new image is uploaded during edit
            imageData = this.editingItem.image;
        }
        
        // Validate required fields
        const name = document.getElementById('itemName').value.trim();
        const category = document.getElementById('itemCategory').value;
        const price = document.getElementById('itemPrice').value;
        const stock = document.getElementById('itemStock').value;
        
        if (!name || !category || !price || !stock) {
            this.showToast('Please fill in all required fields');
            return;
        }
        
        if (!imageData && !this.editingItem) {
            this.showToast('Please select an image for the item');
            return;
        }
        
        const formData = {
            name: name,
            category: category,
            price: parseFloat(price),
            stock: parseInt(stock),
            image: imageData,
            imageFile: imageFile
        };
        
        console.log('Form data being submitted:', formData);

        if (this.editingItem) {
            // Update existing item
            console.log('Updating item in admin panel:', this.editingItem.id, formData);
            window.productManager.updateProduct(this.editingItem.id, formData)
                .then(updated => {
                    if (updated) {
                        console.log('Item updated successfully');
                        this.showToast('Item updated successfully!');
                        this.closeItemModal();
                        this.loadItems();
                        this.updateAnalytics();
                        // Notify main page to refresh (if it exists)
                        this.notifyMainPageRefresh();
                    }
                })
                .catch(error => {
                    console.error('Error updating item:', error);
                    this.showToast('Error updating item. Please try again.');
                });
        } else {
            // Add new item
            console.log('Adding new item in admin panel:', formData);
            window.productManager.addProduct(formData)
                .then(newItem => {
                    if (newItem) {
                        console.log('Item added successfully:', newItem);
                        this.showToast('Item added successfully!');
                        this.closeItemModal();
                        this.loadItems();
                        this.updateAnalytics();
                        // Notify main page to refresh (if it exists)
                        this.notifyMainPageRefresh();
                    }
                })
                .catch(error => {
                    console.error('Error adding item:', error);
                    this.showToast('Error adding item. Please try again.');
                });
        }
    }

    closeItemModal() {
        const modal = document.getElementById('itemModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        this.editingItem = null;
    }

    deleteItem(itemId) {
        if (confirm('Are you sure you want to delete this item?')) {
            window.productManager.deleteProduct(itemId)
                .then(deleted => {
                    if (deleted) {
                        this.showToast('Item deleted successfully!');
                        this.loadItems();
                        this.updateAnalytics();
                        this.notifyMainPageRefresh();
                    }
                })
                .catch(error => {
                    console.error('Error deleting item:', error);
                    this.showToast('Error deleting item. Please try again.');
                });
        }
    }

    toggleStock(itemId) {
        const product = window.productManager.getProductById(itemId);
        if (product) {
            const newStock = product.stock > 0 ? 0 : 1;
            window.productManager.updateProduct(itemId, { stock: newStock })
                .then(updated => {
                    if (updated) {
                        this.showToast(`Item marked as ${newStock > 0 ? 'available' : 'sold'}!`);
                        this.loadItems();
                        this.updateAnalytics();
                        this.notifyMainPageRefresh();
                    }
                })
                .catch(error => {
                    console.error('Error updating stock:', error);
                    this.showToast('Error updating stock. Please try again.');
                });
        }
    }

    toggleOrdersView() {
        const ordersSection = document.getElementById('ordersSection');
        const itemsSection = document.querySelector('.items-section');
        const viewOrdersBtn = document.getElementById('viewOrdersBtn');
        
        console.log('Toggle orders view clicked, current view:', this.currentView);
        console.log('Orders section found:', ordersSection);
        console.log('Items section found:', itemsSection);
        
        if (ordersSection) {
            if (this.currentView === 'dashboard') {
                // Show orders, hide items
                ordersSection.style.display = 'block';
                if (itemsSection) itemsSection.style.display = 'none';
                this.currentView = 'orders';
                if (viewOrdersBtn) {
                    viewOrdersBtn.textContent = 'Back to Dashboard';
                    viewOrdersBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Dashboard';
                }
                this.loadOrders();
            } else {
                // Show items, hide orders
                ordersSection.style.display = 'none';
                if (itemsSection) itemsSection.style.display = 'block';
                this.currentView = 'dashboard';
                if (viewOrdersBtn) {
                    viewOrdersBtn.textContent = 'View Orders';
                    viewOrdersBtn.innerHTML = '<i class="fas fa-list"></i> View Orders';
                }
            }
        } else {
            console.error('Orders section not found!');
        }
    }

    loadOrders() {
        const ordersList = document.getElementById('ordersList');
        console.log('Loading orders, ordersList found:', ordersList);
        
        if (ordersList) {
            const orders = this.getOrdersFromStorage();
            console.log('Orders from storage:', orders);
            
            if (orders.length === 0) {
                ordersList.innerHTML = '<div class="no-orders"><i class="fas fa-shopping-cart"></i><p>No orders yet</p></div>';
            } else {
                ordersList.innerHTML = orders.map(order => this.createOrderCard(order)).join('');
            }
        } else {
            console.error('Orders list element not found!');
        }
    }

    getOrdersFromStorage() {
        const orders = localStorage.getItem('diyCraftsOrders');
        return orders ? JSON.parse(orders) : [];
    }

    createOrderCard(order) {
        return `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-date">${order.date}</div>
                </div>
                <div class="order-customer">
                    <div class="customer-name">${order.customerName}</div>
                    <div class="customer-email">${order.customerEmail}</div>
                    <div class="customer-phone">${order.customerPhone}</div>
                </div>
                <div class="order-address">
                    <strong>Shipping Address:</strong> ${order.shippingAddress}
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span class="item-name">${item.name}</span>
                            <span class="item-quantity">Qty: ${item.quantity}</span>
                            <span class="item-total">Rs ${(item.price * item.quantity)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">Total: Rs ${order.total}</div>
                ${order.transferImage && order.transferImage !== 'Not provided' ? `
                    <div class="order-screenshot">
                        <strong>Payment Screenshot:</strong>
                        <div class="screenshot-container">
                            <img src="${order.transferImage}" alt="Payment Screenshot" class="screenshot-image">
                        </div>
                    </div>
                ` : ''}
                <div class="order-status">Status: <span class="status-${order.status}">${order.status}</span></div>
            </div>
        `;
    }

    initModals() {
        // Item modal
        const itemModal = document.getElementById('itemModal');
        if (itemModal) {
            const closeBtn = document.getElementById('closeItemModal');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeItemModal());
            }

            itemModal.addEventListener('click', (e) => {
                if (e.target === itemModal) {
                    this.closeItemModal();
                }
            });
        }
    }

    notifyMainPageRefresh() {
        // Dispatch a custom event that the main page can listen to
        window.dispatchEvent(new CustomEvent('adminDataChanged'));
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
    
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    // Popularity Statistics Methods
    showPopularityStats() {
        const popularitySection = document.getElementById('popularityStatsSection');
        if (popularitySection) {
            this.loadPopularityStats();
            popularitySection.style.display = 'block';
            this.currentView = 'popularity';
        }
    }

    hidePopularityStats() {
        const popularitySection = document.getElementById('popularityStatsSection');
        if (popularitySection) {
            popularitySection.style.display = 'none';
            this.currentView = 'dashboard';
        }
    }

    loadPopularityStats() {
        if (!window.productManager) {
            console.error('Product manager not available');
            return;
        }

        const stats = window.productManager.getPopularityStats();
        this.renderPopularityStats(stats);
    }

    renderPopularityStats(stats) {
        const statsGrid = document.getElementById('popularityStatsGrid');
        const totalOrderCount = document.getElementById('totalOrderCount');
        const mostPopularProduct = document.getElementById('mostPopularProduct');
        const averagePopularity = document.getElementById('averagePopularity');

        if (!statsGrid) return;

        // Sort products by popularity (highest first)
        const sortedProducts = stats.products.sort((a, b) => b.popularity - a.popularity);

        // Render product statistics
        statsGrid.innerHTML = sortedProducts.map(product => `
            <div class="popularity-card">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <div class="popularity-metrics">
                        <div class="metric">
                            <span class="metric-label">Popularity:</span>
                            <span class="metric-value popularity-${this.getPopularityLevel(product.popularity)}">${product.popularity}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Orders:</span>
                            <span class="metric-value">${product.orderCount}</span>
                        </div>
                    </div>
                </div>
                <div class="popularity-bar">
                    <div class="popularity-fill" style="width: ${product.popularity}%"></div>
                </div>
            </div>
        `).join('');

        // Update summary statistics
        if (totalOrderCount) {
            totalOrderCount.textContent = stats.totalOrders;
        }

        if (mostPopularProduct && sortedProducts.length > 0) {
            mostPopularProduct.textContent = sortedProducts[0].name;
        }

        if (averagePopularity) {
            const avg = Math.round(stats.products.reduce((sum, p) => sum + p.popularity, 0) / stats.products.length);
            averagePopularity.textContent = avg;
        }
    }

    getPopularityLevel(popularity) {
        if (popularity >= 80) return 'high';
        if (popularity >= 60) return 'medium';
        return 'low';
    }

    initMobileDrawerButtons() {
        // Mobile drawer button event listeners
        const drawerAddItemBtn = document.getElementById('drawerAddItemBtn');
        if (drawerAddItemBtn) {
            drawerAddItemBtn.addEventListener('click', () => {
                this.showAddItemForm();
                this.closeMobileDrawer();
            });
        }

        const drawerViewOrdersBtn = document.getElementById('drawerViewOrdersBtn');
        if (drawerViewOrdersBtn) {
            drawerViewOrdersBtn.addEventListener('click', () => {
                this.toggleOrdersView();
                this.closeMobileDrawer();
            });
        }

        const drawerPopularityBtn = document.getElementById('drawerPopularityBtn');
        if (drawerPopularityBtn) {
            drawerPopularityBtn.addEventListener('click', () => {
                this.showPopularityStats();
                this.closeMobileDrawer();
            });
        }

        const drawerLogoutBtn = document.getElementById('drawerLogoutBtn');
        if (drawerLogoutBtn) {
            drawerLogoutBtn.addEventListener('click', () => {
                this.handleLogout();
                this.closeMobileDrawer();
            });
        }
    }

    closeMobileDrawer() {
        const mobileDrawer = document.getElementById('mobileDrawer');
        if (mobileDrawer) {
            mobileDrawer.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Create global admin instance
window.adminManager = new AdminManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Admin Dashboard initializing...');
    
    // Load products and initialize dashboard
    if (window.adminManager.isLoggedIn) {
        window.adminManager.loadItems();
        window.adminManager.updateAnalytics();
    }
    
    // Admin manager is already initialized in its constructor
    console.log('Admin Dashboard loaded successfully!');
});