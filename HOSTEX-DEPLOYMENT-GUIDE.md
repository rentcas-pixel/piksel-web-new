# 🚀 HOSTEX DEPLOYMENT - DETALI INSTRUKCIJA

## ✅ PARUOŠTA
- ✅ Production build sukurtas
- ✅ Deployment package: `piksel-website-deployment-20250916-180207.tar.gz` (24.4 MB)
- ✅ Ecosystem.config.js atnaujintas
- ✅ Deployment skriptai paruošti

## 📋 REIKALAVIMAI HOSTEX SERVERYJE
```bash
# Node.js 18+ versija
node --version  # turėtų rodyti v18+ arba v20+

# NPM
npm --version

# PM2 (process manager)
npm install -g pm2
```

## 🔧 ŽINGSNIS PO ŽINGSNIO

### 1️⃣ PRISIJUNGTI PRIE HOSTEX SERVERIO
```bash
ssh username@your-hostex-server-ip
```

### 2️⃣ SUKURTI PROJEKTO KATALOGĄ
```bash
# Eiti į web katalogą
cd /var/www/vhosts/piksel.lt/

# Sukurti Next.js app katalogą
mkdir -p nextjs-app
cd nextjs-app
```

### 3️⃣ PERKELTI FAILUS
**Variantas A: SCP (iš macOS)**
```bash
# Iš savo kompiuterio
scp /Users/renatasparojus/web-web/piksel-website-deployment-20250916-180207.tar.gz username@server-ip:/var/www/vhosts/piksel.lt/nextjs-app/

# Serverio pusėje
cd /var/www/vhosts/piksel.lt/nextjs-app/
tar -xzf piksel-website-deployment-20250916-180207.tar.gz --strip-components=1
```

**Variantas B: FTP/SFTP**
- Prisijungti prie serverio per FileZilla arba kitą FTP klientą
- Perkelti `piksel-website-deployment-20250916-180207.tar.gz` į `/var/www/vhosts/piksel.lt/nextjs-app/`
- Serverio pusėje išpakuoti: `tar -xzf piksel-website-deployment-20250916-180207.tar.gz --strip-components=1`

### 4️⃣ ĮDIEGTI DEPENDENCIES
```bash
cd /var/www/vhosts/piksel.lt/nextjs-app/
npm install
```

### 5️⃣ SUKURTI ENVIRONMENT FAILĄ
```bash
nano .env.local
```

**Įdėti šį turinį:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://eknndiyjolypgxkwtvxn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbm5kaXlqb2x5cGd4a3d0dnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTg0MzIsImV4cCI6MjA3MzA3NDQzMn0.BYGZRH9kk2mSqpLMwb67_W9YDoweA6sAQhebYkquQBw
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://piksel.lt
```

**Išsaugoti:** `Ctrl+X`, tada `Y`, tada `Enter`

### 6️⃣ SUKURTI PRODUCTION BUILD
```bash
npm run build
```

### 7️⃣ PALEISTI SU PM2
```bash
# Paleisti aplikaciją
pm2 start ecosystem.config.js

# Išsaugoti PM2 konfigūraciją
pm2 save

# Nustatyti automatinį paleidimą
pm2 startup
```

### 8️⃣ PATIKRINTI, KAD VEIKIA
```bash
# Patikrinti PM2 procesus
pm2 list

# Patikrinti logus
pm2 logs piksel-website

# Patikrinti, ar portas 3000 atidarytas
netstat -tlnp | grep 3000
```

### 9️⃣ NGINX KONFIGŪRACIJA (jei reikia)
```bash
# Sukurti nginx konfigūraciją
sudo nano /etc/nginx/sites-available/piksel.lt
```

**Įdėti šį turinį:**
```nginx
server {
    listen 80;
    server_name piksel.lt www.piksel.lt;
    
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

**Aktyvuoti:**
```bash
sudo ln -s /etc/nginx/sites-available/piksel.lt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 🔟 SSL CERTIFICATE
```bash
# Įdiegti Certbot
sudo apt install certbot python3-certbot-nginx

# Gauti SSL sertifikatą
sudo certbot --nginx -d piksel.lt -d www.piksel.lt
```

## 🔄 ATNAUJINIMAI
```bash
# Eiti į projekto katalogą
cd /var/www/vhosts/piksel.lt/nextjs-app/

# Perkelti naują versiją (jei reikia)
# ... perkelti failus ...

# Įdiegti naujas dependencies
npm install

# Sukurti naują build
npm run build

# Perkrauti PM2
pm2 restart piksel-website
```

## 🐛 TROUBLESHOOTING

### Problema: Port 3000 užimtas
```bash
# Rasti procesą, kuris naudoja portą 3000
sudo lsof -i :3000

# Užbaigti procesą
sudo kill -9 PID_NUMBER
```

### Problema: PM2 neveikia
```bash
# Perkrauti PM2
pm2 kill
pm2 start ecosystem.config.js
pm2 save
```

### Problema: Build neveikia
```bash
# Ištrinti node_modules ir package-lock.json
rm -rf node_modules package-lock.json

# Įdiegti iš naujo
npm install
npm run build
```

### Problema: Nginx klaidos
```bash
# Patikrinti nginx konfigūraciją
sudo nginx -t

# Perkrauti nginx
sudo systemctl reload nginx

# Patikrinti nginx logus
sudo tail -f /var/log/nginx/error.log
```

## 📊 MONITORING
```bash
# PM2 status
pm2 list

# PM2 logai
pm2 logs piksel-website

# PM2 monitoring
pm2 monit

# Serverio resursai
htop
```

## 🌐 REZULTATAS
Po sėkmingo deployment'o jūsų svetainė bus prieinama:
- **HTTP:** http://piksel.lt
- **HTTPS:** https://piksel.lt (po SSL sertifikato)

## 📞 PAGALBA
Jei kiltų problemų:
1. Patikrinkite PM2 logus: `pm2 logs piksel-website`
2. Patikrinkite nginx logus: `sudo tail -f /var/log/nginx/error.log`
3. Patikrinkite, ar portas 3000 atidarytas: `netstat -tlnp | grep 3000`

---
**Deployment package:** `piksel-website-deployment-20250916-180207.tar.gz`  
**Sukurta:** 2025-09-16 18:02:07  
**Dydis:** 24.4 MB

