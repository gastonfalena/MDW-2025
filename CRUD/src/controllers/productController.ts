import { Request, Response } from "express";
import { Product } from "../models/productModel";
import { CreateProductDto } from "../dto/create-product.dto";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

// Crear producto
export const createProduct = async (req: Request, res: Response) => {
  const productDto = plainToInstance(CreateProductDto, req.body);

  const errors = await validate(productDto);
  if (errors.length > 0) {
    return res.status(400).json(errors.map((err) => err.constraints));
  }

  try {
    const product = new Product(productDto);
    await product.save();
    res.status(201).json(product);
  } catch (err: any) {
    if (err.code === 11000) {
      // índice único de Mongo
      return res.status(400).json({ message: "El nombre ya existe" });
    }
    res.status(500).json({ message: "Error interno", error: err });
  }
};

// Obtener todos los productos
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error interno", error: err });
  }
};

// Obtener producto por ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error interno", error: err });
  }
};

// Actualizar producto
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error interno", error: err });
  }
};

// Eliminar producto
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error interno", error: err });
  }
};
