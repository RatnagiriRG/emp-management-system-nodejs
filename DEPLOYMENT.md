# 🚀 Render Deployment Guide

This guide will help you deploy your Employee Management System API to Render's free tier.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be pushed to GitHub
2. **MongoDB Atlas Account** - For cloud database (free tier available)
3. **Render Account** - Sign up at [render.com](https://render.com)

## 🗄️ Step 1: Choose Your Database Option

### Option A: MongoDB Atlas (Has Free Tier Limitations)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up and create M0 cluster (512MB storage, limited)
3. Create database user and get connection string

### Option B: Railway PostgreSQL (Recommended - Generous Free Tier)
1. Sign up at [Railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Get connection string from Railway dashboard

### Option C: Supabase PostgreSQL (Good Alternative)
1. Sign up at [Supabase.com](https://supabase.com)
2. Create new project
3. Get PostgreSQL connection string

### Option D: Local MongoDB with Railway (Hybrid)
1. Keep your local MongoDB for development
2. Use Railway's MongoDB template for production

## 🚀 Recommended: MongoDB with Railway

## 📤 Step 2: Push Code to GitHub

1. Initialize git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Employee Management System API"
   ```

2. Create a new repository on GitHub named `employee-management-system-api`

3. Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/employee-management-system-api.git
   git branch -M main
   git push -u origin main
   ```

## 🌐 Step 3: Deploy on Render

### Create Web Service

1. **Login to Render** at [dashboard.render.com](https://dashboard.render.com)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your `employee-management-system-api` repository

3. **Configure Service Settings**:
   ```
   Name: employee-management-api
   Region: Oregon (US West) or closest to you
   Branch: main
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables**:
   Click "Advanced" and add these environment variables:

   ```env
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/employee_management
   JWT_SECRET=your-super-strong-random-secret-for-production-min-32-chars
   JWT_EXPIRE=24h
   REFRESH_TOKEN_EXPIRE=7d
   ALLOWED_ORIGINS=https://your-frontend-domain.com
   APP_NAME=Employee Management System
   API_VERSION=1.0.0
   ```

5. **Create Service** - Click "Create Web Service"

## ⚡ Step 4: Generate Strong JWT Secret

Use this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

## 🔧 Step 5: Configure After Deployment

Once deployed, your API will be available at: `https://your-service-name.onrender.com`

### Test Your Deployment

1. **Health Check**: 
   ```
   GET https://your-service-name.onrender.com/api/health
   ```

2. **API Info**: 
   ```
   GET https://your-service-name.onrender.com/api/
   ```

### Seed Initial Users (Important!)

After deployment, you need to create the initial admin users. You have two options:

#### Option A: Add Seed Script to Package.json
Update your `package.json` to include a remote seed command:
```json
{
  "scripts": {
    "seed-production": "node scripts/seedUsers.js"
  }
}
```

Then run it once via Render's console or add it to your build command.

#### Option B: Use Postman/API Client
1. Use the registration endpoint to create an admin user
2. Manually set the role to 'admin' in your MongoDB Atlas dashboard

## 🔒 Security Checklist

- [ ] Strong JWT secret (min 32 characters)
- [ ] MongoDB Atlas with proper authentication
- [ ] IP whitelist configured (0.0.0.0/0 for Render)
- [ ] CORS origins set to your actual frontend domains
- [ ] NODE_ENV set to 'production'
- [ ] No sensitive data in your GitHub repository

## 📊 Render Free Tier Limitations

- **750 hours/month** of runtime (about 31 days)
- **500MB RAM**
- **Sleep after 15 minutes** of inactivity (cold start ~30 seconds)
- **No custom domains** (upgrade required)
- **Limited build minutes**

## 🔄 Continuous Deployment

Render automatically deploys when you push to your main branch on GitHub.

## 🚨 Common Issues & Solutions

### Issue: Service fails to start
**Solution**: Check environment variables and MongoDB connection string

### Issue: Database connection fails
**Solution**: 
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Check username/password in connection string
3. Ensure database user has read/write permissions

### Issue: JWT authentication fails
**Solution**: Verify JWT_SECRET is set and matches between requests

### Issue: CORS errors
**Solution**: Update ALLOWED_ORIGINS with your frontend domain

## 📱 Testing Your Deployed API

### Using Postman
1. Import the provided Postman collection
2. Update the `baseUrl` variable to your Render URL
3. Test all endpoints

### Using curl
```bash
# Health check
curl https://your-service-name.onrender.com/api/health

# Register user
curl -X POST https://your-service-name.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","firstName":"Test","lastName":"User","role":"employee"}'
```

## 🎉 Success!

Your Employee Management System API is now deployed and accessible worldwide!

**Your API URL**: `https://your-service-name.onrender.com`
**API Documentation**: `https://your-service-name.onrender.com/api/`
**Health Check**: `https://your-service-name.onrender.com/api/health`

## 📈 Next Steps

1. **Frontend Deployment**: Deploy your frontend to Netlify/Vercel
2. **Custom Domain**: Upgrade Render plan for custom domain
3. **Monitoring**: Set up logging and monitoring
4. **CI/CD**: Add automated testing before deployment
5. **Documentation**: Host API documentation (Swagger/OpenAPI)

---

**Need Help?** Check Render's [documentation](https://render.com/docs) or their community forum.
