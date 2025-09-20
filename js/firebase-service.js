// Firebase Service for Product Management
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

class FirebaseService {
    constructor() {
        this.db = window.firebase.db;
        this.storage = window.firebase.storage;
        this.productsCollection = 'products';
        this.cartsCollection = 'carts';
        this.sessionId = this.getOrCreateSessionId();
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

  // Upload image to Firebase Storage
  async uploadImage(file, productId) {
    try {
      const fileName = `product-${productId}-${Date.now()}.${file.name.split('.').pop()}`;
      const storageRef = ref(this.storage, `product-images/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('Image uploaded successfully:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Add new product
  async addProduct(productData) {
    try {
      console.log('Adding product to Firebase:', productData);
      
      // Add product to Firestore
      const docRef = await addDoc(collection(this.db, this.productsCollection), {
        name: productData.name,
        category: productData.category,
        price: productData.price,
        stock: productData.stock,
        description: productData.description,
        image: productData.image, // This will be the Firebase Storage URL
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Product added with ID:', docRef.id);
      return {
        id: docRef.id,
        ...productData
      };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  // Get all products
  async getProducts() {
    try {
      console.log('Loading products from Firebase...');
      
      const q = query(collection(this.db, this.productsCollection), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
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
      
      const productRef = doc(this.db, this.productsCollection, productId);
      await updateDoc(productRef, {
        ...productData,
        updatedAt: new Date().toISOString()
      });

      console.log('Product updated successfully');
      return { id: productId, ...productData };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(productId) {
    try {
      console.log('Deleting product from Firebase:', productId);
      
      await deleteDoc(doc(this.db, this.productsCollection, productId));
      
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
      
      const q = query(collection(this.db, this.cartsCollection), 
                     where('sessionId', '==', this.sessionId));
      const querySnapshot = await getDocs(q);
      
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
      
      const q = query(collection(this.db, this.cartsCollection), 
                     where('sessionId', '==', this.sessionId));
      const querySnapshot = await getDocs(q);
      
      const cartData = {
        sessionId: this.sessionId,
        items: cartItems,
        updatedAt: new Date().toISOString()
      };
      
      if (!querySnapshot.empty) {
        // Update existing cart
        const cartDoc = querySnapshot.docs[0];
        await updateDoc(doc(this.db, this.cartsCollection, cartDoc.id), cartData);
        console.log('Cart updated in Firebase');
      } else {
        // Create new cart
        await addDoc(collection(this.db, this.cartsCollection), cartData);
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
      
      const q = query(collection(this.db, this.cartsCollection), 
                     where('sessionId', '==', this.sessionId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const cartDoc = querySnapshot.docs[0];
        await deleteDoc(doc(this.db, this.cartsCollection, cartDoc.id));
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
