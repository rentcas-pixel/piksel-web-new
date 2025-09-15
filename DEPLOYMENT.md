# Hostex Deployment Guide

## Prerequisites
- Node.js 18+ installed on server
- Git access to repository
- Domain name configured
- SSL certificate (usually free with Hostex)

## Deployment Steps

### 1. Server Setup
```bash
# Connect to your Hostex server via SSH
ssh your-username@your-server-ip

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2
```

### 2. Clone Repository
```bash
# Navigate to your web directory
cd /var/www/html  # or your preferred directory

# Clone the repository
git clone https://github.com/your-username/piksel-website.git
cd piksel-website

# Install dependencies
npm install
```

### 3. Environment Configuration
```bash
# Copy environment file
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

### 4. Build and Start
```bash
# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

### 5. Nginx Configuration (if needed)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## Updates
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild
npm run build

# Restart PM2
pm2 restart piksel-website
```

## Troubleshooting
- Check PM2 logs: `pm2 logs piksel-website`
- Check if port 3000 is available: `netstat -tlnp | grep 3000`
- Verify environment variables: `pm2 env 0`

