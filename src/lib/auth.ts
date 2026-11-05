import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("StudioSpaceX");

export const auth = betterAuth({
  // ✅ baseURL যোগ করা হলো (Vercel এর লিংক)
  baseURL: process.env.NODE_ENV === "production" 
    ? "https://studiospace-x.vercel.app" 
    : "http://localhost:3000",

  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://studiospace-x.vercel.app"
  ],
});