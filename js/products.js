// Products Data and Management
class ProductManager {
    constructor() {
        this.products = this.loadProducts();
        this.categories = ['all', 'flowers', 'keychains', 'accessories', 'stuffed-toys', 'jewellery'];
    }

    // Load products from localStorage or return empty array
    loadProducts() {
        const stored = localStorage.getItem('diyCraftsProducts');
        if (stored) {
            return JSON.parse(stored);
        }
        return [];
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
    addProduct(productData) {
        const newProduct = {
            id: this.getNextId(),
            ...productData
        };
        console.log('Adding new product:', newProduct);
        this.products.push(newProduct);
        this.saveProducts();
        console.log('Products after adding:', this.products);
        return newProduct;
    }

    // Update product
    updateProduct(id, productData) {
        const index = this.products.findIndex(product => product.id === parseInt(id));
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...productData };
            this.saveProducts();
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
