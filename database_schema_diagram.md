# Twitter Clone Database Schema Diagram

## Database Schema Overview

```mermaid
erDiagram
    %% User Entity
    User {
        ObjectId _id PK
        String username UK "unique, required"
        String fullName "required"
        String password "required, minLength: 6"
        String email UK "unique, required"
        String profileImg "default: ''"
        String coverImg "default: ''"
        String bio "default: ''"
        String link "default: ''"
        ObjectId[] followers "ref: User"
        ObjectId[] following "ref: User"
        ObjectId[] likedPosts "ref: Post"
        Date createdAt "timestamps"
        Date updatedAt "timestamps"
    }

    %% Post Entity
    Post {
        ObjectId _id PK
        ObjectId user FK "ref: User, required"
        String text "optional"
        String img "optional"
        ObjectId[] likes "ref: User"
        Comment[] comments "embedded"
        Date createdAt "timestamps"
        Date updatedAt "timestamps"
    }

    %% Comment Subdocument (embedded in Post)
    Comment {
        String text "required"
        ObjectId user "ref: User, required"
    }

    %% Notification Entity
    Notification {
        ObjectId _id PK
        ObjectId from FK "ref: User, required"
        ObjectId to FK "ref: User, required"
        String type "enum: ['follow', 'like'], required"
        Boolean read "default: false"
        Date createdAt "timestamps"
        Date updatedAt "timestamps"
    }

    %% Relationships
    User ||--o{ Post : "creates"
    User ||--o{ Notification : "receives"
    User ||--o{ Notification : "sends"
    User ||--o{ User : "follows"
    User ||--o{ Post : "likes"
    Post ||--o{ Comment : "contains"
    User ||--o{ Comment : "writes"
```

## Detailed Table Structures

### 1. User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  fullName: String (required),
  password: String (required, minLength: 6),
  email: String (unique, required),
  profileImg: String (default: ""),
  coverImg: String (default: ""),
  bio: String (default: ""),
  link: String (default: ""),
  followers: [ObjectId] (ref: User),
  following: [ObjectId] (ref: User),
  likedPosts: [ObjectId] (ref: Post),
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Post Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  text: String (optional),
  img: String (optional),
  likes: [ObjectId] (ref: User),
  comments: [
    {
      text: String (required),
      user: ObjectId (ref: User, required)
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Notification Collection
```javascript
{
  _id: ObjectId,
  from: ObjectId (ref: User, required),
  to: ObjectId (ref: User, required),
  type: String (enum: ["follow", "like"], required),
  read: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## Key Relationships

1. **User-Post**: One-to-Many (User creates multiple Posts)
2. **User-User**: Many-to-Many (Users follow other Users)
3. **User-Post**: Many-to-Many (Users like Posts)
4. **Post-Comment**: One-to-Many (Post contains multiple Comments)
5. **User-Comment**: One-to-Many (User writes multiple Comments)
6. **User-Notification**: One-to-Many (User receives multiple Notifications)

## Indexes

- **Post Collection**: Text index on content for search functionality
- **User Collection**: Unique indexes on username and email
- **Notification Collection**: Indexes on from, to, and read fields for efficient queries

## Data Flow

1. **User Registration**: Creates new User document
2. **Post Creation**: Creates Post with user reference
3. **Follow Action**: Updates both users' followers/following arrays
4. **Like Action**: Updates post's likes array and user's likedPosts array
5. **Comment Action**: Adds comment to post's comments array
6. **Notification**: Creates notification for follow/like actions 