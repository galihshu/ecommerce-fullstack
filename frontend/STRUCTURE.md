# 📁 Project Structure

## 🗂 Folder Organization

### `/src/components/`
- **`admin/`** - Admin-specific components
  - `AdminLayout.tsx` - Admin dashboard layout
  - `ProtectedRoute.tsx` - Route protection for admin pages
  - `index.ts` - Admin component exports

- **User Components** (directly in components folder)
  - `Navbar.tsx` - Main navigation bar
  - `Footer.tsx` - Page footer
  - `ProductCard.tsx` - Product display card
  - `ProductGrid.tsx` - Product grid layout
  - `CartItem.tsx` - Shopping cart item
  - `user-components.ts` - User component exports

- **`index.ts`** - Main component exports (admin only)

### `/src/pages/`
- **`admin/`** - Admin pages
  - `AdminDashboard.tsx` - Main admin dashboard
  - `AdminProducts.tsx` - Product management
  - `AdminOrders.tsx` - Order management
  - `AdminUsers.tsx` - User management
  - `AdminAnalytics.tsx` - Analytics dashboard
  - `AdminSettings.tsx` - Admin settings
  - `LoginPage.tsx` - Admin login page
  - `index.ts` - Admin page exports

- **User Pages** (directly in pages folder)
  - `Homepage.tsx` - Main homepage
  - `ProductsPage.tsx` - Products listing
  - `ProductDetail.tsx` - Product details
  - `CartPage.tsx` - Shopping cart
  - `user-pages.ts` - User page exports

- **`index.ts`** - Main page exports (admin only)

## 🔄 Import Examples

### User Components
```typescript
import { Navbar, Footer, ProductCard } from './components/user-components';
```

### Admin Components
```typescript
import { AdminLayout, ProtectedRoute } from './components';
```

### User Pages
```typescript
import { Homepage, ProductsPage } from './pages/user-pages';
```

### Admin Pages
```typescript
import { AdminDashboard, AdminUsers } from './pages';
```

## 🎯 Benefits

1. **Clear Separation**: Admin components in `/admin/` folder, user components in main folder
2. **Logical Grouping**: User-facing pages are in main pages folder (more intuitive)
3. **Maintainability**: Clear organization makes code easier to maintain
4. **Team Collaboration**: Different developers can work on different areas
5. **Bundle Optimization**: Tree shaking can exclude unused admin code

## 🚀 Routing Structure

- **User Routes**: `/`, `/products`, `/product/:id`, `/cart`
  - Uses Navbar + Footer layout
  - Accessible to all users
  - Components imported from main folders

- **Admin Routes**: `/admin/*`
  - Uses AdminLayout
  - Requires authentication and admin role
  - Separate login page at `/login`
  - Components and pages from `/admin/` folders

This structure provides clear separation while keeping user-facing components and pages in the main, more intuitive locations.
