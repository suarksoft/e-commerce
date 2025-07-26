# Admin Panel Deployment Guide

## 🎯 Admin Panelini Vercel'de Deploy Etme

### 1. Vercel'de Yeni Proje Oluştur

1. **Vercel Dashboard'a git**: https://vercel.com/dashboard
2. **"New Project"** butonuna tık
3. **GitHub repository'ni seç**: `suarksoft/e-commerce`
4. **Root Directory**: `my-medusa-store` olarak ayarla

### 2. Build Ayarları

**Build Settings:**
- **Framework Preset**: Other
- **Build Command**: `npm run build:admin`
- **Output Directory**: `.medusa/admin`
- **Install Command**: `npm install`

### 3. Environment Variables

**Vercel'de şu environment variables'ları ekle:**

```
MEDUSA_BACKEND_URL=https://your-backend-url.onrender.com
NODE_ENV=production
ADMIN_CORS=https://your-admin-domain.vercel.app
STORE_CORS=https://your-frontend-domain.vercel.app
```

### 4. Deploy Et

1. **"Deploy"** butonuna tık
2. **Build işlemini bekle** (5-10 dakika)
3. **Admin paneli hazır!** 🎉

### 5. Admin Panel URL'i

Admin paneli şu adreste olacak:
```
https://your-admin-domain.vercel.app/app
```

### 6. Backend CORS Güncellemesi

Render'da backend environment variables'ları güncelle:

```
ADMIN_CORS=https://your-admin-domain.vercel.app
```

## 🔧 Alternatif: Railway'de Admin Panel

Eğer Vercel'de sorun yaşarsan:

1. **Railway'de yeni service oluştur**
2. **Aynı repository'yi kullan**
3. **Root Directory**: `my-medusa-store`
4. **Build Command**: `npm run build:admin`
5. **Start Command**: `npx serve .medusa/admin -s -l 3000`

## 🎯 Sonraki Adımlar

1. **Admin paneli deploy et**
2. **Backend CORS ayarlarını güncelle**
3. **Admin panelinde test et**
4. **Ürün ekle, sipariş yönet vs.**

## 📝 Notlar

- Admin paneli ayrı deploy edildiği için memory sorunu olmayacak
- Backend API'leri admin panelinden kullanılacak
- CORS ayarları önemli - doğru URL'leri kullan 