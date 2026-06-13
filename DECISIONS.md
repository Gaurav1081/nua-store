Architectural Decision: Context API vs. Zustand for State

The main fork I considered was React Context API with useReducer vs. a lightweight external store like Zustand.

The case for Zustand: It avoids re-render sprawl more elegantly — you can subscribe to slices, the devtools are excellent, and the API is clean enough that it barely adds mental overhead. For a cart that's read in two or three places (badge, drawer, detail page), Zustand would have been the more scalable choice.

Why I went with Context + useReducer: The spec asked me to justify my choice, and the honest answer is that the app's state surface is small enough that Context is fine. The cart lives in one reducer with five action types. The only consumer of the full cart state is the drawer; the badge just reads totalItems. That's exactly the shape of problem Context was designed for. Pulling in Zustand for this would be choosing a tool because it's cool, not because the problem requires it.

The trade-off: if this grew to include wishlists, recently viewed, filter state, and user auth, I'd migrate to Zustand or Jotai in a single afternoon — the reducer logic ports directly.

I split UI state (drawer open/closed) into its own UIContext so cart re-renders don't cascade into the navbar when someone just opens or closes the drawer.

I also made the variant logic category-aware at the data layer rather than the component layer — getProductVariants returns null for non-clothing categories (electronics, jewelery) so the detail page never renders colour swatches or size buttons for products that don't have them. The alternative was filtering in JSX, but keeping that decision in the data layer means the component stays dumb about category rules.

What I'd Do Differently With More Time

1. Real variant data. The Fake Store API has no colour/size data, so I generated deterministic variants from the product ID. This works — pages are deep-linkable and consistent — but the stock states are fictional. With more time I'd layer on a small JSON fixture or a mock MSW worker to make this feel less like a workaround.

2. Image gallery. FakeStore gives one image per product. I duplicated it four times to satisfy the thumbnail requirement. In a real codebase this would be the first thing I'd replace — even placeholder images differentiated by a colour overlay would be more honest.

3. Testing. I added the mock async add-to-cart with random failure (bonus), but didn't write the unit tests for the variant selector. The component logic for sold-out disabling and quantity capping is straightforward to test with React Testing Library; it just needed more time.

4. Error boundary. Right now a crashed product card would take down the grid. A simple ErrorBoundary wrapper around each card would keep the rest of the page alive.

5. Accessibility audit. I've used aria-label, aria-pressed, role="dialog", and focus management on the drawer, but I haven't run a full axe or Lighthouse accessibility pass. That would be a pre-merge requirement in a real codebase.


