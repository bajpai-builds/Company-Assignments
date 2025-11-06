# Product Management Web App

A full-stack web application for managing products with user authentication.

## Features

- User Authentication (JWT-based)
- Product CRUD Operations
- Product Filtering & Search
- Protected Routes
- Modern UI with React
- TypeScript Support

## Tech Stack

### Backend

- NestJS (TypeScript)
- MongoDB
- TypeORM
- JWT Authentication

### Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios

## Project Structure

```
product-management/
├── backend/           # NestJS backend
└── frontend/         # React frontend
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory
2. Install dependencies: `npm install`
3. Create a `.env` file with required environment variables
4. Run the development server: `npm run start:dev`

### Frontend Setup

1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Create a `.env` file with required environment variables
4. Run the development server: `npm start`

## Environment Variables

### Backend (.env)

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/product-management
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1h
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:3000
```
