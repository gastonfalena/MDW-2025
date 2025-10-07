"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const getProducts = async (req, res) => {
    try {
        const products = await productModel_1.default.find();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProducts = getProducts;
const getProduct = async (req, res) => {
    try {
        const product = await productModel_1.default.findById(req.params.id);
        if (!product)
            return res.status(404).json({ error: "Producto no encontrado" });
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProduct = getProduct;
const createProduct = async (req, res) => {
    try {
        const product = req.body;
        const newProduct = await productModel_1.default.create(product);
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!product)
            return res.status(404).json({ error: "Producto no encontrado" });
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel_1.default.findByIdAndDelete(id);
        if (!product)
            return res.status(404).json({ error: "Producto no encontrado" });
        res.json({ message: "Producto eliminado correctamente" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteProduct = deleteProduct;
