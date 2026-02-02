#!/bin/bash

# DramaAlert Studio - Environment Setup
# Run this to configure your environment for deployment

echo "🎬 DramaAlert Studio - Environment Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to prompt for input
prompt() {
    echo -e "${YELLOW}$1${NC}"
    read -p "  > " value
    echo "$value"
}

echo "📋 Supabase Configuration"
echo "------------------------"
echo "Create a project at https://supabase.com"
echo ""

SUPABASE_URL=$(prompt "Enter your Supabase URL (https://xxx.supabase.co)")
SUPABASE_ANON_KEY=$(prompt "Enter your Supabase anon key")
SERVICE_ROLE_KEY=$(prompt "Enter your Supabase service role key")

echo ""
echo "🔐 App Security"
echo "---------------"

# Generate secure passwords if not provided
APP_PASSWORD=$(prompt "Enter your app password (press Enter to generate random)")
if [ -z "$APP_PASSWORD" ]; then
    APP_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 24)
    echo "  Generated password: $APP_PASSWORD"
fi

JWT_SECRET=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
echo "  Generated JWT_SECRET: $JWT_SECRET"

echo ""
echo "📝 Creating .env.local..."
echo ""

cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY

# App Secrets
APP_PASSWORD=$APP_PASSWORD
JWT_SECRET=$JWT_SECRET

# Optional API Keys
# GEMINI_API_KEY=
# OPENCLAW_API_URL=http://100.88.15.95:3000
EOF

echo -e "${GREEN}✅ .env.local created successfully!${NC}"
echo ""
echo "📦 Next Steps:"
echo "1. Run 'npx supabase login' and link your project"
echo "2. Run the schema SQL in Supabase SQL Editor"
echo "3. Deploy with: vercel --prod"
echo ""
