# 🌦️ WeatherVerse — Atmospheric Intelligence & Live Forecasts

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://weather-verse-2gtkt6u5i-weather-now.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

> A modern atmospheric intelligence platform delivering real-time meteorological observations, synoptic 7-day forecasts, granular hourly telemetry, EPA air quality diagnostics, and an intelligent AI Weather Copilot powered by Google Gemini.

🔗 **Live Production Deployment:** [weather-verse-2gtkt6u5i-weather-now.vercel.app](https://weather-verse-2gtkt6u5i-weather-now.vercel.app/)

---

## 📖 Overview

**WeatherVerse** was engineered to reimagine how users interact with meteorological data. Traditional weather interfaces often overwhelm users with cluttered tables or oversimplify critical telemetry. WeatherVerse merges scientific precision with fluid design aesthetics:

- **Dual Meteorological Engine:** Pulls authoritative atmospheric data from WeatherAPI and Open-Meteo with automated resilience and fallback failover.
- **AI-Powered Atmospheric Synthesis:** Translates complex barometric, thermal, and particulate readings into natural, actionable lifestyle recommendations (wardrobe, running windows, storm alerts).
- **Curated Dual Design System:** Smoothly shifts between warm editorial Day Mode (warm paper `#F3E9DC`, terracotta accents) and deep OLED Night Mode (`#02040A` cosmic slate) with zero layout jarring.
- **Precision Responsive Architecture:** Handcrafted responsive layouts verified on viewports from compact mobile screens (375px, 390px, 430px) through tablets (768px) to high-density desktop displays (1920px+).

---

## ✨ Key Features

- 🛰️ **Real-Time Weather Station:** Live ambient temperature, apparent feels-like reading, conditions, humidity, atmospheric pressure, visibility range, and wind speed.
- 📅 **7-Day Synoptic Forecast:** Complete 7-day outlook with daily high/low temperatures, precipitation likelihood, wind dynamics, and interactive day detail inspection.
- ⏱️ **24-Hour Hourly Scrubber:** Granular hourly progression curve with an interactive touch-scrubber to inspect temperature shifts, humidity variations, and sky conditions.
- 🍃 **US EPA Air Quality Index (AQI):** Diagnostic air health analyzer displaying real-time pollutant levels for PM2.5, PM10, Carbon Monoxide (CO), Nitrogen Dioxide (NO₂), and Ozone (O₃) with color-coded health advisories.
- 🤖 **Gemini 3.1 Flash AI Weather Copilot:** Conversational meteorological advisor offering instant context-aware answers to queries like *"Should I carry an umbrella?"*, *"Is it a good time for a 5K run?"*, or *"What should I wear today?"*. Includes Web Speech API voice recognition and text-to-speech reading.
- 🔍 **Spotlight Global Search (`Ctrl+K` / `⌘K`):** Fast city search modal with instant suggestions, voice search capability, and one-tap GPS geolocation detection.
- 📌 **Saved Multi-City Deck:** Bookmark favorite global cities with local storage persistence and quick-switch dashboard access.
- 🌓 **Dual Aesthetic Theme Engine:** One-touch toggle between warm sunlit Day Mode and high-contrast OLED Night Mode.
- 📱 **Mobile-First Touch Ergonomics:** Dedicated mobile navigation bar `[Logo] [Theme] [Search] [Menu]`, full-screen backdrop-blurred navigation drawer, and swipeable horizontal telemetry strips.

---

## 🛠️ Tech Stack

### Frontend & Core
- **Framework:** [React 19](https://react.dev/) (Functional components, custom context, hooks)
- **Routing:** [React Router v7](https://reactrouter.com/) (Single-page app routing with history support)
- **Build Tool:** [Vite 8](https://vitejs.dev/) (Fast HMR & optimized production bundling)
- **Icons:** [Lucide React](https://lucide.dev/) (Consistent, lightweight SVG iconography)
- **Markdown Parsing:** [Marked](https://marked.js.org/) (Sanitized markdown rendering for AI responses)

### Styling & Animation
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with native CSS custom properties for Day/Night tokens
- **Motion & Interactions:** [Framer Motion 12](https://www.framer.com/motion/) (Route transitions, drawer animations, modal popups)
- **Micro-Animations:** [GSAP 3](https://greensock.com/gsap/) (Smooth timeline choreography)
- **Data Visualizations:** [Recharts 3](https://recharts.org/) (Interactive SVG temperature curves and analytical area charts)

### APIs & Data Sources
- **WeatherAPI:** Primary real-time observations, 5-day forecast, and air quality pollutants
- **Open-Meteo:** Open-access global meteorological models, WMO code interpretation, and 7-day fallback forecasts
- **Google Gemini 3.1 Flash API (`@google/genai`):** Natural-language atmospheric reasoning and lifestyle recommendations
- **Web Speech API:** In-browser SpeechRecognition and SpeechSynthesis for voice queries and audio narration

### Backend & Deployment
- **Server:** Node.js & Express.js backend proxy with CORS protection
- **Hosting:** [Vercel](https://vercel.com/) (Client SPA with rewrite rules & serverless API support)

---

## 📁 Project Architecture

```text
WeatherVerse/
├── client/                          # React 19 Frontend (Vite)
│   ├── public/                      # Static assets & favicon
│   ├── src/
│   │   ├── components/              # Reusable UI Components
│   │   │   ├── AIAssistant.jsx      # AI Copilot assistant widget
│   │   │   ├── AQICard.jsx          # Pollutant summary card
│   │   │   ├── AQISection.jsx       # Detailed EPA AQI breakdown
│   │   │   ├── BentoMetrics.jsx     # Telemetry metric grid & compass
│   │   │   ├── Footer.jsx           # Global responsive footer
│   │   │   ├── ForecastSection.jsx  # Synoptic daily cards
│   │   │   ├── GlobalSearchModal.jsx# Spotlight search modal (Ctrl+K)
│   │   │   ├── Navbar.jsx           # Responsive header with drawer
│   │   │   ├── SkeletonLoader.jsx   # Apple-style loading skeleton
│   │   │   ├── TemperatureChart.jsx # Recharts area temperature curve
│   │   │   ├── WeatherEnvironment.jsx # Living GSAP atmospheric simulation
│   │   │   └── WeatherHero.jsx      # Compact Apple-style weather hero
│   │   ├── context/
│   │   │   ├── ThemeContext.jsx     # Day / Night mode state & persistence
│   │   │   └── WeatherContext.jsx   # Global weather, geolocation, units (°C/°F)
│   │   ├── pages/                   # Application Route Pages
│   │   │   ├── AboutPage.jsx        # Project manifesto & developer info
│   │   │   ├── AIPage.jsx           # Full-screen conversational AI Copilot
│   │   │   ├── AirQualityPage.jsx   # EPA AQI diagnostics & spectrum
│   │   │   ├── AnalyticsPage.jsx    # Meteorological instruments & compass
│   │   │   ├── ForecastPage.jsx     # 7-day synoptic forecast dashboard
│   │   │   ├── HomePage.jsx         # Primary atmospheric dashboard
│   │   │   ├── HourlyPage.jsx       # 24-hour detailed timeline view
│   │   │   └── LocationsPage.jsx    # Saved locations manager
│   │   ├── Services/                # API Integration Layer
│   │   │   ├── AIService.js         # Gemini API client & fallback synthesis
│   │   │   └── WeatherService.js    # WeatherAPI & Open-Meteo fetchers
│   │   ├── App.jsx                  # Root router & shell layout
│   │   ├── index.css                # Tailwind CSS v4 & theme variables
│   │   └── main.jsx                 # React root mount
│   ├── package.json                 # Client dependencies & scripts
│   ├── vercel.json                  # SPA routing rewrite rules
│   └── vite.config.js               # Vite bundler configuration
├── server/                          # Optional Express.js API Backend
│   ├── controllers/
│   │   ├── AIController.js          # Gemini 3.1 Flash integration
│   │   └── WeatherController.js     # WeatherAPI proxy controller
│   ├── Routes/
│   │   ├── AIRoutes.js              # AI advice endpoints
│   │   └── WeatherRoutes.js         # Weather data endpoints
│   ├── Index.js                     # Express app setup & CORS
│   ├── package.json                 # Backend dependencies
│   └── server.js                    # Local server listener (Port 5000)
├── notes.txt                        # Feature notes
└── README.md                        # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher (or pnpm / yarn)

### 1. Clone the Repository
```bash
git clone https://github.com/Siddharth5547/WeatherVerse.git
cd WeatherVerse
```

### 2. Install Dependencies

#### Client (Frontend)
```bash
cd client
npm install
```

#### Server (Optional Backend Proxy)
```bash
cd ../server
npm install
```

### 3. Environment Variables Configuration

Create a `.env` file in the `client/` folder:
```bash
# client/.env
VITE_API_URL=https://weatherverse-backend.vercel.app/api/weather
```

*(Optional)* If running your own backend, create a `.env` file in the `server/` folder:
```bash
# server/.env
PORT=5000
WEATHER_API_KEY=your_weatherapi_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Development Server

#### Start Client
```bash
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

#### (Optional) Start Backend
```bash
cd server
npm run dev
```
The server will run on [http://localhost:5000](http://localhost:5000).

### 5. Production Build
```bash
cd client
npm run build
```
The production bundle will be generated in `client/dist/`.

---

## 🔑 Environment Variables Reference

| Variable | Scope | Purpose | Required | Source |
| :--- | :--- | :--- | :---: | :--- |
| `VITE_API_URL` | Client | Base URL for backend weather and AI proxy endpoints | No *(defaults to live backend / direct Open-Meteo)* | Custom backend deployment or Vercel URL |
| `WEATHER_API_KEY` | Server | API key for WeatherAPI current conditions, forecast, and AQI | No *(system automatically falls back to Open-Meteo)* | [WeatherAPI](https://www.weatherapi.com/) |
| `GEMINI_API_KEY` | Server | Google Gemini API key for intelligent meteorological synthesis | No *(system includes intelligent local meteorological synthesis)* | [Google AI Studio](https://aistudio.google.com/) |
| `PORT` | Server | Local HTTP port for the Express backend | No *(default: 5000)* | Environment configuration |

---

## 📱 Responsive Design & Accessibility

WeatherVerse is engineered with a **zero-horizontal-overflow guarantee** across all modern viewports:

| Device Class | Viewport Range | Layout Adaptation |
| :--- | :--- | :--- |
| **Compact Mobile** | `375px — 430px` (iPhone SE, 13/14/15/16 Pro, Galaxy S, Pixel) | Compact navigation bar `[Logo] [Theme] [Search] [Menu]`, full-height blurred drawer, touch-scrollable 24-hr strip, swipeable 7-day forecast cards, and stacked metric telemetry. |
| **Tablet** | `768px — 1023px` (iPad, Galaxy Tab) | Balanced 2-column bento grids, intermediate chart sizing, and quick-access top navigation. |
| **Desktop & Laptop** | `1024px — 1440px` (MacBook, Ultrabooks, Standard Monitors) | Full widescreen dashboard, synchronized analytics graphs, 7-column forecast grid, and expanded sidebar controls. |
| **Ultra-Wide** | `1920px+` (4K / WQHD Displays) | Centered max-width container (`max-w-7xl`) preventing content stretching and preserving visual hierarchy. |

### Theme System
- ☀️ **Warm Day Mode:** Inspired by natural sunlight and tactile editorial design (`#F3E9DC` canvas, `#FFF9F2` glass surfaces, `#2E2118` primary typography, and `#D48344` solar accents).
- 🌙 **OLED Night Mode:** Designed for low-light legibility and energy efficiency (`#02040A` cosmic background, `#0B1220` card surfaces, `#F8FAFC` crisp text, and `#38BDF8` cyber blue telemetry).

---

## 🌐 Live Demo & Deployment

The application is deployed on **Vercel** with continuous deployment from the primary repository branch.

- **Live URL:** [https://weather-verse-2gtkt6u5i-weather-now.vercel.app/](https://weather-verse-2gtkt6u5i-weather-now.vercel.app/)

### Deploying to Vercel

1. Push your changes to GitHub.
2. Import the repository in [Vercel Dashboard](https://vercel.com/).
3. Set the **Root Directory** to `client`.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**.

The included `client/vercel.json` ensures all client-side routes (`/forecast`, `/hourly`, `/air-quality`, `/analytics`, `/locations`, `/ai`, `/about`) are rewritten to `/index.html` for seamless single-page application navigation.

---

## 👤 Author & Acknowledgments

**Siddharth Bharti**
- **GitHub:** [@Siddharth5547](https://github.com/Siddharth5547)
- **LinkedIn:** [linkedin.com/in/siddharth2004/](https://linkedin.com/in/siddharth2004/)
- **Repository:** [https://github.com/Siddharth5547/WeatherVerse](https://github.com/Siddharth5547/WeatherVerse)

### Meteorological Data Providers
- [WeatherAPI.com](https://www.weatherapi.com/) — Atmospheric conditions & air quality telemetry
- [Open-Meteo.com](https://open-meteo.com/) — Open-source global forecast models
- [Google Gemini](https://ai.google.dev/) — Generative AI weather intelligence

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and adapt it for your own projects.
