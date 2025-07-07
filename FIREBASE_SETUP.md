# Firebase Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Enter your project name (e.g., "flipkart-app")
4. Follow the setup wizard

## Step 2: Add Web App

1. In your Firebase project, click the web icon (</>) to add a web app
2. Register your app with a nickname (e.g., "flipkart-web")
3. Copy the configuration object

## Step 3: Update Configuration

1. Open `firebase.config.js` in your project
2. Replace the placeholder values with your actual Firebase config:

```javascript
export const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 4: Enable Authentication

1. In Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable "Email/Password" authentication
3. Enable "Phone" authentication (for OTP)
4. For Phone Auth, add test phone numbers if you're in development

## Step 5: Test the App

1. Run your app: `npm run dev`
2. Try signing up with email/password
3. Try phone authentication with OTP

## Troubleshooting

### OTP Not Working
- Make sure Phone Authentication is enabled in Firebase Console
- Add your phone number to test numbers if in development
- Check Firebase Console logs for errors

### Email Authentication Issues
- Verify Email/Password is enabled in Firebase Console
- Check that your Firebase config is correct
- Look for errors in the browser console

### Firebase Config Errors
- Double-check all values in `firebase.config.js`
- Ensure your project ID matches exactly
- Verify your API key is correct

## Security Rules (Optional)

For production, consider setting up proper security rules in Firebase Console:
- Go to "Firestore Database" > "Rules"
- Configure read/write permissions as needed 