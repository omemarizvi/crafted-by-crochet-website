// Firebase Service for Product Management
// Using traditional Firebase SDK (not modular)

class FirebaseService {
    constructor() {
        this.db = null;
        this.productsCollection = 'products';
        this.cartsCollection = 'carts';
        this.sessionId = this.getOrCreateSessionId();
        this.initialized = false;
        this.init();
    }

    async init() {
        // Wait for Firebase to be initialized
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait
        
        while (attempts < maxAttempts && !this.initialized) {
            if (window.firebase && window.firebase.db) {
                this.db = window.firebase.db;
                this.initialized = true;
                console.log('Firebase Service initialized successfully!');
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!this.initialized) {
            console.error('Firebase Service failed to initialize after 5 seconds');
        }
    }

    // Generate or retrieve session ID for cart persistence
    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('cartSessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('cartSessionId', sessionId);
        }
        return sessionId;
    }

  // Convert image file to base64 string for Firestore storage
  async convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        console.log('Image converted to base64 successfully');
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        console.error('Error converting image to base64:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  // Add new product
  async addProduct(productData) {
    try {
      if (!this.initialized || !this.db) {
        throw new Error('Firebase not initialized');
      }
      
      console.log('Adding product to Firebase:', productData);
      
      // Convert image file to base64 if provided
      let imageData = productData.image;
      if (productData.imageFile) {
        imageData = await this.convertImageToBase64(productData.imageFile);
      }
      
      // Add product to Firestore using traditional SDK
      const docRef = await this.db.collection(this.productsCollection).add({
        name: productData.name,
        category: productData.category,
        price: productData.price,
        stock: productData.stock,
        description: productData.description,
        image: imageData, // This will be the base64 string
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Product added with ID:', docRef.id);
      return {
        id: docRef.id,
        ...productData,
        image: imageData
      };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  // Get all products
  async getProducts() {
    try {
      if (!this.initialized || !this.db) {
        throw new Error('Firebase not initialized');
      }
      
      console.log('Loading products from Firebase...');
      
      const querySnapshot = await this.db.collection(this.productsCollection)
        .orderBy('createdAt', 'desc')
        .get();
      
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log('Products loaded from Firebase:', products.length);
      return products;
    } catch (error) {
      console.error('Error loading products:', error);
      throw error;
    }
  }

  // Update product
  async updateProduct(productId, productData) {
    try {
      console.log('Updating product in Firebase:', productId, productData);
      
      // Convert image file to base64 if provided
      let imageData = productData.image;
      if (productData.imageFile) {
        imageData = await this.convertImageToBase64(productData.imageFile);
      }
      
      const productRef = this.db.collection(this.productsCollection).doc(productId);
      await productRef.update({
        ...productData,
        image: imageData,
        updatedAt: new Date().toISOString()
      });

      console.log('Product updated successfully');
      return { id: productId, ...productData, image: imageData };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(productId) {
    try {
      console.log('Deleting product from Firebase:', productId);
      
      await this.db.collection(this.productsCollection).doc(productId).delete();
      
      console.log('Product deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Get product by ID
  async getProductById(productId) {
    try {
      const products = await this.getProducts();
      return products.find(product => product.id === productId);
    } catch (error) {
      console.error('Error getting product by ID:', error);
      throw error;
    }
  }

  // Cart Management Methods
  async getCart() {
    try {
      console.log('Loading cart from Firebase for session:', this.sessionId);
      
      const querySnapshot = await this.db.collection(this.cartsCollection)
        .where('sessionId', '==', this.sessionId)
        .get();
      
      if (!querySnapshot.empty) {
        const cartDoc = querySnapshot.docs[0];
        const cartData = cartDoc.data();
        console.log('Cart loaded from Firebase:', cartData.items);
        return cartData.items || [];
      }
      
      console.log('No cart found, returning empty array');
      return [];
    } catch (error) {
      console.error('Error loading cart from Firebase:', error);
      // Fallback to localStorage
      return this.getCartFromLocalStorage();
    }
  }

  async saveCart(cartItems) {
    try {
      console.log('Saving cart to Firebase:', cartItems);
      
      const querySnapshot = await this.db.collection(this.cartsCollection)
        .where('sessionId', '==', this.sessionId)
        .get();
      
      const cartData = {
        sessionId: this.sessionId,
        items: cartItems,
        updatedAt: new Date().toISOString()
      };
      
      if (!querySnapshot.empty) {
        // Update existing cart
        const cartDoc = querySnapshot.docs[0];
        await this.db.collection(this.cartsCollection).doc(cartDoc.id).update(cartData);
        console.log('Cart updated in Firebase');
      } else {
        // Create new cart
        await this.db.collection(this.cartsCollection).add(cartData);
        console.log('Cart created in Firebase');
      }
      
      // Also save to localStorage as backup
      this.saveCartToLocalStorage(cartItems);
    } catch (error) {
      console.error('Error saving cart to Firebase:', error);
      // Fallback to localStorage
      this.saveCartToLocalStorage(cartItems);
    }
  }

  async clearCart() {
    try {
      console.log('Clearing cart from Firebase');
      
      const querySnapshot = await this.db.collection(this.cartsCollection)
        .where('sessionId', '==', this.sessionId)
        .get();
      
      if (!querySnapshot.empty) {
        const cartDoc = querySnapshot.docs[0];
        await this.db.collection(this.cartsCollection).doc(cartDoc.id).delete();
        console.log('Cart cleared from Firebase');
      }
      
      // Also clear localStorage
      this.clearCartFromLocalStorage();
    } catch (error) {
      console.error('Error clearing cart from Firebase:', error);
      // Fallback to localStorage
      this.clearCartFromLocalStorage();
    }
  }

  // LocalStorage fallback methods
  getCartFromLocalStorage() {
    try {
      const stored = localStorage.getItem('diyCraftsCart');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  }

  saveCartToLocalStorage(cartItems) {
    try {
      localStorage.setItem('diyCraftsCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  clearCartFromLocalStorage() {
    try {
      localStorage.removeItem('diyCraftsCart');
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  }
}

// Create global instance
window.firebaseService = new FirebaseService();
console.log('Firebase Service initialized!');
