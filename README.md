# NeGo App 🚀

> A full-stack social platform built with **Next.js, React, TypeScript, Node.js, Express, MongoDB, and Socket.IO**.

<p align="center">
  <a href="https://github.com/mostafanagedy/NeGo_App">
    <img src="https://img.shields.io/github/stars/mostafanagedy/NeGo_App?style=for-the-badge" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/mostafanagedy/NeGo_App/issues">
    <img src="https://img.shields.io/github/issues/mostafanagedy/NeGo_App?style=for-the-badge" alt="GitHub Issues" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

---

## 📖 Overview

**NeGo App** is a full-stack social platform designed around modern social-network functionality and real-time user interactions.

The application follows a clear client/server architecture: the frontend is built with **Next.js and React using TypeScript**, while the backend exposes a RESTful API using **Node.js and Express** with **MongoDB/Mongoose** for data persistence. **Socket.IO** is used to support authenticated real-time communication and conversation-based messaging.

The backend is organized into controllers, routes, models, middleware, and configuration layers, making the codebase easier to maintain, test, and extend.

---

## ✨ Core Features

### 🔐 Authentication & Security

- User registration and authentication.
- JWT-based authentication.
- Password hashing with bcrypt.
- Protected API routes through authentication middleware.
- Request validation using Joi and Express Validator.
- Security headers with Helmet.
- CORS configuration.
- Centralized error handling.
- Secure authenticated Socket.IO connections.

### 👤 User & Social Features

- User profiles.
- Profile picture uploads.
- Follow / unfollow functionality.
- User-related interactions and relationships.
- Saved posts.
- Reactions and engagement.

### 📝 Posts & Feed

- Create and manage posts.
- Post reactions.
- Comments and comment management.
- Feed endpoints for retrieving social content.
- Saved-post functionality.

### 💬 Real-Time Chat

- Real-time communication using Socket.IO.
- Authenticated WebSocket connections using JWT.
- Personal user rooms for direct notifications.
- Conversation rooms.
- Join / leave conversation events.
- Persistent conversations and messages using MongoDB.

### 👥 Groups & Events

- Group management functionality.
- Group-related interactions.
- Event management functionality.
- Dedicated backend routes, controllers, and data models.

### 🛒 Marketplace

- Marketplace module with dedicated API routes.
- Listing management.
- Marketplace data models and controllers.

### 📤 File Uploads

- User/media upload support using Multer.
- Static serving of uploaded assets through the backend `/uploads` endpoint.

---

## 🏗️ Architecture

NeGo follows a modular **full-stack client/server architecture**:

```text
┌─────────────────────────────────────────────────────────────┐
│                         NeGo App                             │
├──────────────────────────────┬──────────────────────────────┤
│          Frontend             │           Backend            │
│                              │                              │
│  Next.js + React             │  Node.js + Express           │
│  TypeScript                  │  REST API                    │
│  Tailwind CSS                │  JWT Authentication          │
│  Socket.IO Client             │  Socket.IO Server            │
│                              │  Validation & Security        │
└───────────────┬──────────────┴──────────────┬───────────────┘
                │                             │
                │        HTTP / WebSocket     │
                └──────────────┬──────────────┘
                               │
                        ┌──────▼──────┐
                        │   MongoDB   │
                        │  Mongoose   │
                        └─────────────┘
```

### Backend Request Flow

```text
Client
  ↓
Express Router
  ↓
Authentication / Validation Middleware
  ↓
Controller
  ↓
Mongoose Model
  ↓
MongoDB
  ↓
JSON Response
```

### Real-Time Flow

```text
Client
  ↓
Socket.IO Client
  ↓
JWT Authentication
  ↓
Socket.IO Server
  ↓
User / Conversation Room
  ↓
Real-Time Event
```

---

## 🛠️ Technology Stack

### Frontend

- **Next.js 16** — React framework and application routing.
- **React 19** — UI development.
- **TypeScript 5** — Static typing and maintainability.
- **Tailwind CSS 4** — Utility-first styling.
- **Socket.IO Client** — Real-time communication.
- **Lucide React** — Icon system.
- **ESLint** — Code quality and linting.

### Backend

- **Node.js** — JavaScript runtime.
- **Express 5** — REST API framework.
- **MongoDB** — NoSQL database.
- **Mongoose** — MongoDB ODM.
- **Socket.IO** — Real-time bidirectional communication.
- **JWT** — Authentication tokens.
- **bcrypt / bcryptjs** — Password hashing.
- **Joi / Express Validator** — Request validation.
- **Multer** — File uploads.
- **Helmet** — HTTP security headers.
- **Morgan** — HTTP request logging.
- **CORS** — Cross-origin resource configuration.
- **Jest / Supertest** — Backend testing.

---

## 📁 Project Structure

```text
NeGo_App/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── multer.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── chat.controller.js
│   │   │   ├── comment.controller.js
│   │   │   ├── events.controller.js
│   │   │   ├── feed.controller.js
│   │   │   ├── groups.controller.js
│   │   │   ├── marketplace.controller.js
│   │   │   ├── post.controller.js
│   │   │   └── user.controller.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   ├── Post.model.js
│   │   │   ├── Comment.model.js
│   │   │   ├── Reaction.model.js
│   │   │   ├── SavedPost.model.js
│   │   │   ├── Conversation.model.js
│   │   │   ├── Message.model.js
│   │   │   ├── Group.model.js
│   │   │   ├── Event.model.js
│   │   │   └── Listing.model.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── post.routes.js
│   │   │   ├── comment.routes.js
│   │   │   ├── feed.routes.js
│   │   │   ├── chat.routes.js
│   │   │   ├── marketplace.routes.js
│   │   │   ├── groups.routes.js
│   │   │   └── events.routes.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── postman_collection.json
│   ├── seed-users.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── eslint.config.mjs
│   └── package.json
│
├── docs/
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB](https://www.mongodb.com/) — local MongoDB instance or MongoDB Atlas
- Git

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mostafanagedy/NeGo_App.git
cd NeGo_App
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
```

> **Important:** Never commit real credentials, database connection strings, JWT secrets, or other sensitive environment variables to GitHub.

---

## ▶️ Running the Application

The frontend and backend run as separate development processes.

### Start the Backend

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

The API is versioned under:

```text
/api/v1
```

Available API modules include:

```text
/api/v1/auth
/api/v1/users
/api/v1/posts
/api/v1/comments
/api/v1/feed
/api/v1/chat
/api/v1/marketplace
/api/v1/groups
/api/v1/events
```

### Start the Frontend

Open a second terminal:

```bash
cd frontend
npm run dev
```

The Next.js development server will provide the local frontend URL in the terminal.

---

## 🧪 Testing

The backend includes Jest and Supertest for automated API testing.

Run the backend test suite with:

```bash
cd backend
npm test
```

---

## 📮 API Testing with Postman

A Postman collection is included in the backend directory:

```text
backend/postman_collection.json
```

You can import this collection into Postman to test the available API endpoints.

---

## 🔒 Security Considerations

The backend includes several security-oriented mechanisms:

- JWT authentication for protected resources.
- Password hashing using bcrypt.
- Helmet security headers.
- CORS middleware.
- Request validation with Joi and Express Validator.
- Centralized error handling.
- Authenticated Socket.IO handshake using JWT.
- Environment-based configuration for secrets and database credentials.

For production deployment, review CORS origins, cookie/token strategy, rate limiting, upload restrictions, logging, and secret management before exposing the application publicly.

---

## 📌 API Design

The backend uses a versioned REST API structure:

```text
/api/v1/<resource>
```

### Main Resources

| Resource | Purpose |
|---|---|
| `/auth` | Registration and authentication |
| `/users` | User profiles and social relationships |
| `/posts` | Post management and interactions |
| `/comments` | Comment management |
| `/feed` | Social feed operations |
| `/chat` | Conversations and messaging |
| `/marketplace` | Marketplace listings |
| `/groups` | Group functionality |
| `/events` | Event functionality |

---

## 🔄 Development Workflow

A typical development workflow for NeGo is:

```text
Feature Request
      ↓
Backend Route
      ↓
Validation Middleware
      ↓
Controller
      ↓
Mongoose Model
      ↓
API Response
      ↓
Frontend Integration
      ↓
Socket.IO Events (when real-time behavior is required)
      ↓
Testing
```

---

## 🗺️ Roadmap

Potential improvements for future iterations include:

- [ ] Production deployment for frontend and backend.
- [ ] Production-grade CORS configuration.
- [ ] Rate limiting and abuse protection.
- [ ] Refresh-token/session strategy.
- [ ] More comprehensive automated test coverage.
- [ ] API documentation with OpenAPI/Swagger.
- [ ] Improved real-time notification system.
- [ ] Advanced search and filtering.
- [ ] Image optimization and cloud storage integration.
- [ ] CI/CD pipeline.
- [ ] Monitoring and observability.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

### Contribution Workflow

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Run the available tests and linting checks.
5. Commit your changes:

```bash
git commit -m "feat: add your feature"
```

6. Push your branch:

```bash
git push origin feature/your-feature
```

7. Open a Pull Request.

---

## 📄 License

This project currently uses the license configuration defined in the backend package metadata. If this repository is intended for public reuse, consider adding a dedicated `LICENSE` file with the exact terms you want to apply.

---

## 👨‍💻 Author

**Mostafa Nagedy**

Full Stack Developer focused on building scalable web applications, RESTful APIs, real-time systems, and modern frontend experiences.

- 💻 GitHub: [@mostafanagedy](https://github.com/mostafanagedy)
- 💼 LinkedIn: [Mostafa Nagedy](https://www.linkedin.com/in/mostafa-nagdey/)
- 🌐 Portfolio: [Portfolio](https://portoflio-lime.vercel.app/)

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

**Built with ❤️ using modern full-stack technologies.**
