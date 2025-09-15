#!/bin/bash

# Piksel.lt Next.js Deployment Script for Hostex
# This script will deploy the Next.js application to replace WordPress

echo "🚀 Starting Piksel.lt deployment to Hostex..."

# Configuration
DOMAIN="piksel.lt"
BACKUP_DIR="/var/www/vhosts/piksel.lt/backups"
HTTPDOCS_DIR="/var/www/vhosts/piksel.lt/httpdocs"
APP_DIR="/var/www/vhosts/piksel.lt/nextjs-app"

# Create backup of current WordPress site
echo "📦 Creating backup of current WordPress site..."
mkdir -p $BACKUP_DIR
cd $HTTPDOCS_DIR
tar -czf $BACKUP_DIR/wordpress-backup-$(date +%Y%m%d-%H%M%S).tar.gz .

# Create Next.js app directory
echo "📁 Creating Next.js app directory..."
mkdir -p $APP_DIR
cd $APP_DIR

# Clone or upload the Next.js project
echo "📥 Setting up Next.js project..."
# Option 1: If you have Git repository
# git clone https://github.com/your-username/piksel-website.git .

# Option 2: Upload files via FTP/SFTP to this directory
# Then run:
npm install
npm run build

# Create .env.local file
echo "⚙️ Creating environment configuration..."
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://eknndiyjolypgxkwtvxn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbm5kaXlqb2x5cGd4a3d0dnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTg0MzIsImV4cCI6MjA3MzA3NDQzMn0.BYGZRH9kk2mSqpLMwb67_W9YDoweA6sAQhebYkquQBw
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://piksel.lt
EOF

# Install PM2 if not already installed
echo "🔧 Installing PM2..."
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'piksel-website',
      script: 'npm',
      args: 'start',
      cwd: '$APP_DIR',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
EOF

# Start the application
echo "🚀 Starting Next.js application..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Next.js application deployed successfully!"
echo "🌐 Your site should be available at: https://piksel.lt"
echo "📊 Monitor with: pm2 logs piksel-website"
echo "🔄 Restart with: pm2 restart piksel-website"

