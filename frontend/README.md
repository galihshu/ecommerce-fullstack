# E-Commerce Frontend Application

A modern e-commerce frontend application built with React, TypeScript, Vite, Chakra UI, and Tailwind CSS.

## 🚀 Features

- **Product Catalog**: Browse and search through a collection of products
- **Product Details**: View detailed information about each product
- **Shopping Cart**: Add, remove, and update items in your cart
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean and intuitive interface using Tailwind CSS
- **State Management**: React Context API for cart functionality
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Tailwind CSS (for styling and layout)
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Icons**: Custom SVG icons

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation bar with cart indicator
│   ├── ProductCard.tsx  # Individual product card component
│   ├── ProductGrid.tsx  # Grid layout for products
│   ├── CartItem.tsx     # Shopping cart item component
│   └── Footer.tsx       # Footer component
├── context/            # React Context providers
│   └── CartContext.tsx  # Shopping cart state management
├── pages/              # Page components
│   ├── Homepage.tsx    # Landing page with featured products
│   ├── ProductsPage.tsx # All products page with filtering
│   ├── ProductDetail.tsx # Individual product details
│   └── CartPage.tsx    # Shopping cart page
├── data/               # Mock data
│   └── products.ts     # Product data
├── types/              # TypeScript type definitions
│   └── index.ts       # Shared types
├── App.tsx             # Main app component with routing
└── main.tsx           # App entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Features Overview

### Homepage
- Hero section with call-to-action buttons
- Featured products showcase
- Company features section
- Newsletter subscription

### Products Page
- Search functionality
- Category filtering
- Sort options (price, name)
- Responsive grid layout

### Product Detail Page
- Product images and descriptions
- Quantity selector
- Add to cart functionality
- Stock information
- Breadcrumb navigation

### Shopping Cart
- Item quantity management
- Remove items functionality
- Order summary
- Promo code input
- Responsive design

## 🎨 Design System

### Color Palette
- Primary: Blue (#3B82F6)
- Secondary: Purple (#8B5CF6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

### Typography
- Headings: Bold weights
- Body text: Regular weights
- Responsive font sizes

### Spacing
- Consistent spacing using Tailwind CSS classes
- Responsive breakpoints (sm, md, lg, xl)

## 🔧 Customization

### Adding New Products

Edit `src/data/products.ts` to add new products:

```typescript
{
  id: number,
  name: string,
  price: number,
  description: string,
  image: string,
  category: string,
  stock: number
}
```

### Styling

The application uses Tailwind CSS for styling. You can customize the theme by editing `tailwind.config.js`.

### Components

All components are built with TypeScript and follow React best practices. Each component is self-contained and reusable.

## 📦 Build & Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite for the fast build tool
- Unsplash for the product images

---

**Note**: This is a frontend-only demo application. No actual payment processing or backend integration is included.
