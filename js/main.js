import { products, currency, integrations } from "./catalog.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const money = new Intl.NumberFormat(currency.locale, { style: "currency", currency: currency.code });
const formatPrice = (price) => (typeof price === "number" ? money.format(price) : "Price TBA");
const byId = new Map(products.map((p) => [p.id, p]));

/* ------------------------------------------------------------------ toast */
const toastEl = $("[data-toast]");
let toastTimer;
function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2400);
}

/* ----------------------------------------------------------------- header */
function initHeader() {
  const header = $("[data-header]");
  const toggle = $("[data-menu-toggle]");
  const nav = $("#primary-nav");

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 761px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
}

/* --------------------------------------------------------------- carousel */
function initCarousel() {
  const root = $("[data-carousel]");
  const slides = $$(".hero-slide", root);
  const pauseBtn = $("[data-carousel-pause]", root);
  const INTERVAL = 6000;
  let index = 0;
  let timer = null;
  let userPaused = reduceMotion.matches;

  const show = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((slide, n) => {
      const active = n === index;
      slide.classList.toggle("is-active", active);
      slide.inert = !active;
      slide.setAttribute("aria-hidden", String(!active));
    });
  };

  const stop = () => { clearInterval(timer); timer = null; };
  const start = () => {
    stop();
    if (!userPaused) timer = setInterval(() => show(index + 1), INTERVAL);
  };
  const syncPauseBtn = () => {
    pauseBtn.setAttribute("aria-pressed", String(userPaused));
    pauseBtn.setAttribute("aria-label", userPaused ? "Play slideshow" : "Pause slideshow");
  };

  $("[data-carousel-prev]", root).addEventListener("click", () => { show(index - 1); start(); });
  $("[data-carousel-next]", root).addEventListener("click", () => { show(index + 1); start(); });
  pauseBtn.addEventListener("click", () => { userPaused = !userPaused; syncPauseBtn(); start(); });

  // Pause while the user is reading or interacting with a slide
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", (e) => { if (!root.contains(e.relatedTarget)) start(); });
  root.addEventListener("pointerenter", stop);
  root.addEventListener("pointerleave", start);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  show(0);
  syncPauseBtn();
  start();
}

/* --------------------------------------------------------------- products */
function productCard(p) {
  const li = document.createElement("li");
  li.className = "product";
  li.dataset.productId = p.id;
  const tba = typeof p.price !== "number";
  li.innerHTML = `
    <div class="product-media">
      <img src="${p.image}" width="800" height="800" alt="" loading="lazy">
    </div>
    <div class="product-meta">
      <p class="product-price${tba ? " is-tba" : ""}"></p>
      <span class="product-tag"></span>
    </div>
    <h3 class="product-name"></h3>
    <p class="product-desc"></p>
    <div class="product-actions">
      <button class="btn btn-soft" type="button" data-add>Add to cart</button>
      <button class="btn btn-dark" type="button" data-buy>Buy now</button>
    </div>`;
  // Text set via textContent so catalogue data is never parsed as HTML
  $("img", li).alt = p.alt;
  $(".product-price", li).textContent = formatPrice(p.price);
  $(".product-tag", li).textContent = p.tag;
  $(".product-name", li).textContent = p.name;
  $(".product-desc", li).textContent = p.description;
  $("[data-add]", li).setAttribute("aria-label", `Add ${p.name} to cart`);
  $("[data-buy]", li).setAttribute("aria-label", `Buy ${p.name} now`);
  return li;
}

const ALL_INITIAL = 6;

function initProducts() {
  const newList = $('[data-product-list="new"]');
  const allList = $('[data-product-list="all"]');
  const moreBtn = $("[data-show-more]");

  products.filter((p) => p.isNew).forEach((p) => newList.append(productCard(p)));
  products.forEach((p, i) => {
    const card = productCard(p);
    if (i >= ALL_INITIAL) card.hidden = true;
    allList.append(card);
  });

  if (products.length <= ALL_INITIAL) moreBtn.hidden = true;
  moreBtn.addEventListener("click", () => {
    const revealed = $$("li[hidden]", allList);
    revealed.forEach((li) => (li.hidden = false));
    moreBtn.hidden = true;
    $("button", revealed[0])?.focus({ preventScroll: true });
    revealed[0]?.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" });
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add], [data-buy]");
    if (!btn) return;
    const id = btn.closest("[data-product-id]").dataset.productId;
    cart.add(id);
    if (btn.hasAttribute("data-buy")) openCart(btn);
    else toast(`${byId.get(id).name} added to cart`);
  });
}

/* ------------------------------------------------------------------- cart */
const CART_KEY = "caalipo-cart";
const cart = {
  items: load(),
  add(id) { this.items[id] = (this.items[id] || 0) + 1; this.save(); },
  set(id, qty) { if (qty <= 0) delete this.items[id]; else this.items[id] = qty; this.save(); },
  count() { return Object.values(this.items).reduce((a, b) => a + b, 0); },
  save() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(this.items)); } catch { /* storage unavailable */ }
    renderCart();
  },
};

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    // Drop anything that no longer exists in the catalogue
    return Object.fromEntries(Object.entries(raw).filter(([id, q]) => byId.has(id) && Number.isInteger(q) && q > 0));
  } catch {
    return {};
  }
}

const cartDialog = $("[data-cart]");
let cartOpener = null;

function openCart(opener) {
  cartOpener = opener || document.activeElement;
  $("[data-checkout-msg]").textContent = "";
  if (!cartDialog.open) cartDialog.showModal();
}

function renderCart() {
  const count = cart.count();
  const badge = $("[data-cart-count]");
  badge.textContent = count;
  badge.hidden = count === 0;
  $("[data-open-cart]").setAttribute("aria-label", `Open cart, ${count} item${count === 1 ? "" : "s"}`);

  const list = $("[data-cart-items]");
  const entries = Object.entries(cart.items);
  list.replaceChildren(...entries.map(([id, qty]) => {
    const p = byId.get(id);
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <img src="${p.image}" width="76" height="76" alt="">
      <div>
        <p class="cart-item-name"></p>
        <p class="cart-item-price"></p>
        <div class="qty">
          <button type="button" data-dec>−</button>
          <output aria-live="polite"></output>
          <button type="button" data-inc>+</button>
        </div>
      </div>
      <button class="cart-remove" type="button" data-remove>Remove</button>`;
    $(".cart-item-name", li).textContent = p.name;
    $(".cart-item-price", li).textContent = formatPrice(p.price);
    $("output", li).textContent = qty;
    $("[data-dec]", li).setAttribute("aria-label", `Decrease quantity of ${p.name}`);
    $("[data-inc]", li).setAttribute("aria-label", `Increase quantity of ${p.name}`);
    $("[data-remove]", li).setAttribute("aria-label", `Remove ${p.name} from cart`);
    li.dataset.id = id;
    return li;
  }));

  const empty = entries.length === 0;
  $("[data-cart-empty]").hidden = !empty;
  $("[data-cart-foot]").hidden = empty;

  const allPriced = entries.every(([id]) => typeof byId.get(id).price === "number");
  const subtotal = entries.reduce((sum, [id, q]) => sum + (byId.get(id).price || 0) * q, 0);
  $("[data-cart-subtotal]").textContent = allPriced ? money.format(subtotal) : "Prices TBA";
}

function initCart() {
  $("[data-open-cart]").addEventListener("click", (e) => openCart(e.currentTarget));

  $("[data-cart-items]").addEventListener("click", (e) => {
    const li = e.target.closest(".cart-item");
    if (!li) return;
    const id = li.dataset.id;
    const qty = cart.items[id] || 0;
    if (e.target.closest("[data-inc]")) cart.set(id, qty + 1);
    else if (e.target.closest("[data-dec]")) cart.set(id, qty - 1);
    else if (e.target.closest("[data-remove]")) cart.set(id, 0);
    else return;
    // Keep focus inside the drawer after the list re-renders
    const same = $(`.cart-item[data-id="${id}"] ${e.target.closest("button").hasAttribute("data-inc") ? "[data-inc]" : "[data-dec]"}`);
    (same || $("[data-close-dialog]", cartDialog)).focus();
  });

  $("[data-checkout]").addEventListener("click", () => {
    if (integrations.checkoutUrl) {
      window.location.href = integrations.checkoutUrl;
      return;
    }
    $("[data-checkout-msg]").textContent = "Checkout isn't connected yet, so orders can't be placed. Your cart is saved on this device.";
  });

  renderCart();
}

/* ---------------------------------------------------------------- dialogs */
function initDialogs() {
  $$("dialog").forEach((dlg) => {
    $("[data-close-dialog]", dlg).addEventListener("click", () => dlg.close());
    // Click on the backdrop closes the dialog
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", () => {
      const opener = dlg === cartDialog ? cartOpener : searchOpener;
      if (opener && document.contains(opener)) opener.focus();
    });
  });
}

/* ----------------------------------------------------------------- search */
const searchDialog = $("[data-search]");
let searchOpener = null;

function initSearch() {
  const input = $("[data-search-input]");
  const results = $("[data-search-results]");
  const status = $("[data-search-status]");

  const render = () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.replaceChildren(); status.textContent = "Type to search the catalogue."; return; }
    const hits = products.filter((p) => `${p.name} ${p.description} ${p.tag}`.toLowerCase().includes(q));
    results.replaceChildren(...hits.map((p) => {
      const li = document.createElement("li");
      li.innerHTML = `<button type="button"><img src="${p.image}" width="52" height="52" alt=""><span></span></button>`;
      $("span", li).textContent = `${p.name} — ${formatPrice(p.price)}`;
      $("button", li).dataset.goto = p.id;
      return li;
    }));
    status.textContent = hits.length
      ? `${hits.length} bag${hits.length === 1 ? "" : "s"} found.`
      : `No bags match "${input.value.trim()}". Try a shorter word.`;
  };

  $("[data-open-search]").addEventListener("click", (e) => {
    searchOpener = e.currentTarget;
    searchDialog.showModal();
    input.focus();
    render();
  });
  input.addEventListener("input", render);

  results.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-goto]");
    if (!btn) return;
    const card = $(`[data-product-list="all"] [data-product-id="${btn.dataset.goto}"]`);
    if (card.hidden) $("[data-show-more]").click();
    searchOpener = null;
    searchDialog.close();
    card.classList.add("is-highlight");
    card.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" });
    $("[data-add]", card).focus({ preventScroll: true });
    setTimeout(() => card.classList.remove("is-highlight"), 2400);
  });
}

/* ------------------------------------------------------------- newsletter */
function initNewsletter() {
  const form = $("[data-newsletter]");
  const input = $("input", form);
  const msg = $(".newsletter-msg", form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.classList.remove("is-error");
    if (!input.checkValidity()) {
      msg.classList.add("is-error");
      msg.textContent = input.value ? "Enter a full email address, like name@example.com." : "Enter your email address to subscribe.";
      input.focus();
      return;
    }
    if (!integrations.newsletterEndpoint) {
      msg.textContent = "Sign-up isn't open yet. Follow @caalipobags on Instagram for new drops.";
      return;
    }
    try {
      const res = await fetch(integrations.newsletterEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.value.trim() }),
      });
      if (!res.ok) throw new Error(res.statusText);
      form.reset();
      msg.textContent = "Subscribed. You'll hear about the next drop.";
    } catch {
      msg.classList.add("is-error");
      msg.textContent = "Couldn't subscribe right now. Check your connection and try again.";
    }
  });
}

initHeader();
initCarousel();
initProducts();
initDialogs();
initCart();
initSearch();
initNewsletter();
