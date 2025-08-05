# � Deploy to Render with PostgreSQL (FREE)

**Simple, single-platform deployment using Render's free PostgreSQL database.**

## Why Render PostgreSQL?
- ✅ **All-in-one platform** - database + API hosting
- ✅ **FREE PostgreSQL** for 90 days (then $7/month)
- ✅ **FREE web service** (750 hours/month)
- ✅ **No setup complexity** - just deploy!
- ✅ **Auto SSL, monitoring, backups**

---

## � Quick Deploy (10 Minutes Total)

### Step 1: Create PostgreSQL Database (3 minutes)
1. **Go to [Render Dashboard](https://dashboard.render.com)** → Sign up/Login
2. **Click "New +"** → **"PostgreSQL"**
3. **Settings**:
   - Name: `employee-db`
   - Database: `employee_management` 
   - User: `admin`
   - Plan: **Free** (90 days free)
4. **Create Database** → **Copy Internal Database URL**

### Step 2: Deploy API (5 minutes)
1. **Click "New +"** → **"Web Service"**
2. **Connect your GitHub repo**: `emp-management-system-nodejs`
3. **Settings**:
   - Name: `employee-api`
   - Build Command: `npm install`
   - Start Command: `npm start`

### Step 3: Set Environment Variables (2 minutes)
**Paste these in Render environment variables:**
```env
NODE_ENV=production
PORT=10000
DB_TYPE=postgres
DATABASE_URL=postgresql://admin:password@dpg-xxx.render.com/employee_management
JWT_SECRET=1c4be4d94f93b08c87d987eaa188e617e989a8ea3ce250eff94812423f1f9ad9c29daaad7fef4beb010ebd32e4adff53bc97c81b7909ef20ab2541ba4548cc5d
JWT_EXPIRE=24h
REFRESH_TOKEN_EXPIRE=7d
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

**🎯 Done! Your API is live at: `https://employee-api.onrender.com`**

---

## 🧪 Test Your Deployment

```bash
# Health check
curl https://employee-api.onrender.com/api/health

# Create admin user
curl -X POST https://employee-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@company.com",
    "password": "admin123",
    "firstName": "System",
    "lastName": "Administrator", 
    "role": "admin"
  }'

# Test login
curl -X POST https://employee-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

---

## 💰 Cost
- **FREE for 90 days** (database + web service)
- **After 90 days**: $7/month for database, web service stays FREE
- **Total**: $7/month maximum

---

## 🚨 Important Notes
1. **DATABASE_URL**: Use the **Internal Database URL** from Render
2. **DB_TYPE=postgres**: This switches your app from MongoDB to PostgreSQL
3. **Auto-created tables**: Employee and User tables created automatically
4. **Sleep behavior**: Web service sleeps after 15min, database never sleeps

---

## 📋 Deployment Checklist
- [ ] PostgreSQL database created on Render
- [ ] Database Internal URL copied
- [ ] Web service created and connected to GitHub
- [ ] Environment variables set (especially `DB_TYPE=postgres`)
- [ ] Service deployed successfully
- [ ] Health endpoint working
- [ ] Admin user created
- [ ] API endpoints tested

**🎉 Your Employee Management System is now live on Render!**
