// Products Data and Management
class ProductManager {
    constructor() {
        this.products = [];
        this.categories = ['all', 'flowers', 'keychains', 'accessories', 'stuffed-toys', 'jewellery'];
        this.useFirebase = true; // Set to true when Firebase is configured
        
        // Initialize with default products immediately
        this.products = this.getDefaultProducts();
        console.log('Products initialized with defaults:', this.products.length);
        
        // Then try to load from database
        this.loadProducts();
    }

    // Load products from Firebase, IndexedDB, or fallback to localStorage
    async loadProducts() {
        if (this.useFirebase && window.firebaseService && window.firebaseService.initialized) {
            try {
                console.log('Loading products from Firebase...');
                this.products = await window.firebaseService.getProducts();
                console.log('Products loaded from Firebase:', this.products.length);
                // Also save to localStorage as backup
                this.saveProducts();
                return;
            } catch (error) {
                console.error('Error loading products from Firebase:', error);
                console.log('Falling back to alternative database...');
            }
        }
        
        // Try IndexedDB if available
        if (window.simpleDBService && window.simpleDBService.initialized) {
            try {
                console.log('Loading products from IndexedDB...');
                this.products = await window.simpleDBService.getProducts();
                console.log('Products loaded from IndexedDB:', this.products.length);
                return;
            } catch (error) {
                console.error('Error loading products from IndexedDB:', error);
                console.log('Falling back to localStorage...');
            }
        }
        
        // Final fallback to localStorage
        console.log('Loading products from localStorage...');
        const storedProducts = this.loadProductsFromLocalStorage();
        
        // If no products found anywhere, keep default products
        if (storedProducts.length === 0) {
            console.log('No products found in storage, keeping default products');
            // Save default products to localStorage
            this.saveProducts();
        } else {
            console.log('Found products in localStorage, replacing defaults');
            this.products = storedProducts;
        }
    }

    // Load products from localStorage as fallback
    loadProductsFromLocalStorage() {
        const stored = localStorage.getItem('diyCraftsProducts');
        if (stored) {
            return JSON.parse(stored);
        }
        return [];
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
                image: 'images/products/rose.jpg'
            },
            {
                id: 2,
                name: 'Sunflower Keychain',
                category: 'keychains',
                price: 500,
                stock: 0,
                image: 'images/products/sunflower-keychain.jpg'
            },
            {
                id: 3,
                name: 'Sunflower Pot',
                category: 'flowers',
                price: 1500,
                stock: 0,
                image: 'images/products/sunflower-pot.jpg'
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
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.description.toLowerCase().includes(lowercaseQuery)
        );
    }

    // Get product by ID
    getProductById(id) {
        return this.products.find(product => product.id === parseInt(id));
    }

    // Add new product
    async addProduct(productData) {
        // Try Firebase first
        if (this.useFirebase && window.firebaseService && window.firebaseService.initialized) {
            try {
                console.log('Adding new product to Firebase:', productData);
                const newProduct = await window.firebaseService.addProduct(productData);
                this.products.push(newProduct);
                this.saveProducts(); // Save to localStorage as backup
                console.log('Product added successfully to Firebase:', newProduct);
                return newProduct;
            } catch (error) {
                console.error('Error adding product to Firebase:', error);
                console.log('Falling back to alternative database...');
            }
        }
        
        // Try IndexedDB if available
        if (window.simpleDBService && window.simpleDBService.initialized) {
            try {
                console.log('Adding new product to IndexedDB:', productData);
                const newProduct = await window.simpleDBService.addProduct(productData);
                this.products.push(newProduct);
                console.log('Product added successfully to IndexedDB:', newProduct);
                return newProduct;
            } catch (error) {
                console.error('Error adding product to IndexedDB:', error);
                console.log('Falling back to localStorage...');
            }
        }
        
        // Final fallback to localStorage
        console.log('Adding to localStorage...');
        return this.addProductToLocalStorage(productData);
    }

    // Add product to localStorage as fallback
    addProductToLocalStorage(productData) {
        const newProduct = {
            id: this.getNextId(),
            ...productData
        };
        
        // Compress image if it's too large (basic compression)
        if (newProduct.image && newProduct.image.length > 100000) { // ~100KB
            console.log('Image too large, applying basic compression...');
            newProduct.image = this.basicImageCompression(newProduct.image);
        }
        
        console.log('Adding new product to localStorage:', newProduct);
        this.products.push(newProduct);
        
        try {
            this.saveProducts();
            console.log('Products after adding:', this.products);
            return newProduct;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('LocalStorage quota exceeded. Clearing old data and retrying...');
                this.clearOldData();
                try {
                    this.saveProducts();
                    console.log('Products saved after clearing old data');
                    return newProduct;
                } catch (retryError) {
                    console.error('Still unable to save after clearing old data:', retryError);
                    throw new Error('Unable to save product. Please try with a smaller image or contact support.');
                }
            } else {
                throw error;
            }
        }
    }

    // Update product
    async updateProduct(id, productData) {
        if (this.useFirebase && window.firebaseService) {
            try {
                console.log('Updating product in Firebase:', id, productData);
                
                // Update product in Firebase (image will be converted to base64)
                const updatedProduct = await window.firebaseService.updateProduct(id, productData);
                
                const index = this.products.findIndex(product => product.id === id);
                if (index !== -1) {
                    this.products[index] = { ...this.products[index], ...updatedProduct };
                    this.saveProducts(); // Save to localStorage as backup
                    console.log('Product updated successfully in Firebase:', this.products[index]);
                    return this.products[index];
                }
            } catch (error) {
                console.error('Error updating product in Firebase:', error);
                // Fallback to localStorage
                return this.updateProductInLocalStorage(id, productData);
            }
        } else {
            console.log('Firebase not available, updating in localStorage...');
            return this.updateProductInLocalStorage(id, productData);
        }
    }

    // Update product in localStorage as fallback
    updateProductInLocalStorage(id, productData) {
        const index = this.products.findIndex(product => product.id === parseInt(id));
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...productData };
            this.saveProducts();
            return this.products[index];
        }
        return null;
    }

    // Delete product
    async deleteProduct(id) {
        if (this.useFirebase && window.firebaseService) {
            try {
                console.log('Deleting product from Firebase:', id);
                
                await window.firebaseService.deleteProduct(id);
                
                const index = this.products.findIndex(product => product.id === id);
                if (index !== -1) {
                    const deletedProduct = this.products.splice(index, 1)[0];
                    this.saveProducts(); // Save to localStorage as backup
                    console.log('Product deleted successfully from Firebase');
                    return deletedProduct;
                }
            } catch (error) {
                console.error('Error deleting product from Firebase:', error);
                // Fallback to localStorage
                return this.deleteProductFromLocalStorage(id);
            }
        } else {
            console.log('Firebase not available, deleting from localStorage...');
            return this.deleteProductFromLocalStorage(id);
        }
    }

    // Delete product from localStorage as fallback
    deleteProductFromLocalStorage(id) {
        const index = this.products.findIndex(product => product.id === parseInt(id));
        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1)[0];
            this.saveProducts();
            return deletedProduct;
        }
        return null;
    }

    // Get next available ID
    getNextId() {
        const maxId = Math.max(...this.products.map(product => product.id), 0);
        return maxId + 1;
    }

    // Save products to localStorage
    saveProducts() {
        localStorage.setItem('diyCraftsProducts', JSON.stringify(this.products));
    }

    // Load products from localStorage
    loadProductsFromStorage() {
        const stored = localStorage.getItem('diyCraftsProducts');
        if (stored) {
            this.products = JSON.parse(stored);
        }
    }

    // Get categories
    getCategories() {
        return this.categories;
    }

    // Get products count by category
    getCategoryCounts() {
        const counts = {};
        this.categories.forEach(category => {
            counts[category] = this.getProductsByCategory(category).length;
        });
        return counts;
    }

    // Get total value of products
    getTotalValue() {
        return this.products.reduce((total, product) => total + (product.price * product.stock), 0);
    }

    // Get low stock products (stock < 5)
    getLowStockProducts() {
        return this.products.filter(product => product.stock < 5);
    }

    // Get out of stock products
    getOutOfStockProducts() {
        return this.products.filter(product => product.stock === 0);
    }

    // Basic image compression (synchronous)
    basicImageCompression(base64Image) {
        try {
            // Simple string manipulation to reduce size
            // Remove data URL prefix and decode
            const base64Data = base64Image.split(',')[1];
            
            // If it's still too large, return a placeholder
            if (base64Data.length > 50000) { // ~50KB
                console.log('Image still too large, using placeholder');
                return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+SW1hZ2UgVG9vIExhcmdlPC90ZXh0Pjwvc3ZnPg==';
            }
            
            return base64Image;
        } catch (error) {
            console.error('Error compressing image:', error);
            return base64Image;
        }
    }

    // Advanced image compression (asynchronous)
    async compressImage(base64Image, maxWidth = 400, quality = 0.7) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions
                let { width, height } = img;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };
            img.src = base64Image;
        }).catch(() => {
            // If compression fails, return original
            return base64Image;
        });
    }

    // Clear old data to free up space
    clearOldData() {
        console.log('Clearing old data to free up localStorage space...');
        
        // Remove images from older products (keep only basic info)
        const productsWithoutImages = this.products.map(product => ({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            description: product.description,
            image: null // Remove image to save space
        }));
        
        this.products = productsWithoutImages;
        
        // Clear other localStorage data that might be taking up space
        const keysToCheck = ['diyCraftsCart', 'diyCraftsOrders', 'cartSessionId'];
        keysToCheck.forEach(key => {
            try {
                const data = localStorage.getItem(key);
                if (data && data.length > 50000) { // If data is larger than ~50KB
                    console.log(`Clearing large data from ${key}`);
                    localStorage.removeItem(key);
                }
            } catch (error) {
                console.log(`Error checking ${key}:`, error);
            }
        });
    }
}

// Create global instance
window.productManager = new ProductManager();

// Initialize products on page load
document.addEventListener('DOMContentLoaded', function() {
    // Clear any existing sample data from localStorage
    const existingProducts = JSON.parse(localStorage.getItem('diyCraftsProducts') || '[]');
    
    // Check if there are old sample products (with placeholder images or specific names)
    const hasSampleData = existingProducts.some(product => 
        product.image.includes('placeholder') || 
        product.name.includes('Crochet Flower Bouquet') ||
        product.name.includes('Crochet Keychain Set') ||
        product.name.includes('Sample') ||
        product.name.includes('Test') ||
        product.description.includes('sample') ||
        product.description.includes('test')
    );
    
    if (hasSampleData) {
        // Clear the old sample data
        localStorage.removeItem('diyCraftsProducts');
        window.productManager.products = [];
        window.productManager.saveProducts();
        console.log('Sample data cleared from products');
    } else {
        // Load products from storage if available
        window.productManager.loadProductsFromStorage();
    }
    
    // Also clear any sample orders that might contain sample product names
    const existingOrders = JSON.parse(localStorage.getItem('diyCraftsOrders') || '[]');
    const hasSampleOrders = existingOrders.some(order => 
        order.items.some(item => 
            item.name.includes('Crochet Flower Bouquet') ||
            item.name.includes('Crochet Keychain Set') ||
            item.name.includes('Sample') ||
            item.name.includes('Test')
        )
    );
    
    if (hasSampleOrders) {
        localStorage.removeItem('diyCraftsOrders');
        console.log('Sample orders cleared');
    }
});
