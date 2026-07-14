# HiFi Chats

A static marketing + ordering website for **HiFi Chats** — a fictional
street-food brand built around a "chat with your food" concept. There is
no backend and no build step: every page is plain HTML/CSS/JS, and the
"ordering" experience (cart, checkout, chat-bot recommendations) is
simulated entirely in the browser with `localStorage`.

## What's in here

```
.
├── index.html        Home page (hero slider, specials, testimonials)
├── menu.html          Full menu — search, category filters, item modal
├── about.html         Brand story, values, team, timeline
├── catering.html      Catering packages + booking request form
├── chat.html          "Live Chat Center" — scripted bot + agent switcher
├── contact.html       Contact form, hours, map placeholder
├── css/
│   ├── main.css       Design tokens (colors, spacing, type) + base styles
│   ├── components.css Navbar, footer, cart drawer, chat widget, etc.
│   └── animations.css Scroll-reveal / marquee / hero animations
├── js/
│   ├── cart.js        Shared cart (localStorage-backed) + cart drawer UI
│   ├── menu.js         Menu data, filtering, search, add-to-cart
│   ├── hero.js         Home page hero slider
│   └── main.js         Navbar, mobile menu, scroll reveal, chat widget toggle
├── assets/            Images (burger, wrap, bowl, milkshake, interior, hero)
└── docker/            Container build (see "Running with Docker" below)
```

Every page shares the same navbar/footer/chat-widget markup and includes
`js/cart.js` + `js/main.js`, so a change to shared chrome (nav links,
footer columns, hours, etc.) has to be repeated across all six `.html`
files — there's no templating layer.

## The ordering flow (how it fits together)

1. **`js/menu.js`** defines all menu items in one object, `menuData`,
   grouped by category (`burgers`, `wraps`, `bowls`, `drinks`, `sides`).
   Clicking a menu card opens a detail modal; clicking the `+` button
   quick-adds it.
2. Both actions call **`window.Cart.addItem({ id, name, price })`**
   (defined in `js/cart.js`). The cart is a single JS module, loaded on
   every page, that persists its state to `localStorage` — that's what
   lets the cart badge and drawer stay in sync no matter which page
   you're on.
3. The nav's "Order Now" button (desktop + mobile, every page) opens the
   **cart drawer**: line items, quantity controls, a promo-code field,
   and a Checkout button. Checkout shows a fake order confirmation and
   empties the cart — there's no real payment processor or backend.
4. **`chat.html`**'s scripted bot recognizes a few keywords ("burger",
   "wrap", "bowl", "deal"/"coupon") and, for menu items, renders an
   "Add to Order" button using the *same* `window.Cart.addItem` call —
   the ids (`b1`, `w1`, `bo1`, ...) are kept in sync with `menuData` in
   `menu.js` on purpose, so an item added via chat merges with one added
   via the menu page instead of creating a duplicate line.
5. The promo code `HIFICHAT20` (mentioned by the chat bot) is hardcoded
   in `js/cart.js`'s `COUPONS` map and gives 20% off — that's the only
   "coupon" that exists.

## Making future changes

**Add / change a menu item**
Edit the `menuData` object at the top of `js/menu.js`. Each item is:
```js
{ id: 'b5', name: 'New Burger', desc: '...', price: 13.99, badge: 'new', badgeText: '✨ New', calories: 700, image: 'assets/burger.png' }
```
- `id` must be unique across *all* categories (menu, chat, and cart all
  key off it — reusing an id will merge two different items into one
  cart line).
- `badge` is one of `pop` / `hot` / `new` / `veg` / `''` (styled in
  `css/main.css` under `.badge-*`); leave both badge fields `''` for no
  badge.
- `image` can reuse an existing file in `assets/` or you can drop a new
  image there and point to it.
- No other file needs to change — the menu grid, search, and modal all
  render from this object automatically.

**Make the chat bot recommend a new item**
In `chat.html`'s inline `<script>`, add an entry to `chatMenuItems` and a
matching `if (query.includes('...'))` branch inside `generateBotResponse`.
Keep the `id`/`price` identical to the corresponding entry in
`menu.js`'s `menuData` so it merges correctly if the same item is also
added from the menu page.

**Add/adjust a catering package**
Edit the three `.pkg-card` blocks in `catering.html` (name, price, bullet
list) and the matching `<option>` in the booking form's "Selected
Spread" `<select>`. The "Book …" buttons auto-select the right option by
matching the package name — keep the option text and the `.pkg-name`
text consistent.

**Change a promo code / discount**
Edit the `COUPONS` object near the top of `js/cart.js` (`{ CODE: rate }`,
rate is a fraction, e.g. `0.20` = 20% off).

**Change global chrome (nav links, footer, hours, chat widget copy)**
This markup is duplicated across all six `.html` files — update it in
each file. There is no shared layout/include mechanism.

## Running locally without Docker

It's a static site — any static file server works:
```bash
python3 -m http.server 8080
# or
npx serve .
```
Then open `http://localhost:8080`.

## Running with Docker

```
docker/
├── Dockerfile             nginx:alpine, copies the site in, no build step
├── entrypoint.sh          renders the nginx config from $PORT, then execs nginx
└── nginx.conf.template    nginx server block (templated on $PORT)
docker-compose.yml          at the repo root — builds the image and runs it
```

**Build and run:**
```bash
docker compose up -d --build
```
Open **http://localhost:8080**.

**Stop:**
```bash
docker compose down
```

**Use a different host port** (container always listens on 80 internally):
```bash
HOST_PORT=9090 docker compose up -d
```
then open `http://localhost:9090`.

**Rebuild after editing any HTML/CSS/JS/asset:**
```bash
docker compose up -d --build
```
(there's no bind-mount / live-reload — the image bakes in a copy of the
site, so a rebuild is required to see changes through Docker; for active
editing, use the plain static-file-server method above instead.)

**Health check:** the container exposes a Docker healthcheck that curls
`/index.html` internally every 30s; `docker compose ps` will show
`healthy` once nginx is serving.
