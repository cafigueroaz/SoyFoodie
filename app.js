import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/usuarioRoutes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

app.use(
  "/auth/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: "Demasiados intentos, intenta más tarde." },
  })
);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true, message: "Servidor funcionando ✅" });
});

export default app;
