// Products Data and Management
class ProductManager {
    constructor() {
        this.products = this.loadProducts();
        this.categories = ['all', 'flowers', 'keychains', 'accessories', 'stuffed-toys', 'jewellery'];
    }

    // Sample products data
    loadProducts() {
        return [
            {
                id: 1,
                name: "Crochet Flower Bouquet",
                category: "flowers",
                price: 28.99,
                stock: 10,
                description: "Beautiful crocheted flowers in a lovely bouquet arrangement. Each flower is handcrafted with love and care. Perfect for special occasions or home decoration.",
                image: "images/products/crochet-rose-bouquet.jpg"
            },
            {
                id: 2,
                name: "Crochet Keychain Set",
                category: "keychains",
                price: 15.50,
                stock: 15,
                description: "Set of 3 adorable crocheted keychains featuring cute animals and shapes. Each one is unique and made with soft yarn!",
                image: "https://via.placeholder.com/300x300/8B5A8C/FFFFFF?text=Crochet+Keychains"
            },
            {
                id: 3,
                name: "Crochet Flower Crown",
                category: "accessories",
                price: 22.75,
                stock: 8,
                description: "Delicate crochet flower crown perfect for festivals, weddings, and special events. Made with premium cotton yarn.",
                image: "https://via.placeholder.com/300x300/D4A5A5/FFFFFF?text=Flower+Crown"
            },
            {
                id: 4,
                name: "Crochet Amigurumi Panda",
                category: "stuffed-toys",
                price: 35.00,
                stock: 5,
                description: "Adorable crocheted panda amigurumi made with soft, high-quality yarn. Perfect for children and collectors alike.",
                image: "https://via.placeholder.com/300x300/F7E7CE/8B5A8C?text=Panda+Toy"
            },
            {
                id: 5,
                name: "Crochet Statement Necklace",
                category: "jewellery",
                price: 32.50,
                stock: 12,
                description: "Elegant crocheted statement necklace with intricate patterns. Perfect for adding a handmade touch to any outfit.",
                image: "https://via.placeholder.com/300x300/8B5A8C/FFFFFF?text=Necklace"
            },
            {
                id: 6,
                name: "Crochet Sunflower Wall Hanging",
                category: "accessories",
                price: 25.00,
                stock: 7,
                description: "Bright and cheerful crocheted sunflower wall hanging to brighten any room. Perfect home decor piece.",
                image: "https://via.placeholder.com/300x300/D4A5A5/FFFFFF?text=Sunflower"
            },
            {
                id: 7,
                name: "Crochet Coaster Set",
                category: "accessories",
                price: 18.99,
                stock: 20,
                description: "Set of 6 beautiful crocheted coasters with different patterns. Perfect for protecting your furniture in style.",
                image: "https://via.placeholder.com/300x300/F7E7CE/8B5A8C?text=Coasters"
            },
            {
                id: 8,
                name: "Crochet Infinity Scarf",
                category: "accessories",
                price: 42.00,
                stock: 6,
                description: "Beautiful crocheted infinity scarf with intricate stitch patterns. One of a kind piece made with premium yarn.",
                image: "https://via.placeholder.com/300x300/8B5A8C/FFFFFF?text=Scarf"
            },
            {
                id: 9,
                name: "Crochet Teddy Bear",
                category: "stuffed-toys",
                price: 28.99,
                stock: 9,
                description: "Soft and cuddly crocheted teddy bear perfect for children and adults alike. Made with love and attention to detail.",
                image: "https://via.placeholder.com/300x300/D4A5A5/FFFFFF?text=Teddy+Bear"
            },
            {
                id: 10,
                name: "Crochet Earrings Set",
                category: "jewellery",
                price: 19.75,
                stock: 18,
                description: "Set of 3 pairs of delicate crocheted earrings with different styles and colors. Lightweight and comfortable to wear.",
                image: "https://via.placeholder.com/300x300/F7E7CE/8B5A8C?text=Earrings"
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
    addProduct(productData) {
        const newProduct = {
            id: this.getNextId(),
            ...productData
        };
        this.products.push(newProduct);
        this.saveProducts();
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
    // Load products from storage if available
    window.productManager.loadProductsFromStorage();
    
    // If no products in storage, use default sample products
    if (window.productManager.getAllProducts().length === 0) {
        window.productManager.products = window.productManager.loadProducts();
        window.productManager.saveProducts();
    }
});
