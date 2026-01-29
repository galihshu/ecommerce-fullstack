# E-Commerce System Flow Diagrams

## Complete User Journey Flow

```mermaid
graph TD
    A[User Visits Website] --> B{Is User Logged In?}
    
    B -->|No| C[Browse Products as Guest]
    B -->|Yes| D[Browse Products as User]
    
    C --> E[Add to Cart - localStorage]
    D --> F[Add to Cart - Database]
    
    E --> G[View Cart - localStorage]
    F --> H[View Cart - Database]
    
    G --> I[Click Checkout]
    H --> J[Click Checkout]
    
    I --> K[Redirect to Login]
    J --> L[Checkout Form]
    
    K --> M[Login with Guest Cart]
    M --> N[Merge Guest Cart to Database]
    N --> L
    
    L --> O[Submit Order]
    O --> P[Create Order from Cart]
    P --> Q[Clear Cart Items]
    Q --> R[Deactivate Old Cart]
    R --> S[Create New Empty Cart]
    S --> T[Order Success Page]
    
    T --> U[Continue Shopping]
    U --> D
```

## Shopping Cart State Management

```mermaid
stateDiagram-v2
    [*] --> GuestShopping
    GuestShopping --> GuestCart: Add to Cart
    GuestCart --> GuestShopping: Continue Shopping
    GuestCart --> LoginRequired: Click Checkout
    LoginRequired --> AuthenticatedShopping: Login Success
    LoginRequired --> GuestShopping: Login Cancel
    
    AuthenticatedShopping --> AuthenticatedCart: Add to Cart
    AuthenticatedCart --> AuthenticatedShopping: Continue Shopping
    AuthenticatedCart --> CheckoutProcess: Click Checkout
    
    CheckoutProcess --> OrderCreated: Submit Order
    OrderCreated --> NewCartReady: Clear & Create Cart
    NewCartReady --> AuthenticatedShopping: Continue Shopping
    
    GuestShopping --> AuthenticatedShopping: Direct Login
```

## Database Operations Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth API
    participant C as Cart API
    participant DB as Database
    
    Note over U,DB: Guest User Flow
    U->>F: Add to Cart
    F->>F: localStorage.setItem()
    
    U->>F: Login
    F->>A: POST /auth/login + guest_cart
    A->>DB: Get/Create User Cart
    A->>DB: Merge Guest Cart Items
    A->>F: Login Success
    
    Note over U,DB: Authenticated User Flow
    U->>F: Add to Cart
    F->>C: POST /protected/cart/add
    C->>DB: Create/Update Cart Item
    C->>F: Success Response
    F->>C: GET /protected/cart (refresh)
    C->>DB: Get Updated Cart
    C->>F: Cart Data
    
    U->>F: Checkout
    F->>C: POST /protected/checkout
    C->>DB: Create Order
    C->>DB: Clear Cart Items
    C->>DB: Deactivate Cart
    C->>DB: Create New Cart
    C->>F: Order Success
```

## Cart Merge Process

```mermaid
flowchart TD
    A[Guest Cart Data] --> B[Parse Guest Cart Items]
    B --> C[Get User Active Cart]
    C --> D{Cart Exists?}
    
    D -->|No| E[Create New Cart]
    D -->|Yes| F[Use Existing Cart]
    
    E --> G[Process Each Guest Item]
    F --> G
    
    G --> H[Product Exists?]
    H -->|No| I[Skip Item]
    H -->|Yes| J[Item Already in Cart?]
    
    J -->|No| K[Create New Cart Item]
    J -->|Yes| L[Update Quantity]
    
    K --> M[Check Stock Availability]
    L --> M
    
    M --> N{Stock Sufficient?}
    N -->|No| O[Keep Original Quantity]
    N -->|Yes| P[Save to Database]
    
    I --> Q[Next Item]
    O --> Q
    P --> Q
    
    Q --> R{More Items?}
    R -->|Yes| G
    R -->|No| S[Merge Complete]
    
    S --> T[Clear Guest Cart localStorage]
    T --> U[Refresh Frontend Cart State]
```

## Error Handling Flow

```mermaid
graph TD
    A[API Call] --> B{Success?}
    
    B -->|Yes| C[Update Local State]
    B -->|No| D[Log Error]
    
    D --> E{Network Error?}
    E -->|Yes| F[Show Network Error]
    E -->|No| G{Authentication Error?}
    
    G -->|Yes| H[Redirect to Login]
    G -->|No| I{Validation Error?}
    
    I -->|Yes| J[Show Validation Message]
    I -->|No| K[Show Generic Error]
    
    F --> L[Retry Mechanism]
    H --> M[Save Return URL]
    J --> N[Highlight Form Fields]
    K --> O[Log to Console]
    
    L --> A
    M --> P[Post-Login Redirect]
    N --> Q[User Correction]
    O --> R[Report to Support]
    
    P --> S[Retry Original Action]
    Q --> A
```

## Performance Optimization Flow

```mermaid
graph LR
    A[User Action] --> B[Immediate UI Update]
    B --> C[Debounce API Call]
    C --> D[API Request]
    D --> E[Backend Processing]
    E --> F[Database Operation]
    F --> G[Cache Response]
    G --> H[Return Response]
    H --> I[Update Local State]
    I --> J[Sync UI]
    
    subgraph "Optimizations"
        C
        G
    end
    
    subgraph "Database"
        F
    end
    
    subgraph "Frontend"
        B
        I
        J
    end
```

## Security Validation Flow

```mermaid
flowchart TD
    A[API Request] --> B[JWT Validation]
    B --> C{Token Valid?}
    
    C -->|No| D[Return 401 Unauthorized]
    C -->|Yes| E[Extract User Context]
    
    E --> F[Rate Limiting Check]
    F --> G{Within Limits?}
    
    G -->|No| H[Return 429 Too Many Requests]
    G -->|Yes| I[Input Validation]
    
    I --> J[Sanitize Data]
    J --> K[Business Logic Validation]
    K --> L{Valid Data?}
    
    L -->|No| M[Return 400 Bad Request]
    L -->|Yes| N[Database Operation]
    
    N --> O{Operation Success?}
    O -->|No| P[Rollback Transaction]
    O -->|Yes| Q[Log Activity]
    
    P --> R[Return 500 Server Error]
    Q --> S[Return Success Response]
    
    D --> T[Clear Sensitive Data]
    H --> T
    M --> T
    R --> T
    S --> T
```

## Testing Scenarios Matrix

| Scenario | Pre-conditions | Actions | Expected Results | Test Status |
|----------|----------------|---------|------------------|-------------|
| Guest Add to Cart | Not logged in | Add item to cart | Item saved in localStorage | ✅ |
| Guest View Cart | Items in localStorage | Navigate to /cart | Items displayed with product data | ✅ |
| Guest Checkout | Items in cart | Click checkout | Redirect to login | ✅ |
| Cart Merge | Guest cart + login | Login with guest cart | Items merged to database | ✅ |
| Authenticated Add | Logged in | Add item to cart | Item saved in database | ✅ |
| Cart Persistence | Logged in items | Refresh page | Items still in cart | ✅ |
| Checkout Flow | Items in cart | Complete checkout | Order created, cart cleared | ✅ |
| Error Handling | Network failure | Add to cart | Graceful error handling | ✅ |
| Stock Validation | Low stock item | Add to cart | Stock validation error | ✅ |
| Concurrent Access | Multiple tabs | Add items | Consistent cart state | ✅ |

## Monitoring Metrics

### Key Performance Indicators (KPIs)

```mermaid
graph TD
    A[User Metrics] --> B[Cart Abandonment Rate]
    A --> C[Checkout Conversion Rate]
    A --> D[Session Duration]
    
    E[Technical Metrics] --> F[API Response Time]
    E --> G[Database Query Time]
    E --> H[Error Rate]
    
    I[Business Metrics] --> J[Order Value]
    I --> K[Items per Order]
    I --> L[Repeat Purchase Rate]
    
    B --> M[Dashboard Analytics]
    C --> M
    D --> M
    F --> M
    G --> M
    H --> M
    J --> M
    K --> M
    L --> M
```

---

## Implementation Checklist

### ✅ Completed Features
- [x] Guest cart localStorage storage
- [x] Authenticated cart database storage
- [x] Cart merge on login
- [x] Complete checkout flow
- [x] Order management system
- [x] Error handling and validation
- [x] API documentation with Swagger
- [x] Comprehensive logging

### 🔄 In Progress
- [ ] Performance optimization
- [ ] Advanced analytics
- [ ] Cross-device synchronization

### 📋 Planned Features
- [ ] Cart sharing functionality
- [ ] Wishlist integration
- [ ] Advanced filtering and search
- [ ] Mobile app integration
- [ ] Multi-language support

---

This documentation provides a complete overview of the e-commerce shopping cart system, including all flows, API endpoints, database operations, and implementation details.
