// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartDisplay();
    }

    // Add item to cart
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: quantity
            });
        }
        
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
            this.updateCartDisplay(); // Re-render for removal
            // Also update the cart modal if it's open
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
                // Also update the cart modal if it's open
                if (window.cartModal && window.cartModal.modal && window.cartModal.modal.style.display === 'block') {
                    window.cartModal.updateCartDisplay();
                }
                this.showToast(`${item.name} quantity updated to ${quantity}`);
            }
        }
    }

    // Get cart items
    getItems() {
        return this.items;
    }

    // Get quantity of specific item
    getQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        return item ? item.quantity : 0;
    }

    // Get total items count
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Get total price
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Clear cart
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
        this.showToast('Cart cleared!');
    }

    // Check if cart is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('diyCraftsCart', JSON.stringify(this.items));
    }

    // Load cart from localStorage
    loadCart() {
        const stored = localStorage.getItem('diyCraftsCart');
        return stored ? JSON.parse(stored) : [];
    }

    // Update cart display
    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }
    }

    // Show toast notification
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

// Create global cart instance
window.shoppingCart = new ShoppingCart();

// Cart Modal Management
class CartModal {
    constructor() {
        this.modal = null;
        this.cartItems = null;
        this.cartEmpty = null;
        this.cartTotal = null;
        this.totalAmount = null;
        this.checkoutBtn = null;
    }

    init() {
        this.modal = document.getElementById('cartModal');
        this.cartItems = document.getElementById('cartItems');
        this.cartEmpty = document.getElementById('cartEmpty');
        this.cartTotal = document.getElementById('cartTotal');
        this.totalAmount = document.getElementById('totalAmount');
        this.checkoutBtn = document.getElementById('checkoutBtn');
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Close cart modal
        const closeBtn = document.getElementById('closeCartModal');
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

        // Checkout button
        if (this.checkoutBtn) {
            console.log('Checkout button found, adding event listener');
            this.checkoutBtn.addEventListener('click', () => {
                console.log('Checkout button clicked');
                this.openCheckout();
            });
        } else {
            console.error('Checkout button not found!');
        }
    }

    open() {
        if (this.modal) {
            this.updateCartDisplay();
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    updateCartDisplay() {
        const items = window.shoppingCart.getItems();
        
        if (items.length === 0) {
            this.cartEmpty.style.display = 'block';
            this.cartItems.style.display = 'none';
            this.cartTotal.style.display = 'none';
        } else {
            this.cartEmpty.style.display = 'none';
            this.cartItems.style.display = 'block';
            this.cartTotal.style.display = 'block';
            
            // Always re-render and attach event listeners
            this.renderCartItems(items);
            this.updateTotal();
        }
    }

    renderCartItems(items) {
        console.log('Rendering cart items:', items);
        if (this.cartItems) {
            this.cartItems.innerHTML = items.map(item => `
                <div class="cart-item" data-item-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn decrease-btn" data-item-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-item-id="${item.id}">+</button>
                        <button class="remove-btn" data-item-id="${item.id}">Remove</button>
                    </div>
                </div>
            `).join('');
            
            console.log('Cart items HTML rendered, attaching listeners...');
            // Attach event listeners to the new buttons
            this.attachCartItemListeners();
        } else {
            console.error('Cart items container not found!');
        }
    }

    attachCartItemListeners() {
        console.log('Attaching cart item listeners...');
        
        // Decrease quantity buttons
        const decreaseBtns = this.cartItems.querySelectorAll('.decrease-btn');
        console.log('Found decrease buttons:', decreaseBtns.length);
        decreaseBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Decrease button clicked');
                const itemId = parseInt(e.target.dataset.itemId);
                const currentQuantity = window.shoppingCart.getQuantity(itemId);
                window.shoppingCart.updateQuantity(itemId, currentQuantity - 1);
            });
        });

        // Increase quantity buttons
        const increaseBtns = this.cartItems.querySelectorAll('.increase-btn');
        console.log('Found increase buttons:', increaseBtns.length);
        increaseBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Increase button clicked');
                const itemId = parseInt(e.target.dataset.itemId);
                const currentQuantity = window.shoppingCart.getQuantity(itemId);
                window.shoppingCart.updateQuantity(itemId, currentQuantity + 1);
            });
        });

        // Remove buttons
        const removeBtns = this.cartItems.querySelectorAll('.remove-btn');
        console.log('Found remove buttons:', removeBtns.length);
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Remove button clicked');
                const itemId = parseInt(e.target.dataset.itemId);
                window.shoppingCart.removeItem(itemId);
            });
        });
        
        console.log('Cart item listeners attached successfully');
    }

    updateTotal() {
        if (this.totalAmount) {
            this.totalAmount.textContent = window.shoppingCart.getTotalPrice().toFixed(2);
        }
    }

    updateCartItemDisplay(productId) {
        // Find the cart item element and update its quantity display
        const cartItem = this.cartItems.querySelector(`[data-item-id="${productId}"]`);
        if (cartItem) {
            const quantitySpan = cartItem.querySelector('.quantity');
            const item = window.shoppingCart.items.find(item => item.id === productId);
            if (quantitySpan && item) {
                quantitySpan.textContent = item.quantity;
            }
        }
    }

    updateCartCount() {
        // Update the cart count in the header
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = window.shoppingCart.getTotalItems();
        }
    }

    openCheckout() {
        console.log('openCheckout called');
        this.close();
        console.log('Cart modal closed, opening checkout modal');
        window.checkoutModal.open();
    }
}

// Checkout Modal Management
class CheckoutModal {
    constructor() {
        this.modal = null;
        this.form = null;
        this.checkoutTotal = null;
    }

    init() {
        this.modal = document.getElementById('checkoutModal');
        this.form = document.getElementById('checkoutForm');
        this.checkoutTotal = document.getElementById('checkoutTotal');
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Close checkout modal
        const closeBtn = document.getElementById('closeCheckoutModal');
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

        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Image preview
        const imageInput = document.getElementById('transferImage');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImagePreview(e));
        }
    }

    open() {
        if (this.modal) {
            this.updateTotal();
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    updateTotal() {
        if (this.checkoutTotal) {
            this.checkoutTotal.textContent = window.shoppingCart.getTotalPrice().toFixed(2);
        }
    }

    handleImagePreview(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('imagePreview');
                const previewImg = document.getElementById('previewImg');
                if (preview && previewImg) {
                    previewImg.src = e.target.result;
                    preview.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            address: document.getElementById('shippingAddress').value,
            items: window.shoppingCart.getItems(),
            total: window.shoppingCart.getTotalPrice(),
            transferImage: document.getElementById('transferImage').files[0]
        };

        // Here you would typically send the order to your email service
        this.submitOrder(formData);
    }

    submitOrder(orderData) {
        // Generate unique order ID
        const orderId = Date.now();
        orderData.id = orderId;
        
        // Save order to localStorage for analytics
        this.saveOrderToStorage(orderData);
        
        // Send order to Google Sheets
        this.sendOrderToGoogleSheets(orderData);
        
        // Show success message
        window.shoppingCart.showToast('Order placed successfully! We will contact you soon at ' + orderData.email);
        
        // Clear the cart
        window.shoppingCart.clearCart();
        
        // Close the checkout modal
        this.close();
        
        // Notify admin that new order was placed
        window.dispatchEvent(new CustomEvent('newOrderPlaced'));
    }

    sendOrderToEmail(orderData) {
        // Create email content
        const orderId = orderData.id || Date.now();
        const subject = `New Order from Crafted by Crochet Website - Order #${orderId}`;
        const body = this.createEmailBody(orderData);
        
        // Try multiple methods to send email
        this.tryEmailMethods(orderData, subject, body);
        
        console.log('Order details prepared for email:', orderData);
    }

    tryEmailMethods(orderData, subject, body) {
        // Method 1: Try automatic email sending via webhook
        this.sendEmailViaWebhook(orderData, subject, body);
    }

    async sendEmailViaWebhook(orderData, subject, body) {
        try {
            // Convert image to base64 if available
            let imageBase64 = null;
            if (orderData.transferImage) {
                imageBase64 = await this.convertFileToBase64(orderData.transferImage);
            }

            // Create form data for email sending
            const formData = new FormData();
            formData.append('to', 'craftedbycrochet@gmail.com');
            formData.append('subject', subject);
            formData.append('message', body);
            formData.append('customer_name', orderData.name);
            formData.append('customer_email', orderData.email);
            formData.append('customer_phone', orderData.phone);
            formData.append('shipping_address', orderData.address);
            formData.append('order_total', orderData.total);
            formData.append('order_id', orderData.id || Date.now());
            
            if (imageBase64) {
                formData.append('transfer_image', imageBase64);
            }

            // Use a simple webhook service (you can replace this with your preferred service)
            const response = await fetch('https://formspree.io/f/xpwgkqyv', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log('Email sent successfully via webhook');
                window.shoppingCart.showToast('Order sent successfully! We will contact you soon.');
                return;
            }
        } catch (error) {
            console.log('Webhook email failed:', error);
        }

        // Fallback: Show success message and copy details
        window.shoppingCart.showToast('Order received! We will contact you soon.');
        this.copyOrderToClipboard(orderData, subject, body);
    }

    convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    copyOrderToClipboard(orderData, subject, body) {
        const orderText = `Subject: ${subject}\n\n${body}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(orderText).then(() => {
                alert('Order details copied to clipboard! Please paste them into an email to craftedbycrochet@gmail.com');
            }).catch(err => {
                console.error('Failed to copy to clipboard:', err);
                this.showOrderDetails(orderData, subject, body);
            });
        } else {
            this.showOrderDetails(orderData, subject, body);
        }
    }

    showOrderDetails(orderData, subject, body) {
        const orderDetails = `
Order Details (Copy and send to craftedbycrochet@gmail.com):

${subject}

${body}

---
Please send this information to craftedbycrochet@gmail.com
        `;
        
        alert(orderDetails);
    }

    createEmailBody(orderData) {
        const itemsList = orderData.items.map(item => 
            `- ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
        
        return `New Order Details:

Customer Information:
Name: ${orderData.name}
Email: ${orderData.email}
Phone: ${orderData.phone}
Shipping Address: ${orderData.address}

Order Items:
${itemsList}

Total Amount: $${orderData.total.toFixed(2)}

Payment Method: Bank Transfer or PayPal
Transfer Screenshot: ${orderData.transferImage ? 'Attached' : 'Not provided'}

Please contact the customer to arrange payment and shipping.

---
This order was placed through the Crafted by Crochet website.`;
    }

    saveOrderToStorage(orderData) {
        // Get existing orders
        const existingOrders = localStorage.getItem('diyCraftsOrders');
        const orders = existingOrders ? JSON.parse(existingOrders) : [];
        
        // Create new order object
        const newOrder = {
            id: orderData.id || Date.now(),
            customerName: orderData.name,
            customerEmail: orderData.email,
            customerPhone: orderData.phone,
            shippingAddress: orderData.address,
            items: orderData.items,
            total: orderData.total,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            status: 'pending',
            transferImage: 'Not provided' // Will be updated if image is processed
        };
        
        // Add new order
        orders.push(newOrder);
        
        // Save back to localStorage
        localStorage.setItem('diyCraftsOrders', JSON.stringify(orders));
        
        // Process image separately if provided
        if (orderData.transferImage) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                // Update the order with image data
                const orderIndex = orders.findIndex(order => order.id === newOrder.id);
                if (orderIndex !== -1) {
                    orders[orderIndex].transferImage = imageData;
                    localStorage.setItem('diyCraftsOrders', JSON.stringify(orders));
                }
            };
            reader.readAsDataURL(orderData.transferImage);
        }
    }

    async sendOrderToGoogleSheets(orderData) {
        console.log('=== SENDING ORDER TO GOOGLE SHEETS ===');
        console.log('Order data:', orderData);
        
        try {
            // Prepare data for Google Sheets
            const itemsList = orderData.items.map(item => 
                `${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
            ).join('; ');

            const sheetData = {
                timestamp: new Date().toISOString(),
                orderId: orderData.id,
                customerName: orderData.name,
                customerEmail: orderData.email,
                customerPhone: orderData.phone,
                shippingAddress: orderData.address,
                items: itemsList,
                totalAmount: orderData.total.toFixed(2),
                paymentMethod: 'Bank Transfer or PayPal',
                transferScreenshot: orderData.transferImage ? 'Yes' : 'No',
                status: 'Pending'
            };

            console.log('Prepared sheet data:', sheetData);

            // Try multiple methods to send data
            const success = await this.tryMultipleMethods(sheetData);
            
            if (success) {
                console.log('✅ Order sent successfully to Google Sheets');
                window.shoppingCart.showToast('Order sent to Google Sheets successfully!');
            } else {
                console.log('❌ All methods failed');
                throw new Error('All methods failed');
            }
            
        } catch (error) {
            console.error('❌ Failed to send to Google Sheets:', error);
            window.shoppingCart.showToast('Order saved locally but failed to send to Google Sheets. Please check your setup.');
        }
    }

    async tryMultipleMethods(sheetData) {
        console.log('=== TRYING MULTIPLE METHODS ===');
        
        // Method 1: Try Google Apps Script (primary method)
        try {
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyYhbbPdhL7vxEnNsUXd2-YeJYUwQ7pB06k1mzbmWTnSWnLrZDNLmPH_Uy86CvhEpeAtw/exec';
            console.log('Google Script URL:', GOOGLE_SCRIPT_URL);
            
            if (GOOGLE_SCRIPT_URL.includes('YOUR_ACTUAL_SCRIPT_ID_HERE')) {
                console.log('❌ Google Script not configured - URL still contains placeholder');
                throw new Error('Google Script not configured');
            }
            
            console.log('✅ Google Script URL looks valid, attempting to send data...');
            console.log('Sheet data being sent:', sheetData);
            
            // Use GET method with URL parameters to avoid CORS issues
            const params = new URLSearchParams();
            Object.keys(sheetData).forEach(key => {
                params.append(key, sheetData[key]);
            });
            
            const fullUrl = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
            console.log('Full URL being called:', fullUrl);
            
            const response = await fetch(fullUrl, {
                method: 'GET',
                mode: 'no-cors'
            });
            
            console.log('✅ Google Sheets GET request completed');
            console.log('Response status:', response.status);
            console.log('Response type:', response.type);
            return true;
            
        } catch (error) {
            console.log('❌ Google Script GET method failed:', error);
        }

        // Method 2: Try POST with different approach
        try {
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyYhbbPdhL7vxEnNsUXd2-YeJYUwQ7pB06k1mzbmWTnSWnLrZDNLmPH_Uy86CvhEpeAtw/exec';
            if (!GOOGLE_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
                console.log('Trying POST method...');
                
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(sheetData)
                });
                
                console.log('✅ Google Sheets POST request completed');
                return true;
            }
        } catch (error) {
            console.log('❌ Google Script POST method failed:', error);
        }

        console.log('❌ All methods failed');
        return false;
    }

}

// Create global instances
window.cartModal = new CartModal();
window.checkoutModal = new CheckoutModal();

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    // Cart is already initialized in the ShoppingCart constructor
    window.shoppingCart.updateCartDisplay();
});
