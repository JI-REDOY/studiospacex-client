# StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform

**Live Site URL:** [https://studiospace-x.vercel.app](https://studiospace-x.vercel.app)

## 📽️ Project Overview
StudioSpace is a high-performance peer-to-peer marketplace designed for creators, filmmakers, photographers, podcasters, and musicians. Studio owners and hosts can list their creative spaces—ranging from photography cyc walls and cinema sound stages to podcast lounges, music recording suites, and art workshops. Fellow creators can discover, filter, inspect dynamic availability, and reserve studio slots with transparent pricing and real-time booking management.

## ✨ Key Features
1.  **Interactive UI & Glassmorphism Design:** A premium, modern, and fully responsive UI featuring a Swiper.js hero slider, dynamic featured studios, and a golden-themed flagship section.
2.  **Secure Authentication:** Email/Password and Google OAuth login using **BetterAuth**. Private routes are protected via middleware, and server mutations are secured with JWT in HTTPOnly cookies.
3.  **Comprehensive Studio CRUD:** Hosts can add, update, and delete their studios. Includes ImgBB image uploading, custom amenities tagging, and a flagship selection option.
4.  **Real-time Booking & Double-Booking Prevention:** Users can book studios via a dynamic modal. A custom MongoDB operator-based algorithm strictly prevents double-booking for overlapping "Confirmed" slots.
5.  **Host Dashboard & Wishlist:** Hosts can manage booking requests (approve/reject) from a dedicated dashboard. Users can save their favorite studios to a personalized wishlist for later viewing.

## 🛠️ Tech Stack
*   **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI, Swiper.js, Sonner (Toast).
*   **Backend:** Node.js, Express.js, MongoDB.
*   **Authentication:** BetterAuth, JWT, HTTPOnly Cookies.
*   **Deployment:** Vercel (Client & Server).

## 🔐 Examiner Test Credentials
*   **Email:** `zuwyxitida@mailinator.com`
*   **Password:** `Unique@123`
*   *(Note: You can also log in using the Google OAuth button).*

---
*Created with ❤️ for the StudioSpace Assignment.*
