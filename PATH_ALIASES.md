# Path Aliases Guide

This project uses path aliases to make imports cleaner and more maintainable. Instead of using relative paths like `../../../utils/logger`, you can use absolute paths with aliases.

## Available Aliases

| Alias | Path | Usage |
|-------|------|-------|
| `@` | `/src` | Root source directory |
| `@components` | `/src/components` | Reusable UI components |
| `@pages` | `/src/pages` | Page-level components |
| `@utils` | `/src/utils` | Utility functions |
| `@hooks` | `/src/hooks` | Custom React hooks |
| `@context` | `/src/context` | React Context providers |
| `@design-system` | `/src/design-system` | Design system components |
| `@assets` | `/src/assets` | Static assets |
| `@config` | `/src/config` | Configuration files |
| `@redux` | `/src/redux` | Redux store and slices |
| `@routes` | `/src/routes` | Routing configuration |
| `@providers` | `/src/providers` | App-level providers |
| `@supabase-config` | `/src/supabase` | Supabase configuration |
| `@protected-route` | `/src/protectedRoute` | Protected route components |

## Examples

### Before (Relative Imports)
```javascript
// From a deeply nested component
import Layout from "../../../components/layout/Layout";
import { sanitizeInput } from "../../../utils/security";
import { useAuth } from "../../../hooks/auth/useAuth";
import { serifTheme } from "../../../design-system/themes/serifTheme";
```

### After (Path Aliases)
```javascript
// Clean, absolute imports
import Layout from "@components/layout/Layout";
import { sanitizeInput } from "@utils/security";
import { useAuth } from "@hooks/auth/useAuth";
import { serifTheme } from "@design-system/themes/serifTheme";
```

## Benefits

1. **Cleaner Code**: No more `../../../` chains
2. **Better Maintainability**: Moving files doesn't break imports
3. **Improved Readability**: Clear indication of where imports come from
4. **IDE Support**: Better autocomplete and navigation
5. **Consistent Imports**: Same import path regardless of file location

## Usage Guidelines

1. **Always use aliases** for imports from different directories
2. **Use relative imports** only for files in the same directory
3. **Prefer specific aliases** over the generic `@` alias when possible

### Good Examples
```javascript
import logger from "@utils/logger";
import { Button } from "@design-system/components";
import HomePage from "@pages/home/HomePage";
```

### Avoid
```javascript
import logger from "@/utils/logger"; // Use @utils instead
import Button from "./Button"; // OK for same directory
import HomePage from "../../../pages/home/HomePage"; // Use @pages instead
```

## IDE Configuration

### VS Code
The path aliases should work automatically with VS Code. If you encounter issues, create a `jsconfig.json` file:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@utils/*": ["src/utils/*"],
      "@hooks/*": ["src/hooks/*"],
      "@context/*": ["src/context/*"],
      "@design-system/*": ["src/design-system/*"],
      "@assets/*": ["src/assets/*"],
      "@config/*": ["src/config/*"],
      "@redux/*": ["src/redux/*"],
      "@routes/*": ["src/routes/*"],
      "@providers/*": ["src/providers/*"],
      "@supabase-config/*": ["src/supabase/*"],
      "@protected-route/*": ["src/protectedRoute/*"]
    }
  },
  "include": ["src/**/*"]
}
```

## Migration Guide

When updating existing imports:

1. **Identify the target directory** of your import
2. **Find the corresponding alias** from the table above
3. **Replace the relative path** with the alias
4. **Test that imports still work** by running the dev server

Example migration:
```javascript
// Before
import { supabase } from "../../supabase/supabaseConfig";

// After  
import { supabase } from "@supabase-config/supabaseConfig";
```
