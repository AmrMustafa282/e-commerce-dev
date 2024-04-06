import { PrismaClient } from "@prisma/client";

import {AppError} from "./../utils/appError.js";
import {catchAsync} from "./../utils/catchAsync.js";
import {getAll, getOne, deleteOne, updateOne} from "./handlerFactory.js";
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
 fileFilter: multerFilter,
});

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
 if (!req.file) return next();
 req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
 await sharp(req.file.buffer)
  .resize(500, 500)
  .toFormat("jpeg")
  .jpeg({ quality: 90 })
  .toFile(`public/img/users/${req.file.filename}`);
 next();
});

export const uploadUserPhoto = upload.single("photo");

const filterObj = (obj, ...allowedFileds) => {
 const newObj = {};
 Object.keys(obj).forEach((el) => {
  if (allowedFileds.includes(el)) newObj[el] = obj[el];
 });
 return newObj;
};

export const updateMe = catchAsync(async (req, res, next) => {
 // 1) Create error if user POSTs password data
 if (req.body.password || req.body.passwordConfirm) {
  return next(
   new AppError(
    "This route is not for password updates. Please user /updateMyPassword",
    400
   )
  );
 }
 // 2) filterout unwanted fields names that are not allowed to be updated like [role]
 const filterdBody = filterObj(req.body, "username", "email"); // only update name and email
 if (req.file) filterdBody.photo = req.file.filename;

  const updatedUser = await prisma.user.update({
    where: {
      id: req.user.id,
    },
      data:filterdBody
   });

 res.status(200).json({
  status: "success",
  data: {
   updatedUser,
  },
 });
});

export const deleteMe = catchAsync(async (req, res, next) => {
 await prisma.user.update({where:{id:req.user.id}, data:{ isActive: false }});

 res.status(204).json({
  status: "success",
  data: null,
 });
});

export const getMe = (req, res, next) => {
 req.params.id = req.user.id;
 next();
};

export const getAllUsers = catchAsync(async (req, res, next) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 16;
  const sortDirection = req.query.order === "asc" ? "asc" : "desc";
  const search = req.query.search || "";
  const users = await prisma.user.findMany({
   where: {
      OR: [
        { username: { contains: search } },
        { role: { contains: search } },
        { email: { contains: search } },
      ],
   },
   orderBy: {
    updatedAt: sortDirection,
    },
   include:{orders:true},
   skip: startIndex,
   take: limit,
  });

  const total = await prisma.user.count();
  res.status(200).json({
   users,
   total,
  });
});

export const getUser = getOne('user');

// Do NOT update passwords with this!!!!
export const updateUser = updateOne('user');
export const deleteUser = deleteOne('user');


