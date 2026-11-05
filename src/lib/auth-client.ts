import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // ✅ ব্রাউজারে এনভায়রনমেন্ট ভ্যারিয়েবল কাজ করে না, তাই সরাসরি লিংক দিতে হবে
  baseURL: process.env.NODE_ENV === "production" 
    ? "https://studiospace-x.vercel.app" 
    : "http://localhost:3000",
  plugins: [jwtClient()],
});