# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the Pomofocus Clone application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: For repository hosting
3. **MongoDB Atlas Account**: For cloud database
4. **Node.js**: For local development and testing

## Step 1: Database Setup (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider and region
4. Click "Create"

### 1.3 Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password (save these!)
4. Select "Read and write to any database"
5. Click "Add User"

### 1.4 Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `pomofocus`

Example connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/pomofocus?retryWrites=true&w=majority
```

## Step 2: Prepare Your Code

### 2.1 Push to GitHub
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/pomofocus-clone.git
git push -u origin main
```

### 2.2 Verify Project Structure
Ensure your project has these key files:
- `package.json` (root)
- `client/package.json`
- `server/index.js`
- `vercel.json`
- `.env.example`

## Step 3: Deploy to Vercel

### 3.1 Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

### 3.2 Configure Build Settings
Vercel should auto-detect the settings, but verify:

**Framework Preset**: Other
**Root Directory**: `./` (leave empty)
**Build Command**: `npm run build`
**Output Directory**: `client/build`
**Install Command**: `npm run install-all`

### 3.3 Set Environment Variables
Click "Environment Variables" and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pomofocus?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

**Important**: Replace the MongoDB URI with your actual connection string!

### 3.4 Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at the provided URL

## Step 4: Post-Deployment Configuration

### 4.1 Test Your Application
1. Visit your deployed URL
2. Test user registration and login
3. Test timer functionality
4. Test task creation
5. Test settings configuration

### 4.2 Set Up Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

### 4.3 Monitor Performance
1. Check Vercel Analytics
2. Monitor function execution times
3. Check for any errors in the logs

## Step 5: Troubleshooting

### Common Issues

#### 1. Build Failures
**Problem**: Build fails during deployment
**Solution**:
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs for specific errors

#### 2. Database Connection Issues
**Problem**: Can't connect to MongoDB
**Solution**:
- Verify MongoDB Atlas network access settings
- Check connection string format
- Ensure database user has correct permissions

#### 3. API Routes Not Working
**Problem**: Frontend can't reach backend API
**Solution**:
- Verify `vercel.json` configuration
- Check that API routes are properly prefixed with `/api`
- Ensure server is listening on correct port

#### 4. Environment Variables Not Loading
**Problem**: App can't access environment variables
**Solution**:
- Verify environment variables are set in Vercel dashboard
- Check that variable names match your code
- Redeploy after adding environment variables

### Debugging Steps

1. **Check Vercel Logs**
   - Go to your project in Vercel dashboard
   - Click "Functions" tab
   - Check for any error messages

2. **Test Locally with Production Build**
   ```bash
   npm run build
   npm start
   ```

3. **Verify Database Connection**
   - Test MongoDB connection string locally
   - Check MongoDB Atlas logs

4. **Check API Endpoints**
   - Test API endpoints with Postman
   - Verify CORS settings

## Step 6: Production Optimization

### 6.1 Performance Optimization
1. **Enable Caching**
   - Add appropriate cache headers
   - Use CDN for static assets

2. **Database Optimization**
   - Add database indexes
   - Optimize queries
   - Monitor database performance

3. **Security Hardening**
   - Use strong JWT secrets
   - Enable HTTPS
   - Implement rate limiting

### 6.2 Monitoring and Analytics
1. **Set up monitoring**
   - Use Vercel Analytics
   - Monitor error rates
   - Track performance metrics

2. **Set up alerts**
   - Monitor uptime
   - Alert on errors
   - Track user engagement

## Step 7: Maintenance

### 7.1 Regular Updates
1. **Keep dependencies updated**
   ```bash
   npm audit fix
   npm update
   ```

2. **Monitor security**
   - Check for security vulnerabilities
   - Update dependencies regularly

3. **Backup strategy**
   - Regular database backups
   - Version control for code
   - Environment variable backups

### 7.2 Scaling Considerations
1. **Database scaling**
   - Monitor MongoDB Atlas usage
   - Upgrade cluster size if needed

2. **Application scaling**
   - Vercel automatically scales
   - Monitor function execution limits

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | Yes | `your-secret-key` |
| `NODE_ENV` | Environment mode | No | `production` |
| `PORT` | Server port | No | `5000` |

## Support

If you encounter issues:

1. **Check Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **MongoDB Atlas Support**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
3. **Create Issues**: Use GitHub issues for code-related problems
4. **Community Support**: Stack Overflow, Reddit, etc.

## Next Steps

After successful deployment:

1. **Set up monitoring and alerts**
2. **Configure custom domain**
3. **Set up CI/CD pipeline**
4. **Implement advanced features**
5. **Optimize for performance**

Your Pomofocus Clone is now live and ready for users! 🎉 