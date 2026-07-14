import mongoose from "mongoose";
import { Seller } from "../models/seller.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
const createSeller = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    const { businessName, gstNumber, pickupAddress, bankDetails } = req.body;
    const createdSeller = await Seller.create({
      userId: new mongoose.Types.ObjectId(user?._id),
      businessName,
      gstNumber,
      pickupAddress,
      bankDetails,
    });
    if (!createdSeller) {
      return res
        .status(500)
        .json(new ApiError(500, "Internal server error while creating seller"));
    }
    const seller = await Seller.findById({ _id: createdSeller?._id }).select(
      "-commissionRate"
    );
    return res
      .status(201)
      .json(new ApiResponse(201, seller, "Seller created successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error?.message || "Internal server error while creating seller"
        )
      );
  }
});

export { createSeller };
