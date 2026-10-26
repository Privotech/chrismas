import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

function wishesApiPlugin() {
  const dataFilePath = path.resolve(process.cwd(), "data/wishes.json");

  function getWishes() {
    try {
      if (fs.existsSync(dataFilePath)) {
        const content = fs.readFileSync(dataFilePath, "utf-8");
        return JSON.parse(content || "[]");
      }
    } catch {
      // fallback
    }
    return [];
  }

  function saveWishes(wishes) {
    try {
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
      fs.writeFileSync(dataFilePath, JSON.stringify(wishes, null, 2), "utf-8");
    } catch {
      // fallback
    }
  }

  const handler = (req, res, next) => {
    const rawUrl = req.url || "";
    const cleanUrl = rawUrl.split("?")[0];

    // Handle reactions: /api/wishes/:id/react
    const reactMatch = cleanUrl.match(/^\/api\/wishes\/([^/]+)\/react$/);
    if (reactMatch && req.method === "POST") {
      const wishId = reactMatch[1];
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const parsed = JSON.parse(body || "{}");
          const reactionKey = parsed.reaction || "warmth";
          const wishes = getWishes();
          const wish = wishes.find((w) => String(w.id) === String(wishId));
          if (wish) {
            wish.reactions = wish.reactions || { warmth: 0, cheer: 0, star: 0, hug: 0 };
            wish.reactions[reactionKey] = (wish.reactions[reactionKey] || 0) + 1;
            saveWishes(wishes);
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify(wish));
            return;
          }
          res.statusCode = 404;
          res.end(JSON.stringify({ error: "Wish not found" }));
        } catch {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Invalid reaction payload" }));
        }
      });
      return;
    }

    if (cleanUrl === "/api/wishes") {
      if (req.method === "GET") {
        const wishes = getWishes();
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify(wishes));
        return;
      }
      if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          try {
            const data = JSON.parse(body || "{}");
            const wishes = getWishes();
            const now = new Date().toISOString();
            const newWish = {
              id: "wish-" + Date.now(),
              name: (data.name && data.name.trim()) || "Anonymous Friend",
              message: data.message || "",
              category: data.category || "family",
              theme: data.theme || "pine",
              createdAt: now,
              timestamp: now,
              reactions: {
                warmth: 1,
                cheer: 0,
                star: 1,
                hug: 0,
              },
            };
            wishes.push(newWish);
            saveWishes(wishes);
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 201;
            res.end(JSON.stringify(newWish));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Invalid JSON" }));
          }
        });
        return;
      }
    }
    next();
  };

  return {
    name: "wishes-api-plugin",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wishesApiPlugin()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
  },
});
