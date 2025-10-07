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

router.get("/", getProducts); 
router.get("/:id", getProduct); 

router.post("/", authMiddleware, createProduct); 
router.put("/:id", authMiddleware, updateProduct); 
router.delete("/:id", authMiddleware, deleteProduct); 

export default router;
