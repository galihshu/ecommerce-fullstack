# Shopping Cart Feature Documentation

## Overview
This document describes the complete shopping cart implementation for the e-commerce application. The cart feature includes full CRUD operations, real-time calculations, and a responsive user interface.

## Backend Implementation

### Models
- **Cart**: Represents a user's shopping cart
- **CartItem**: Represents individual items in the cart

### API Endpoints

#### Cart Management
- `GET /api/v1/cart` - Get user's cart with all items
- `GET /api/v1/cart/summary` - Get cart summary with totals (subtotal, tax, shipping, total)
- `POST /api/v1/cart/add` - Add product to cart
- `PUT /api/v1/cart/items/:id` - Update cart item quantity
- `DELETE /api/v1/cart/items/:id` - Remove item from cart
- `DELETE /api/v1/cart/clear` - Clear all items from cart

### Features
- **Stock Validation**: Prevents adding items beyond available stock
- **User Authentication**: All cart operations require authentication
- **Automatic Cart Creation**: Creates new cart when user adds first item
- **Quantity Management**: Supports updating item quantities
- **Price Calculations**: Real-time subtotal and total calculations

## Frontend Implementation

### Components

#### CartIcon
- Displays cart icon with item count badge
- Links to cart page
- Shows real-time item count

#### CartItem
- Individual cart item display
- Quantity controls with stock validation
- Item removal functionality
- Price display and subtotal calculation

#### AddToCartButton
- Add products to cart from product pages
- Stock status display
- Success/error notifications
- Prevents adding out-of-stock items

#### CartPage
- Complete cart management interface
- Order summary with calculations
- Promo code input (UI only)
- Checkout integration

### State Management

#### CartContext
- Global cart state management
- API integration for cart operations
- Local state fallback for offline scenarios
- Real-time calculations for totals

### API Integration

#### cartAPI
- Axios-based API client
- Automatic authentication headers
- Error handling and interceptors
- Response transformation

## Features

### Core Functionality
1. **Add to Cart**: Add products with quantity validation
2. **Update Quantity**: Increase/decrease item quantities
3. **Remove Items**: Remove individual items from cart
4. **Clear Cart**: Remove all items at once
5. **Calculate Totals**: Automatic subtotal, tax, and total calculations

### User Experience
- **Responsive Design**: Works on all device sizes
- **Real-time Updates**: Cart updates immediately
- **Stock Indicators**: Shows stock availability
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages

### Security & Validation
- **Authentication Required**: All operations need valid JWT token
- **Stock Validation**: Prevents overselling
- **User Isolation**: Users can only access their own carts
- **Input Validation**: Server-side validation for all inputs

## Usage Examples

### Adding a Product to Cart
```typescript
import { useCart } from '../context/CartContext';

const { addToCart } = useCart();

// Add product with quantity
await addToCart(product, 2);
```

### Getting Cart Summary
```typescript
import { cartAPI } from '../services/api';

const response = await cartAPI.getCartSummary();
console.log(response.data.total); // Total price with tax
```

### Updating Item Quantity
```typescript
import { useCart } from '../context/CartContext';

const { updateQuantity } = useCart();

// Update quantity to 3
await updateQuantity(productId, 3);
```

## File Structure

```
backend/
├── models/cart.go          # Cart and CartItem models
├── handlers/cart.go        # Cart API handlers
└── routes/routes.go        # Cart route definitions

frontend/
├── src/
│   ├── components/
│   │   ├── CartIcon.tsx       # Cart icon component
│   │   ├── CartItem.tsx       # Cart item component
│   │   └── AddToCartButton.tsx # Add to cart button
│   ├── context/
│   │   └── CartContext.tsx    # Cart state management
│   ├── pages/
│   │   └── CartPage.tsx       # Cart page component
│   ├── services/
│   │   └── api.ts            # API client with cart endpoints
│   └── types/
│       └── api.ts            # TypeScript interfaces
```

## Testing

### Backend Testing
- Test all CRUD operations
- Validate stock management
- Test authentication requirements
- Verify price calculations

### Frontend Testing
- Test user interactions
- Verify state management
- Test error handling
- Validate responsive design

## Future Enhancements

### Planned Features
- **Wishlist Integration**: Move items between wishlist and cart
- **Saved Carts**: Allow users to save multiple carts
- **Cart Abandonment**: Email reminders for abandoned carts
- **Bulk Operations**: Add multiple items at once
- **Cart Sharing**: Share cart with others

### Performance Optimizations
- **Caching**: Cache cart data for faster loading
- **Optimistic Updates**: Update UI before API response
- **Lazy Loading**: Load cart data only when needed
- **Background Sync**: Sync cart changes in background

## Troubleshooting

### Common Issues
1. **Cart Not Loading**: Check authentication status
2. **Stock Issues**: Verify product stock levels
3. **Price Calculations**: Check tax and shipping settings
4. **API Errors**: Check network connectivity and API endpoints

### Debug Tips
- Check browser console for errors
- Verify JWT token validity
- Check network requests in dev tools
- Review backend logs for API errors
