import { PrismaClient } from "@prisma/client";

import { AppError } from "./../utils/appError.js";
import { catchAsync } from "./../utils/catchAsync.js";
import { deleteOne, deleteAll, getAll } from "./handlerFactory.js";
import multer from "multer";
import sharp from "sharp";

const prisma = new PrismaClient();
const model = "product";

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
 // fileFilter: multerFilter,
});

export const uploadProductImages = upload.fields([
 // upload.single('photo') for only one [req.file]
 // upload.array('images') for multiple [req.files]
 // upload.fields([{},{}]) for mix of them [req.files]
 { name: "imageCover", maxCount: 1 },
 { name: "images", maxCount: 10 },
]);

export const resizeProductImages = catchAsync(async (req, res, next) => {
 // console.log(req.files);
 if (!req.files.imageCover && !req.files.images) {
  // console.log("out");
  return next();
 }
 // 1) Cover Image
 req.body.imageCover = `product-cover-${Date.now()}.jpeg`;
 await sharp(req.files.imageCover[0].buffer)
  .resize(316, 475)
  .toFormat("jpeg")
  .jpeg({ quality: 90 })
  .toFile(`client/public/img/product/${req.body.imageCover}`);

 // 2) Images

 req.body.images = [];
 await Promise.all(
  req.files.images.map(async (file, i) => {
   const filename = `product-img-${Date.now()}-${i + 1}.jpeg`;

   await sharp(file.buffer)
    .resize(750, 1125)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`client/public/img/product/${filename}`);
   req.body.images.push(filename);
  })
 );

 // console.log(req.body)
 next();
});

export const getAllProducts = catchAsync(async (req, res, next) => {
 try {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 16;
  const sortDirection = req.query.order === "asc" ? "asc" : "desc";
  const search = req.query.search || "";

  const products = await prisma.product.findMany({
   where: {
    OR: [{ name: { contains: search } }],
   },
   orderBy: {
    // price: sortDirection,
    updatedAt: sortDirection,
   },
   include: {
    images: true,
    category: true,
    size: true,
    color: true,
    // relatedProducts: {
    //  include: {
    //   products: true
    //  },
    // },
   },
   // skip: startIndex,
   // take: limit,
  });

  const total = await prisma.product.count();

  res.status(200).json({
   products,
   total,
  });
 } catch (error) {
  next(error);
 }
});
export const getFeaturedProducts = catchAsync(async (req, res, next) => {
 try {
  const products = await prisma.product.findMany({
   where: { isFeatured: true, isArchived: false },
   orderBy: {
    updatedAt: "asc",
   },
   include: {
    images: true,
    category: true,
    size: true,
    color: true,
    relatedProducts: true,
   },
  });

  const total = await prisma.product.count();

  res.status(200).json({
   products,
   total,
  });
 } catch (error) {
  next(error);
 }
});

export const createProduct = catchAsync(async (req, res, next) => {
 let {
  categoryId,
  name,
  description,
  price,
  sizeId,
  colorId,
  relatedProductsId,
  relatedProductsName,
 } = req.body;
 const isFeatured = req.body.isFeatured === "true";
 const isArchived = req.body.isArchived === "true";

 if (!relatedProductsId) {
  const relatedProducts = await prisma.relatedProducts.create({
   data: {
    name: relatedProductsName || name,
   },
  });
  relatedProductsId = relatedProducts.id;
 }

 const product = await prisma.product.create({
  data: {
   categoryId,
   sizeId,
   colorId,
   name,
   description, //[fix]
   price,
   isFeatured,
   isArchived,
   relatedProductsId,
  },
 });

 const relatedProd = await prisma.relatedProducts.findUnique({
  where: {
   id: relatedProductsId,
  },
  include: {
   products: {
    include: {
     images: true,
     color: true,
     size: true,
     category: true,
    },
   },
  },
 });

 await prisma.image.create({
  data: {
   productId: product.id,
   url: req.body.imageCover,
  },
 });

 for (const i in req.body.images) {
  await prisma.image.create({
   data: {
    productId: product.id,
    url: req.body.images[i],
   },
  });
 }

 res.status(201).json({
  status: "success",
  data: {
   product,
   relatedProd,
  },
 });
});

export const getProduct = catchAsync(async (req, res, next) => {
 const product = await prisma.product.findFirst({
  where: { id: req.params.id },
  include: {
   category: true,
   images: true,
   size: true,
   color: true,
   relatedProducts: {
    include: {
     products: {
      include: {
       color: true,
      },
     },
    },
   },
  },
 });

 if (!product) {
  return next(new AppError("No product found with that ID"));
 }
 res.status(200).json({
  status: "success",
  product,
 });
});
export const updateProduct = catchAsync(async (req, res, next) => {
 let {
  images,
  imageCover,
  isFeatured,
  isArchived,
  relatedProductsId,
  relatedProductsName,
  ...rest
 } = req.body;
 isFeatured = req.body.isFeatured === "true";
 isArchived = req.body.isArchived === "true";
 rest.isFeatured = isFeatured;
 rest.isArchived = isArchived;

 if (!relatedProductsId && relatedProductsName) {
  const relatedProducts = await prisma.relatedProducts.create({
   data: {
    name: relatedProductsName || rest.name,
   },
  });
  relatedProductsId = relatedProducts.id;
  rest.relatedProductsId = relatedProductsId;
 }

 const product = await prisma.product.update({
  where: { id: req.params.id },
  data: rest,
  include: {
   images: true,
  },
 });

 await prisma.image.deleteMany({
  where: { productId: product.id },
 });
 await prisma.image.create({
  // where: { id: product.images[0].id },
  data: {
   productId: product.id,
   url: req.body.imageCover,
  },
 });

 // console.log("iamges", product.images.length);
 for (let i = 0; i < req.body.images.length; i++) {
  await prisma.image.create({
   // where: { id: product.images[i + 1].id },
   data: {
    productId: product.id,
    url: req.body.images[i],
   },
  });
 }

 res.status(201).json({
  status: "success",
  data: {
   product,
  },
 });
});

export const relatedProducts = catchAsync(async (req, res, next) => {
 const relatedProducts = await prisma.relatedProducts.findMany({
  include: {
   products: true,
  },
 });

 res.status(200).json({
  relatedProducts,
 });
});

export const deleteProduct = deleteOne(model);
export const deleteAllProduct = deleteAll(model);

export const deleteRelation = deleteOne("relatedProducts");
