import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI as string);
// ✅ আপনার ডাটাবেসের নাম (বড় হাতের অক্ষরে)
const db = client.db("StudioSpaceX");

export const auth = betterAuth({
  // ✅ প্রোডাকশনে গুগল লগইনের জন্য baseURL
  baseURL: process.env.NODE_ENV === "production" 
    ? "https://studiospace-x.vercel.app" 
    : "http://localhost:3000",

  database: mongodbAdapter(db, {
    client,
  }),
  
  emailAndPassword: { 
    enabled: true, 
  }, 
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // ✅ গুগল অ্যাকাউন্ট লিংক করার পারমিশন (unable_to_link_account এরর ফিক্স)
  account: {
    accountLinking: {
      trustedProviders: ["google"],
    },
  },

  plugins: [jwt()],
  
  session: {
    cookieCache: {
      enabled: true,
      strategy: 'jwt',
      maxAge: 7 * 24 * 60 * 60 
    }
  },

  // ✅ রিডাইরেক্টের জন্য ট্রাস্টেড অরিজিন
  trustedOrigins: [
    "http://localhost:3000",
    "https://studiospace-x.vercel.app"
  ],
});