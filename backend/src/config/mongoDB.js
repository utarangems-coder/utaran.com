import mongoose from "mongoose";
import dns from "dns";

// Force Node to resolve DNS using IPv4 first, resolving querySrv resolution issues in some Node.js environments
try {
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch (err) {
  console.warn("Could not set DNS default result order:", err.message);
}

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is undefined");
    }
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "demo-db",
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    // Safely mask password in URI for logging
    const maskedURI = process.env.MONGO_URI
      ? process.env.MONGO_URI.replace(/:([^:@]+)@/, ":******@")
      : "undefined";
    console.error(`MongoDB connection failed (URI: ${maskedURI}):`, error.message || error);
    throw error;
  }
};
