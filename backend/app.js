import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";

import { errorHandler } from "./src/middlewares/error.middleware.js";
import compression from "compression";
import Product from "./src/models/Product.model.js";

const app = express();
app.use(compression());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet());
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); 

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5000,
  }),
);

app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl === "/api/payments/webhook") {
        req.rawBody = buf;
      }
    },
  })
);

app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).send("OK");
});
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/", productRoutes);
app.use("/api/", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);

app.get("/sitemap.xml", async (req, res) => {
  res.header("Content-Type", "application/xml");
  try {
    const products = await Product.find({ isActive: true, quantity: { $gt: 0 } }).select("_id updatedAt");
    const productUrls = products
      .map(
        (p) => `
  <url>
    <loc>https://utaran.com/products/${p._id}</loc>
    <lastmod>${p.updatedAt ? p.updatedAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
      )
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://utaran.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://utaran.com/products</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://utaran.com/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://utaran.com/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>${productUrls}
</urlset>`;
    res.send(sitemap);
  } catch (err) {
    const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://utaran.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://utaran.com/products</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
    res.send(staticSitemap);
  }
});

const frontendDistPath = path.resolve(__dirname, "../frontend/dist");
const shouldServeFrontend = process.env.SERVE_FRONTEND === "true";

// SEO Bot-only product meta-injector (transparent to humans)
app.get("/products/:id", async (req, res, next) => {
  const userAgent = req.headers["user-agent"] || "";
  const botKeywords = [
    "twitterbot",
    "facebookexternalhit",
    "discordbot",
    "whatsapp",
    "telegrambot",
    "slackbot",
  ];

  const isBot = botKeywords.some((keyword) => userAgent.toLowerCase().includes(keyword));
  const htmlPath = path.join(frontendDistPath, "index.html");

  if (shouldServeFrontend && isBot && fs.existsSync(htmlPath)) {
    try {
      const product = await Product.findOne({ _id: req.params.id, isActive: true });
      if (product) {
        let html = fs.readFileSync(htmlPath, "utf8");

        const escapeHtml = (str = "") => {
          return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        };

        const title = `${escapeHtml(product.title)} — Utaran`;
        const description = escapeHtml(product.description);
        const imageUrl = product.images && product.images[0] ? product.images[0] : "";

        // Replace default titles & descriptions
        html = html
          .replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`)
          .replace(/<meta[^>]*name="description"[^>]*>/i, `<meta name="description" content="${description}" />`)
          .replace(/<meta[^>]*property="og:title"[^>]*>/i, `<meta property="og:title" content="${title}" />`)
          .replace(/<meta[^>]*property="og:description"[^>]*>/i, `<meta property="og:description" content="${description}" />`);

        if (imageUrl) {
          html = html.replace(/<meta[^>]*property="og:image"[^>]*>/i, `<meta property="og:image" content="${imageUrl}" />`);
        }

        return res.status(200).send(html);
      }
    } catch (err) {
      console.error("[SEO Meta Injector Error]:", err);
    }
  }

  next();
});

if (shouldServeFrontend && fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

app.use(errorHandler);

export default app;
