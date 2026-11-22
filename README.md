# NIVANTO — Business Support Ecosystem & Admin CMS

**Tagline:** *Your dream, fully powered.*

A full-stack React + Vite + Tailwind CSS + Firebase application featuring:
1. **Customer Website** (`/`, `/services`, `/work`, `/templates`, `/about`, `/contact`) reading live from Cloud Firestore in real time.
2. **Protected Admin Control Panel** (`/inan1422008admin`) with Email/Password authentication, rate limiting, Firebase Phone OTP 2FA, and live CRUD management for all website copy, services, portfolio browser previews, readymade templates, and customer inquiries.

---

## 1. Local Installation

```bash
npm install
npm run dev
```

The development server runs on `http://localhost:3000`.

---

## 2. Environment Configuration (`.env`)

For standalone local or Vercel deployment, create a `.env` file in the project root (refer to `.env.example` and `firebase.sample.js`):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_ID=your_database_id_if_named
```

---

## 3. Firebase Setup & Security Rules

1. Open [Firebase Console](https://console.firebase.google.com/) and select your project.
2. **Firestore Database**:
   - Ensure Firestore is created and deploy the rules from `firestore.rules` (which enforce public read only on `active == true` items, public inquiry creation with server timestamp validation, and authenticated admin writes).
3. **Firebase Authentication**:
   - Go to **Authentication → Sign-in method** and enable:
     - **Email/Password**
     - **Phone** (required for Step 2 2FA OTP to `+8801720266825`)
   - Under **Authentication → Settings → Authorized domains**, add your Vercel production domain (and `localhost` for local testing).
   - *(Optional for testing without SMS quota)*: Under **Phone → Phone numbers for testing**, you can add `+8801720266825` with a test 6-digit verification code.

---

## 4. Creating Your First Admin User

Public signups are intentionally disabled. Create your admin account manually in Firebase Console:

1. Open **Firebase Console → Authentication → Users**.
2. Click **Add user**.
3. Enter your admin email and a strong password, then click **Add user**.
4. Visit `/inan1422008admin/login` on your site:
   - **Step 1**: Sign in with your Email & Password (5 failed attempts triggers a 15-minute lockout).
   - **Step 2**: Enter the 6-digit Firebase Phone OTP sent to `+8801720266825` (60s expiry, 3 failed attempts triggers a 30-minute lockout).
5. Once inside `/inan1422008admin/dashboard`, click **"Seed Default Content"** in the sidebar to populate Firestore with the initial Nivanto copy, services, portfolio items, and templates.

---

## 5. Deploying to Vercel

1. Push the repository to GitHub/GitLab.
2. Import the project in [Vercel](https://vercel.com/).
3. Add all `VITE_FIREBASE_*` variables from `.env.example` under **Project Settings → Environment Variables**.
4. Deploy — `vercel.json` automatically configures SPA routing for all customer and admin routes.
