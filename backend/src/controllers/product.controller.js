import Product from "../models/Product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  const images = req.files.map((file) => file.path);

  const product = await Product.create({ ...req.body, images });
  res.status(201).json(product);
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    tags,
    sort = "newest",
    page = 1,
    limit = 12,
  } = req.query;

  const query = { isActive: true };

  // 🔍 Search by title
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  // 🗂 Category
  if (category) {
    query.category = category;
  }

  // 🏷 Tags
  if (tags) {
    query.tags = { $in: tags.split(",") };
  }

  // 🔃 Sorting
  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  };

  const sortBy = sortMap[sort] || sortMap.newest;

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(query),
  ]);

  res.json({
    data: products,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  });
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
