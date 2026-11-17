# Caalipo website

Static storefront home page for Caalipo (Gen-Z fashion bags). Plain HTML, CSS and JavaScript modules, with no build step and no application dependencies.

## Run locally

Use a recent Node.js release:

~~~bash
node serve.mjs
~~~

Then open http://localhost:3000.

## Screenshots

~~~bash
node screenshot.mjs http://localhost:3000 <label> 1440 768 390
~~~

This uses the installed google-chrome in headless mode and saves PNGs to temporary screenshots/ without overwriting earlier ones.

## Structure

| Path | Purpose |
| --- | --- |
| index.html | Page markup and section placeholders |
| css/styles.css | Design tokens and section styles |
| js/catalog.js | Product catalogue, currency, and integration placeholders |
| js/main.js | Hero slider, mobile menu, product rendering, cart drawer, search, and newsletter UI |
| assets/img/ | Web-ready logo and favicon files |
| serve.mjs | Dependency-free local development server |
| screenshot.mjs | Browser screenshot utility |

## Still to supply

- **Products:** real names, prices, descriptions, photos and currency in js/catalog.js. Prices intentionally remain "Price TBA" until verified details are provided.
- **Photography:** replace the placeholder images in index.html with approved product and campaign photography.
- **Craft video:** the "The making" tile is currently a poster with a "Video coming soon" label.
- **Checkout:** integrations.checkoutUrl is null, so the cart is local only and checkout is not connected.
- **Newsletter:** integrations.newsletterEndpoint is null, so sign-up is not connected to a mailing service.
- **Legal and support pages:** shipping, returns, privacy, terms and contact details still need to be supplied before a public commerce launch.
- **Logo:** review the reversed footer treatment when an approved light logo variant is available.

## Current status

This repository is a storefront front-end prototype, not a live e-commerce checkout. Do not represent placeholder products, prices, shipping, newsletter, or payment integrations as operational.

## Maintainer guidance

See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), and [SUPPORT.md](SUPPORT.md).

## License and asset rights

No repository-level open-source license is currently provided. Brand marks, product photographs, fonts, and other creative assets may have separate rights. Do not assume public availability grants permission to reuse them.
