# 10th Standard D Section • 2018 Passout Reunion Website

A nostalgic, full-stack reunion website crafted for the **10th Standard D Section (2018 Passouts)** gathering on **14 November 2026** at **Royal Villa, Okketturu**.

---

## 🌟 Features

- **Hero & Countdown**: Live countdown to 14 November 2026, 5:00 PM IST with zero-day celebration state (`"Today is the day! ❤️"`).
- **Polaroid Scrapbook Memories**: Nostalgic polaroid cards with washi tape accents, handwritten captions in *Caveat*, and details of classroom benches, lunch raids, PT periods, and uniform shirt autographs.
- **Persistent RSVP with Netlify Blobs**: Submissions are stored persistently in Netlify Blobs without requiring an external SQL/MongoDB database.
- **Device Restriction / Duplicate Prevention**: Generates a unique client device ID on the first visit and enforces duplicate checking on both client and backend (returns `HTTP 409 Conflict` if the same device tries to submit twice).
- **Public "Everyone" Page (`/everyone`)**: Live RSVP statistics (✅ Coming, 🤔 Maybe, ❌ Can't Come), searchable list of classmate cards, notes, and relative timestamps without exposing private device IDs or secrets.
- **Protected Admin Dashboard (`/admin`)**: Password-protected dashboard with metrics breakdown (Total YES, MAYBE, NO, Total), individual entry deletion, and CSV export (`10th_D_2018_Reunion_Responses.csv`).
- **Social & WhatsApp Sharing**: Native Web Share API integration on mobile devices + pre-filled WhatsApp invite generator using dynamic `window.location.origin`.
- **Calendar Integration**: Google Calendar template link and one-click downloadable `.ics` calendar invite.
- **Google Maps Integration**: Direct directions link to Royal Villa, Okketturu.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Canvas Confetti
- **Backend**: Netlify Functions (v2 Web API standard)
- **Database**: Netlify Blobs (`@netlify/blobs`)
- **Build Tool**: Vite 8

---

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

> In local development, the built-in Vite middleware simulates the Netlify Functions (`/.netlify/functions/rsvp`, `/.netlify/functions/responses`, and `/.netlify/functions/admin`) with a local persistent file store in `.data/rsvps.json` so you do not need the Netlify CLI to test the full stack locally.

3. To build the production app:
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to Netlify

### Option 1: Git-based Deployment (Recommended)
1. Push this repository to GitHub or GitLab.
2. In the [Netlify Dashboard](https://app.netlify.com/), click **Add new site** > **Import an existing project**.
3. Select your repository. Netlify will automatically detect `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
4. Go to **Site Configuration** > **Environment variables** and add:
   - `ADMIN_PASSWORD`: Your secret organizer password (e.g., `reunion2018` or your own strong passphrase).
5. Deploy the site.

### Netlify Blobs Setup
Netlify Blobs is enabled automatically on all Netlify sites! No external database setup, connection strings, or third-party storage credentials are needed. The Netlify Functions will automatically write to and read from your site's Netlify Blobs store (`10th_d_reunion_rsvps`).

---

## 🔑 Environment Variables

| Variable | Description | Default (if unset) |
| :--- | :--- | :--- |
| `ADMIN_PASSWORD` | Password required to unlock the `/admin` portal | `reunion2018` |

---

## 📂 Project Structure

```
├── netlify/
│   └── functions/
│       ├── types.ts         # TypeScript data contracts & schemas
│       ├── storage.ts       # Netlify Blobs persistent store wrapper
│       ├── rsvp.ts          # POST /.netlify/functions/rsvp (validates & saves)
│       ├── responses.ts     # GET /.netlify/functions/responses (public safe list)
│       └── admin.ts         # GET/DELETE /.netlify/functions/admin & CSV export
├── public/
│   └── social-preview.svg   # 1200x630 OpenGraph and Twitter card asset
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Responsive header + mobile drawer
│   │   ├── Hero.tsx             # Main hero with polaroid stack & CTAs
│   │   ├── Countdown.tsx        # Live countdown timer to 14 Nov 2026
│   │   ├── StorySection.tsx     # 8-year retrospective story
│   │   ├── NostalgiaSection.tsx # Scrapbook polaroid photo cards
│   │   ├── EventDetails.tsx     # Date, venue, dress code, maps & calendar
│   │   ├── RSVPSection.tsx      # RSVP form, duplicate check, celebration
│   │   ├── ShareButtons.tsx     # Web Share & WhatsApp deep link
│   │   ├── EveryonePage.tsx     # /everyone attendee list & statistics
│   │   ├── AdminPage.tsx        # /admin protected dashboard & CSV export
│   │   └── Footer.tsx           # Nostalgic footer & admin entry point
│   ├── lib/
│   │   ├── api.ts           # Fetch client for Netlify functions
│   │   └── deviceId.ts      # Device fingerprint & submission state
│   ├── App.tsx              # Root app and client routing
│   ├── index.css            # Tailwind CSS & vintage paper textures
│   └── main.tsx             # React entry point
├── netlify.toml             # Netlify build, functions, and SPA redirect rules
└── vite.config.ts           # Vite config + local Netlify functions dev plugin
```
