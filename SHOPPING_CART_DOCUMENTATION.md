# E-Commerce Shopping Cart System Documentation

## Overview

This document describes the complete shopping cart system flow for the e-commerce application, supporting both guest and authenticated user scenarios.

## System Architecture

### Database Schema

#### Tables Structure
```
carts
├── id (PK)
├── user_id (FK)
├── is_active (boolean)
├── created_at
├── updated_at
└── deleted_at (soft delete)

cart_items
├── id (PK)
├── cart_id (FK)
├── product_id (FK)
├── quantity
├── created_at
└── updated_at

orders
├── id (PK)
├── user_id (FK)
├── order_number
├── status
├── total_amount
├── payment_method
├── shipping_address
├── notes
├── created_at
└── updated_at

order_items
├── id (PK)
├── order_id (FK)
├── product_id (FK)
├── quantity
├── unit_price
├── total_price
├── created_at
└── updated_at
```

## Shopping Cart Flow Scenarios

### Scenario 1: Guest User Flow

#### 1. Add to Cart (Guest)
```
User Action: Click "Add to Cart"
Frontend: CartContext.addToCart()
Storage: localStorage.setItem('guest_cart', JSON.stringify(cartData))
Format: [{product_id: 1, quantity: 2}, ...]
UI Update: Immediate local state update
```

#### 2. Navigate to Cart
```
Route: /cart
Data Source: localStorage guest_cart
Product Loading: Fetch product details from API
UI Display: Cart items with product information
```

#### 3. Checkout Process
```
Route: /checkout → Redirect to /login
Authentication Required: Yes
Guest Cart Transfer: Send guest_cart in login request
```

#### 4. Login & Cart Merge
```
API: POST /auth/login
Request Body: {
  email: "user@example.com",
  password: "password",
  guest_cart: [{product_id: 1, quantity: 2}]
}
Backend Process:
  1. Authenticate user
  2. Merge guest cart to user cart
  3. Create/update cart_items
  4. Clear localStorage guest_cart
```

#### 5. Complete Order
```
API: POST /protected/checkout
Process:
  1. Get user's active cart
  2. Create order from cart items
  3. Clear cart items
  4. Deactivate old cart
  5. Create new empty cart
  6. Redirect to OrderSuccessPage
```

### Scenario 2: Authenticated User Flow

#### 1. Add to Cart (Authenticated)
```
User Action: Click "Add to Cart"
Frontend: CartContext.addToCart()
API Call: POST /protected/cart/add
Request: {product_id: 1, quantity: 2}
Backend Process:
  1. Get/create user's active cart
  2. Check if product exists in cart
  3. Update quantity or create new item
  4. Save to database
  5. Refresh cart state
```

#### 2. Navigate to Cart
```
Route: /cart
Data Source: Database via API
API: GET /protected/cart
Response: {
  id: 1,
  user_id: 123,
  is_active: true,
  cart_items: [...]
}
```

#### 3. Checkout Process
```
Route: /checkout (direct access)
Authentication: Already verified
Cart Data: Loaded from database
Form: Shipping address, payment method
```

#### 4. Complete Order
```
API: POST /protected/checkout
Same process as Scenario 1, but cart already in database
```

## API Endpoints

### Authentication
```
POST /auth/register
POST /auth/login
  Request: {
    email: string,
    password: string,
    guest_cart?: [{product_id: number, quantity: number}]
  }
GET /auth/profile
```

### Cart Management
```
GET /protected/cart
  Response: Cart with cart_items and product details

POST /protected/cart/add
  Request: {product_id: number, quantity: number}
  Response: CartItem

PUT /protected/cart/items/:id
  Request: {quantity: number}
  Response: Updated CartItem

DELETE /protected/cart/items/:id
  Response: Success message

DELETE /protected/cart/clear
  Response: Success message
```

### Checkout
```
POST /protected/checkout
  Request: {
    shipping_address: Address,
    payment_method: "cod" | "bank_transfer",
    notes: string
  }
  Response: {
    order_id: number,
    order_number: string,
    status: string,
    total_amount: number,
    payment_method: string,
    message: string
  }

GET /protected/checkout/history
  Response: [Order]

GET /protected/checkout/orders/:id
  Response: Order with order_items

PUT /protected/checkout/orders/:id/cancel
  Response: Success message
```

## Frontend Components

### CartContext
```typescript
interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
```

### Key Features
- **Dual Storage**: localStorage (guest) + database (authenticated)
- **State Synchronization**: Local state + API calls + refresh
- **Error Handling**: Graceful degradation on API failures
- **Cart Merge**: Guest to authenticated cart migration
- **Real-time Updates**: Immediate UI feedback with backend persistence

## Database Operations

### Cart Lifecycle
```
1. User Registration → Create initial cart (is_active: true)
2. Add Items → Create/update cart_items
3. Checkout → 
   - Create order from cart_items
   - Delete cart_items
   - Deactivate cart (is_active: false)
   - Create new cart (is_active: true)
4. Repeat Shopping → New cart ready
```

### Cart Merge Process
```sql
-- Get user's active cart
SELECT * FROM carts WHERE user_id = ? AND is_active = true;

-- Process each guest cart item
INSERT INTO cart_items (cart_id, product_id, quantity)
VALUES (?, ?, ?)
ON CONFLICT(cart_id, product_id) 
DO UPDATE SET quantity = cart_items.quantity + excluded.quantity;

-- Verify stock constraints
SELECT stock FROM products WHERE id = ?;
```

## Error Handling

### Frontend Errors
- **Network Issues**: Graceful degradation, retry mechanisms
- **API Failures**: Revert local state, show user feedback
- **State Inconsistencies**: Emergency validation methods
- **Authentication**: Redirect to login with return URL

### Backend Errors
- **Validation**: Product existence, stock availability
- **Database**: Transaction rollback on errors
- **Authentication**: JWT token validation
- **Authorization**: Role-based access control

## Performance Considerations

### Frontend Optimizations
- **Local State**: Immediate UI updates
- **API Debouncing**: Prevent duplicate requests
- **Cart Refresh**: Optimized after operations
- **Loading States**: User feedback during operations

### Backend Optimizations
- **Database Indexes**: user_id, product_id, cart_id
- **Transactions**: Atomic operations
- **Caching**: Product data, cart summaries
- **Connection Pooling**: Efficient database access

## Security Measures

### Authentication & Authorization
- **JWT Tokens**: Secure authentication
- **Middleware**: Route protection
- **User Context**: Secure user identification
- **Role Validation**: Admin vs user access

### Data Validation
- **Input Sanitization**: Prevent injection attacks
- **Stock Validation**: Prevent overselling
- **Price Validation**: Server-side price verification
- **Address Validation**: Proper format checking

## Testing Scenarios

### Guest User Flow Tests
1. Add items as guest → Verify localStorage storage
2. Navigate cart → Verify guest cart display
3. Login → Verify cart merge to database
4. Complete order → Verify order creation

### Authenticated User Flow Tests
1. Login → Verify cart creation
2. Add items → Verify database storage
3. Update quantities → Verify API updates
4. Checkout → Verify complete flow

### Edge Cases
- **Network failures** during cart operations
- **Stock depletion** during checkout
- **Concurrent cart operations**
- **Cart expiration** scenarios
- **Cross-device synchronization**

## Monitoring & Debugging

### Frontend Logging
```javascript
console.log('CartContext: Adding item to backend cart', {product_id, quantity});
console.log('CartContext: Backend add to cart response:', response.data);
```

### Backend Logging
```go
fmt.Printf("AddToCart: User %d attempting to add item to cart\n", userID);
fmt.Printf("AddToCart: Created new cart item with ID %d\n", cartItem.ID);
```

### Key Metrics
- **Cart abandonment rate**
- **Checkout conversion rate**
- **API response times**
- **Error rates by endpoint**
- **Database query performance

## Future Enhancements

### Planned Features
- **Cart persistence across devices**
- **Wishlist integration**
- **Cart sharing functionality**
- **Advanced analytics**
- **A/B testing for checkout flow**

### Scalability Considerations
- **Microservices architecture**
- **Redis caching layer**
- **Load balancing**
- **Database sharding**
- **CDN integration**

---

## API Documentation

The complete API documentation is available at:
- **Swagger UI**: http://localhost:8080/swagger/index.html
- **Swagger JSON**: http://localhost:8080/swagger/swagger.json

## Support

For technical support or questions about the shopping cart system:
- Check the console logs for debugging information
- Review the API documentation for endpoint details
- Contact the development team for assistance
