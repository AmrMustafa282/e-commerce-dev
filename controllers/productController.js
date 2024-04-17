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
  { name: "images", maxCount: 3 },
]);

export const resizeProductImages = catchAsync(async (req, res, next) => {
  console.log(req.files);
  if (!req.files.imageCover && !req.files.images) {
    console.log("out");
    return next();
  }
  // 1) Cover Image
  req.body.imageCover = `product-cover-${Date.now()}.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(800, 800)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`client/public/img/product/${req.body.imageCover}`);

  // 2) Images

  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `product-img-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(800, 800)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`client/public/img/product/${filename}`);
      req.body.images.push(filename);
    }),
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
      where: { isFeatured: true },
      orderBy: {
        updatedAt: "asc",
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
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
  const { categoryId, name, price, isFeatured, isArchived, sizeId, colorId } =
    req.body;
  console.log(req.body);
  const product = await prisma.product.create({
    data: {
      categoryId,
      sizeId,
      colorId,
      name,
      price,
      // isFeatured,
      // isArchived,
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
    },
  });
});

export const getProduct = catchAsync(async (req, res, next) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id },
      include: {
        category: true,
        images: true,
        size: true,
        color: true,
      },
    });

    if (!product) {
      return next(new AppError("No product found with that ID"));
    }
    res.status(200).json({
      status: "success",
      product,
    });
  } catch (error) {
    next(error);
  }
});
export const updateProduct = catchAsync(async (req, res, next) => {
  const { images, imageCover, ...rest } = req.body;
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

  console.log("iamges", product.images.length);
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

export const deleteProduct = deleteOne(model);
export const deleteAllProduct = deleteAll(model);
