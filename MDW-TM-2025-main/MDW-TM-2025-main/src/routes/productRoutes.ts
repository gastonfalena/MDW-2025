import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", getProducts); // Ver todos los productos
router.get("/:id", getProduct); // Ver producto específico

// 🔐 Rutas PROTEGIDAS
router.post("/", authMiddleware, createProduct); // Crear producto
router.put("/:id", authMiddleware, updateProduct); // Actualizar producto
router.delete("/:id", authMiddleware, deleteProduct); // Eliminar producto

export default router;
