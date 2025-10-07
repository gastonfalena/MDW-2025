"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.updateCartItem = exports.removeFromCart = exports.addToCart = exports.getCart = void 0;
const cartModel_1 = __importDefault(require("../models/cartModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const getCart = async (req, res) => {
    try {
        const cart = await cartModel_1.default.findOne({ user: req.user._id }).populate("items.product");
        if (!cart) {
            return res.status(200).json({ items: [], total: 0 });
        }
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCart = getCart;
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const product = await productModel_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        // Convertir a any para evitar errores de TypeScript
        const productAny = product;
        if (productAny.stock < quantity) {
            return res.status(400).json({ error: "Stock insuficiente" });
        }
        let cart = await cartModel_1.default.findOne({ user: req.user._id });
        if (!cart) {
            cart = new cartModel_1.default({ user: req.user._id, items: [] });
        }
        // Convertir a any
        const cartAny = cart;
        const existingItemIndex = cartAny.items.findIndex((item) => item.product.toString() === productId);
        if (existingItemIndex > -1) {
            cartAny.items[existingItemIndex].quantity += quantity;
        }
        else {
            cartAny.items.push({ product: productId, quantity });
        }
        // Calcular total
        await cartAny.populate("items.product");
        cartAny.total = cartAny.items.reduce((total, item) => {
            const productItem = item.product;
            return total + productItem.price * item.quantity;
        }, 0);
        await cartAny.save();
        res.status(200).json(cartAny);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addToCart = addToCart;
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await cartModel_1.default.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        // Convertir a any
        const cartAny = cart;
        cartAny.items = cartAny.items.filter((item) => item.product.toString() !== productId);
        // Recalcular total
        await cartAny.populate("items.product");
        cartAny.total = cartAny.items.reduce((total, item) => {
            const product = item.product;
            return total + product.price * item.quantity;
        }, 0);
        await cartAny.save();
        res.status(200).json(cartAny);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.removeFromCart = removeFromCart;
const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (quantity < 1) {
            return res.status(400).json({ error: "La cantidad debe ser al menos 1" });
        }
        const product = await productModel_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        // Convertir a any
        const productAny = product;
        if (productAny.stock < quantity) {
            return res.status(400).json({ error: "Stock insuficiente" });
        }
        const cart = await cartModel_1.default.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        // Convertir a any
        const cartAny = cart;
        const itemIndex = cartAny.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res
                .status(404)
                .json({ error: "Producto no encontrado en el carrito" });
        }
        cartAny.items[itemIndex].quantity = quantity;
        // Recalcular total
        await cartAny.populate("items.product");
        cartAny.total = cartAny.items.reduce((total, item) => {
            const product = item.product;
            return total + product.price * item.quantity;
        }, 0);
        await cartAny.save();
        res.status(200).json(cartAny);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateCartItem = updateCartItem;
const clearCart = async (req, res) => {
    try {
        const cart = await cartModel_1.default.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        // Convertir a any
        const cartAny = cart;
        cartAny.items = [];
        cartAny.total = 0;
        await cartAny.save();
        res.status(200).json({ message: "Carrito vaciado correctamente" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.clearCart = clearCart;
