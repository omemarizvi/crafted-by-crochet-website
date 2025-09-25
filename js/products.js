// Products Data and Management
class ProductManager {
    constructor() {
        this.categories = ['all', 'flowers', 'bouquets', 'keychains', 'accessories', 'stuffed-toys', 'jewellery'];
        
        // Initialize with default products only
        this.products = this.getDefaultProducts();
        
        // Update popularity based on existing orders
        this.updatePopularityFromOrders();
        
        console.log('Products initialized with defaults:', this.products.length);
        console.log('Default products:', this.products);
    }

    // Get default products
    getDefaultProducts() {
        return [
            {
                id: 1,
                name: 'Rose',
                category: 'flowers',
                price: 1000,
                stock: 0, // Made to order
                image: 'images/products/rose.jpg',
                popularity: 95 // High popularity
            },
            {
                id: 2,
                name: 'Sunflower Keychain',
                category: 'keychains',
                price: 500,
                stock: 0,
                image: 'images/products/sunflower-keychain.jpg',
                popularity: 88
            },
            {
                id: 3,
                name: 'Sunflower Pot',
                category: 'flowers',
                price: 1500,
                stock: 0,
                image: 'images/products/sunflower-pot.jpg',
                popularity: 75
            },
            {
                id: 4,
                name: 'Sunflower',
                category: 'flowers',
                price: 1000,
                stock: 0,
                image: 'images/products/sunflower.jpg',
                popularity: 92
            },
            {
                id: 5,
                name: 'Rose Bouquet',
                category: 'bouquets',
                price: 4000,
                stock: 0,
                image: 'images/products/roses-bouquet.jpg',
                popularity: 98
            },
            {
                id: 6,
                name: 'Tulip and Lavender Bouquet',
                category: 'bouquets',
                price: 5000,
                stock: 0,
                image: 'images/products/tulips-lavendar-bouquet.jpg',
                popularity: 85
            },
            {
                id: 7,
                name: 'Daisies Bouquet',
                category: 'bouquets',
                price: 2000,
                stock: 0,
                image: 'images/products/daisies-bouquet.jpg',
                popularity: 80
            }
        ];
    }

    // Get all products
    getAllProducts() {
        return this.products;
    }

    // Get products by category
    getProductsByCategory(category) {
        if (category === 'all') {
            return this.products;
        }
        return this.products.filter(product => product.category === category);
    }

    // Search products by name
    searchProducts(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(lowercaseQuery)
        );
    }

    // Get product by ID
    getProductById(id) {
        return this.products.find(product => product.id === parseInt(id));
    }

    // Add new product
    addProduct(productData) {
        const newProduct = {
            id: this.getNextId(),
            name: productData.name,
            category: productData.category,
            price: parseFloat(productData.price),
            stock: parseInt(productData.stock),
            image: productData.image,
            popularity: parseInt(productData.popularity) || 50 // Default popularity if not provided
        };

        this.products.push(newProduct);
        this.saveProducts();
        console.log('Adding new product:', newProduct);
        return newProduct;
    }

    // Get next available ID
    getNextId() {
        const maxId = this.products.reduce((max, product) => Math.max(max, product.id), 0);
        return maxId + 1;
    }

    // Update existing product
    updateProduct(id, productData) {
        const index = this.products.findIndex(product => product.id === parseInt(id));
        if (index !== -1) {
            this.products[index] = {
                ...this.products[index],
                ...productData,
                id: parseInt(id) // Ensure ID doesn't change
            };
            this.saveProducts();
            console.log('Product updated:', this.products[index]);
            return this.products[index];
        }
        return null;
    }

    // Delete product
    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === parseInt(id));
        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1)[0];
            this.saveProducts();
            console.log('Product deleted:', deletedProduct);
            return deletedProduct;
        }
        return null;
    }

    // Save products to localStorage
    saveProducts() {
        try {
            localStorage.setItem('diyCraftsProducts', JSON.stringify(this.products));
            console.log('Products saved to localStorage');
        } catch (error) {
            console.error('Error saving products to localStorage:', error);
        }
    }

    // Load products from localStorage
    loadProductsFromLocalStorage() {
        try {
            const savedProducts = localStorage.getItem('diyCraftsProducts');
            if (savedProducts) {
                this.products = JSON.parse(savedProducts);
                console.log('Products loaded from localStorage:', this.products.length);
                return this.products;
            }
        } catch (error) {
            console.error('Error loading products from localStorage:', error);
        }
        return [];
    }

    // Clear all products (reset to defaults)
    clearAllProducts() {
        this.products = this.getDefaultProducts();
        this.saveProducts();
        console.log('Products reset to defaults');
    }

    // Sort products by different criteria
    sortProducts(products, sortBy) {
        const sortedProducts = [...products]; // Create a copy to avoid mutating original array
        
        switch (sortBy) {
            case 'price-low-high':
                return sortedProducts.sort((a, b) => a.price - b.price);
            case 'price-high-low':
                return sortedProducts.sort((a, b) => b.price - a.price);
            case 'popularity':
                return sortedProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
            case 'alphabetical':
                return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return sortedProducts; // Return unsorted if no valid sort option
        }
    }

    // Track order and update product popularity
    trackOrder(orderItems) {
        console.log('Tracking order for popularity update:', orderItems);
        
        // Load current order counts
        const orderCounts = this.getOrderCounts();
        
        // Update order counts for each item in the order
        orderItems.forEach(item => {
            const productId = item.id;
            orderCounts[productId] = (orderCounts[productId] || 0) + item.quantity;
        });
        
        // Save updated order counts
        this.saveOrderCounts(orderCounts);
        
        // Recalculate popularity for all products
        this.updatePopularityFromOrders();
        
        console.log('Order tracking completed, popularity updated');
    }

    // Get order counts from localStorage
    getOrderCounts() {
        try {
            const savedCounts = localStorage.getItem('diyCraftsOrderCounts');
            return savedCounts ? JSON.parse(savedCounts) : {};
        } catch (error) {
            console.error('Error loading order counts:', error);
            return {};
        }
    }

    // Save order counts to localStorage
    saveOrderCounts(orderCounts) {
        try {
            localStorage.setItem('diyCraftsOrderCounts', JSON.stringify(orderCounts));
            console.log('Order counts saved to localStorage');
        } catch (error) {
            console.error('Error saving order counts:', error);
        }
    }

    // Update product popularity based on order counts
    updatePopularityFromOrders() {
        const orderCounts = this.getOrderCounts();
        const totalOrders = Object.values(orderCounts).reduce((sum, count) => sum + count, 0);
        
        if (totalOrders === 0) {
            console.log('No orders yet, keeping default popularity');
            return;
        }

        // Update popularity for each product
        this.products.forEach(product => {
            const orderCount = orderCounts[product.id] || 0;
            
            if (orderCount > 0) {
                // Calculate popularity based on order frequency
                // Base popularity (50) + order-based boost (up to 50 points)
                const orderBoost = Math.min(50, (orderCount / totalOrders) * 100);
                product.popularity = Math.round(50 + orderBoost);
            } else {
                // Keep default popularity for products with no orders
                product.popularity = product.popularity || 50;
            }
        });

        // Save updated products
        this.saveProducts();
        console.log('Product popularity updated based on orders');
    }

    // Get popularity statistics
    getPopularityStats() {
        const orderCounts = this.getOrderCounts();
        const totalOrders = Object.values(orderCounts).reduce((sum, count) => sum + count, 0);
        
        return {
            totalOrders,
            orderCounts,
            products: this.products.map(product => ({
                id: product.id,
                name: product.name,
                popularity: product.popularity,
                orderCount: orderCounts[product.id] || 0
            }))
        };
    }

    // Get product statistics
    getProductStats() {
        const totalProducts = this.products.length;
        const totalStock = this.products.reduce((sum, product) => sum + product.stock, 0);
        const totalValue = this.products.reduce((sum, product) => sum + (product.price * product.stock), 0);
        
        const categoryStats = {};
        this.products.forEach(product => {
            categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
        });

        return {
            totalProducts,
            totalStock,
            totalValue,
            categoryStats
        };
    }
}

// Create global instance
window.productManager = new ProductManager();