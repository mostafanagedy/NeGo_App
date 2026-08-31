# NeGo Database Schema & Indexes

NeGo uses MongoDB with Mongoose ODM for data modeling.

## Collections & Schemas

### 1. Users (`User`)
- `firstName`, `lastName`, `username` (unique index), `email` (unique index), `password` (hashed with bcrypt), `profilePicture`, `coverPicture`, `bio`, `isVerified`, `location`, `website`, `work`, `education`, `followers` ([ref User]), `following` ([ref User]).

### 2. Posts (`Post`)
- `author` (ref User, index), `content`, `image`, `images`, `video`, `likes` ([ref User]), `likesCount`, `reactionsCount` ({ like, love, haha, wow, sad, angry }), `commentsCount`, `sharesCount`, `visibility` (`public`, `followers`, `private`), `hashtags` (index), `mentions` ([ref User]), `originalPost` (ref Post), `shareComment`.
- Indexes: `{ author: 1, createdAt: -1 }`, `{ hashtags: 1 }`, `{ createdAt: -1 }`.

### 3. Comments (`Comment`)
- `post` (ref Post, index), `author` (ref User), `content`, `parentComment` (ref Comment, index), `likes` ([ref User]), `repliesCount`.
- Indexes: `{ post: 1, createdAt: -1 }`, `{ parentComment: 1, createdAt: 1 }`.

### 4. Reactions (`Reaction`)
- `post` (ref Post), `user` (ref User), `type` (`like`, `love`, `haha`, `wow`, `sad`, `angry`).
- Indexes: Compound Unique Index `{ post: 1, user: 1 }`, Index `{ post: 1, type: 1 }`.

### 5. Saved Posts (`SavedPost`)
- `user` (ref User), `post` (ref Post).
- Indexes: Compound Unique Index `{ user: 1, post: 1 }`, Index `{ user: 1, createdAt: -1 }`.
