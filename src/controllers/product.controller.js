import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";


const createProduct = asyncHandler(async (req, res) => {
  try {
    let {
      sellerId,
      title,
      description,
      brand,
      category,
      images = [],
      specifications = [],
      variants = [],
      status,
    } = req.body;

    // Handle parsed JSON if objects/arrays were sent as stringified JSON in form-data
    if (typeof specifications === "string") {
      try {
        specifications = JSON.parse(specifications);
      } catch (e) {}
    }
    if (typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch (e) {}
    }
    if (typeof images === "string") {
      try {
        images = JSON.parse(images);
      } catch (e) {}
    }

    // Process multer uploaded file(s)
    let uploadedImageUrls = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        const cloudinaryResponse = await uploadOnCloudinary(file.path);
        if (cloudinaryResponse?.url) {
          uploadedImageUrls.push(cloudinaryResponse.url);
        }
      }
    } else if (req.files && req.files.images && req.files.images.length > 0) {
      for (const file of req.files.images) {
        const cloudinaryResponse = await uploadOnCloudinary(file.path);
        if (cloudinaryResponse?.url) {
          uploadedImageUrls.push(cloudinaryResponse.url);
        }
      }
    } else if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResponse?.url) {
        uploadedImageUrls.push(cloudinaryResponse.url);
      }
    }

    const finalImages = [
      ...(Array.isArray(images) ? images : []),
      ...uploadedImageUrls,
    ];

    const createdProduct = await Product.create({
      sellerId: new mongoose.Types.ObjectId(sellerId),
      title,
      description,
      brand,
      category: new mongoose.Types.ObjectId(category),
      images: finalImages,
      specifications: Array.isArray(specifications) ? specifications : [],
      variants: Array.isArray(variants) ? variants : [],
      status: status || "active",
    });

    if (!createdProduct) {
      return res
        .status(500)
        .json(
          new ApiError(500, "Internal server error while creating product")
        );
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, createdProduct, "Product created successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error?.message || "Internal server error while creating product"
        )
      );
  }
});


const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json(new ApiError(400, "Invalid product ID"));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    let {
      title,
      description,
      brand,
      category,
      specifications,
      status,
      variants,
      images,
      deletedImages,
    } = req.body;

    // Handle parsed JSON if objects/arrays were sent as stringified JSON in form-data
    if (typeof specifications === "string") {
      try {
        specifications = JSON.parse(specifications);
      } catch (e) {}
    }
    if (typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch (e) {}
    }
    if (typeof images === "string") {
      try {
        images = JSON.parse(images);
      } catch (e) {}
    }
    if (typeof deletedImages === "string") {
      try {
        deletedImages = JSON.parse(deletedImages);
      } catch (e) {}
    }

    if (title) product.title = title;
    if (description !== undefined) product.description = description;
    if (brand !== undefined) product.brand = brand;
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json(new ApiError(400, "Invalid category ID"));
      }
      product.category = new mongoose.Types.ObjectId(category);
    }
    if (specifications) product.specifications = specifications;
    if (status) product.status = status;
    if (variants) product.variants = variants;

    // Handle image file updates if new files are uploaded via Multer
    let uploadedImageUrls = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        const cloudinaryResponse = await uploadOnCloudinary(file.path);
        if (cloudinaryResponse?.url) {
          uploadedImageUrls.push(cloudinaryResponse.url);
        }
      }
    } else if (req.files && req.files.images && req.files.images.length > 0) {
      for (const file of req.files.images) {
        const cloudinaryResponse = await uploadOnCloudinary(file.path);
        if (cloudinaryResponse?.url) {
          uploadedImageUrls.push(cloudinaryResponse.url);
        }
      }
    } else if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResponse?.url) {
        uploadedImageUrls.push(cloudinaryResponse.url);
      }
    }

    // Handle image deletion via separate deletedImages array
    if (
      deletedImages &&
      Array.isArray(deletedImages) &&
      deletedImages.length > 0
    ) {
      for (const imgUrl of deletedImages) {
        await deleteFromCloudinary(imgUrl);
      }
      product.images = product.images.filter(
        (imgUrl) => !deletedImages.includes(imgUrl)
      );
    }

    // Append newly uploaded images from Multer (if any)
    if (uploadedImageUrls.length > 0) {
      product.images = [...product.images, ...uploadedImageUrls];
    }




    const updatedProduct = await product.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedProduct, "Product updated successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error?.message || "Internal server error while updating product"
        )
      );
  }
});

const getProduct = asyncHandler(async (req, res) => {
  try {
    const {
      offset = 0,
      limit = 10,
      search = "",
      category,
      brand,
      minPrice,
      maxPrice,
      status = "active",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;
    const offsetNum = Math.max(0, parseInt(offset, 10) || 0);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);

    const matchQuery = {};

    if (status) {
      matchQuery.status = status;
    }

    if (search) {
      matchQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (brand) {
      matchQuery.brand = { $regex: brand, $options: "i" };
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      matchQuery.category = new mongoose.Types.ObjectId(category);
    }

    if (minPrice || maxPrice) {
      matchQuery["variants.price"] = {};
      if (minPrice) matchQuery["variants.price"].$gte = Number(minPrice);
      if (maxPrice) matchQuery["variants.price"].$lte = Number(maxPrice);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const pipeline = [
      { $match: matchQuery },
      { $sort: sortOptions },
      { $skip: offsetNum },
      { $limit: limitNum },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "sellers",
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
        },
      },
      {
        $unwind: {
          path: "$seller",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const products = await Product.aggregate(pipeline);
    const totalProducts = await Product.countDocuments(matchQuery);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          products,
          pagination: {
            totalProducts,
            offset: offsetNum,
            limit: limitNum,
            hasMore: offsetNum + products.length < totalProducts,
          },
        },
        "Products fetched successfully"
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error?.message || "Internal server error while getting products"
        )
      );
  }
});

const getProductById = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json(new ApiError(400, "Invalid product ID"));
    }

    const product = await Product.findById(productId)
      .populate("category", "name slug level")
      .populate("sellerId", "businessName gstNumber pickupAddress");

    if (!product) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, product, "Product details fetched successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error?.message || "Internal server error while fetching product"
        )
      );
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json(new ApiError(400, "Invalid product ID"));
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    // Delete all associated images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imgUrl of product.images) {
        await deleteFromCloudinary(imgUrl);
      }
    }

    await Product.findByIdAndDelete(productId);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Product deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error?.message || "Internal server error while deleting product"
        )
      );
  }
});

export {
  createProduct,
  updateProduct,
  getProduct,
  getProductById,
  deleteProduct,
};





