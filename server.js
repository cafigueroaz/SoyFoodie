import express from "express";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mongoose from "mongoose";

mongoose
  .connect("mongodb://localhost:27017/prueba")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión", err));

const app = express();
const PORT = 10000;

app.use(express.json());

app.use("/products", productRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor eschuchando en http://localhost:${PORT}`);
});
