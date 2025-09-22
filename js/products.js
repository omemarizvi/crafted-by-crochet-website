// Products Data and Management
class ProductManager {
    constructor() {
        this.categories = ['all', 'flowers', 'keychains', 'accessories', 'stuffed-toys', 'jewellery'];
        
        // Initialize with default products only
        this.products = this.getDefaultProducts();
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
            },
            {
                id: 4,
                name: 'Sunflower',
                category: 'flowers',
                price: 1000,
                stock: 0,
                image: 'images/products/sunflower.jpg'
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
            image: productData.image
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