// Firebase Service for Product Management
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
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
}

// Create global instance
window.firebaseService = new FirebaseService();
console.log('Firebase Service initialized!');
