// Placeholder catalogue — replace with real Caalipo products.
// Every product field below is a placeholder: no real names, prices or
// descriptions have been supplied yet. `price: null` renders as "Price TBA"
// and keeps the cart from showing a made-up total.

const img = (label, w = 800, h = 800) =>
  `https://placehold.co/${w}x${h}/F5F0E8/A89F94?font=inter&text=${encodeURIComponent(label)}`;

const pad = (n) => String(n).padStart(2, "0");

export const products = Array.from({ length: 12 }, (_, i) => {
  const n = pad(i + 1);
  return {
    id: `bag-${n}`,
    name: `Bag name ${n}`,
    description: "Short product description to be supplied.",
    price: null, // number in the store currency, e.g. 89.0
    tag: "Denim bag",
    isNew: i < 6,
    image: img(`Bag photo ${n}`),
    alt: `Placeholder for bag ${n} product photo`,
  };
});

export const currency = { code: "USD", locale: "en-US" }; // placeholder — confirm store currency

// Integration points that do not exist yet. Leave as null until connected.
export const integrations = {
  checkoutUrl: null, // e.g. Shopify / Stripe Checkout URL
  newsletterEndpoint: null, // e.g. Klaviyo / Mailchimp form endpoint
};
