import express from "express";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  // WebSocket Server for Real-Time Collaboration
  const wss = new WebSocketServer({ server });

  const clients = new Set<WebSocket>();

  wss.on("connection", (ws) => {
    clients.add(ws);
    console.log("New analyst connected to the bunker.");

    ws.on("message", (message) => {
      // Broadcast any tactical updates to all other analysts
      const data = JSON.parse(message.toString());
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    });

    ws.on("close", () => {
      clients.delete(ws);
      console.log("Analyst disconnected.");
    });
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", analysts: clients.size });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Bunker Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
