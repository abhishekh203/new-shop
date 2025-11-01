# Design System Migration Guide

## ✅ Completed

1. **Created New Light Theme Design System**
   - `/src/design-system/foundations/colors.js` - Light theme color tokens
   - `/src/design-system/foundations/typography.js` - Typography system
   - `/src/design-system/foundations/spacing.js` - Spacing, borders, shadows
   - `/src/design-system/foundations/animations.js` - Animation presets

2. **Created Components**
   - `/src/design-system/components/Button.jsx` - Button component
   - `/src/design-system/components/Card.jsx` - Card component

3. **Created Utilities**
   - `/src/design-system/utils.js` - Helper functions

4. **Cleaned Up**
   - Removed outdated `icons.js` file
   - Updated all export files

## 📋 Design System Structure

```
src/design-system/
├── foundations/
│   ├── colors.js          # Light theme colors
│   ├── typography.js      # Font system
│   ├── spacing.js         # Spacing, radius, shadows
│   ├── animations.js      # Animations
│   └── index.js          # Exports
├── components/
│   ├── Button.jsx
│   ├── Card.jsx
│   └── index.js
├── utils.js               # Helper functions
└── index.js              # Main export
```

## 🎨 Color System

### Primary Colors
- **Teal**: Primary brand color (Teal 500)
- **Cyan**: Secondary brand color (Cyan 500)
- **Blue**: Accent color

### Gradients
- `colors.gradients.primary` - Teal to Cyan
- `colors.gradients.primaryHover` - Darker teal to cyan
- `colors.gradients.secondary` - Blue to Cyan

### Theme Tokens
- `colors.theme.background` - White
- `colors.theme.textPrimary` - Gray 900
- `colors.theme.textSecondary` - Gray 600
- `colors.theme.border` - Gray 200

## 📝 Usage Examples

### Using Colors
```jsx
import { colors } from '../design-system'

// Background
style={{ background: colors.theme.background }}

// Text
style={{ color: colors.theme.textPrimary }}

// Gradient
style={{ background: colors.gradients.primary }}
```

### Using Typography
```jsx
import { textStyles } from '../design-system'

<h1 style={textStyles.h1}>Heading</h1>
<p style={textStyles.body}>Body text</p>
```

### Using Spacing
```jsx
import { spacing } from '../design-system'

<div style={{ padding: spacing[4] }}>Content</div>
```

### Using Components
```jsx
import { Button, Card } from '../design-system'

<Button variant="primary" size="medium">
  Click Me
</Button>

<Card variant="elevated" padding="medium">
  Card content
</Card>
```

## 🔄 Next Steps

1. Replace hardcoded colors in components
2. Replace hardcoded spacing values
3. Replace hardcoded typography classes
4. Update Tailwind config to use design system colors
5. Convert dark theme components to light theme

## 📌 Components to Update

- [ ] HeroSection.jsx
- [ ] HomePage.jsx
- [ ] OTTSubscriptionInfo.jsx
- [ ] HomePageProductCard.jsx
- [ ] SubscriptionPage.jsx

## 💡 Tips

- Use `colors.theme.*` for semantic colors
- Use `colors.gradients.*` for gradients
- Use `textStyles.*` instead of Tailwind text classes
- Use `spacing[*]` instead of hardcoded px values
- Use `borderRadius.*` for rounded corners

