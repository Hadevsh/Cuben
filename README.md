# Cuben

A minimalistic, feature-rich **speedcubing timer** to track your solves, generate scrambles, and visualize progress — all in the browser.

## ✨ Features

* **One-click timing** and solve logging via a clean web UI (`index.html`).
* **Random scrambles** for fair practice sessions.
* **Session statistics & history** (separate views: `stats.html`, `times.html`, `history.html`).
* **CFOP reference** page to quickly review algorithms (`cfop.html`). ([GitHub][2])
* **Lightweight stack:** pure HTML/CSS/JavaScript — no heavy framework required (repo languages are ~JS/HTML/CSS).

> The code is organized under `css/`, `js/`, `src/`, and `utils/`. There’s also a simple `server.js` you can use for local serving if you prefer Node.

## 🗂 Project structure

```
Cuben/
├─ css/              # Stylesheets
├─ js/               # Frontend logic (timer, UI handlers)
├─ src/              # Core modules (scramble, stats, storage)*
├─ utils/            # Utilities/helpers*
├─ index.html        # Main timer UI
├─ stats.html        # Charts / summary stats
├─ times.html        # Raw solves table / management
├─ history.html      # Sessions / trends over time
├─ cfop.html         # CFOP reference / learning aid
├─ server.js         # (Optional) Node-based static server
├─ package.json      # (If serving with Node)
└─ README.md
```

*Exact contents may evolve, but those folders exist in the repo.

## 🚀 Getting started

### Option A — open directly

1. Download or clone the repo.
2. Open `index.html` in your browser — you’re ready to time solves.

### Option B — serve locally (recommended)

Serving over HTTP avoids some browser security quirks and enables clean routing between the HTML pages.

**Using Python:**

```bash
# from the repo root
python -m http.server 8000
# then visit http://localhost:8000/
```

**Using Node (if you want the provided server):**

```bash
# install dependencies if package.json is present
npm install
node server.js
# then visit the printed local URL (typically http://localhost:3000 or 5000)
```

The repo includes `server.js`; use it if you prefer a Node based static server. 

## 🧠 How it works

1. **Timing UI** (main page) listens for start/stop input (e.g., keyboard or button) and records solve times. `js/` contains the UI logic.
2. **Scramble generation** runs in the frontend so sessions are self-contained and reproducible.
3. **Storage** is handled client-side (e.g., browser storage) so your data stays local unless you export it.
4. **Stats & history** pages read stored solves to compute Ao5/Ao12, best/worst, streaks, and render charts/tables (see `stats.html`, `times.html`, `history.html`).
5. **CFOP reference** provides quick access to method notes while practicing (`cfop.html`).

## 🧪 Testing ideas

While the project is frontend-only, you can add lightweight tests:

* **Scramble validity** (no illegal consecutive moves).
* **AoN calculations** (Ao5/Ao12 with drops).
* **Persistence** (save/reload sessions).
* **Keyboard handling** (e.g., spacebar timing semantics).

## 🤝 Contributing

PRs welcome! Keep changes focused and include a brief note in this README for user-visible behavior (new pages, new stats, etc.).
