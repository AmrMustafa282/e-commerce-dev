import { PrismaClient } from "@prisma/client";

import { AppError } from "./../utils/appError.js";
import { catchAsync } from "./../utils/catchAsync.js";
import { getAll, getOne, deleteOne, updateOne } from "./handlerFactory.js";
import multer from "multer";
import sharp from "sharp";

const prisma = new PrismaClient();

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
 if (file.mimetype.startsWith("image")) {
  cb(null, true);
 } else {
  cb(new AppError("Not an image! Please upload only images", 400), false);
 }
};

const upload = multer({
 storage: multerStorage,
//  fileFilter: multerFilter,
});



export const uploadBillboardPhoto = upload.single("image");

export const resizeBillboardPhoto = catchAsync(async (req, res, next) => {
 if (!req.file) return next();
 req.file.filename = `billboard-${req.body.label}-${Date.now()}.jpeg`;
 await sharp(req.file.buffer)
  .resize(1200, 490)
  .toFormat("jpeg")
  .jpeg({ quality: 90 })
  .toFile(`public/img/billboard/${req.file.filename}`);
 next();
});

export const createBillboard = catchAsync(async (req, res, next) => {
//  console.log(req.file);
 const { label } = req.body;
 const imageUrl = `public/img/billboard/${req.file.filename}`; // Assuming the image has been uploaded and resized

 const billboard = await prisma.billboard.create({
  data: {
   label,
   imageUrl,
  },
 });

 res.status(201).json({
  status: "success",
  data: {
   billboard,
  },
 });
});

export const getAllBillboards = catchAsync(async (req, res, next) => {
  const billboards = await prisma.billboard.findMany({
    include:{categories:true}
  });


  res.status(200).json({
   billboards,
  });
});
export const getBillboard = getOne("billboard");

export const updateBillboard = updateOne("billboard");
export const deleteBillboard = deleteOne("billboard");
