# 🚀 Railway + Render Deployment Guide

Deploy your Employee Management System using Railway for database and Render for hosting.

## Why This Combo?
- **Railway**: Generous free tier for databases (MongoDB/PostgreSQL)
- **Render**: Great free tier for web services
- **Cost**: Completely free for small projects

---

## 🗄️ Step 1: Set up Database on Railway

### Option A: MongoDB on Railway (Recommended)
1. **Sign up at [Railway.app](https://railway.app)**
2. **Create New Project** → "Deploy from template"
3. **Search for "MongoDB"** → Select MongoDB template
4. **Deploy** - Railway will provision MongoDB instance
5. **Get Connection String**:
   - Go to your MongoDB service
   - Click "Connect" tab
   - Copy the connection string (looks like: `mongodb://mongo:password@server:port/railway`)

### Option B: PostgreSQL on Railway (Alternative)
1. **Create New Project** → "Provision PostgreSQL"
2. **Get Connection String** from the "Connect" tab
3. **Note**: You'll need to convert your MongoDB code to PostgreSQL

---

## 🌐 Step 2: Deploy API on Render

1. **Push Code to GitHub** (if not already done)
2. **Create Web Service on Render**:
   - Connect your GitHub repository
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set Environment Variables** on Render:
   ```env
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb://mongo:password@server:port/railway
   JWT_SECRET=your-64-character-secret
   ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

---

## 🔧 Environment Variables Template

### For Railway MongoDB:
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb://mongo:your-password@containers-us-west-xxx.railway.app:port/railway
JWT_SECRET=1c4be4d94f93b08c87d987eaa188e617e989a8ea3ce250eff94812423f1f9ad9c29daaad7fef4beb010ebd32e4adff53bc97c81b7909ef20ab2541ba4548cc5d
JWT_EXPIRE=24h
REFRESH_TOKEN_EXPIRE=7d
ALLOWED_ORIGINS=https://your-frontend.netlify.app
APP_NAME=Employee Management System
API_VERSION=1.0.0
```

---

## 💰 Free Tier Limits

### Railway Free Tier:
- **$5 credit per month** (usually covers database usage)
- **Automatic sleep** after period of inactivity
- **1GB disk space**
- **Shared CPU/RAM**

### Render Free Tier:
- **750 hours/month** runtime
- **500MB RAM**
- **Sleep after 15 minutes** inactivity
- **~30 second cold start**

---

## 📋 Quick Setup Commands

### 1. Test Railway MongoDB Connection
```bash
# Install MongoDB client (optional)
npm install -g mongodb-connection-string

# Test connection (replace with your Railway URL)
mongosh "mongodb://mongo:password@containers-us-west-xxx.railway.app:port/railway"
```

### 2. Test Your Deployed API
```bash
# Health check
curl https://your-render-app.onrender.com/api/health

# Register first admin
curl -X POST https://your-render-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@company.com",
    "password": "admin123", 
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

---

## 🔄 Alternative: All-in-One Railway Deployment

If you prefer everything on Railway:

1. **Deploy on Railway** instead of Render:
   - Push to GitHub
   - Connect to Railway
   - Railway auto-detects Node.js
   - Set environment variables
   - Deploy!

2. **Railway provides**:
   - Web service hosting
   - Database hosting
   - Custom domains (paid)
   - Better performance than Render free tier

---

## 🚨 Troubleshooting

### Railway Connection Issues:
```bash
# Check if Railway MongoDB is running
curl -v telnet://your-railway-mongo-url:port

# Check environment variables
echo $MONGODB_URI
```

### Render Deployment Issues:
- Check build logs in Render dashboard
- Verify environment variables are set
- Ensure MongoDB_URI is accessible from Render

---

## 🎯 Production Checklist

- [ ] Railway MongoDB instance created
- [ ] Connection string obtained from Railway
- [ ] Code pushed to GitHub
- [ ] Render web service created
- [ ] Environment variables set on Render
- [ ] Database connection tested
- [ ] API endpoints tested
- [ ] Admin user created

---

## 💡 Pro Tips

1. **Monitor Usage**: Both Railway and Render show usage in dashboards
2. **Backup Strategy**: Export your data regularly
3. **Scaling**: When you outgrow free tiers, both have reasonable paid plans
4. **Security**: Use strong passwords and rotate JWT secrets

Your API will be live at: `https://your-app-name.onrender.com` 🚀
