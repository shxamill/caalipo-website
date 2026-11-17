# Contributing

This repository is a static storefront prototype built with HTML, CSS, and browser JavaScript modules.

## Local development

A recent Node.js version is needed for the local server:

~~~bash
node serve.mjs
~~~

Open http://localhost:3000. No npm install or build step is required.

## Before opening a pull request

Run basic syntax checks:

~~~bash
node --check serve.mjs
node --check screenshot.mjs
node --experimental-default-type=module --check js/catalog.js
node --experimental-default-type=module --check js/main.js
~~~

Also verify the storefront at desktop and mobile widths, product rendering, cart interactions, menu behavior, and browser-console output.

## Product and commerce rules

- Do not invent product names, descriptions, prices, stock, shipping terms, or policies.
- Keep checkoutUrl and newsletterEndpoint unset until the real services are connected and tested.
- Do not collect or store customer information in this static prototype.
- Confirm rights before adding product photography, brand assets, fonts, or third-party content.
- Never commit API keys, payment secrets, .env files, or private customer information.

There is currently no automated browser or unit-test suite.
