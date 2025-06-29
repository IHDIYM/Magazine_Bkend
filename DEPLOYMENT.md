# Deployment Guide for Netlify

## Prerequisites
- Your backend is running on ngrok (already configured)
- Your frontend is ready for deployment

## Backend Setup
1. Your Flask backend is running on port 5005
2. Ngrok tunnel is active: `https://7358-2401-4900-8fca-8451-2808-3868-77e4-817d.ngrok-free.app`

## Frontend Deployment on Netlify

### Method 1: Using Netlify CLI
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build your project: `npm run build`
3. Deploy: `netlify deploy --prod --dir=dist`

### Method 2: Using Netlify Dashboard
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Environment Variables
In Netlify dashboard, set the following environment variable:
- **Key**: `VITE_API_URL`
- **Value**: `https://7358-2401-4900-8fca-8451-2808-3868-77e4-817d.ngrok-free.app/api/query`

### Important Notes
- The ngrok URL will change each time you restart ngrok
- For production, consider using a permanent hosting solution for your backend
- Update the `VITE_API_URL` environment variable in Netlify when the ngrok URL changes

## Testing
After deployment, test the chatbot functionality to ensure it connects to your backend properly. 