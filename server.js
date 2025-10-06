import mongoose from "mongoose";
import app from "./app.js";

const { MONGODB_URI, PORT = 10000 } = process.env;

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Mongo conectado");
    const server = app.listen(PORT, () =>
      console.log(`API http://localhost:${PORT}`)
    );

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      server.close(() => process.exit(0));
    });
  } catch (err) {
    console.error("Error al iniciar:", err.message);
    process.exit(1);
  }
}

main();
