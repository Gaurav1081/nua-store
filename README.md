Nua Store

A mini e-commerce web app built with React 18 + Vite, SCSS Modules, and the Fake Store API.

Live site: https://nuastore.netlify.app

Setup

Requirements: Node 18+

bashgit clone <your-repo-url>
cd nua-store
npm install
npm run dev

Open http://localhost:5173

bashnpm run build   # Production build
npm run preview # Preview production build

Stack

React 18 with hooks and Context API
Vite build tool
React Router v6 client-side routing
SCSS Modules scoped styles, shared variables in src/styles/_variables.scss
Fake Store API https://fakestoreapi.com
localStorage cart persistence across refreshes


Features

Product listing grid with category filter + sort
Skeleton loading and error/retry states
Product detail with colour swatches, size selector (available/low stock/sold out), quantity picker
Variant (colour + size) synced to URL for deep-linking
Slide-in cart drawer with quantity controls, removal, subtotal/grand total, free shipping threshold
Quick Add to Cart with simulated async + random failure (bonus)
Cart persists in localStorage across page refreshes
Fully responsive — 4-col desktop grid, 2-col mobile, sideways thumbnail scroll on mobile detail

Project Structure

src/
  components/
    Navbar/         sticky header with cart badge
    ProductCard/    listing card with Quick Add
    CartDrawer/     slide-in right drawer
  pages/
    ProductListing  / route
    ProductDetail   /product/:id route
  hooks/
    useProducts.js  data fetching with in-memory cache
  stores/
    CartContext     cart state via useReducer + localStorage
    UIContext       drawer open/close state
  router/           createBrowserRouter config
  data/variants.js  deterministic colour/size/stock generation
  styles/           SCSS variables and global resets

See DECISIONS.md for architectural choices.

Lighthouse (Desktop)
image is in docs/lighthouse.png
Performance 81 · Accessibility 96 · Best Practices 100 · SEO 100