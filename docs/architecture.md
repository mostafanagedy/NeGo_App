# NeGo Architecture Overview

NeGo is a modern, scalable social media platform designed following clean layered architecture principles.

## Layered Architecture

```
Client Request
      │
      ▼
┌──────────────┐
│ Express Router│  routes/*.routes.js
└──────┬───────┘
      │
      ▼
┌──────────────┐
│ Middleware   │  auth.middleware.js, validate.middleware.js, error.middleware.js
└──────┬───────┘
      │
      ▼
┌──────────────┐
│ Controllers  │  controllers/*.controller.js (Thin layer - HTTP handling)
└──────┬───────┘
      │
      ▼
┌──────────────┐
│ Services     │  services/*.service.js (Business logic & data orchestration)
└──────┬───────┘
      │
      ▼
┌──────────────┐
│ Database     │  models/*.model.js (Mongoose Schemas & MongoDB)
└──────────────┘
```

## Core Modules & Data Pipelines

### Public Pipeline
Handles public interactions including authentication, profiles, user relationships, posts, media, comments, reactions, saved posts, sharing, and feed generation.

### Future Realtime & E2EE Pipeline
- **Socket.io**: Real-time events, typing indicators, notifications, message delivery.
- **WebCrypto API (E2EE)**: Private client-side AES-GCM encrypted messaging where server stores ciphertext only.
- **Redis Cache**: Feed caching, online presence, and rate limiting.
