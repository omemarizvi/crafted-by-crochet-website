// Products Data and Management
class ProductManager {
    constructor() {
        this.products = [];
        this.categories = ['all', 'flowers', 'keychains', 'accessories', 'stuffed-toys', 'jewellery'];
        this.googleScriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // Replace with your actual URL
        this.loadProductsFromGoogleSheets();
    }

    // Load products from Google Sheets
    async loadProductsFromGoogleSheets() {
        try {
            console.log('Loading products from Google Sheets...');
            const response = await fetch(this.googleScriptUrl);
            const data = await response.json();
            
            if (data.success && data.products) {
                this.products = data.products;
                console.log('Products loaded from Google Sheets:', this.products.length);
                // Also save to localStorage as backup
                this.saveProducts();
            } else {
                console.error('Failed to load products from Google Sheets:', data.error);
                // Fallback to localStorage
                this.products = this.loadProductsFromLocalStorage();
            }
        } catch (error) {
            console.error('Error loading products from Google Sheets:', error);
            // Fallback to localStorage
            this.products = this.loadProductsFromLocalStorage();
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

    // Load products from localStorage or return empty array (legacy method)
    loadProducts() {
        return this.loadProductsFromLocalStorage();
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
        try {
            console.log('Adding new product to Google Sheets:', productData);
            
            const response = await fetch(this.googleScriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'add',
                    ...productData
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                const newProduct = {
                    id: result.id,
                    ...productData
                };
                this.products.push(newProduct);
                this.saveProducts(); // Save to localStorage as backup
                console.log('Product added successfully:', newProduct);
                return newProduct;
            } else {
                console.error('Failed to add product to Google Sheets:', result.error);
                // Fallback to localStorage
                return this.addProductToLocalStorage(productData);
            }
        } catch (error) {
            console.error('Error adding product to Google Sheets:', error);
            // Fallback to localStorage
            return this.addProductToLocalStorage(productData);
        }
    }

    // Add product to localStorage as fallback
    addProductToLocalStorage(productData) {
        const newProduct = {
            id: this.getNextId(),
            ...productData
        };
        console.log('Adding new product to localStorage:', newProduct);
        this.products.push(newProduct);
        this.saveProducts();
        console.log('Products after adding:', this.products);
        return newProduct;
    }

    // Update product
    async updateProduct(id, productData) {
        try {
            console.log('Updating product in Google Sheets:', id, productData);
            
            const response = await fetch(this.googleScriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'update',
                    id: parseInt(id),
                    ...productData
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                const index = this.products.findIndex(product => product.id === parseInt(id));
                if (index !== -1) {
                    this.products[index] = { ...this.products[index], ...productData };
                    this.saveProducts(); // Save to localStorage as backup
                    console.log('Product updated successfully:', this.products[index]);
                    return this.products[index];
                }
            } else {
                console.error('Failed to update product in Google Sheets:', result.error);
                // Fallback to localStorage
                return this.updateProductInLocalStorage(id, productData);
            }
        } catch (error) {
            console.error('Error updating product in Google Sheets:', error);
            // Fallback to localStorage
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
        try {
            console.log('Deleting product from Google Sheets:', id);
            
            const response = await fetch(this.googleScriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'delete',
                    id: parseInt(id)
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                const index = this.products.findIndex(product => product.id === parseInt(id));
                if (index !== -1) {
                    const deletedProduct = this.products.splice(index, 1)[0];
                    this.saveProducts(); // Save to localStorage as backup
                    console.log('Product deleted successfully');
                    return deletedProduct;
                }
            } else {
                console.error('Failed to delete product from Google Sheets:', result.error);
                // Fallback to localStorage
                return this.deleteProductFromLocalStorage(id);
            }
        } catch (error) {
            console.error('Error deleting product from Google Sheets:', error);
            // Fallback to localStorage
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
