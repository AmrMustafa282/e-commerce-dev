import { PrismaClient } from "@prisma/client";

import { AppError } from "./../utils/appError.js";
import { catchAsync } from "./../utils/catchAsync.js";
import { deleteOne, deleteAll } from "./handlerFactory.js";
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
 // 1) Cover Image [to handel render timeout ]
 req.body.imageCover = `product-cover-${Date.now()}.jpeg`;

 await sharp(req.files.imageCover[0].buffer)
  .resize(316, 475)
  .toFormat("jpeg")
  .jpeg({ quality: 90 })
  .toFile(`client/dist/img/product/${req.body.imageCover}`),
  // 2) Images

  (req.body.images = []);

 await Promise.all(
  req.files.images.map(async (file, i) => {
   const filename = `product-img-${Date.now()}-${i + 1}.jpeg`;

   await sharp(file.buffer)
    .resize(750, 1125)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`client/dist/img/product/${filename}`);
   req.body.images.push(filename);
  })
 );

 req.body.images = req.body.images.sort();
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
    productSizes: true,
    color: true,
    // relatedProducts: {
    //  include: {
    //   products: true
    //  },
    // },
   },
   //  skip: startIndex,
   //  take: limit,
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
   //  orderBy: {
   //   updatedAt: "desc",
   //  },
   include: {
    images: true,
    category: true,
    productSizes: true,
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
 //  console.log(req.body);
 let {
  categoryId,
  name,
  description,
  price,
  // sizeId,
  productSizes,
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

 if (!Array.isArray(productSizes)) {
  productSizes = [productSizes];
 }
 productSizes = productSizes.map((size) => JSON.parse(size));

 const product = await prisma.product.create({
  data: {
   categoryId,
   //  sizeId,
   colorId,
   name,
   description,
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
     productSizes: true,
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
 for (const i in productSizes) {
  await prisma.productSize.create({
   data: {
    productId: product.id,
    sizeId: productSizes[i].id,
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
   color: true,
   productSizes: {
    include: {
     size: true,
    },
   },
   relatedProducts: {
    include: {
     products: {
      include: {
       color: true,
      },
     },
    },
   },
   reviews: {
    include: {
     user: true,
     upvotes: true,
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
 console.log(req.body.images);
 let {
  images,
  imageCover,
  isFeatured,
  isArchived,
  relatedProductsId,
  relatedProductsName,
  productSizes,
  ...rest
 } = req.body;
 isFeatured = req.body.isFeatured === "true";
 isArchived = req.body.isArchived === "true";
 rest.isFeatured = isFeatured;
 rest.isArchived = isArchived;

 // handel one item case
 if (!Array.isArray(productSizes)) {
  productSizes = [productSizes];
 }
 productSizes = productSizes.map((size) => JSON.parse(size));

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
  data: {
   ...rest,
  },
  include: {
   images: true,
  },
 });

 await prisma.productSize.deleteMany({
  where: { productId: product.id },
 });

 for (let i = 0; i < productSizes.length; i++) {
  await prisma.productSize.create({
   // where: { id: product.images[i + 1].id },
   data: {
    productId: product.id,
    sizeId: productSizes[i].id,
   },
  });
 }

 await prisma.image.deleteMany({
  where: { productId: product.id },
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
export const getStates = catchAsync(async (req, res, next) => {
 const orders = await prisma.order.findMany({
  where: {
   isPaid: true,
  },
  include: {
   orderItems: {
    include: {
     product: true,
    },
   },
  },
 });
 const products = await prisma.product.count();
 const customers = await prisma.user.count({
  where: {
   role: "user",
  },
 });
 let sales = 0;
 const totalRevenue = orders.reduce((acc, order) => {
  const orderPrice = order.orderItems.reduce((orderAcc, item) => {
   const itemPrice = parseInt(item.amount) * parseInt(item.product.price);
   sales += parseInt(item.amount);
   return orderAcc + itemPrice;
  }, 0);
  return acc + orderPrice;
 }, 0);

 const monthlyRevenue = {};
 for (const order of orders) {
  const month = order.createdAt.getMonth();
  let revenueForOrder = 0;
  for (const item of order.orderItems) {
   revenueForOrder += item.product.price.toNumber() * item.amount.toNumber();
  }
  monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
 }
 const graphData = [
  { name: "Jan", total: 0 },
  { name: "Feb", total: 0 },
  { name: "Mar", total: 0 },
  { name: "Apr", total: 0 },
  { name: "May", total: 0 },
  { name: "Jun", total: 0 },
  { name: "Jul", total: 0 },
  { name: "Aug", total: 0 },
  { name: "Sep", total: 0 },
  { name: "Oct", total: 0 },
  { name: "Nov", total: 0 },
  { name: "Dec", total: 0 },
 ];

 for (const month in monthlyRevenue) {
  graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
 }

 res.status(200).json({
  status: "success",
  totalRevenue,
  sales,
  products,
  customers,
  graphData,
 });
});

export const deleteProduct = deleteOne(model);
export const deleteAllProduct = deleteAll(model);

export const deleteRelation = deleteOne("relatedProducts");
