# Firebase Setup Guide

This guide will walk you through setting up Firebase for the Map Trekker Live project.

## Prerequisites

- A Google account
- Node.js and npm installed
- Project cloned locally

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "map-trekker-live")
4. (Optional) Enable Google Analytics
5. Click **"Create project"** and wait for it to be ready

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **web icon** (`</>`) to add a web app
2. Give your app a nickname (e.g., "Map Trekker Web")
3. (Optional) Check "Also set up Firebase Hosting" if you plan to use it
4. Click **"Register app"**
5. Copy the Firebase configuration object that appears:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-ABC123" // Optional, for Analytics
};
```

## Step 3: Configure Environment Variables

1. In your project root, copy the `.env.example` file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Important**: Never commit the `.env` file to version control!

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication** from the left sidebar
2. Click **"Get started"** if this is your first time
3. Go to the **"Sign-in method"** tab
4. Find **"Email/Password"** in the list
5. Click on it and toggle **"Enable"**
6. Click **"Save"**

### Optional: Enable Additional Providers

You can also enable other authentication providers:
- Google Sign-In
- Facebook
- GitHub
- Apple
- Phone authentication

## Step 5: Set Up Cloud Firestore

1. In Firebase Console, go to **Firestore Database** from the left sidebar
2. Click **"Create database"**
3. Choose a starting mode:
   - **Production mode** (recommended for production)
   - **Test mode** (for development - allows all reads/writes)
4. Select a Cloud Firestore location (choose closest to your users)
5. Click **"Enable"**

### Create Collections

Create the following collections in Firestore:

#### Collection: `busLocations`
This stores real-time bus location data.

**Document structure:**
```javascript
{
  busId: "bus-001",
  busNumber: "42A",
  location: {
    latitude: 12.9716,
    longitude: 77.5946
  },
  crowdDensity: "medium", // "low" | "medium" | "high"
  isActive: true,
  lastUpdated: Timestamp,
  driverId: "user-id-123",
  route: "route-1"
}
```

#### Collection: `routes` (Optional)
Store bus route information.

#### Collection: `busStops` (Optional)
Store bus stop locations.

## Step 6: Configure Firestore Security Rules

### Development Rules (Permissive)

For initial development and testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write to busLocations
    match /busLocations/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Production Rules (Recommended)

For production deployment:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Bus locations - drivers can write, everyone can read
    match /busLocations/{busId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null 
        && request.auth.token.userType == 'driver';
      allow delete: if request.auth.token.userType == 'admin';
    }
    
    // Routes - read-only for authenticated users
    match /routes/{routeId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.userType == 'admin';
    }
    
    // Bus stops - read-only for authenticated users
    match /busStops/{stopId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.userType == 'admin';
    }
  }
}
```

To apply these rules:
1. Go to **Firestore Database** > **Rules** tab
2. Paste your rules
3. Click **"Publish"**

## Step 7: Set Up Custom Claims (Optional)

To implement role-based access (user, driver, admin), you'll need to set custom claims. This requires Firebase Admin SDK on the backend.

### Using Firebase Functions (Recommended)

Create a Cloud Function to set user roles:

```javascript
const admin = require('firebase-admin');
admin.initializeApp();

exports.setUserRole = functions.https.onCall(async (data, context) => {
  // Check if request is made by an admin
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can set user roles.'
    );
  }

  const { uid, role } = data;
  
  // Set custom user claim
  await admin.auth().setCustomUserClaims(uid, { userType: role });
  
  return { message: `Success! ${uid} has been made a ${role}` };
});
```

## Step 8: Test Your Configuration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try to register a new user
3. Check Firebase Console > Authentication to see if the user was created
4. Try to share location as a driver
5. Check Firestore Console to see if data is being written

## Troubleshooting

### Authentication Issues

**Problem**: "Firebase: Error (auth/unauthorized-domain)"
- **Solution**: Add your domain to authorized domains in Firebase Console
  - Go to Authentication > Settings > Authorized domains
  - Add `localhost` and your production domain

### Firestore Permission Denied

**Problem**: "Missing or insufficient permissions"
- **Solution**: Check your Firestore security rules
- For development, use test mode
- Ensure user is authenticated

### Environment Variables Not Loading

**Problem**: Firebase configuration is undefined
- **Solution**: 
  - Make sure `.env` file is in the project root
  - Environment variables in Vite must start with `VITE_`
  - Restart the development server after changing `.env`

### CORS Errors

**Problem**: CORS errors when accessing Firebase
- **Solution**: Check allowed domains in Firebase Console
- Ensure you're using HTTPS in production

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Model](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## Support

If you encounter any issues:
1. Check the [Firebase Status Dashboard](https://status.firebase.google.com/)
2. Search [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
3. Open an issue in the project repository
