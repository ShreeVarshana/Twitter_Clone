# Twitter Clone ER Diagram

## Entity Relationship Diagram

```mermaid
erDiagram
    %% User Entity - Central entity
    User {
        ObjectId _id PK "Primary Key"
        String username UK "Unique, Required"
        String fullName "Required"
        String password "Required, Min 6 chars"
        String email UK "Unique, Required"
        String profileImg "Default: empty"
        String coverImg "Default: empty"
        String bio "Default: empty"
        String link "Default: empty"
        Date createdAt "Auto-generated"
        Date updatedAt "Auto-updated"
    }

    %% Post Entity
    Post {
        ObjectId _id PK "Primary Key"
        ObjectId user FK "Foreign Key to User"
        String text "Optional content"
        String img "Optional image URL"
        Date createdAt "Auto-generated"
        Date updatedAt "Auto-updated"
    }

    %% Comment Subdocument (Embedded in Post)
    Comment {
        String text "Required comment text"
        ObjectId user "Reference to User"
    }

    %% Notification Entity
    Notification {
        ObjectId _id PK "Primary Key"
        ObjectId from FK "Sender User ID"
        ObjectId to FK "Receiver User ID"
        String type "Enum: follow/like"
        Boolean read "Default: false"
        Date createdAt "Auto-generated"
        Date updatedAt "Auto-updated"
    }

    %% Junction Tables for Many-to-Many Relationships

    %% User Follows User (Many-to-Many)
    UserFollows {
        ObjectId follower "User who follows"
        ObjectId following "User being followed"
    }

    %% User Likes Post (Many-to-Many)
    UserLikesPost {
        ObjectId user "User who likes"
        ObjectId post "Post being liked"
    }

    %% User Liked Posts (Many-to-Many)
    UserLikedPosts {
        ObjectId user "User reference"
        ObjectId post "Liked post reference"
    }

    %% Relationships with Cardinality
    User ||--o{ Post : "creates"
    User ||--o{ Notification : "receives"
    User ||--o{ Notification : "sends"
    User ||--o{ UserFollows : "is follower"
    User ||--o{ UserFollows : "is followed"
    User ||--o{ UserLikesPost : "likes"
    Post ||--o{ UserLikesPost : "liked by"
    User ||--o{ UserLikedPosts : "has liked"
    Post ||--o{ UserLikedPosts : "is liked"
    Post ||--o{ Comment : "contains"
    User ||--o{ Comment : "writes"
```

## Relationship Details

### 1. User → Post (1:N)
- **Cardinality**: One User can create many Posts
- **Constraint**: Each Post must have exactly one creator
- **Implementation**: Post.user field references User._id

### 2. User ↔ User (M:N) - Follow Relationship
- **Cardinality**: Many Users can follow many Users
- **Implementation**: 
  - User.followers[] array contains User IDs
  - User.following[] array contains User IDs

### 3. User ↔ Post (M:N) - Like Relationship
- **Cardinality**: Many Users can like many Posts
- **Implementation**:
  - Post.likes[] array contains User IDs
  - User.likedPosts[] array contains Post IDs

### 4. Post → Comment (1:N)
- **Cardinality**: One Post can have many Comments
- **Implementation**: Comments embedded as subdocuments in Post.comments[]

### 5. User → Comment (1:N)
- **Cardinality**: One User can write many Comments
- **Implementation**: Comment.user field references User._id

### 6. User → Notification (1:N) - Receiver
- **Cardinality**: One User can receive many Notifications
- **Implementation**: Notification.to field references User._id

### 7. User → Notification (1:N) - Sender
- **Cardinality**: One User can send many Notifications
- **Implementation**: Notification.from field references User._id

## Database Design Patterns

### 1. Embedded Documents
- **Comments**: Embedded in Post documents for better performance
- **Benefits**: Faster queries, atomic operations

### 2. Array References
- **Followers/Following**: Arrays of ObjectIds for efficient lookups
- **Likes**: Arrays of ObjectIds for quick like status checks

### 3. Junction Collections
- **Notifications**: Separate collection for complex querying
- **Benefits**: Indexed fields, flexible querying

## Constraints and Validations

### User Collection
- `username`: Unique, required
- `email`: Unique, required
- `password`: Required, minimum 6 characters
- `followers[]`: Array of valid User ObjectIds
- `following[]`: Array of valid User ObjectIds
- `likedPosts[]`: Array of valid Post ObjectIds

### Post Collection
- `user`: Required, must reference valid User
- `text` OR `img`: At least one must be present
- `likes[]`: Array of valid User ObjectIds
- `comments[]`: Array of comment subdocuments

### Notification Collection
- `from`: Required, must reference valid User
- `to`: Required, must reference valid User
- `type`: Must be either "follow" or "like"
- `read`: Boolean, defaults to false

## Index Strategy

1. **Primary Indexes**: `_id` (automatic)
2. **Unique Indexes**: `username`, `email`
3. **Foreign Key Indexes**: `Post.user`, `Notification.from`, `Notification.to`
4. **Text Index**: `Post.text` for search functionality
5. **Compound Indexes**: `Notification.to + read` for unread notifications 