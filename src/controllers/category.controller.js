import mongoose from "mongoose";
import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, parent, ancestors } = req.body;
  try {
    // const imageLocalPath = req?.file?.path;
    // let image = "";
    // if (imageLocalPath) {
    //   image = await uploadOnCloudinary(imageLocalPath);
    // }
    const createdCategory = await Category.create({
      name,
      slug,
      //   image: image ? image?.url : "",
      parent: parent ? new mongoose.Types.ObjectId(parent) : null,
      ancestors: ancestors?.length > 0 ? ancestors : [],
    });
    if (!createdCategory) {
      return res
        .status(500)
        .json(
          new ApiError(500, "Internal server error while creating category")
        );
    }
    return res
      .status(201)
      .json(
        new ApiResponse(201, createdCategory, "Category created successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error?.message || "Internal server error while creating category"
        )
      );
  }
});
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    const hasChildren = await Category.exists({
      parent: category._id,
    });

    if (hasChildren) {
      throw new ApiError(
        400,
        "Cannot delete category because it has subcategories."
      );
    }

    await Category.findByIdAndDelete(categoryId);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Category deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error?.message || "Internal server error"));
  }
});

// const getCategory = asyncHandler(async (req, res) => {
//   const categories = await Category.aggregate([
//     {
//       $match: {
//         parent: null,
//       },
//     },
//     {
//       $graphLookup: {
//         from: "categories",
//         startWith: "$_id",
//         connectFromField: "_id",
//         connectToField: "parent",
//         as: "descendants",
//         depthField: "depth",
//       },
//     },
//   ]);
//   return res
//     .status(200)
//     .json(new ApiResponse(200, categories, "Category fetched successfully"));
// });
const getCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find().lean();

  const categoryMap = {};

  categories.forEach((category) => {
    categoryMap[category._id.toString()] = {
      ...category,
      children: [],
    };
  });
  const categoryTree = [];
  categories.forEach((category) => {
    if (category.parent) {
      const parent = categoryMap[category.parent.toString()];

      if (parent) {
        parent.children.push(categoryMap[category._id.toString()]);
      }
    } else {
      categoryTree.push(categoryMap[category._id.toString()]);
    }
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, categoryTree, "Categories fetched successfully")
    );
});
export { createCategory, deleteCategory, getCategory };
