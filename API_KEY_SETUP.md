# Google Translate API Key Setup - Step by Step

## Step 1: Get Your Google Translate API Key

### 1.1 Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 1.2 Create or Select a Project
- Click on the project dropdown at the top
- Click "New Project" or select an existing one
- Give it a name like "Flipkart Translation"

### 1.3 Enable Cloud Translation API
- In the left sidebar, click "APIs & Services" > "Library"
- Search for "Cloud Translation API"
- Click on "Cloud Translation API"
- Click "Enable"

### 1.4 Create API Credentials
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "API Key"
- Copy the generated API key (it will look like: `AIzaSyC...`)

### 1.5 (Optional) Restrict the API Key
- Click on the API key you just created
- Under "Application restrictions", select "HTTP referrers"
- Add your domain or leave it unrestricted for development
- Under "API restrictions", select "Restrict key"
- Select "Cloud Translation API"
- Click "Save"

## Step 2: Configure the API Key in Your App

### Option A: Using Environment Variable (Recommended)

1. Open the `.env` file in your project root
2. Replace `your_actual_api_key_here` with your real API key:

```
EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY=AIzaSyC_your_actual_api_key_here
```

### Option B: Direct Configuration

1. Open `config/api.ts`
2. Replace the line:
```typescript
GOOGLE_TRANSLATE_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY || 'YOUR_GOOGLE_TRANSLATE_API_KEY',
```

With:
```typescript
GOOGLE_TRANSLATE_API_KEY: 'AIzaSyC_your_actual_api_key_here',
```

## Step 3: Test the Configuration

1. Restart your development server:
```bash
npm run dev
```

2. Open the app and select a non-English language
3. Check if translations are working

## Step 4: Troubleshooting

### If you see "API key not configured" error:
- Make sure you've added the API key to `.env` file
- Restart the development server after adding the key
- Check that the API key is correct (starts with `AIzaSyC`)

### If you see "API key not valid" error:
- Make sure you've enabled Cloud Translation API
- Check that your API key is not restricted to wrong domains
- Verify the API key is copied correctly

### If translations are not working:
- Check your internet connection
- Verify the API key has Cloud Translation API enabled
- Check the Google Cloud Console for any quota limits

## Step 5: Cost Information

- **Free Tier**: 500,000 characters per month
- **Paid**: $20 per million characters after free tier
- **Monitoring**: Check usage in Google Cloud Console > APIs & Services > Dashboard

## Step 6: Security Best Practices

1. **Never commit your API key to version control**
2. **Use environment variables for production**
3. **Restrict your API key to specific domains/IPs**
4. **Monitor your API usage regularly**

## Example .env file:
```
# Google Translate API Key
EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY=AIzaSyC_your_actual_api_key_here
```

## Need Help?

If you're still having issues:
1. Check the console logs for specific error messages
2. Verify your API key in Google Cloud Console
3. Make sure Cloud Translation API is enabled
4. Check your internet connection 