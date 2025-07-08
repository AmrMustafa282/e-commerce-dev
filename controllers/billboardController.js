import { PrismaClient } from "@prisma/client";

import { AppError } from "./../utils/appError.js";
import { catchAsync } from "./../utils/catchAsync.js";
import { getOne, deleteOne} from "./handlerFactory.js";
import multer from "multer";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const prisma = new PrismaClient();


const multerFilter = (req, file, cb) => {
 if (file.mimetype.startsWith("image")) {
  cb(null, true);
 } else {
  cb(new AppError("Not an image! Please upload only images", 400), false);
 }
};


const storage = new CloudinaryStorage({
 cloudinary,
 params: {
  folder: "billboards",
  format: async (req, file) => "jpeg", // force jpeg
  public_id: (req, file) => `billboard-${Date.now()}`,
  transformation: [
   { width: 1200, height: 290, crop: "limit", quality: "auto" },
  ],
 },
});

const upload = multer({
 storage,
 fileFilter: multerFilter,
});

export const uploadBillboardPhoto = upload.single("image");


export const createBillboard = catchAsync(async (req, res, next) => {
 const { label } = req.body;
 const imageUrl = req.file.path; // Cloudinary URL

 const billboard = await prisma.billboard.create({
  data: {
   label,
   imageUrl,
  },
 });

 res.status(201).json({
  status: "success",
  data: { billboard },
 });
});

export const updateBillboard = catchAsync(async (req, res, next) => {
 const { label } = req.body;
 const imageUrl = req.file?.path;

 const billboard = await prisma.billboard.update({
  where: { id: req.params.id },
  data: {
   label,
   ...(imageUrl && { imageUrl }), // only update if new image
  },
 });

 if (!billboard) {
  return next(new AppError("No document found with that ID", 404));
 }

 res.status(200).json({
  status: "success",
  data: { billboard },
 });
});

export const getAllBillboards = catchAsync(async (req, res, next) => {
 const billboards = await prisma.billboard.findMany({});

 res.status(200).json({
  billboards,
 });
});
export const getFeaturedBillboard = catchAsync(async (req, res, next) => {
 const billboard = await prisma.billboard.findFirst({
  where: {
   label: {
    contains: "Featured",
   },
  },
 });

 res.status(200).json({
  billboard,
 });
});

export const getBillboard = getOne("billboard");
export const deleteBillboard = deleteOne("billboard");
