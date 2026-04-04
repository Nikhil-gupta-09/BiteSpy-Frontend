## BiteSpy Frontend

BiteSpy is a Next.js 16 app that helps users scan a food product, answer a short question flow, and view a truth-style report with alternatives. The UI is built for a friendly, guided experience, while the backend is split across services:

- Firebase Auth handles signup and login.
- MongoDB Atlas stores auth mirror records.
- Firestore stores the profile form data.

The current demo flow is hardcoded around a Nutella-style product journey so the frontend can be tested end-to-end without the MCP backend being connected yet.

## Project Flow

1. User signs up or logs in with Firebase Auth.
2. Signup/login success syncs an auth record into MongoDB Atlas.
3. User uploads a product image on the home page.
4. The app routes to a 5-question yes/no flow.
5. After the questions, a loader screen appears briefly.
6. The result page shows the Truth-o-Meter, nutrients, alerts, and ingredient reality.
7. The alternatives page shows healthier, cheaper, and same-taste options.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Firebase Auth
- Firestore for profile data
- MongoDB Atlas for auth sync
- Tailwind CSS for styling
- Framer Motion and icon libraries for interaction

## Folder Structure

### Root files

- [package.json](package.json) - project scripts and dependencies.
- [next.config.ts](next.config.ts) - Next.js configuration.
- [tsconfig.json](tsconfig.json) - TypeScript configuration and path aliases.
- [eslint.config.mjs](eslint.config.mjs) - linting rules.
- [postcss.config.mjs](postcss.config.mjs) - Tailwind/PostCSS setup.
- [.env](.env) - local environment variables for Firebase and MongoDB Atlas.
- [firebase.ts](firebase.ts) - Firebase client initialization for Auth.

### App routes

- [app/page.tsx](app/page.tsx) - landing page that combines the navbar, hero, upload area, and footer.
- [app/signup/page.tsx](app/signup/page.tsx) - Firebase signup form.
- [app/login/page.tsx](app/login/page.tsx) - Firebase login form.
- [app/profile-form/page.tsx](app/profile-form/page.tsx) - profile form that saves profile details.
- [app/profile/page.tsx](app/profile/page.tsx) - view/edit profile screen.
- [app/questions/page.tsx](app/questions/page.tsx) - 5-step yes/no product questions.
- [app/processing/page.tsx](app/processing/page.tsx) - loader page shown between questions and results.
- [app/result/page.tsx](app/result/page.tsx) - final truth report page.
- [app/alternatives/page.tsx](app/alternatives/page.tsx) - alternative products page.
- [app/news/page.tsx](app/news/page.tsx) - news page.
- [app/insights/page.tsx](app/insights/page.tsx) - insights page.
- [app/api/auth/sync/route.ts](app/api/auth/sync/route.ts) - syncs Firebase auth users into MongoDB Atlas.
- [app/api/profile/route.ts](app/api/profile/route.ts) - profile CRUD endpoint backed by Firestore.

### Components

- [components/Navbar.tsx](components/Navbar.tsx) - top navigation with dynamic login/logout state.
- [components/Hero.tsx](components/Hero.tsx) - landing hero section.
- [components/ClaimForm.tsx](components/ClaimForm.tsx) - upload card that starts the question flow.
- [components/Upload.tsx](components/Upload.tsx) - upload-related UI component.
- [components/Footer.tsx](components/Footer.tsx) - site footer.
- [components/Logo.tsx](components/Logo.tsx) - shared BiteSpy logo.

### Library files

- [lib/profile.ts](lib/profile.ts) - shared profile types, validation, and email normalization.
- [lib/mongodb.ts](lib/mongodb.ts) - MongoDB Atlas connection helper.
- [lib/firebase-admin.ts](lib/firebase-admin.ts) - Firebase Admin setup for Firestore profile access.

## Environment Variables

Set these in [.env](.env):

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `GEMINI_API_KEY`

## Local Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Production Build

```bash
npm run build
```

## Backend Notes

- Firebase Auth remains the source of truth for sign-in and sign-up.
- MongoDB Atlas stores a lightweight auth mirror in `auth_users`.
- Firestore stores the profile form data used by the profile pages.
- The profile question/result flow is frontend-only for now and hardcoded for the Nutella demo case.

## Extending The App

If you reconnect a real backend later, the best places to start are:

- [app/api/auth/sync/route.ts](app/api/auth/sync/route.ts) for auth metadata.
- [app/api/profile/route.ts](app/api/profile/route.ts) for profile persistence.
- [app/questions/page.tsx](app/questions/page.tsx) and [app/result/page.tsx](app/result/page.tsx) for the product analysis flow.

## Deployment

This app builds cleanly with `npm run build` and is ready for Netlify or another Next.js host once the environment variables are set.

