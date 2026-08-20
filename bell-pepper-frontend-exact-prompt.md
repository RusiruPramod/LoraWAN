# Bell Pepper Smart Monitoring — Exact Frontend Build Prompt

> This is the precise prompt that reproduces the frontend exactly as built. Use this if you need to regenerate, hand off, or rebuild the same app in Lovable, another AI builder, or a fresh project.

---

Act as a senior frontend engineer and UI/UX designer. Build a production-quality **frontend-only** web application for a **Bell Pepper Smart Monitoring System**. No real backend calls yet — use mock data everywhere, but structure the code so Firebase can be wired in later without restructuring.

## 1. Tech Stack (exact)

- React 18 + Vite
- React Router v6 (`react-router-dom`) for real page routing with a protected-route wrapper
- Tailwind CSS (core utility classes only, no custom compiler config beyond a small `brand` color extension)
- `lucide-react` for icons
- `recharts` for charts
- `three` (r0.160-class API) for a 3D visualization — no OrbitControls, no CapsuleGeometry
- Firebase SDK listed as a dependency but **not initialized/called yet** — only a config scaffold

## 2. Project Structure (exact)

```
bell-pepper-monitor/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── .env.example
├── .gitignore
├── src/
│   ├── main.jsx                 # mounts BrowserRouter + AuthProvider + App
│   ├── App.jsx                  # <Routes>: /login (public), / (protected, nested)
│   ├── index.css                # tailwind base/components/utilities
│   ├── context/
│   │   └── AuthContext.jsx      # mock auth: login(email) sets a user object, logout clears it
│   ├── services/
│   │   └── firebase.js          # commented-out Firebase init using import.meta.env vars
│   ├── data/
│   │   └── mockData.js          # IDEAL_RANGES, LIVE_READINGS, statusFor(), SUGGESTIONS, genHistory(), POWER_COMPARISON
│   ├── components/
│   │   ├── ui.jsx               # Card, StatusBadge
│   │   ├── PageHeader.jsx       # title + "System Online" + "Updated 10 seconds ago"
│   │   ├── Sidebar.jsx          # nav + user block + logout
│   │   ├── AppLayout.jsx        # sidebar + mobile topbar + <Outlet/>
│   │   ├── ConditionCard.jsx    # icon + label + value + StatusBadge
│   │   ├── SuggestionCard.jsx   # good/warn tone card
│   │   ├── EnergyTank.jsx       # animated vertical fill bar
│   │   └── CommunicationScene.jsx  # Three.js scene, mounts into a ref'd div
│   └── pages/
│       ├── Login.jsx
│       ├── Dashboard.jsx
│       ├── Plant.jsx
│       ├── History.jsx
│       ├── Power.jsx
│       ├── Communication.jsx
│       └── Settings.jsx
```

Routing exact shape:
- `/login` — public, redirects to `/` if already logged in
- `/` — protected, renders `AppLayout`, nested index route = Dashboard
- `/plant`, `/history`, `/power`, `/communication`, `/settings` — protected, nested under `/`
- any unknown path → redirect to `/`

## 3. Design System (exact)

- **Background:** `bg-gray-50` for the app shell, white cards
- **Cards:** `bg-white border border-gray-100 rounded-3xl shadow-sm`
- **Primary color:** green — `green-600` / `green-700` for actions and active nav; `green-50` / `green-100` for soft backgrounds and badges
- **Status colors:** Good/Healthy = green badge, Low/High/Needs Attention = amber badge, Critical = red badge, No Data = gray badge — **status is always shown as text, never color alone**
- **Radius:** rounded-2xl/3xl consistently on cards, inputs, buttons
- **Spacing:** generous padding (`p-5`–`p-8` on cards, `gap-4`–`gap-6` on grids)
- **Typography:** one sans font (system default via Tailwind), clear hierarchy — page title `text-2xl font-semibold`, card titles `text-sm font-semibold`, big values `text-2xl`–`text-4xl font-semibold`
- Avoid: neon colors, dark backgrounds, heavy shadows, dense layouts

## 4. Page-by-Page Content (exact)

### Login (`/login`)
- Logo mark + "Bell Pepper Monitor" + tagline "Monitor your plant. Understand its health. Grow better."
- Toggle pill: **Log in** / **Create account**
- Login fields: Email, Password (show/hide), "Forgot password?" link, submit button "Log in"
- Register fields: Name, Email, Password, Confirm password, submit button "Create account"
- Footer note: "Demo mode — any email/password will sign you in."
- Submitting calls `login({ email })` from `AuthContext` and navigates to `/`

### Sidebar (all protected pages)
- Top: logo + "Bell Pepper Monitor"
- Nav: Dashboard, Plant, History, Power, Communication, Settings — active item gets `bg-green-50 text-green-700`
- Bottom: user avatar initial + name + "Online" dot + **Logout** button
- Mobile: sidebar becomes an off-canvas drawer with a topbar hamburger button

### Dashboard (`/`)
1. `PageHeader`: "Good morning 👋" / "Bell Pepper Monitor"
2. Hero **Plant Health** card (green gradient, white text): "Plant Health" label, "Healthy" headline, "Your bell pepper plant is growing under good conditions.", pill "Overall Condition: Good"
3. **Current Conditions** grid (5 `ConditionCard`s): Temperature (28°C, Good), Humidity (68%, Good), Nitrogen (46 ppm, Good), Phosphorus (38 ppm, Good), Potassium (18 ppm, Low)
4. Two-column lower section:
   - Left (2 cols): **💡 What Your Plant Needs** — 3 `SuggestionCard`s (Potassium needs attention / Temperature looks good / Humidity is healthy) + footnote about AI suggestions being enabled via Settings
   - Right (1 col): **System Connection** card (Connected, Signal: Good, Last update: 10s ago, link to View Technical Details → `/communication`) and **Energy** card (Power Saving Active, 30%, "Efficiency reference · measured using INA226 power monitoring.", link → `/power`)

### Plant (`/plant`)
- Header: "My Bell Pepper" / "Digital plant health profile"
- Left card: plant icon, "Healthy" headline, "Bell Pepper · Capsicum annuum", status badge
- Right: Current Condition mini-grid (temp/humidity/N/P/K) + Suggestions list (same 3 suggestions)

### History (`/history`)
- Header: "Plant History" / "Trends over time"
- Filter pills: **Today | 7 Days | 30 Days** (state-driven, regenerates mock series via `genHistory(range)`)
- Charts: Temperature line chart, Humidity line chart, NPK grouped bar chart (Nitrogen/Phosphorus/Potassium) — Recharts, green palette, tooltips on, no legend clutter beyond the NPK chart

### Power (`/power`)
- Header: "Power Monitoring" / "Measured using INA226"
- **Normal vs Deep Sleep** comparison table: Voltage, Current, Power, Activity, Battery Impact
- **Live Energy Draw**: two `EnergyTank`s (Normal ~78%, Deep Sleep ~6%) animating smoothly on an interval to simulate live readings
- **Reference Efficiency** card: "30%" with note "Manually set target — not a live sensor reading."
- **Measured Efficiency** card: e.g. "27.4%" with note "Calculated from live INA226 Normal vs Deep Sleep readings." — always shown as a visually separate card from the reference value

### Communication (`/communication`) — replaces "Zone Map"
- Header: "Communication" / "Sensor node ↔ receiver, live"
- Card containing a `<div>` mounted with `CommunicationScene` (Three.js): two realistic ESP32-style boards (board + chip + pin headers + antenna, not plain cubes) positioned left (sensor) and right (receiver), a curved wireless-link line between them, one glowing packet sphere animating along the curve on a loop, whole group gently rotating, "Connected" status pill above the canvas, caption below explaining data flow
- Three small cards below: Signal Strength ("Good"), ADR ("Good"), Power Mode ("Deep Sleep")
- Collapsible **View Technical Details** (`<details>`) revealing RSSI, SNR, Device ID, Last handshake
- Only **one** sensor node and **one** receiver node anywhere in this page — no multi-node UI

### Settings (`/settings`)
- Header: "Settings" / "Account, AI, and device configuration"
- **Account** card: Profile name, Email, Logout button
- **AI Suggestions** card: "AI Ready" / "AI Not Configured" badge, explanatory note, masked API key input (show/hide toggle), **Save API Key** / **Update API Key** button (label changes once a key is saved), **Remove** button appears once configured
- **Device** card: Device name (ESP32-SN-01), Connection status badge, Last seen
- **System** card: Application version, Data retention

## 5. Mock Data Contract (exact — `src/data/mockData.js`)

```js
IDEAL_RANGES = {
  temperature: { min: 20, max: 30, unit: "°C" },
  humidity: { min: 50, max: 70, unit: "%" },
}

LIVE_READINGS = {
  temperature: 28,
  humidity: 68,
  nitrogen: { value: 46, status: "Good" },
  phosphorus: { value: 38, status: "Good" },
  potassium: { value: 18, status: "Low" },
}

statusFor(param, value)   // returns "Low" | "High" | "Good" against IDEAL_RANGES

SUGGESTIONS = [
  { id, tone: "warn" | "good", title, body }, // 3 entries as listed above
]

genHistory(rangeLabel)    // "Today" -> 12 pts, "7 Days" -> 7 pts, "30 Days" -> 30 pts
                          // each point: { label, temperature, humidity, nitrogen, phosphorus, potassium }

POWER_COMPARISON = [
  { metric: "Voltage", normal: "3.3 V", deepSleep: "3.3 V" },
  { metric: "Current", normal: "82 mA", deepSleep: "0.9 mA" },
  { metric: "Power", normal: "271 mW", deepSleep: "3 mW" },
  { metric: "Activity", normal: "Always On", deepSleep: "Sleeps between readings" },
  { metric: "Battery Impact", normal: "Higher drain", deepSleep: "Extended battery life" },
]
```

## 6. Auth Contract (exact — `src/context/AuthContext.jsx`)

- `AuthProvider` wraps the app, exposes `{ user, login, logout }` via `useAuth()`
- `login({ email })` sets `user = { name: "Amaya Perera", email }` — no password check (demo mode)
- `logout()` sets `user = null`
- `ProtectedRoute` in `App.jsx` redirects to `/login` when `user` is null

## 7. Firebase Readiness (not active — exact)

`src/services/firebase.js` exports `FIREBASE_CONFIGURED` (boolean, checks `import.meta.env.VITE_FIREBASE_API_KEY`) and contains commented-out `initializeApp` / `getAuth` / `getFirestore` / `getDatabase` calls reading from `.env` vars:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
AI_API_KEY=
```

Nothing in the UI calls Firebase yet — swapping `AuthContext` and `mockData.js` reads for real Firestore/RTDB calls is the intended next step, without touching any page/component markup.

## 8. Non-Negotiable UX Rules (carried through every page)

1. Plant health and plain-language status always come before raw numbers.
2. Technical values (RSSI, SNR, device IDs) only appear behind "View Technical Details."
3. The 30% efficiency figure is always labeled as a manual reference, never presented as a live sensor reading.
4. Status is always shown as text + color, never color alone.
5. Exactly one sensor node and one receiver node in the architecture and UI — no Zone Map, no multi-node elements anywhere.
