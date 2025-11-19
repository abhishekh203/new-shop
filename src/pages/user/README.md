# User Dashboard - Refactored Structure

This directory contains the refactored User Dashboard feature, now organized into smaller, more maintainable components.

## 📁 Directory Structure

```
user/
├── UserDashboard.jsx          # Main dashboard component (orchestration)
├── components/                # Reusable UI components
│   ├── index.js              # Barrel export
│   ├── StatsCard.jsx         # Statistics display card
│   ├── ProductCard.jsx       # Product item card
│   ├── OrderCard.jsx         # Order details card
│   └── TrackingModal.jsx     # Order tracking modal
├── tabs/                      # Tab content components
│   ├── index.js              # Barrel export
│   ├── OrdersTab.jsx         # Orders tab content
│   └── ReviewsTab.jsx        # Reviews tab content
├── utils/                     # Utility functions
│   ├── orderHelpers.js       # Order-related helper functions
│   └── invoiceGenerator.js   # Invoice PDF generation
└── constants/                 # Constants and configuration
    └── index.js              # App constants (tabs, status, etc.)
```

## 🎯 Key Improvements

### Before Refactoring
- **Single file**: 800+ lines in `UserDashboard.jsx`
- **Difficult maintenance**: All logic, UI, and utilities in one place
- **Hard to test**: Tightly coupled components
- **Poor reusability**: Duplicated code across sections

### After Refactoring
- **Modular structure**: Split into 11 focused files
- **Easy maintenance**: Each component has a single responsibility
- **Testable**: Components can be tested independently
- **Reusable**: Components can be used elsewhere in the app
- **Better performance**: Easier code-splitting and lazy loading

## 📦 Components

### Main Component

#### `UserDashboard.jsx`
The orchestrator component that:
- Manages authentication and user state
- Fetches and manages data (orders, reviews)
- Handles tab navigation
- Coordinates child components
- **Lines**: ~465 (down from 800+)

### UI Components (`components/`)

#### `StatsCard.jsx`
Displays statistical information with an icon and footer text.

**Props:**
- `title` (string): Card title
- `value` (string|number): Main value to display
- `icon` (Component): Icon component
- `footerText` (string): Footer information
- `onClick` (function): Click handler

**Usage:**
```jsx
<StatsCard 
  title="Total Orders" 
  value={42} 
  icon={BsBoxSeam} 
  footerText="Last order: 2 days ago"
  onClick={() => handleClick()}
/>
```

#### `ProductCard.jsx`
Displays product information with add-to-cart functionality.

**Props:**
- `item` (object): Product data
- `onAddToCart` (function): Add to cart handler

#### `OrderCard.jsx`
Displays order information with expandable details.

**Props:**
- `order` (object): Order data
- `expandedOrder` (string): Currently expanded order ID
- `onToggleExpand` (function): Expand/collapse handler
- `onGenerateInvoice` (function): Invoice generation handler
- `onRequestRefund` (function): Refund request handler
- `onTrackShipping` (function): Shipping tracking handler
- `calculateTotalAmount` (function): Total calculation function
- `handleAddToCart` (function): Add to cart handler

#### `TrackingModal.jsx`
Modal for displaying order tracking information.

**Props:**
- `isOpen` (boolean): Modal visibility
- `order` (object): Order data
- `onClose` (function): Close handler

### Tab Components (`tabs/`)

#### `OrdersTab.jsx`
Complete orders management interface with:
- Statistics cards
- Search and filter controls
- Order list with expandable details
- Actions (invoice, refund, tracking)

**Props:**
- `userOrders` (array): List of user orders
- `loading` (boolean): Loading state
- `searchTerm` (string): Current search term
- `setSearchTerm` (function): Search term setter
- `sortBy` (string): Current sort option
- `setSortBy` (function): Sort option setter
- `orderView` (string): Current view filter
- `setOrderView` (function): View filter setter
- `statusStats` (object): Order statistics
- `totalSpent` (number): Total amount spent
- `lastOrderDate` (string): Last order date
- `expandedOrder` (string): Currently expanded order
- `toggleOrderExpand` (function): Expand toggle handler
- `generateInvoice` (function): Invoice generation
- `requestRefund` (function): Refund request
- `trackShipping` (function): Tracking handler
- `calculateTotalAmount` (function): Amount calculator
- `handleAddToCart` (function): Add to cart handler

#### `ReviewsTab.jsx`
Reviews management interface with:
- Review filtering (all, pending, approved, rejected)
- Review status display
- Product ratings and feedback

**Props:**
- `userReviews` (array): List of user reviews
- `loadingReviews` (boolean): Loading state
- `reviewsFilter` (string): Current filter
- `setReviewsFilter` (function): Filter setter

### Utilities (`utils/`)

#### `orderHelpers.js`
Helper functions for order processing:

```javascript
// Get CSS classes for order status badge
getStatusClasses(status)

// Get product names from order
getProductNames(order)
```

#### `invoiceGenerator.js`
PDF invoice generation using jsPDF:

```javascript
// Generate and download invoice PDF
generateInvoice(order, user, calculateTotalAmount)
```

### Constants (`constants/`)

#### `index.js`
Application constants:

```javascript
// WhatsApp support number
export const WHATSAPP_SUPPORT_NUMBER = "+9779807677391";

// Tab identifiers
export const TAB_ORDERS = "orders";
export const TAB_REVIEWS = "reviews";

// Order status values
export const STATUS_DELIVERED = 'delivered';
export const STATUS_PLACED = 'placed';
export const STATUS_PENDING = 'pending';
export const STATUS_PROCESSING = 'processing';
export const STATUS_SHIPPED = 'shipped';
export const STATUS_CANCELLED = 'cancelled';
export const STATUS_REFUNDED = 'refunded';
```

## 🔄 Data Flow

```
UserDashboard (Main)
    ├── Fetches user data from Supabase
    ├── Manages state (orders, reviews, activeTab)
    └── Passes data to child components
        ├── OrdersTab
        │   ├── Displays StatsCard components
        │   └── Renders OrderCard for each order
        │       └── Opens TrackingModal on tracking
        └── ReviewsTab
            └── Displays review list with filters
```

## 🎨 Styling

All components use:
- **Tailwind CSS** for utility classes
- **serifTheme** from design system for consistent styling
- **Framer Motion** for animations (where applicable)
- **Dark mode support** via Tailwind dark: prefix

## 🧪 Testing Recommendations

### Unit Tests
```javascript
// Test individual components
describe('StatsCard', () => {
  it('displays correct value', () => {
    // Test implementation
  });
});

// Test utility functions
describe('orderHelpers', () => {
  it('returns correct status classes', () => {
    expect(getStatusClasses('delivered')).toBe('bg-green-100 text-green-800');
  });
});
```

### Integration Tests
```javascript
// Test tab switching
describe('UserDashboard', () => {
  it('switches between tabs correctly', () => {
    // Test implementation
  });
  
  it('fetches reviews when switching to reviews tab', () => {
    // Test implementation
  });
});
```

## 📝 Usage Examples

### Adding a New Tab

1. **Create tab component** in `tabs/`:
```javascript
// tabs/SettingsTab.jsx
const SettingsTab = ({ userSettings, onUpdateSettings }) => {
  return (
    <div>
      {/* Settings UI */}
    </div>
  );
};
export default SettingsTab;
```

2. **Add constant** in `constants/index.js`:
```javascript
export const TAB_SETTINGS = "settings";
```

3. **Import and use** in `UserDashboard.jsx`:
```javascript
import { SettingsTab } from './tabs';
// Add to tabs array and render logic
```

### Creating a Reusable Component

1. **Create component** in `components/`:
```javascript
// components/ActionButton.jsx
const ActionButton = ({ label, icon, onClick, variant }) => {
  return (
    <button onClick={onClick} className={/* styles */}>
      {icon && <Icon />}
      {label}
    </button>
  );
};
export default ActionButton;
```

2. **Export** from `components/index.js`:
```javascript
export { default as ActionButton } from './ActionButton';
```

3. **Use** in any component:
```javascript
import { ActionButton } from '../components';
<ActionButton label="Save" onClick={handleSave} />
```

## 🚀 Performance Optimizations

1. **Code Splitting**: Each component can be lazy-loaded
```javascript
const OrdersTab = lazy(() => import('./tabs/OrdersTab'));
```

2. **Memoization**: Use `useMemo` for expensive calculations
```javascript
const totalSpent = useMemo(() => 
  orders.reduce((sum, order) => sum + order.total, 0),
  [orders]
);
```

3. **Conditional Rendering**: Tabs load only when active
```javascript
{activeTab === TAB_REVIEWS && <ReviewsTab {...props} />}
```

## 🔧 Future Improvements

- [ ] Add skeleton loading states
- [ ] Implement virtualization for large order lists
- [ ] Add unit tests for all components
- [ ] Add Storybook documentation
- [ ] Implement real-time order updates via Supabase subscriptions
- [ ] Add export functionality (CSV, Excel)
- [ ] Implement advanced filtering options
- [ ] Add animations for state transitions

## 📚 Related Documentation

- [Design System Documentation](../../design-system/README.md)
- [Supabase Integration Guide](../../supabase/README.md)
- [Redux Store Structure](../../redux/README.md)

## 🐛 Common Issues

### Issue: Components not rendering
**Solution**: Check barrel exports in `index.js` files

### Issue: Dark mode not working
**Solution**: Ensure Tailwind dark mode is enabled in `tailwind.config.js`

### Issue: Icons not displaying
**Solution**: Verify all icon imports from react-icons

## 👥 Contributing

When adding new features:
1. Keep components small and focused
2. Use PropTypes for type checking
3. Follow existing naming conventions
4. Update this README with new components
5. Add JSDoc comments for functions

## 📄 License

Same as parent project license.

