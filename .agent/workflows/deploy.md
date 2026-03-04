---
description: How to deploy the MERN application (Frontend & Backend)
---

# Deployment Workflow

This guide covers the steps to deploy the SkillConnect platform to a production environment (e.g., Vercel for Frontend, Render/Heroku for Backend).

## 1. Prepare Environment Variables
Ensure you have the following variables ready for your hosting provider:

### Backend (.env)
- `MONGODB_URI`: Your production MongoDB connection string (e.g., MongoDB Atlas)
- `JWT_SECRET`: A secure, random string for authentication
- `PORT`: Usually provided by the host (default: 5000)
- `NODE_ENV`: Set to `production`

### Frontend (.env)
- `VITE_API_URL`: The full URL of your deployed backend API

## 2. Backend Deployment (e.g., Render/Railway)
1. **Connect Repository**: Link your GitHub/GitLab repo.
2. **Build Command**: `npm install`
3. **Start Command**: `node backend/server.js` (or `npm start` if defined)
4. **Environment Variables**: Add the variables from Step 1.

## 3. Frontend Deployment (e.g., Vercel/Netlify)
1. **Connect Repository**: Link the repo.
2. **Build Command**: `npm run build` (Run from the `frontend` directory)
3. **Output Directory**: `dist`
4. **Environment Variables**: Add `VITE_API_URL`.

## 4. Database Setup
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Whitelist the IP addresses of your hosting providers.
3. Copy the connection string to your backend's `MONGODB_URI`.

## 5. Verification
- Visit the frontend URL.
- Test login/register to ensure the API connection is working.
- Check backend logs for any connection errors.
