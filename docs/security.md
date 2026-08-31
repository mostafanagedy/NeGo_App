# NeGo Security & Authorization Guidelines

## Security Controls Implemented

1. **Helmet & Security Headers**: Helmet middleware is enabled to enforce HTTP headers (XSS Filter, HSTS, NoSniff, Hide Powered-By).
2. **CORS Controls**: Configured to restrict cross-origin request sources.
3. **Input Validation**: Centralized Joi schemas validate all request parameters and payloads to prevent injection attacks and invalid data shapes.
4. **Password Hashing**: User passwords are hashed with `bcryptjs` with salt rounds before database persistence. Passwords are never returned in JSON responses (`select("-password")`).
5. **JWT Authentication & Protection**: Protected endpoints verify JWT signature via `auth.middleware.js` and inject `req.user`.
6. **Owner-Only Authorization**: Resource update/delete operations explicitly verify user ownership (e.g. post owner, comment owner).
7. **Safe Media File Uploads**: Uploaded files use generated unique filenames (`Date.now()_random`) to prevent file overwrite or path traversal attacks.
