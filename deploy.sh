#!/bin/bash

echo "🚀 Starting Netlify Deployment..."

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=dist --site-name=tata-motors-magazine-$(date +%s)

echo "✅ Deployment completed!"
echo "🔗 Your site should be live at the URL provided above"
echo ""
echo "📝 Don't forget to set the environment variable in Netlify dashboard:"
echo "   VITE_API_URL=https://7358-2401-4900-8fca-8451-2808-3868-77e4-817d.ngrok-free.app/api/query" 