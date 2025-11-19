# Barrel Exports Guide

This project uses barrel exports (index.js files) to provide cleaner and more organized imports. Instead of importing from deep file paths, you can import multiple items from a single directory.

## What are Barrel Exports?

Barrel exports are `index.js` files that re-export multiple modules from a directory, allowing you to import multiple items with a single import statement.

## Available Barrel Exports

### 📄 Pages (`@pages`)
```javascript
// Instead of multiple imports:
import HomePage from '@pages/home/HomePage';
import ProductInfo from '@pages/productInfo/ProductInfo';
import CartPage from '@pages/cart/CartPage';

// Use barrel export:
import { HomePage, ProductInfo, CartPage } from '@pages';
```

**Available exports:**
- Core: `HomePage`, `ProductInfo`, `CartPage`, `AllProduct`, `CategoryPage`, `SubscriptionPage`, `ReviewsPage`, `NoPage`
- Auth: `Signup`, `Login`, `UserDashboard`, `AuthCallback`
- Service: `ContactUs`, `PurchasePage`
- Streaming: `NetflixNepal`, `SpotifyNepal`, `PrimeVideoNepal`, etc.
- And more...

### 🛠️ Utils (`@utils`)
```javascript
// Instead of multiple imports:
import logger from '@utils/logger';
import { sanitizeInput } from '@utils/security';
import { validateEmail } from '@utils/validation';

// Use barrel export:
import { logger, sanitizeInput, validateEmail } from '@utils';
```

**Available exports:**
- `logger` - Secure logging utility
- Security: `sanitizeInput`, `SecureSession`, `passwordSecurity`, etc.
- Validation: `validateEmail`, `validatePassword`, `RateLimiter`, etc.
- Data: `normalizeProduct`, `safeParseJSON`, etc.

### 🎣 Hooks (`@hooks`)
```javascript
// Instead of:
import { useAuth } from '@hooks/auth/useAuth';
import useCartSync from '@hooks/cart/useCartSync';

// Use barrel export:
import { useAuth, useCartSync } from '@hooks';
```

### 🔄 Context (`@context`)
```javascript
// Instead of:
import MyContext from '@context/myContext';
import { useNotification } from '@context/NotificationContext';

// Use barrel export:
import { MyContext, useNotification } from '@context';
```

### 🧩 Components (`@components`)
```javascript
// Instead of:
import Layout from '@components/layout/Layout';
import Navbar from '@components/navbar/Navbar';
import Loader from '@components/loader/Loader';

// Use barrel export:
import { Layout, Navbar, Loader } from '@components';
```

**Available exports:**
- Layout: `Layout`, `Navbar`, `Footer`, `FooterOTT`
- UI: `Loader`, `ErrorBoundary`, `NetworkStatus`, `ScrollTop`
- Product: `HomePageProductCard`, `RelatedProducts`, `ProductReviews`
- SEO: `SEOHelmet`, `Breadcrumb`, `NepalSEO`
- And more...

### 🏪 Redux (`@redux`)
```javascript
// Instead of:
import { store } from '@redux/store';
import { addToCart, deleteFromCart } from '@redux/cartSlice';

// Use barrel export:
import { store, addToCart, deleteFromCart } from '@redux';
```

## Benefits

1. **Cleaner Imports**: Fewer import lines
2. **Better Organization**: Logical grouping of related exports
3. **Easier Refactoring**: Moving files doesn't break imports as much
4. **Improved Readability**: Clear indication of what's being imported
5. **Better Tree Shaking**: Modern bundlers can still optimize unused exports

## Usage Examples

### Before (Without Barrel Exports)
```javascript
import HomePage from '@pages/home/HomePage';
import ProductInfo from '@pages/productInfo/ProductInfo';
import CartPage from '@pages/cart/CartPage';
import Layout from '@components/layout/Layout';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/footer/Footer';
import logger from '@utils/logger';
import { sanitizeInput } from '@utils/security';
import { validateEmail } from '@utils/validation';
import { useAuth } from '@hooks/auth/useAuth';
import useCartSync from '@hooks/cart/useCartSync';
```

### After (With Barrel Exports)
```javascript
import { HomePage, ProductInfo, CartPage } from '@pages';
import { Layout, Navbar, Footer } from '@components';
import { logger, sanitizeInput, validateEmail } from '@utils';
import { useAuth, useCartSync } from '@hooks';
```

## Best Practices

### ✅ Do
- Use barrel exports for importing multiple items from the same directory
- Keep barrel exports organized and well-documented
- Use specific imports when you only need one item
- Combine with path aliases for maximum benefit

### ❌ Don't
- Import everything with `import * as` unless necessary
- Create circular dependencies between barrel exports
- Over-use barrel exports for single imports
- Forget to update barrel exports when adding new modules

## Performance Considerations

Modern bundlers (like Vite) support tree shaking, so unused exports from barrel files won't be included in the final bundle. However, be mindful of:

1. **Import only what you need** - Even with tree shaking
2. **Avoid circular dependencies** - Can break tree shaking
3. **Keep barrel files focused** - Don't export everything

## Adding New Exports

When adding new components or utilities:

1. **Create the new file** in the appropriate directory
2. **Add the export** to the relevant `index.js` file
3. **Update documentation** if it's a commonly used export
4. **Test the import** to ensure it works correctly

Example:
```javascript
// Add to src/components/index.js
export { default as NewComponent } from './NewComponent/NewComponent';
```

## Migration Guide

To migrate existing imports to use barrel exports:

1. **Identify related imports** from the same directory
2. **Check if a barrel export exists** for that directory
3. **Replace individual imports** with barrel import
4. **Test that everything still works**

Example migration:
```javascript
// Before
import Layout from '@components/layout/Layout';
import Navbar from '@components/navbar/Navbar';

// After
import { Layout, Navbar } from '@components';
```
