// middlewares/errors.js
export function errorHandler(err, req, res, next) {
  console.error("❌ ERROR:", err);

  // 1️⃣ Errores de validación Mongoose (por ejemplo, password muy corto)
  if (err.name === "ValidationError") {
    const details = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message,
    }));

    return res.status(400).json({
      error: "Error de validación",
      details,
    });
  }

  // 2️⃣ Error de duplicado (email o nickname ya registrado)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: `El valor del campo '${field}' ya está registrado.`,
    });
  }

  // 3️⃣ Error de JWT (token inválido o expirado)
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Token inválido" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expirado" });
  }

  // 4️⃣ Otros errores
  res.status(500).json({
    error: "Error interno del servidor",
    message: err.message,
  });
}
