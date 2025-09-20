// Main JavaScript for Customer Interface
class HomePageManager {
    constructor() {
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.products = [];
        
        this.initEventListeners();
        this.loadProducts();
    }

    initEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }

        // Category filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCategoryFilter(e));
        });

        // Cart button
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.openCart());
        }
    }

    initProductModal() {
        // Close product modal
        const closeBtn = document.getElementById('closeModal');
        console.log('Product modal close button found:', closeBtn);
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('Close product modal clicked');
                this.closeProductModal();
            });
        } else {
            console.error('Product modal close button not found!');
        }

        // Close on outside click
        const modal = document.getElementById('productModal');
        console.log('Product modal element found:', modal);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    console.log('Product modal outside click');
                    this.closeProductModal();
                }
            });
        } else {
            console.error('Product modal element not found!');
        }
    }

    loadProducts() {
        // Always load fresh products from localStorage to reflect admin changes
        window.productManager.loadProductsFromStorage();
        this.products = window.productManager.getAllProducts();
        this.filterProducts(); // Use filterProducts to ensure proper filtering
    }

    handleSearch(e) {
        this.searchQuery = e.target.value.trim();
        this.filterProducts();
    }

    handleCategoryFilter(e) {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        e.target.classList.add('active');
        
        // Update current category
        this.currentCategory = e.target.dataset.category;
        
        // Clear search when "All" is selected to show all products
        if (this.currentCategory === 'all') {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = '';
                this.searchQuery = '';
            }
        }
        
        this.filterProducts();
    }

    filterProducts() {
        let filteredProducts = window.productManager.getAllProducts();

        // Filter by category (show all if 'all' is selected)
        if (this.currentCategory && this.currentCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.category === this.currentCategory
            );
        }

        // Filter by search query (show all if search is empty)
        if (this.searchQuery && this.searchQuery.length > 0) {
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        this.products = filteredProducts;
        this.renderProducts();
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const noProducts = document.getElementById('noProducts');
        
        if (this.products.length === 0) {
            productsGrid.style.display = 'none';
            noProducts.style.display = 'block';
        } else {
            productsGrid.style.display = 'grid';
            noProducts.style.display = 'none';
            
            productsGrid.innerHTML = this.products.map(product => this.createProductCard(product)).join('');
            
            // Add click event listeners to product cards
            this.attachProductCardListeners();
        }
    }

    attachProductCardListeners() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(card.dataset.productId);
                console.log('Product card clicked, ID:', productId);
                this.openProductModal(productId);
            });
        });
    }

    createProductCard(product) {
        console.log('Creating product card for:', product.name, 'ID:', product.id);
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">No Image</text></svg>'">
                </div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">Rs ${product.price.toFixed(2)}</div>
                    <div class="product-category">${this.formatCategory(product.category)}</div>
                </div>
            </div>
        `;
    }

    formatCategory(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    openProductModal(productId) {
        console.log('Opening product modal for ID:', productId);
        const product = window.productManager.getProductById(productId);
        console.log('Product found:', product);
        if (product) {
            this.showProductModal(product);
        } else {
            console.error('Product not found for ID:', productId);
        }
    }

    showProductModal(product) {
        console.log('Showing product modal for:', product);
        const modal = document.getElementById('productModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalPrice = document.getElementById('modalPrice');
        const modalCategory = document.getElementById('modalCategory');
        const modalStock = document.getElementById('modalStock');
        const modalDescription = document.getElementById('modalDescription');
        const addToCartBtn = document.getElementById('addToCartBtn');
        const contactSellerBtn = document.getElementById('contactSellerBtn');

        console.log('Modal element found:', modal);
        if (modal) {
            // Set product details
            if (modalImage) modalImage.src = product.image;
            if (modalTitle) modalTitle.textContent = product.name;
            if (modalPrice) modalPrice.textContent = `Rs ${product.price.toFixed(2)}`;
            if (modalCategory) modalCategory.textContent = this.formatCategory(product.category);
            if (modalStock) {
                modalStock.textContent = product.stock === 0 ? 'Out of Stock' : `${product.stock} available`;
                modalStock.className = `product-stock ${product.stock === 0 ? 'out-of-stock' : 'in-stock'}`;
            }
            if (modalDescription) modalDescription.textContent = product.description;

            // Set up quantity selector
            this.initQuantitySelector();

            // Set up buttons
            if (addToCartBtn) {
                addToCartBtn.onclick = () => this.addToCart(product);
                addToCartBtn.disabled = product.stock === 0;
                addToCartBtn.textContent = product.stock === 0 ? 'Out of Stock' : 'Add to Cart';
            }

            if (contactSellerBtn) {
                contactSellerBtn.onclick = () => this.contactSeller(product);
            }

            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            console.log('Modal should now be visible');
        } else {
            console.error('Modal element not found!');
        }
    }

    closeProductModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    initQuantitySelector() {
        const quantityInput = document.getElementById('quantityInput');
        const decreaseBtn = document.getElementById('quantityDecrease');
        const increaseBtn = document.getElementById('quantityIncrease');
        
        if (quantityInput) {
            quantityInput.value = 1; // Reset to 1 when modal opens
        }
        
        if (decreaseBtn) {
            decreaseBtn.onclick = () => {
                const currentValue = parseInt(quantityInput.value) || 1;
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            };
        }
        
        if (increaseBtn) {
            increaseBtn.onclick = () => {
                const currentValue = parseInt(quantityInput.value) || 1;
                if (currentValue < 10) {
                    quantityInput.value = currentValue + 1;
                }
            };
        }
    }

    addToCart(product) {
        console.log('Add to cart clicked for product:', product);
        console.log('Shopping cart available:', !!window.shoppingCart);
        
        const quantityInput = document.getElementById('quantityInput');
        const quantity = parseInt(quantityInput?.value) || 1;
        
        if (window.shoppingCart) {
            window.shoppingCart.addItem(product, quantity);
            this.closeProductModal();
            console.log(`Added ${quantity} of ${product.name} to cart successfully`);
        } else {
            console.error('Shopping cart not available!');
        }
    }

    contactSeller(product) {
        // Show contact modal
        this.showContactModal(product);
    }

    showContactModal(product) {
        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeContactModal() {
        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    openCart() {
        console.log('Cart icon clicked');
        console.log('Cart modal available:', !!window.cartModal);
        console.log('Cart modal object:', window.cartModal);
        console.log('Cart modal open method:', typeof window.cartModal?.open);
        
        if (window.cartModal && typeof window.cartModal.open === 'function') {
            window.cartModal.open();
        } else {
            console.error('Cart modal not available or open method not found!');
            console.log('Available methods:', Object.getOwnPropertyNames(window.cartModal || {}));
        }
    }

    initContactModal() {
        // Close contact modal
        const closeBtn = document.getElementById('closeContactModal');
        console.log('Contact modal close button found:', closeBtn);
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('Close contact modal clicked');
                this.closeContactModal();
            });
        } else {
            console.error('Contact modal close button not found!');
        }

        // Close on outside click
        const modal = document.getElementById('contactModal');
        console.log('Contact modal element found:', modal);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    console.log('Contact modal outside click');
                    this.closeContactModal();
                }
            });
        } else {
            console.error('Contact modal element not found!');
        }
    }
}

// Product Modal Management
class ProductModal {
    constructor() {
        this.modal = null;
    }

    init() {
        this.modal = document.getElementById('productModal');
        this.initEventListeners();
    }

    initEventListeners() {
        // Close modal
        const closeBtn = document.getElementById('closeModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Close on outside click
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }
    }

    close() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
}

// Create global instances
window.homePageManager = new HomePageManager();
window.productModal = new ProductModal();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Initialize modals after DOM is ready
    window.homePageManager.initProductModal();
    window.homePageManager.initContactModal();
    window.productModal.init();
    
    // Cart modals are initialized in cart.js
    console.log('Cart modals will be initialized by cart.js');
    
    console.log('DIY Crafts Marketplace loaded successfully!');
    console.log('Cart modal available:', !!window.cartModal);
    console.log('Shopping cart available:', !!window.shoppingCart);
});

// Refresh products when page becomes visible (user returns from admin panel)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page is now visible, refresh products to show any admin changes
        window.homePageManager.loadProducts();
    }
});

// Also refresh when window gains focus
window.addEventListener('focus', function() {
    window.homePageManager.loadProducts();
});

// Listen for admin data changes
window.addEventListener('adminDataChanged', function() {
    window.homePageManager.loadProducts();
});
