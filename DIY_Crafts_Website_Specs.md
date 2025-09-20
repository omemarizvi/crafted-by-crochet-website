# DIY Crafts Website - High-Level Specifications

## Project Overview
A DIY crafts marketplace where admin users can post handmade items for sale, and visitors can browse, add to cart, and purchase items through bank transfer with image confirmation.

## Core Features

### 1. Admin Features
- **Admin Login**: Simple username/password authentication
- **Item Management**: 
  - Post new items (name, image, description, cost, category, stock quantity)
  - Edit existing items
  - Delete items
  - Mark items as sold
- **Order Management**: View all placed orders with customer details and transfer images
- **Analytics Dashboard**: Basic stats (total items, orders, popular categories)

### 2. Customer Features
- **Browse Items**: View all available items in a clean, Instagram-like grid
- **Search**: Search by product name
- **Categories**: Filter by categories (flowers, keychains, accessories, stuffed toys, jewellery, etc.)
- **Shopping Cart**: Add/remove items, adjust quantities
- **Checkout Process**: 
  - Enter personal details (name, email, contact, shipping address)
  - Upload bank transfer screenshot
  - Place order

### 3. Technical Approach
- **No-Cost Solution**: Static website with client-side functionality
- **Data Storage**: Email-based order management (orders sent to admin email)
- **No Backend Database**: Use localStorage for cart, email for order submission
- **Image Handling**: Direct image uploads to email attachments

## Mini ADR: Video vs Photos

**Decision**: Photos only

**Rationale**:
- **Storage Cost**: Zero - no server storage needed
- **User Experience**: Faster loading, easier to browse on mobile
- **Technical Complexity**: Simpler implementation
- **Mobile-First**: Photos are more mobile-friendly for quick browsing
- **Admin Workflow**: Easier for admin to manage photo uploads

**Trade-offs**:
- Less detailed product showcase
- **Mitigation**: Allow multiple photos per item, high-quality images

## UI/UX Specifications

### Design Principles
- **Mobile-First**: Optimized for phone screens
- **Clean & Simple**: Minimal clutter, focus on products
- **Instagram Vibes**: Large, beautiful product photos
- **Easy Navigation**: Intuitive scrolling and filtering

### Page Layouts

#### 1. Homepage (Customer View)
```
┌─────────────────────────────────────┐
│  🏠 DIY Crafts Marketplace          │
├─────────────────────────────────────┤
│  [Search Box: "Search products..."] │
│  [All] [Flowers] [Keychains] [Toys] [Jewellery] │
├─────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│  │ IMG │ │ IMG │ │ IMG │ │ IMG │    │
│  │ $15 │ │ $8  │ │ $25 │ │ $12 │    │
│  │Name │ │Name │ │Name │ │Name │    │
│  └─────┘ └─────┘ └─────┘ └─────┘    │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│  │ IMG │ │ IMG │ │ IMG │ │ IMG │    │
│  │ $20 │ │ $5  │ │ $18 │ │ $30 │    │
│  │Name │ │Name │ │Name │ │Name │    │
│  └─────┘ └─────┘ └─────┘ └─────┘    │
└─────────────────────────────────────┘
```

#### 2. Product Detail Modal
```
┌─────────────────────────────────────┐
│  [×] Close                          │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  │        LARGE IMAGE              │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│  Product Name - $25                 │
│  Category: Keychains                │
│  Stock: 3 available                 │
│                                     │
│  Description:                       │
│  Handmade wooden keychain with...   │
│                                     │
│  [Add to Cart] [Contact Seller]     │
└─────────────────────────────────────┘
```

#### 3. Shopping Cart
```
┌─────────────────────────────────────┐
│  🛒 Shopping Cart (3 items)         │
├─────────────────────────────────────┤
│  ┌─────┐ Product Name        $15    │
│  │ IMG │ Qty: [2] [Remove]          │
│  └─────┘                            │
│  ┌─────┐ Product Name        $8     │
│  │ IMG │ Qty: [1] [Remove]          │
│  └─────┘                            │
│                                     │
│  Total: $38                         │
│  [Checkout] [Continue Shopping]     │
└─────────────────────────────────────┘
```

#### 4. Checkout Process
```
┌─────────────────────────────────────┐
│  Checkout                           │
├─────────────────────────────────────┤
│  Personal Information:              │
│  Name: [________________]           │
│  Email: [________________]          │
│  Contact: [________________]        │
│  Address: [________________]        │
│                                     │
│  Bank Transfer Details:             │
│  Account: 1234-5678-9012            │
│  Amount: $38                        │
│                                     │
│  Upload Transfer Screenshot:        │
│  [Choose File] [Preview]            │
│                                     │
│  [Place Order]                      │
└─────────────────────────────────────┘
```

#### 5. Admin Login
```
┌─────────────────────────────────────┐
│  Admin Login                        │
├─────────────────────────────────────┤
│  Username: [________________]       │
│  Password: [________________]       │
│                                     │
│  [Login]                            │
└─────────────────────────────────────┘
```

#### 6. Admin Dashboard
```
┌─────────────────────────────────────┐
│  Admin Dashboard                    │
├─────────────────────────────────────┤
│  Analytics:                         │
│  Total Items: 25 | Orders: 12       │
│  Popular: Keychains (8 sales)       │
│                                     │
│  [Add New Item] [View Orders]       │
│                                     │
│  Recent Orders:                     │
│  • John D. - 2 items - $23          │
│  • Sarah M. - 1 item - $15          │
│                                     │
│  Manage Items:                      │
│  [Edit] [Delete] [Mark Sold]        │
└─────────────────────────────────────┘
```

#### 7. Add/Edit Item Form
```
┌─────────────────────────────────────┐
│  Add New Item                       │
├─────────────────────────────────────┤
│  Item Name: [________________]      │
│  Category: [Dropdown: Select]       │
│  Price: $[________________]         │
│  Stock: [________________]          │
│                                     │
│  Description:                       │
│  [________________________]         │
│  [________________________]         │
│                                     │
│  Upload Image:                      │
│  [Choose File] [Preview]            │
│                                     │
│  [Save Item] [Cancel]               │
└─────────────────────────────────────┘
```

## Technical Implementation Plan

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: CSS Grid/Flexbox for responsive design
- **Data Storage**: localStorage for cart, email for orders
- **Email Service**: EmailJS or similar for order submissions
- **Hosting**: GitHub Pages (free)

### File Structure
```
/
├── index.html (Homepage)
├── admin.html (Admin dashboard)
├── css/
│   ├── style.css (Main styles)
│   └── admin.css (Admin-specific styles)
├── js/
│   ├── main.js (Customer functionality)
│   ├── admin.js (Admin functionality)
│   └── cart.js (Shopping cart logic)
├── images/
│   └── products/ (Product images)
└── README.md
```

### Key Features Implementation
1. **Responsive Grid**: CSS Grid for product display
2. **Image Optimization**: Compress images for web
3. **Search/Filter**: Client-side JavaScript filtering
4. **Cart Management**: localStorage persistence
5. **Email Integration**: EmailJS for order submission
6. **Admin Authentication**: Simple password protection

### Data Flow
1. **Products**: Stored in JavaScript objects, managed by admin
2. **Cart**: Stored in localStorage
3. **Orders**: Sent via email to admin with all details
4. **Analytics**: Calculated from stored data

## Success Metrics
- Mobile-responsive design
- Fast loading times (<3 seconds)
- Intuitive navigation
- Successful order placement
- Admin can manage items easily

---

**Next Steps**: Please review this specification and let me know if you'd like any changes before I proceed with the implementation.
