# NeGo API Reference

Base URL: `http://localhost:5000/api/v1`

## 1. Authentication
- `POST /auth/register` - Register a new user account.
- `POST /auth/login` - Authenticate user & receive JWT token.
- `GET /auth/me` - Get current authenticated user profile.

## 2. User System & Social Graph
- `GET /users/profile/:username` - Get public profile by username.
- `PUT /users/profile` - Update profile details.
- `PUT /users/profile-picture` - Upload profile picture (multipart/form-data `profilePicture`).
- `PUT /users/cover-picture` - Upload cover picture (multipart/form-data `coverPicture`).
- `GET /users/search?q=` - Search users by username, firstName, or lastName.
- `PUT /users/follow/:userId` - Follow a user.
- `PUT /users/unfollow/:userId` - Unfollow a user.
- `GET /users/:username/followers` - Get followers list.
- `GET /users/:username/following` - Get following list.
- `GET /users/saved-posts` - Get authenticated user's saved posts.

## 3. Posts
- `POST /posts` - Create post (supports optional `content`, `image` file, `visibility`).
- `GET /posts/:postId` - Get single post by ID.
- `GET /posts/user/:username` - Get posts by a specific user.
- `PUT /posts/:postId` - Update post content/visibility (owner only).
- `DELETE /posts/:postId` - Delete post (owner only).
- `POST /posts/:postId/share` - Share a post with optional custom comment.
- `GET /posts/:postId/shares` - Get share instances of a post.

## 4. Reactions
- `PUT /posts/:postId/react` - React to a post (`type`: `like`, `love`, `haha`, `wow`, `sad`, `angry`).
- `DELETE /posts/:postId/react` - Remove reaction from post.
- `GET /posts/:postId/reactions` - Get reactions list with count breakdown.

## 5. Saved Posts
- `POST /posts/:postId/save` - Save a post privately.
- `DELETE /posts/:postId/save` - Remove post from saved posts.

## 6. Comments
- `POST /comments/:postId` - Create comment or nested reply (`content`, optional `parentComment`).
- `GET /comments/post/:postId` - Get paginated comments/replies for a post.
- `PUT /comments/:commentId` - Update comment content (owner only).
- `DELETE /comments/:commentId` - Delete comment (owner or post-owner).

## 7. Feed
- `GET /feed` - Get personalized feed sorted by deterministic engagement & recency algorithm.
