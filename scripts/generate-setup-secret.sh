#!/bin/bash

# Generate Setup Secret
# This script generates a random secret for the initial setup API

echo "🔐 Generating Setup Secret..."
echo ""

SECRET=$(openssl rand -base64 32)

echo "✅ Generated Setup Secret:"
echo ""
echo "SETUP_SECRET=$SECRET"
echo ""
echo "📝 Add this to your Vercel environment variables:"
echo "   1. Go to: https://vercel.com/dashboard"
echo "   2. Select your project"
echo "   3. Settings → Environment Variables"
echo "   4. Add: SETUP_SECRET = $SECRET"
echo "   5. Add: SETUP_ENABLED = true"
echo ""
echo "⚠️  Keep this secret safe!"
echo "⚠️  After creating the first master account, set SETUP_ENABLED=false"
