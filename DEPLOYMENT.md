# CampusBuddy Deployment Guide for Render

## Overview
This guide will help you deploy CampusBuddy on Render.com. You'll need to deploy both the backend API and frontend separately.

## Prerequisites
1. GitHub repository with your code
2. MongoDB Atlas database (or any MongoDB instance)
3. Render.com account

## Step 1: Prepare Your Repository

### 1.1 Fix Package.json
Make sure your `package.json` doesn't have merge conflicts or duplicate entries.

### 1.2 Environment Variables
Create environment variables for your backend:

**Required Environment Variables for Backend:**
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string for JWT tokens
- `NODE_ENV` - Set to "production"
- `PORT` - Set to 5001 (or let Render set it automatically)

## Step 2: Deploy Backend API

### 2.1 Create Backend Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Service Configuration:**
- **Name**: `campusbuddy-backend`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Plan**: Free (or choose paid plan)

### 2.2 Set Environment Variables
In the Render dashboard, go to your backend service → Environment → Add Environment Variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusbuddy
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
PORT=5001
```

### 2.3 Deploy Backend
1. Click "Create Web Service"
2. Wait for the build to complete
3. Note your backend URL (e.g., `https://campusbuddy-backend.onrender.com`)

## Step 3: Deploy Frontend

### 3.1 Create Frontend Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure the service:

**Service Configuration:**
- **Name**: `campusbuddy-frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Plan**: Free (or choose paid plan)

### 3.2 Set Environment Variables
Add this environment variable to your frontend service:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

Replace `your-backend-url` with your actual backend service URL.

### 3.3 Deploy Frontend
1. Click "Create Static Site"
2. Wait for the build to complete
3. Your frontend will be available at the provided URL

## Step 4: Update API Calls (If Needed)

If you haven't already updated your frontend to use environment variables, you'll need to update the API calls. The project should already be configured to use `VITE_API_URL`.

## Step 5: Test Your Deployment

### 5.1 Test Backend Health
Visit: `https://your-backend-url.onrender.com/health`

You should see:
```json
{
  "status": "OK",
  "timestamp": "2025-01-25T...",
  "mongodb": "connected"
}
```

### 5.2 Test Frontend
Visit your frontend URL and test:
- User registration/login
- Browse materials
- Create questions/answers
- Marketplace functionality

## Troubleshooting

### Common Issues

#### 1. Build Failures
**Error**: `Cannot find module @rollup/rollup-linux-x64-gnu`
**Solution**: 
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Commit and push changes

#### 2. CORS Errors
**Error**: CORS policy blocking requests
**Solution**: 
- Check that your backend CORS configuration includes your frontend URL
- Verify environment variables are set correctly

#### 3. MongoDB Connection Issues
**Error**: Cannot connect to MongoDB
**Solution**:
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access settings
- Ensure IP whitelist includes Render's IPs

#### 4. Environment Variables Not Working
**Error**: API calls still going to localhost
**Solution**:
- Verify `VITE_API_URL` is set correctly
- Rebuild the frontend after changing environment variables
- Check that the environment variable is prefixed with `VITE_`

### Debugging Steps

1. **Check Build Logs**: Look at the build logs in Render dashboard
2. **Check Runtime Logs**: Monitor the runtime logs for errors
3. **Test API Endpoints**: Use tools like Postman to test your backend directly
4. **Check Environment Variables**: Verify all environment variables are set correctly

## Environment Variables Reference

### Backend Environment Variables
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusbuddy
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
PORT=5001
```

### Frontend Environment Variables
```bash
VITE_API_URL=https://your-backend-url.onrender.com
```

## Security Considerations

1. **JWT Secret**: Use a strong, random string for JWT_SECRET
2. **MongoDB**: Use MongoDB Atlas with proper authentication
3. **CORS**: Configure CORS to only allow your frontend domain
4. **Environment Variables**: Never commit sensitive data to your repository

## Monitoring

1. **Health Checks**: Monitor the `/health` endpoint
2. **Logs**: Check Render logs regularly
3. **Performance**: Monitor response times and error rates
4. **Database**: Monitor MongoDB connection and performance

## Scaling

When you need to scale:
1. **Upgrade Plans**: Consider upgrading from free to paid plans
2. **Database**: Consider MongoDB Atlas M10+ for better performance
3. **CDN**: Use Cloudflare or similar for static assets
4. **Load Balancing**: Consider multiple backend instances

## Support

If you encounter issues:
1. Check Render's documentation: https://render.com/docs
2. Review the troubleshooting section above
3. Check the application logs in Render dashboard
4. Verify all environment variables are set correctly

---

*Last Updated: January 2025*
*CampusBuddy Deployment Guide v1.0* 