# Frontend Structure Guide

## Directory Overview

```
src/
├── components/               # React components
│   ├── admin/               # Admin panel components
│   │   ├── AdminLayout.tsx  # Main admin layout wrapper
│   │   ├── Header.tsx       # Admin header/navigation
│   │   └── Sidebar.tsx      # Admin sidebar menu
│   ├── site/                # Public website components
│   │   ├── Categories.tsx   # Product categories section
│   │   ├── Delivery.tsx     # Delivery info section
│   │   ├── Faq.tsx          # FAQ section
│   │   ├── FeaturedCollection.tsx  # Featured products
│   │   ├── Footer.tsx       # Site footer
│   │   ├── Hero.tsx         # Hero/banner section
│   │   ├── Ingredients.tsx  # Ingredients section (product details)
│   │   ├── Instagram.tsx    # Instagram feed integration
│   │   ├── LimitedOffer.tsx # Limited time offers
│   │   ├── Nav.tsx          # Main navigation bar
│   │   ├── Newsletter.tsx   # Newsletter signup
│   │   ├── Process.tsx      # Process/workflow section
│   │   ├── Reviews.tsx      # Customer reviews section
│   │   ├── SectionHeading.tsx # Reusable section titles
│   │   ├── Stats.tsx        # Statistics display
│   │   ├── StickyCTAs.tsx   # Sticky call-to-action buttons
│   │   ├── Story.tsx        # Brand story section
│   │   ├── Trust.tsx        # Trust indicators
│   │   └── TrustBar.tsx     # Trust badge bar
│   └── ui/                  # shadcn/ui & Radix UI components
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       └── tooltip.tsx
├── routes/                   # TanStack Router route definitions
│   ├── __root.tsx           # Root layout wrapper
│   ├── index.tsx            # Home page
│   ├── admin/               # Admin section routes
│   │   ├── __root.tsx       # Admin layout
│   │   ├── login.tsx        # Admin login page
│   │   ├── dashboard.tsx    # Dashboard
│   │   ├── categories.tsx   # Manage categories
│   │   ├── coupons.tsx      # Manage coupons
│   │   ├── orders.tsx       # Manage orders
│   │   ├── payments.tsx     # Manage payments
│   │   ├── products.tsx     # Manage products
│   │   ├── reviews.tsx      # Manage reviews
│   │   ├── users.tsx        # Manage users
│   │   └── analytics/       # Analytics sub-routes
│   ├── README.md            # Route configuration guide
│   └── [Other public routes as needed]
├── lib/                      # Utility libraries
│   ├── api/                 # API client configuration
│   │   ├── axios.ts         # Axios instance with base URL
│   │   ├── admin.ts         # Admin API functions
│   │   └── example.functions.ts  # Example API calls
│   ├── utils.ts             # General utility functions
│   ├── error-capture.ts     # Error handling utilities
│   ├── error-page.ts        # Error page rendering
│   ├── config.server.ts     # Server-side configuration
│   └── lovable-error-reporting.ts  # Error reporting
├── store/                    # Redux state management
│   ├── store.ts             # Redux store configuration
│   ├── hooks.ts             # Redux hooks (useSelector, useDispatch)
│   └── adminSlice.ts        # Admin state slice
├── hooks/                    # Custom React hooks
│   └── use-mobile.tsx       # Mobile device detection hook
├── assets/                   # Static assets
├── styles.css               # Global CSS styles
├── router.tsx               # Router configuration (TanStack)
├── routeTree.gen.ts         # Auto-generated route tree (TanStack)
├── server.ts                # Server-side rendering setup
└── start.ts                 # Application entry point

```

## Key Files

### Application Entry Points

**start.ts**
- Main application entry point
- Initializes React and router
- Mounts app to DOM

**server.ts**
- Server-side rendering (SSR) configuration
- Error handling wrapper
- TanStack Start integration

**router.tsx**
- Main router configuration
- Route definitions loader
- Path generation utilities

### Routes

**__root.tsx** (Root Layout)
- Wraps entire application
- Provides global context/providers
- Header, footer, navigation

**admin/__root.tsx** (Admin Layout)
- Admin panel wrapper
- Authentication check
- Admin sidebar/header
- Role-based access control

**admin/login.tsx**
- Admin authentication form
- JWT token management
- Session persistence

**admin/dashboard.tsx**
- Admin dashboard statistics
- Revenue, orders, products metrics
- Charts and analytics

**index.tsx**
- Public home page
- Landing page content
- Product showcase

### State Management (Redux)

**store.ts**
- Redux store configuration
- Middleware setup
- Dev tools integration

**adminSlice.ts**
- Admin user state
- Authentication status
- Admin data (permissions, profile)

**hooks.ts**
- Redux hooks re-exports
- Custom state selectors

### API Integration

**lib/api/axios.ts**
- Axios instance configuration
- Base URL from environment
- Global request/response interceptors

**lib/api/admin.ts**
- Admin-specific API functions
- Login, dashboard, user management
- CRUD operations

### Component Organization

**Components are organized by context:**

- **admin/** - Admin panel components (AdminLayout, Header, Sidebar)
- **site/** - Public website components (Hero, Nav, Footer, etc.)
- **ui/** - Reusable UI components (from shadcn/ui)

### Styling

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - React components built with Radix UI + Tailwind
- **Global CSS** - `styles.css` for base styles
- **Component CSS** - Co-located with component files

## Component Naming Convention

```typescript
// Functional components with TypeScript
export function ComponentName() {
  return <div>...</div>
}

// With props interface
interface ComponentProps {
  title: string
  onClose?: () => void
}

export function ComponentName({ title, onClose }: ComponentProps) {
  return <div>...</div>
}
```

## TanStack Router Configuration

Routes are file-based in the `routes/` directory:

```
routes/
├── __root.tsx          → /
├── index.tsx           → /
├── admin.tsx           → /admin (if exists)
└── admin/
    ├── __root.tsx      → /admin layout
    └── dashboard.tsx   → /admin/dashboard
```

The router tree is auto-generated in `routeTree.gen.ts`.

## State Management Pattern

**For global admin state:**
```typescript
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '@/store/adminSlice'

export function AdminPanel() {
  const user = useSelector(state => state.admin.user)
  const dispatch = useDispatch()
  
  return <div>{user.name}</div>
}
```

## API Call Pattern

```typescript
import { apiClient } from '@/lib/api/axios'

// Direct fetch
const response = await apiClient.get('/admin/dashboard')

// Using pre-built functions
import { loginAdmin, getDashboard } from '@/lib/api/admin'
const data = await getDashboard(token)
```

## Performance Optimization

✅ **Current Optimizations**
- Code splitting via TanStack Router
- Lazy loaded components where possible
- Tailwind CSS production build optimization
- Image optimization (consider in uploads)
- Redux store optimization

⚠️ **Recommended Additions**
- React Query for API caching
- Memoization for expensive components
- Image lazy loading
- Bundle analysis
- Route-based code splitting

## Development Workflow

1. Create route in `routes/` directory
2. Create components in `components/` as needed
3. Add API functions to `lib/api/`
4. Update Redux state if needed
5. Style with Tailwind CSS
6. Test in dev server: `npm run dev`

## Common Patterns

### Protected Route Example
```typescript
// In admin/__root.tsx
if (!isAuthenticated) {
  return <Navigate to="/admin/login" />
}
```

### API Call with Loading
```typescript
const [loading, setLoading] = useState(false)
const [data, setData] = useState(null)

useEffect(() => {
  setLoading(true)
  apiClient.get('/admin/dashboard')
    .then(res => setData(res.data))
    .finally(() => setLoading(false))
}, [])
```

### Using UI Components
```typescript
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function Example() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  )
}
```

## Assets

Place static files in `assets/`:
- Images: `assets/images/`
- Icons: `assets/icons/`
- Fonts: `assets/fonts/`

Reference in components:
```typescript
import logo from '@/assets/images/logo.png'
<img src={logo} alt="Logo" />
```

## Troubleshooting

**Route not found**
- Check `routeTree.gen.ts` was regenerated
- Verify file in `routes/` directory exists

**Component not rendering**
- Check imports are correct
- Verify parent route is rendering
- Check browser console for errors

**API calls failing**
- Verify backend is running on port 4000
- Check `VITE_API_BASE_URL` in .env
- Check JWT token in local storage (if needed)

**Styling issues**
- Ensure Tailwind CSS classes are used
- Check `tailwind.config.js` for custom configuration
- Rebuild Tailwind if needed
