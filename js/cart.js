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
            console.log('Opening cart modal, shopping cart items:', this.shoppingCart ? this.shoppingCart.items.length : 0);
            this.updateCartDisplay();
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            console.log('Cart modal opened');
            
            // Debug: Check if checkout button exists
            const checkoutBtn = document.getElementById('checkoutBtn');
            console.log('Checkout button found:', !!checkoutBtn);
            if (checkoutBtn) {
                console.log('Checkout button display:', checkoutBtn.style.display);
                console.log('Checkout button visibility:', checkoutBtn.style.visibility);
                console.log('Checkout button parent:', checkoutBtn.parentElement);
                
                // Force the button to be visible
                checkoutBtn.style.display = 'block';
                checkoutBtn.style.visibility = 'visible';
                checkoutBtn.style.opacity = '1';
                checkoutBtn.style.position = 'static';
                console.log('Forced checkout button to be visible');
            } else {
                console.log('ERROR: Checkout button not found in DOM!');
            }
            
            // Debug: Check cart total section
            const cartTotal = document.getElementById('cartTotal');
            console.log('Cart total section found:', !!cartTotal);
            if (cartTotal) {
                console.log('Cart total innerHTML:', cartTotal.innerHTML);
            }
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
        console.log('=== updateCartDisplay called ===');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartEmpty = document.getElementById('cartEmpty');

        console.log('Updating cart display:', {
            cartItems: !!cartItems,
            cartTotal: !!cartTotal,
            cartEmpty: !!cartEmpty,
            itemsCount: this.shoppingCart ? this.shoppingCart.items.length : 0
        });

        if (!this.shoppingCart || !this.shoppingCart.items.length) {
            if (cartItems) cartItems.innerHTML = '';
            if (cartTotal) {
                const totalAmount = cartTotal.querySelector('#totalAmount');
                if (totalAmount) totalAmount.textContent = '0.00';
                cartTotal.style.display = 'block'; // Ensure it's visible
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
            cartTotal.style.display = 'block'; // Ensure it's visible
        }
    }

    checkout() {
        if (!this.shoppingCart || !this.shoppingCart.items.length) {
            alert('Your cart is empty!');
            return;
        }

        // Close cart modal and open checkout modal
        this.close();
        this.openCheckoutModal();
    }

    openCheckoutModal() {
        const checkoutModal = document.getElementById('checkoutModal');
        const checkoutTotal = document.getElementById('checkoutTotal');
        const checkoutTotalDisplay = document.getElementById('checkoutTotalDisplay');
        const checkoutItems = document.getElementById('checkoutItems');
        
        if (checkoutModal && checkoutTotal && checkoutTotalDisplay && checkoutItems) {
            // Update totals in checkout modal
            const total = this.shoppingCart.getTotal().toFixed(2);
            checkoutTotal.textContent = total;
            checkoutTotalDisplay.textContent = total;
            
            // Populate order items
            checkoutItems.innerHTML = this.shoppingCart.items.map(item => `
                <div class="checkout-item">
                    <div class="checkout-item-info">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjEwcHgiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
                        <div>
                            <strong>${item.name}</strong>
                            <div>Quantity: ${item.quantity}</div>
                            <div>Rs ${item.price.toFixed(2)} each</div>
                        </div>
                    </div>
                    <div class="checkout-item-total">
                        Rs ${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            `).join('');
            
            // Show checkout modal
            checkoutModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Set up checkout form
            this.setupCheckoutForm();
            
            console.log('Checkout modal opened');
        } else {
            console.error('Checkout modal elements not found');
        }
    }

    closeCheckoutModal() {
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) {
            checkoutModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            console.log('Checkout modal closed');
        }
    }

    setupCheckoutForm() {
        // Only set up event listeners once
        if (this.checkoutFormSetup) return;
        this.checkoutFormSetup = true;

        const checkoutForm = document.getElementById('checkoutForm');
        const closeBtn = document.getElementById('closeCheckoutModal');
        
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleCheckoutSubmit(e));
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeCheckoutModal());
        }

        // Close modal on outside click
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) {
            checkoutModal.addEventListener('click', (e) => {
                if (e.target === checkoutModal) {
                    this.closeCheckoutModal();
                }
            });
        }

        // Image preview functionality
        const transferImage = document.getElementById('transferImage');
        const imagePreview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        
        if (transferImage && imagePreview && previewImg) {
            transferImage.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        previewImg.src = e.target.result;
                        imagePreview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    async handleCheckoutSubmit(e) {
        e.preventDefault();
        
        // Prevent multiple submissions
        const placeOrderBtn = document.querySelector('#checkoutForm button[type="submit"]');
        if (placeOrderBtn && placeOrderBtn.disabled) {
            console.log('Order already being processed, ignoring duplicate submission');
            return;
        }
        
        if (placeOrderBtn) {
            placeOrderBtn.disabled = true;
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            address: document.getElementById('shippingAddress').value,
            transferImage: document.getElementById('transferImage').files[0]
        };

        // Validate form
        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            alert('Please fill in all required fields.');
            return;
        }

        // Generate order ID
        const orderId = Date.now().toString();

        // Create order data
        const orderData = {
            customer: formData,
            items: this.shoppingCart.items,
            total: this.shoppingCart.getTotal(),
            timestamp: new Date().toISOString(),
            orderId: orderId
        };

        // Send order email
        this.sendOrderEmail(orderData);
        
        // Clear cart and close modals
        this.shoppingCart.clearCart();
        this.closeCheckoutModal();
        
        // Re-enable the button
        if (placeOrderBtn) placeOrderBtn.disabled = false;
    }

    convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async sendOrderEmail(orderData) {
        try {
            // Get the Place Order button from checkout modal
            const placeOrderBtn = document.querySelector('#checkoutForm button[type="submit"]');
            const originalText = placeOrderBtn ? placeOrderBtn.textContent : 'Processing...';
            if (placeOrderBtn) placeOrderBtn.textContent = 'Processing Order...';

            const orderSummary = orderData.items.map(item => 
                `${item.name} x${item.quantity} - Rs ${item.price.toFixed(2)}`
            ).join('\n');

            // Create email content with payment instructions
            const emailContent = `New Order Received! 🛍️

CUSTOMER DETAILS:
Name: ${orderData.customer.name}
Email: ${orderData.customer.email}
Phone: ${orderData.customer.phone}
Address: ${orderData.customer.address}

ORDER DETAILS:
${orderSummary}

TOTAL AMOUNT: Rs ${orderData.total.toFixed(2)}

ORDER TIME: ${new Date().toLocaleString()}

Order ID: ${orderData.orderId}

PAYMENT INSTRUCTIONS FOR CUSTOMER:
✅ Order confirmed! Please follow these steps to complete your payment:

1. BANK TRANSFER DETAILS:
   - Account Name: Crafted by Crochet
   - Account Number: [Your Bank Account Number]
   - Bank: [Your Bank Name]
   - Amount: Rs ${orderData.total.toFixed(2)}
   - Reference: Order-${orderData.orderId}

2. UPLOAD PAYMENT PROOF:
   📎 You can upload your payment screenshot directly in the checkout form below
   - Use the embedded form on the website
   - Enter Order ID: ${orderData.orderId}
   - Enter your email: ${orderData.customer.email}

3. ORDER DISPATCH:
   ⏰ Your order will be dispatched within 2-3 business days after payment confirmation.

📞 Need help? Contact us at: craftedbycrochet@gmail.com

---
Please contact the customer to confirm the order and arrange delivery.

Best regards,
DIY Crafts Website`;

            // Try to send email using EmailJS
            if (typeof emailjs !== 'undefined') {
                try {
                    // Initialize EmailJS (you'll need to replace with your actual public key)
                    emailjs.init('J-A4XDkOM-wayz2AS');
                    
                    const templateParams = {
                        to_email: 'craftedbycrochet@gmail.com',
                        reply_to: orderData.customer.email,
                        subject: `New Order - ${orderData.customer.name} - ${new Date().toLocaleDateString()}`,
                        message: emailContent,
                        order_details: orderSummary,
                        total_amount: `Rs ${orderData.total.toFixed(2)}`,
                        order_time: new Date().toLocaleString(),
                        customer_name: orderData.customer.name,
                        customer_email: orderData.customer.email,
                        customer_phone: orderData.customer.phone,
                        customer_address: orderData.customer.address,
                        order_id: orderData.orderId
                    };

                    // Debug: Log template parameters
                    console.log('EmailJS Template Parameters:', templateParams);
                    console.log('Service ID: service_59mtpje');
                    console.log('Template ID: template_g6rxkwq');
                    
                    // Try with user ID for better compatibility
                    await emailjs.send('service_59mtpje', 'template_g6rxkwq', templateParams, 'J-A4XDkOM-wayz2AS');
                    console.log('Order email sent successfully');
                    
                    // Show success message with customer name
                    alert(`Order placed successfully!\n\nThank you ${orderData.customer.name}!\n\nOrder Total: Rs ${orderData.total.toFixed(2)}\n\n✅ Email notification sent to craftedbycrochet@gmail.com\n\nYou will receive a confirmation email shortly.`);
                    return; // Exit early on success
                    
                } catch (emailError) {
                    console.error('EmailJS error details:', emailError);
                    console.log('EmailJS failed, using fallback method');
                }
            }

            // Fallback if EmailJS fails
            alert(`Order placed successfully!\n\nThank you ${orderData.customer.name}!\n\nOrder Total: Rs ${orderData.total.toFixed(2)}\n\nPlease contact craftedbycrochet@gmail.com to confirm your order.`);

            if (placeOrderBtn) placeOrderBtn.textContent = originalText;
            
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
