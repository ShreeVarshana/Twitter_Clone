# Twitter Clone ER Diagram (Mermaid Style)

```mermaid
erDiagram
    %% User Entity
    User {
        string _id PK
        string username
        string fullName
        string password
        string email
        string profileImg
        string coverImg
        string bio
        string link
    }
    
    %% Post Entity
    Post {
        string _id PK
        string text
        string img
        date createdAt
        date updatedAt
    }
    
    %% Comment Entity
    Comment {
        string _id PK
        string text
        date createdAt
        date updatedAt
    }
    
    %% Notification Entity
    Notification {
        string _id PK
        string type
        boolean read
        date createdAt
        date updatedAt
    }

    %% Relationships (diamonds in Mermaid are just labeled relationships)
    User ||--o{ Post : "creates"
    User ||--o{ Comment : "writes"
    Post ||--o{ Comment : "has"
    User ||--o{ Post : "likes"
    User ||--o{ User : "follows"
    User ||--o{ Notification : "sends"
    User ||--o{ Notification : "receives"
```

---

- **Rectangles**: Entities (User, Post, Comment, Notification)
- **Ovals**: Attributes (listed inside each entity)
- **Diamonds**: Relationships (labeled on connecting lines)
- **PK**: Primary Key

This diagram follows the style of your reference image, adapted for Mermaid syntax. 