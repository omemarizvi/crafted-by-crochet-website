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
        console.log('Firebase Service: Starting initialization...');
        
        // Wait for Firebase to be initialized
        let attempts = 0;
        const maxAttempts = 100; // 10 seconds max wait
        
        while (attempts < maxAttempts && !this.initialized) {
            console.log(`Firebase Service: Attempt ${attempts + 1}/${maxAttempts}`);
            console.log('Firebase object available:', typeof window.firebase !== 'undefined');
            console.log('Firebase.db available:', window.firebase && window.firebase.db ? 'Yes' : 'No');
            console.log('Global firebase available:', typeof firebase !== 'undefined');
            console.log('Firebase apps count:', typeof firebase !== 'undefined' && firebase.apps ? firebase.apps.length : 'N/A');
            
            // Try multiple ways to get the database
            let db = null;
            
            // Method 1: Check window.firebase.db
            if (window.firebase && window.firebase.db) {
                db = window.firebase.db;
                console.log('Found database via window.firebase.db');
            }
            // Method 2: Try to get it directly from global firebase
            else if (typeof firebase !== 'undefined' && firebase.firestore) {
                try {
                    // Check if Firebase app is initialized first
                    if (firebase.apps && firebase.apps.length > 0) {
                        db = firebase.firestore();
                        console.log('Found database via firebase.firestore()');
                        // Also set window.firebase if it's not set
                        if (!window.firebase) {
                            window.firebase = {
                                app: firebase.app(),
                                db: db,
                                auth: firebase.auth(),
                                storage: firebase.storage()
                            };
                        }
                    } else {
                        console.log('Firebase app not initialized yet, skipping direct firestore call');
                    }
                } catch (error) {
                    console.log('Error getting firestore directly:', error);
                }
            }
            
            if (db) {
                this.db = db;
                this.initialized = true;
                console.log('Firebase Service initialized successfully!');
                console.log('Database object:', this.db);
                break;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!this.initialized) {
            console.error('Firebase Service failed to initialize after 10 seconds');
            console.log('Final state check:');
            console.log('- window.firebase:', typeof window.firebase);
            console.log('- window.firebase.db:', window.firebase && window.firebase.db ? 'Available' : 'Not available');
            console.log('- Firebase scripts loaded:', typeof firebase !== 'undefined');
        }
    }

    // Manual re-initialization function
    async reinitialize() {
        console.log('Firebase Service: Manual re-initialization requested...');
        this.initialized = false;
        this.db = null;
        await this.init();
        return this.initialized;
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

  // Compress image to reduce file size
  compressImage(file, maxWidth = 800, maxHeight = 600, quality = 0.7) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        console.log(`Image compressed from ${file.size} bytes to ${compressedDataUrl.length} characters`);
        resolve(compressedDataUrl);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // Convert image file to base64 string for Firestore storage
  async convertImageToBase64(file) {
    try {
      // Firebase has a 1MB limit for document fields
      const maxSize = 1048487; // 1MB in bytes
      
      // Try different compression levels
      let compressedImage;
      let quality = 0.7;
      let maxWidth = 800;
      let maxHeight = 600;
      
      do {
        compressedImage = await this.compressImage(file, maxWidth, maxHeight, quality);
        
        // Check if the Base64 string is within Firebase limits
        if (compressedImage.length <= maxSize) {
          console.log(`Image compressed successfully to ${compressedImage.length} characters`);
          break;
        }
        
        // If still too large, reduce quality and size
        quality *= 0.8;
        maxWidth *= 0.8;
        maxHeight *= 0.8;
        
        console.log(`Image still too large (${compressedImage.length} chars), reducing quality to ${quality} and size to ${maxWidth}x${maxHeight}`);
        
        // Prevent infinite loop
        if (quality < 0.1 || maxWidth < 200) {
          console.warn('Image could not be compressed enough for Firebase, using lowest quality');
          break;
        }
        
      } while (compressedImage.length > maxSize && quality > 0.1);
      
      return compressedImage;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
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
