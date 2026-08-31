# NeGo Deployment Guide

## Prerequisites
- Node.js v18+
- MongoDB 6.0+
- Redis (optional in current phase, required for future caching/presence)

## Environment Configuration (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/NeGoDB
JWT_SECRET=your_production_jwt_secret_key_here
NODE_ENV=production
```

## Running the Server
```bash
cd backend
npm install
npm start
```
