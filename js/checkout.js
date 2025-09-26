// Checkout Page Management
class CheckoutManager {
    constructor() {
        this.shoppingCart = null;
        this.emailjsInitialized = false;
        this.init();
    }

    init() {
        // Initialize EmailJS
        this.initEmailJS();
        
        // Wait for cart to be available
        if (window.shoppingCart) {
            this.shoppingCart = window.shoppingCart;
            this.loadOrderSummary();
            this.initEventListeners();
        } else {
            // Wait for cart to load
            setTimeout(() => this.init(), 100);
        }
    }

    initEmailJS() {
        if (typeof emailjs !== 'undefined' && !this.emailjsInitialized) {
            emailjs.init('J-A4XDkOM-wayz2AS'); // Your EmailJS public key
            this.emailjsInitialized = true;
            console.log('EmailJS initialized successfully');
        } else if (typeof emailjs === 'undefined') {
            console.log('EmailJS not loaded yet, retrying...');
            setTimeout(() => this.initEmailJS(), 500);
        }
    }

    loadOrderSummary() {
        const orderSummary = document.getElementById('orderSummary');
        const totalAmount = document.getElementById('totalAmount');
        const cartCount = document.getElementById('cartCount');

        if (!this.shoppingCart || this.shoppingCart.items.length === 0) {
            orderSummary.innerHTML = '<p class="empty-cart">Your cart is empty. <a href="index.html">Continue shopping</a></p>';
            totalAmount.textContent = '$0';
            cartCount.textContent = '0';
            return;
        }

        // Update cart count
        cartCount.textContent = this.shoppingCart.getTotalItems();

        // Generate order summary
        let summaryHTML = '';
        this.shoppingCart.items.forEach(item => {
            summaryHTML += `
                <div class="checkout-item">
                    <div class="checkout-item-info">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='images/products/default.jpg'">
                        <div>
                            <strong>${item.name}</strong>
                            <div>Qty: ${item.quantity} × Rs ${item.price}</div>
                        </div>
                    </div>
                    <div class="checkout-item-total">Rs ${(item.price * item.quantity)}</div>
                </div>
            `;
        });

        orderSummary.innerHTML = summaryHTML;
        totalAmount.textContent = `Rs ${this.shoppingCart.getTotal()}`;
    }

    initEventListeners() {
        // Cart button
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                if (window.cartModal) {
                    window.cartModal.open();
                }
            });
        }

        // Checkout form
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleCheckout(e));
        }
    }

    async handleCheckout(e) {
        e.preventDefault();
        
        if (!this.shoppingCart || this.shoppingCart.items.length === 0) {
            this.showToast('Your cart is empty!', 'error');
            return;
        }

        const placeOrderBtn = document.getElementById('placeOrderBtn');
        if (placeOrderBtn) {
            placeOrderBtn.disabled = true;
            placeOrderBtn.textContent = 'Processing...';
        }

        try {
            // Get form data
            const formData = new FormData(e.target);
            const orderData = {
                customerName: formData.get('customerName'),
                customerPhone: formData.get('customerPhone'),
                customerEmail: formData.get('customerEmail'),
                deliveryAddress: formData.get('deliveryAddress'),
                specialInstructions: formData.get('specialInstructions'),
                items: this.shoppingCart.items,
                total: this.shoppingCart.getTotal(),
                orderNumber: this.generateOrderNumber(),
                orderDate: new Date().toISOString()
            };

            // Send order email
            await this.sendOrderEmail(orderData);
            
            // Track order for popularity updates
            if (window.productManager) {
                window.productManager.trackOrder(orderData.items);
            }
            
            // Clear cart and redirect
            this.shoppingCart.clearCart();
            this.showToast('Order placed successfully! You will receive a confirmation email shortly.', 'success');
            
            // Redirect to home page after a delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);

        } catch (error) {
            console.error('Error placing order:', error);
            this.showToast('There was an error placing your order. Please try again.', 'error');
        } finally {
            // Re-enable the button
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'Place Order';
            }
        }
    }

    generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `CBC-${timestamp}-${random}`;
    }

    async sendOrderEmail(orderData) {
        if (!this.emailjsInitialized) {
            throw new Error('EmailJS not initialized');
        }

        console.log('Sending order email:', orderData);
        
        // Format the email content
        const emailContent = this.formatEmailContent(orderData);
        
        // EmailJS template parameters
        const templateParams = {
            customer_name: orderData.customerName,
            customer_email: orderData.customerEmail,
            customer_phone: orderData.customerPhone,
            customer_address: orderData.deliveryAddress,
            special_instructions: orderData.specialInstructions || 'None',
            order_details: this.formatOrderItems(orderData.items),
            total_amount: `Rs ${orderData.total}`,
            order_time: new Date().toLocaleString(),
            order_id: orderData.orderNumber,
            message: emailContent
        };

        try {
            // Send email using EmailJS
            const response = await emailjs.send(
                'service_59mtpje', // Your EmailJS service ID
                'template_g6rxkwq', // Your EmailJS template ID
                templateParams
            );
            
            console.log('Email sent successfully:', response);
            return response;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    formatEmailContent(orderData) {
        const orderItems = this.formatOrderItems(orderData.items);
        const totalAmount = `Rs ${orderData.total}`;
        const orderTime = new Date().toLocaleString();
        
        return `New Order Received! 🛍️

CUSTOMER DETAILS:
Name: ${orderData.customerName}
Email: ${orderData.customerEmail}
Phone: ${orderData.customerPhone}
Address: ${orderData.deliveryAddress}
Special Instructions: ${orderData.specialInstructions || 'None'}

ORDER DETAILS:
${orderItems}

TOTAL AMOUNT: ${totalAmount}

ORDER TIME: ${orderTime}

Order ID: ${orderData.orderNumber}

PAYMENT INSTRUCTIONS FOR CUSTOMER:
✅ Order confirmed! Please follow these steps to complete your payment:

1. BANK TRANSFER DETAILS:
   - Account Name: Crafted by Crochet
   - Account Number: [Your Bank Account Number]
   - Bank: [Your Bank Name]
   - Amount: ${totalAmount}
   - Reference: Order-${orderData.orderNumber}

2. PAYMENT CONFIRMATION:
   📧 After making the transfer, reply to this email with:
   - Your payment screenshot
   - Bank transfer reference number
   - Any additional notes

3. ORDER DISPATCH:
   ⏰ Your order will be dispatched within 2-3 business days after payment confirmation.

📞 Need help? Contact us at: craftedbycrochet@gmail.com`;
    }

    formatOrderItems(items) {
        return items.map(item => 
            `${item.name} (Qty: ${item.quantity}) - Rs ${(item.price * item.quantity)}`
        ).join('\n');
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `toast show ${type}`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 5000);
        }
    }
}

// Initialize checkout manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.checkoutManager = new CheckoutManager();
});
