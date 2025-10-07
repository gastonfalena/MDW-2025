import { Request, Response } from "express";
import Cart from "../models/cartModel";
import Product from "../models/productModel";
import { AuthRequest } from "../middlewares/authMiddleware";

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart) {
      return res.status(200).json({ items: [], total: 0 });
    }
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Convertir a any para evitar errores de TypeScript
    const productAny: any = product;
    if (productAny.stock < quantity) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Convertir a any
    const cartAny: any = cart;
    const existingItemIndex = cartAny.items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      cartAny.items[existingItemIndex].quantity += quantity;
    } else {
      cartAny.items.push({ product: productId, quantity });
    }

    // Calcular total
    await cartAny.populate("items.product");
    cartAny.total = cartAny.items.reduce((total: number, item: any) => {
      const productItem: any = item.product;
      return total + productItem.price * item.quantity;
    }, 0);

    await cartAny.save();
    res.status(200).json(cartAny);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Convertir a any
    const cartAny: any = cart;
    cartAny.items = cartAny.items.filter(
      (item: any) => item.product.toString() !== productId
    );

    // Recalcular total
    await cartAny.populate("items.product");
    cartAny.total = cartAny.items.reduce((total: number, item: any) => {
      const product: any = item.product;
      return total + product.price * item.quantity;
    }, 0);

    await cartAny.save();
    res.status(200).json(cartAny);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: "La cantidad debe ser al menos 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Convertir a any
    const productAny: any = product;
    if (productAny.stock < quantity) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Convertir a any
    const cartAny: any = cart;
    const itemIndex = cartAny.items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    cartAny.items[itemIndex].quantity = quantity;

    // Recalcular total
    await cartAny.populate("items.product");
    cartAny.total = cartAny.items.reduce((total: number, item: any) => {
      const product: any = item.product;
      return total + product.price * item.quantity;
    }, 0);

    await cartAny.save();
    res.status(200).json(cartAny);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Convertir a any
    const cartAny: any = cart;
    cartAny.items = [];
    cartAny.total = 0;

    await cartAny.save();
    res.status(200).json({ message: "Carrito vaciado correctamente" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
