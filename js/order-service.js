// Order Management Service
class OrderService {
    constructor() {
        this.orders = [];
        this.initializeFirebaseStorage();
    }

    // Initialize Firebase Storage for image uploads
    initializeFirebaseStorage() {
        if (window.firebase && window.firebase.storage) {
            this.storage = window.firebase.storage();
            console.log('Firebase Storage initialized for orders');
        } else {
            console.log('Firebase Storage not available, using localStorage fallback');
        }
    }

    // Create a new order
    async createOrder(orderData) {
        try {
            console.log('Creating new order:', orderData);
            
            // Generate unique order ID
            const orderId = this.generateOrderId();
            const orderDate = new Date().toLocaleDateString();
            
            // Handle payment screenshot upload
            let paymentScreenshotUrl = 'Not provided';
            if (orderData.paymentScreenshot) {
                try {
                    paymentScreenshotUrl = await this.uploadPaymentScreenshot(orderData.paymentScreenshot, orderId);
                } catch (error) {
                    console.error('Error uploading payment screenshot:', error);
                    // Fallback to base64 for localStorage
                    paymentScreenshotUrl = orderData.paymentScreenshot;
                }
            }
            
            // Create order object
            const order = {
                id: orderId,
                date: orderDate,
                customerName: orderData.customerName,
                customerEmail: orderData.customerEmail,
                customerPhone: orderData.customerPhone,
                shippingAddress: orderData.shippingAddress,
                items: orderData.items,
                total: orderData.total,
                paymentMethod: orderData.paymentMethod || 'Bank Transfer',
                paymentScreenshot: paymentScreenshotUrl,
                status: 'pending',
                timestamp: Date.now()
            };
            
            // Save to Firebase if available
            if (window.firebaseService && window.firebaseService.initialized) {
                await this.saveOrderToFirebase(order);
            } else {
                // Fallback to localStorage
                this.saveOrderToLocalStorage(order);
            }
            
            // Send email notification
            await this.sendOrderNotification(order);
            
            // Add to local array
            this.orders.push(order);
            
            console.log('Order created successfully:', order);
            return order;
            
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    // Upload payment screenshot to Firebase Storage
    async uploadPaymentScreenshot(imageData, orderId) {
        if (!this.storage) {
            throw new Error('Firebase Storage not available');
        }
        
        try {
            // Create a blob from base64 data
            const base64Data = imageData.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            
            // Upload to Firebase Storage
            const fileName = `payment-screenshots/order-${orderId}-${Date.now()}.jpg`;
            const storageRef = this.storage.ref(fileName);
            
            const uploadTask = storageRef.put(blob);
            
            return new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Progress tracking
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                    },
                    (error) => {
                        console.error('Upload error:', error);
                        reject(error);
                    },
                    () => {
                        // Upload completed successfully
                        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            console.log('Payment screenshot uploaded:', downloadURL);
                            resolve(downloadURL);
                        });
                    }
                );
            });
            
        } catch (error) {
            console.error('Error uploading payment screenshot:', error);
            throw error;
        }
    }

    // Save order to Firebase
    async saveOrderToFirebase(order) {
        try {
            if (window.firebaseService && window.firebaseService.initialized) {
                // Use Firebase service to save order
                const db = window.firebase.db;
                await db.collection('orders').add(order);
                console.log('Order saved to Firebase');
            }
        } catch (error) {
            console.error('Error saving order to Firebase:', error);
            throw error;
        }
    }

    // Save order to localStorage as fallback
    saveOrderToLocalStorage(order) {
        try {
            const existingOrders = JSON.parse(localStorage.getItem('diyCraftsOrders') || '[]');
            existingOrders.push(order);
            localStorage.setItem('diyCraftsOrders', JSON.stringify(existingOrders));
            console.log('Order saved to localStorage');
        } catch (error) {
            console.error('Error saving order to localStorage:', error);
            throw error;
        }
    }

    // Send email notification using EmailJS (free service)
    async sendOrderNotification(order) {
        try {
            // Check if EmailJS is loaded
            if (typeof emailjs !== 'undefined') {
                // EmailJS configuration (you'll need to set this up)
                const templateParams = {
                    order_id: order.id,
                    customer_name: order.customerName,
                    customer_email: order.customerEmail,
                    customer_phone: order.customerPhone,
                    shipping_address: order.shippingAddress,
                    total_amount: order.total,
                    payment_method: order.paymentMethod,
                    order_items: order.items.map(item => `${item.name} x${item.quantity} - Rs ${item.price}`).join('\n'),
                    payment_screenshot: order.paymentScreenshot,
                    order_date: order.date
                };

                // Send email to admin
                await emailjs.send(
                    'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                    'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                    templateParams,
                    'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
                );
                
                console.log('Order notification email sent successfully');
            } else {
                console.log('EmailJS not available, skipping email notification');
            }
        } catch (error) {
            console.error('Error sending email notification:', error);
            // Don't throw error for email failures
        }
    }

    // Generate unique order ID
    generateOrderId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${random}`;
    }

    // Get all orders
    async getOrders() {
        try {
            // Try Firebase first
            if (window.firebaseService && window.firebaseService.initialized) {
                const db = window.firebase.db;
                const snapshot = await db.collection('orders').orderBy('timestamp', 'desc').get();
                this.orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                return this.orders;
            }
            
            // Fallback to localStorage
            const stored = localStorage.getItem('diyCraftsOrders');
            this.orders = stored ? JSON.parse(stored) : [];
            return this.orders;
            
        } catch (error) {
            console.error('Error getting orders:', error);
            // Fallback to localStorage
            const stored = localStorage.getItem('diyCraftsOrders');
            this.orders = stored ? JSON.parse(stored) : [];
            return this.orders;
        }
    }

    // Update order status
    async updateOrderStatus(orderId, status) {
        try {
            // Update in Firebase
            if (window.firebaseService && window.firebaseService.initialized) {
                const db = window.firebase.db;
                const orderRef = db.collection('orders').doc(orderId);
                await orderRef.update({ status: status });
            }
            
            // Update in localStorage
            const orders = JSON.parse(localStorage.getItem('diyCraftsOrders') || '[]');
            const orderIndex = orders.findIndex(order => order.id === orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = status;
                localStorage.setItem('diyCraftsOrders', JSON.stringify(orders));
            }
            
            // Update local array
            const localOrder = this.orders.find(order => order.id === orderId);
            if (localOrder) {
                localOrder.status = status;
            }
            
            console.log(`Order ${orderId} status updated to ${status}`);
            
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }
}

// Create global instance
window.orderService = new OrderService();
