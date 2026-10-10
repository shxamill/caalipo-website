# Caalipo website

Static storefront home page for Caalipo (Gen-Z fashion bags). Plain HTML, CSS and JavaScript modules, with no build step and no dependencies.

## Run locally

```bash
node serve.mjs
```

Then open http://localhost:3000.

## Screenshots

```bash
node screenshot.mjs http://localhost:3000 <label> 1440 768 390
```

This uses the installed `google-chrome` in headless mode and saves PNGs to `temporary screenshots/` without overwriting earlier ones.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Page markup. Static section placeholders (`placehold.co`) live here. |
| `css/styles.css` | Design tokens (brand colours and type) at the top, then styles for each section. |
| `js/catalog.js` | **Product data, currency and integration settings**. Replace the placeholders here. |
| `js/main.js` | Hero slider, mobile menu, product rendering, cart drawer, search, newsletter form. |
| `assets/img/` | Web copies of the official logo (transparent PNGs cut from `brand_assets/logo.jpeg`) plus favicons. |
| `brand_assets/` | Source brand files (brand PDF, logo, design reference). Kept locally and git-ignored, not published. |

## Still to supply

- **Products:** names, prices, descriptions, photos and currency, set in `js/catalog.js`. Prices show "Price TBA" until set.
- **Photography:** hero (3 photos), promo cards (3), lookbook tiles (3) and the CTA banner. Search `placehold.co` in `index.html`.
- **Craft video:** the "The making" tile is a poster with a "Video coming soon" label. Replace it with a `<video>` element when the film exists.
- **Checkout:** set `integrations.checkoutUrl`. Until then the cart works locally and checkout explains that it isn't connected.
- **Newsletter:** set `integrations.newsletterEndpoint`. Until then the form validates the address and says sign-up isn't open.
- **Logo:** the header and footer place the official mark beside the wordmark (a side-by-side layout assembled from the official file). A reversed (white or cream) version would read better on the dark footer.
- **Help, legal and contact pages:** shipping, returns, privacy, terms and a contact address. None are linked yet because none exist.
