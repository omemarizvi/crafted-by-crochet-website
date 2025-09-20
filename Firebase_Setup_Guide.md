# Firebase Setup Guide for DIY Crafts Website

## Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: "crafted-by-crochet" (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

## Step 2: Enable Required Services

### A. Firestore Database (for product data)
1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Select a location close to your users (e.g., us-central1)
5. Click "Done"

### B. Firebase Storage (for images)
1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode"
4. Select the same location as Firestore
5. Click "Done"

## Step 3: Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>)
4. Enter app nickname: "Crafted by Crochet Website"
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the Firebase configuration object

## Step 4: Update Website Configuration
1. Open `js/firebase-config.js` (we'll create this)
2. Replace the placeholder config with your actual Firebase config
3. The config should look like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Step 5: Set Up Security Rules

### Firestore Rules
1. Go to "Firestore Database" → "Rules"
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to products for all users
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

### Storage Rules
1. Go to "Storage" → "Rules"
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all images
    match /product-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can upload
    }
  }
}
```

## Step 6: Test the Setup
1. Open your website
2. Check browser console for Firebase connection messages
3. Try adding a product from admin panel
4. Verify it appears in Firestore Database
5. Check that images are uploaded to Storage

## Step 7: Enable Authentication (Optional)
If you want to secure the admin panel:

1. Go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" provider
3. Add your admin email
4. Update admin panel to require login

## Troubleshooting
- **CORS errors**: Make sure your domain is added to Firebase authorized domains
- **Permission denied**: Check your Firestore and Storage rules
- **Images not uploading**: Verify Storage rules allow writes
- **Products not loading**: Check Firestore rules allow reads

## Benefits of This Setup
- ✅ **Free tier**: 1GB storage, 10GB transfer/month
- ✅ **Real-time updates**: Products sync instantly
- ✅ **Image optimization**: Firebase handles image compression
- ✅ **Scalable**: Grows with your business
- ✅ **Secure**: Built-in security rules
- ✅ **Works with GitHub Pages**: No server needed
