# StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform

**Live Site URL:** [https://your-client-url.vercel.app](https://your-client-url.vercel.app)

## 📽️ Project Overview
StudioSpace is a high-performance peer-to-peer marketplace designed for creators, filmmakers, photographers, podcasters, and musicians. Studio owners and hosts can list their creative spaces and fellow creators can discover, filter, and reserve studio slots.

## ✨ Key Features
1.  **Interactive UI & Glassmorphism Design:** A premium, modern, and fully responsive UI featuring a Swiper.js hero slider, dynamic featured studios, and a golden-themed flagship section.
2.  **Secure Authentication:** Email/Password and Google OAuth login using **BetterAuth**. Server mutations are secured with JWT in HTTPOnly cookies.
3.  **Comprehensive Studio CRUD:** Hosts can add, update, and delete their studios. Includes ImgBB image uploading and custom amenities tagging.
4.  **Real-time Booking & Double-Booking Prevention:** Users can book studios via a dynamic modal. A custom MongoDB operator-based algorithm strictly prevents double-booking.
5.  **Host Dashboard & POS Receipt:** Hosts can manage booking requests and generate PDF invoices & POS thermal receipts for confirmed bookings.

## 🛠️ Tech Stack
*   **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI, Swiper.js, Sonner (Toast).
*   **Backend:** Node.js, Express.js, MongoDB (Native Driver).
*   **Authentication:** BetterAuth, JWT, JWKS.
*   **Deployment:** Vercel (Client & Server).

## 🚀 Local Setup Steps
1. Clone the repository: `git clone <your-repo-link>`
2. Install dependencies: `npm install`
3. Create `.env.local` and add your MongoDB URI, BetterAuth secret, and Google OAuth credentials.
4. Run the development server: `npm run dev`

## 🔐 Examiner Test Credentials
*   **Email:** `zuwyxitida@mailinator.com`
*   **Password:** `Unique@123`
