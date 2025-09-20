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

        // Item form
        this.initItemForm();
        
        // Modal management
        this.initModals();
        
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
        this.updateAnalytics();
        this.loadItems();
        this.createTestOrderIfNeeded();
    }

    createTestOrderIfNeeded() {
        // Create a test order if no orders exist
        const existingOrders = localStorage.getItem('diyCraftsOrders');
        if (!existingOrders || JSON.parse(existingOrders).length === 0) {
            const testOrder = {
                id: Date.now(),
                customerName: 'Test Customer',
                customerEmail: 'test@example.com',
                customerPhone: '+1 (555) 123-4567',
                shippingAddress: '123 Test Street, Test City, TC 12345',
                items: [
                    { name: 'Crochet Flower Bouquet', price: 28.99, quantity: 1 },
                    { name: 'Crochet Keychain Set', price: 15.50, quantity: 2 }
                ],
                total: 59.99,
                date: new Date().toISOString().split('T')[0],
                status: 'pending',
                transferImage: 'Not provided'
            };
            localStorage.setItem('diyCraftsOrders', JSON.stringify([testOrder]));
            console.log('Test order created');
        }
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
        const categoryCounts = {};
        products.forEach(product => {
            categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
        });
        
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
                    <div class="item-price">Rs ${product.price.toFixed(2)}</div>
                    <div class="item-stock ${stockClass}">${stockText}</div>
                    <div class="item-description">${product.description}</div>
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
        document.getElementById('itemDescription').value = product.description;
        
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
        
        const imageFile = document.getElementById('itemImage').files[0];
        let imageData = null;
        
        if (imageFile) {
            imageData = await this.convertImageToBase64(imageFile);
        }
        
        const formData = {
            name: document.getElementById('itemName').value,
            category: document.getElementById('itemCategory').value,
            price: parseFloat(document.getElementById('itemPrice').value),
            stock: parseInt(document.getElementById('itemStock').value),
            description: document.getElementById('itemDescription').value,
            image: imageData
        };

        if (this.editingItem) {
            // Update existing item
            const updated = window.productManager.updateProduct(this.editingItem.id, formData);
            if (updated) {
                this.showToast('Item updated successfully!');
                this.closeItemModal();
                this.loadItems();
                this.updateAnalytics();
                // Notify main page to refresh (if it exists)
                this.notifyMainPageRefresh();
            }
        } else {
            // Add new item
            const newItem = window.productManager.addProduct(formData);
            if (newItem) {
                this.showToast('Item added successfully!');
                this.closeItemModal();
                this.loadItems();
                this.updateAnalytics();
                // Notify main page to refresh (if it exists)
                this.notifyMainPageRefresh();
            }
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
            const deleted = window.productManager.deleteProduct(itemId);
            if (deleted) {
                this.showToast('Item deleted successfully!');
                this.loadItems();
                this.updateAnalytics();
                this.notifyMainPageRefresh();
            }
        }
    }

    toggleStock(itemId) {
        const product = window.productManager.getProductById(itemId);
        if (product) {
            const newStock = product.stock > 0 ? 0 : 1;
            const updated = window.productManager.updateProduct(itemId, { stock: newStock });
            if (updated) {
                this.showToast(`Item marked as ${newStock > 0 ? 'available' : 'sold'}!`);
                this.loadItems();
                this.updateAnalytics();
                this.notifyMainPageRefresh();
            }
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
                            <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">Total: $${order.total.toFixed(2)}</div>
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
}

// Create global admin instance
window.adminManager = new AdminManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Admin manager is already initialized in its constructor
    console.log('Admin Dashboard loaded successfully!');
});
