import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import loginRoutes from "./routes/loginRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import { authMiddleware } from "./middlewares/authMiddleware";
import { refreshTokenMiddleware } from "./middlewares/refreshTOkenMiddleware";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI!;

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", loginRoutes);

app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/cart", authMiddleware, cartRoutes);

app.use("/api/products", productRoutes);

app.post(
  "/api/refresh-token",
  refreshTokenMiddleware,
  (req: express.Request, res: express.Response) => {
    res.json({ message: "Token actualizado correctamente" });
  }
);

app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

const connectToDb = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB conectado exitosamente");
  } catch (error) {
    console.error(`Error de conexión a MongoDB: ${error}`);
    process.exit(1);
  }
};

connectToDb();

app.listen(port, () => {
  console.log(`Servidor ejecutándose en puerto ${port}`);
});
