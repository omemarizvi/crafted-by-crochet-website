// Simple Database Service - Alternative to Firebase
// Uses IndexedDB for better storage than localStorage

class SimpleDBService {
    constructor() {
        this.dbName = 'CraftedByCrochetDB';
        this.dbVersion = 1;
        this.db = null;
        this.initialized = false;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => {
                console.error('IndexedDB failed to open:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                this.initialized = true;
                console.log('SimpleDBService initialized successfully with IndexedDB');
                resolve(true);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create products store
                if (!db.objectStoreNames.contains('products')) {
                    const productsStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
                    productsStore.createIndex('category', 'category', { unique: false });
                    productsStore.createIndex('name', 'name', { unique: false });
                }
                
                // Create orders store
                if (!db.objectStoreNames.contains('orders')) {
                    const ordersStore = db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
                    ordersStore.createIndex('date', 'date', { unique: false });
                    ordersStore.createIndex('customerEmail', 'customerEmail', { unique: false });
                }
                
                console.log('IndexedDB stores created');
            };
        });
    }

    // Product Management Methods
    async addProduct(productData) {
        try {
            if (!this.initialized) {
                await this.init();
            }
            
            const transaction = this.db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            
            const request = store.add({
                ...productData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    console.log('Product added to IndexedDB with ID:', request.result);
                    resolve({
                        id: request.result,
                        ...productData
                    });
                };
                request.onerror = () => {
                    console.error('Error adding product to IndexedDB:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Error in addProduct:', error);
            throw error;
        }
    }

    async getProducts() {
        try {
            if (!this.initialized) {
                await this.init();
            }
            
            const transaction = this.db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const request = store.getAll();
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    const products = request.result.map(product => ({
                        ...product,
                        id: product.id.toString() // Convert to string for compatibility
                    }));
                    console.log('Products loaded from IndexedDB:', products.length);
                    resolve(products);
                };
                request.onerror = () => {
                    console.error('Error getting products from IndexedDB:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Error in getProducts:', error);
            throw error;
        }
    }

    async updateProduct(productId, productData) {
        try {
            if (!this.initialized) {
                await this.init();
            }
            
            const transaction = this.db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            
            // First get the existing product
            const getRequest = store.get(parseInt(productId));
            
            return new Promise((resolve, reject) => {
                getRequest.onsuccess = () => {
                    const existingProduct = getRequest.result;
                    if (!existingProduct) {
                        reject(new Error('Product not found'));
                        return;
                    }
                    
                    const updatedProduct = {
                        ...existingProduct,
                        ...productData,
                        updatedAt: new Date().toISOString()
                    };
                    
                    const putRequest = store.put(updatedProduct);
                    putRequest.onsuccess = () => {
                        console.log('Product updated in IndexedDB');
                        resolve({ id: productId, ...updatedProduct });
                    };
                    putRequest.onerror = () => {
                        console.error('Error updating product in IndexedDB:', putRequest.error);
                        reject(putRequest.error);
                    };
                };
                getRequest.onerror = () => {
                    console.error('Error getting product for update:', getRequest.error);
                    reject(getRequest.error);
                };
            });
        } catch (error) {
            console.error('Error in updateProduct:', error);
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            if (!this.initialized) {
                await this.init();
            }
            
            const transaction = this.db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            const request = store.delete(parseInt(productId));
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    console.log('Product deleted from IndexedDB');
                    resolve(true);
                };
                request.onerror = () => {
                    console.error('Error deleting product from IndexedDB:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Error in deleteProduct:', error);
            throw error;
        }
    }

    async getProductById(productId) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === productId);
        } catch (error) {
            console.error('Error in getProductById:', error);
            throw error;
        }
    }

    // Check if IndexedDB is supported
    static isSupported() {
        return 'indexedDB' in window;
    }

    // Fallback to localStorage if IndexedDB fails
    async fallbackToLocalStorage() {
        console.log('Falling back to localStorage...');
        // This would implement localStorage methods as backup
        // For now, just return false to indicate fallback needed
        return false;
    }
}

// Create global instance
if (SimpleDBService.isSupported()) {
    window.simpleDBService = new SimpleDBService();
    console.log('SimpleDBService created with IndexedDB support');
} else {
    console.warn('IndexedDB not supported, will use localStorage fallback');
}
