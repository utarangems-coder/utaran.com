import Product from "../models/Product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  const images = req.files.map((file) => file.path);

  const product = await Product.create({ ...req.body, images });
  res.status(201).json(product);
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  const products = await Product.find({ isActive: true })
    .skip(skip)
    .limit(limit);

  res.json(products);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  if (req.files?.length) {
    updateData.images = req.files.map((file) => file.path);
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.status(204).send();
});

export const restoreProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true }
  );

  res.json(product);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    isActive: true,
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});
