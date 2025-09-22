// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadCart();
    }

    // Add item to cart
    addItem(product, quantity = 1) {
        console.log('Adding item to cart:', product, 'quantity:', quantity);
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            console.log('Updated existing item quantity to:', existingItem.quantity);
        } else {
            const newItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: quantity
            };
            this.items.push(newItem);
            console.log('Added new item to cart:', newItem);
        }
        
        console.log('Cart items after add:', this.items);
        this.saveCart();
        this.updateCartDisplay();
        this.showToast(`${product.name} added to cart!`);
    }

    // Remove item from cart
    removeItem(productId) {
        const index = this.items.findIndex(item => item.id === productId);
        if (index !== -1) {
            const removedItem = this.items.splice(index, 1)[0];
            this.saveCart();
            this.updateCartDisplay();
            if (window.cartModal && window.cartModal.modal && window.cartModal.modal.style.display === 'block') {
                window.cartModal.updateCartDisplay();
            }
            this.showToast(`${removedItem.name} removed from cart!`);
            return removedItem;
        }
        return null;
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
                if (window.cartModal && window.cartModal.modal && window.cartModal.modal.style.display === 'block') {
                    window.cartModal.updateCartDisplay();
                }
            }
        }
    }

    // Clear all items from cart
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
        this.showToast('Cart cleared!');
    }

    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get total items count
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('diyCraftsCart', JSON.stringify(this.items));
            console.log('Cart saved to localStorage');
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const savedCart = localStorage.getItem('diyCraftsCart');
            if (savedCart) {
                this.items = JSON.parse(savedCart);
                console.log('Cart loaded from localStorage:', this.items.length, 'items');
            } else {
                console.log('No saved cart found');
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.items = [];
        }
        this.updateCartDisplay();
    }

    // Update cart display
    updateCartDisplay() {
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            const totalItems = this.getTotalItems();
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
            console.log('Updating cart display - total items:', totalItems, 'cart count element:', !!cartCountElement);
        }
    }

    // Show toast notification
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Cart Modal Management
class CartModal {
    constructor() {
        this.modal = null;
        this.shoppingCart = null;
    }

    init() {
        this.modal = document.getElementById('cartModal');
        this.shoppingCart = window.shoppingCart;
        this.initEventListeners();
        this.updateCartDisplay();
    }

    initEventListeners() {
        const closeBtn = document.getElementById('closeCartModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }

        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }
    }

    open() {
        if (this.modal) {
            this.updateCartDisplay();
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            console.log('Cart modal opened');
        }
    }

    close() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            console.log('Cart modal closed');
        }
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartEmpty = document.getElementById('cartEmpty');

        if (!this.shoppingCart || !this.shoppingCart.items.length) {
            if (cartItems) cartItems.innerHTML = '';
            if (cartTotal) {
                const totalAmount = cartTotal.querySelector('#totalAmount');
                if (totalAmount) totalAmount.textContent = '0.00';
            }
            if (cartEmpty) cartEmpty.style.display = 'block';
            return;
        }

        if (cartEmpty) cartEmpty.style.display = 'none';

        if (cartItems) {
            cartItems.innerHTML = this.shoppingCart.items.map(item => `
                <div class="cart-item" data-product-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjEwcHgiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Rs ${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="shoppingCart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="shoppingCart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="remove-btn" onclick="shoppingCart.removeItem(${item.id})">×</button>
                    </div>
                </div>
            `).join('');
        }

        if (cartTotal) {
            const totalAmount = cartTotal.querySelector('#totalAmount');
            if (totalAmount) totalAmount.textContent = this.shoppingCart.getTotal().toFixed(2);
        }
    }

    checkout() {
        if (!this.shoppingCart || !this.shoppingCart.items.length) {
            alert('Your cart is empty!');
            return;
        }

        const orderData = {
            items: this.shoppingCart.items,
            total: this.shoppingCart.getTotal(),
            timestamp: new Date().toISOString()
        };

        this.sendOrderEmail(orderData);
        this.shoppingCart.clearCart();
        this.close();
    }

    async sendOrderEmail(orderData) {
        try {
            const checkoutBtn = document.getElementById('checkoutBtn');
            const originalText = checkoutBtn ? checkoutBtn.textContent : 'Processing...';
            if (checkoutBtn) checkoutBtn.textContent = 'Processing Order...';

            const orderSummary = orderData.items.map(item => 
                `${item.name} x${item.quantity} - Rs ${item.price.toFixed(2)}`
            ).join('\n');

            // Try to send email using EmailJS
            if (typeof emailjs !== 'undefined') {
                try {
                    // Initialize EmailJS (you'll need to replace with your actual public key)
                    emailjs.init('J-A4XDkOM-wayz2AS');
                    
                    const templateParams = {
                        to_email: 'craftedbycrochet@gmail.com',
                        subject: `New Order - ${new Date().toLocaleDateString()}`,
                        order_details: orderSummary,
                        total_amount: `Rs ${orderData.total.toFixed(2)}`,
                        order_time: new Date().toLocaleString()
                    };

                    await emailjs.send('service_59mtpje', 'template_q1scjwp', templateParams);
                    console.log('Order email sent successfully');
                } catch (emailError) {
                    console.log('EmailJS not configured, using fallback method');
                }
            }

            alert(`Order submitted successfully!\n\nOrder Details:\n${orderSummary}\n\nTotal: Rs ${orderData.total.toFixed(2)}\n\nAn email has been sent to craftedbycrochet@gmail.com`);

            if (checkoutBtn) checkoutBtn.textContent = originalText;

        } catch (error) {
            console.error('Error sending order email:', error);
            alert('Order submitted, but there was an issue sending the email. Please contact craftedbycrochet@gmail.com directly.');
        }
    }

    clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            this.shoppingCart.clearCart();
            this.updateCartDisplay();
        }
    }
}

// Create global instances
window.shoppingCart = new ShoppingCart();
window.cartModal = new CartModal();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart system initialized');
    window.cartModal.init();
});
