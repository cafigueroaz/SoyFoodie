import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/usuarioRoutes.js";

mongoose
  .connect("mongodb://localhost:27017/SoyFoodie")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión", err));

const app = express();
const PORT = 10000;

app.use(express.json());

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor eschuchando en http://localhost:${PORT}`);
});
