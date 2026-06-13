Context API vs. Zustand
The main fork I considered was React Context API with useReducer vs. a lightweight external store like Zustand.

Zustand would have been the more scalable choice  you can subscribe to slices, the devtools are excellent, and the API is clean enough that it barely adds mental overhead. For a cart that's read in two or three places (badge, drawer, detail page), it makes a lot of sense.

I went with Context + useReducer because the honest answer is the state surface is small enough that it doesn't need it. The cart lives in one reducer with five action types. The only consumer of the full cart state is the drawer, the badge just reads totalItems. That's exactly the shape of problem Context was designed for. Pulling in Zustand here would be choosing a tool because it's cool, not because the problem requires it.

The trade-off is obvious: if this grew to include wishlists, recently viewed, filter state, and user auth, I'd migrate to Zustand or Jotai, the reducer logic ports directly, so it wouldn't be a painful refactor.

One thing I did split out: UI state (drawer open/closed) lives in its own UIContext so cart re-renders don't cascade into the navbar every time someone opens or closes the drawer.

I also made the variant logic category-aware at the data layer rather than the component layer. getProductVariants returns null for non-clothing categories (electronics, jewelery), so the detail page never renders colour swatches or size buttons for products that don't have them. The alternative was a conditional in JSX, but putting the rule in the data layer keeps the component dumb about category logic, which felt cleaner.

What I'd Do Differently With More Time

Real variant data. The Fake Store API has no colour or size data, so I generated deterministic variants from the product ID. It works pages are deep-linkable and consistent, but the stock states are made up. I'd replace this with a small JSON fixture or a mock MSW worker, it would at least feel like a real workaround rather than a hack.

Image gallery. FakeStore gives one image per product. I duplicated it four times to hit the thumbnail requirement. That's the most obviously fake part of the build, even placeholder images with a colour overlay would be more honest.

Tests. I wired up the mock async add-to-cart with random failure (the bonus), but ran out of time for the unit tests on the variant selector. The sold-out disabling and quantity capping logic is simple enough to test with React Testing Library; it just didn't make the cut.

Error boundary. A crashed product card currently takes down the whole grid. A simple ErrorBoundary wrapper around each card would contain the damage, that's a ten-minute fix I'd do before this went anywhere near production.

Accessibility. I've used aria-label, aria-pressed, role="dialog", and focus-trapped the drawer, but I haven't done a proper axe or Lighthouse accessibility pass. That would be a pre-merge requirement on a real team.
