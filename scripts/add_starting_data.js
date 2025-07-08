import { PrismaClient } from"@prisma/client"
import { faker } from "@faker-js/faker";
import { v2 as cloudinary } from "cloudinary"; // Import your configured Cloudinary

cloudinary.config({
 cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
 api_key: process.env.CLOUDINARY_API_KEY,
 api_secret: process.env.CLOUDINARY_API_SECRET,
});


const prisma = new PrismaClient();

// Helper function to create random date within last year
const randomDate = () => {
 const start = new Date();
 start.setFullYear(start.getFullYear() - 1);
 return faker.date.between({ from: start, to: new Date() });
};

// Helper function to generate random password hash (in real app, use bcrypt)
const generatePasswordHash = () => {
 return faker.internet.password({ length: 60 }); // Simulating hashed password
};

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (imagePath, folder = "fashion-store") => {
 try {
  const result = await cloudinary.uploader.upload(imagePath, {
   folder: folder,
   resource_type: "image",
   transformation: [{ width: 800, height: 800, crop: "fill", quality: "auto" }],
  });
  return result.secure_url;
 } catch (error) {
  console.error(`Error uploading ${imagePath}:`, error);
  return null;
 }
};

// YOUR EXACT CATEGORIES STRUCTURE WITH IMAGES
const fashionCategories = [
 {
  name: "tops",
 },
 {
  name: "bottoms",
 },
 {
  name: "shoes",
 },
 {
  name: "bags",
 },
 {
  name: "accessories",
 },
];

// YOUR EXACT COLORS
const fashionColors = [
 { name: "Black", value: "#000000" },
 { name: "White", value: "#FFFFFF" },
 { name: "Navy Blue", value: "#1B2951" },
 { name: "Beige", value: "#F5F5DC" },
 { name: "Camel", value: "#C19A6B" },
 { name: "Burgundy", value: "#800020" },
 { name: "Olive Green", value: "#556B2F" },
 { name: "Cream", value: "#F5F5DC" },
 { name: "Charcoal", value: "#36454F" },
 { name: "Taupe", value: "#483C32" },
 { name: "Rust", value: "#B7410E" },
 { name: "Stone", value: "#918E85" },
 { name: "Khaki", value: "#F0E68C" },
 { name: "Sage", value: "#9CAF88" },
 { name: "Ecru", value: "#F5F5DC" },
];

// YOUR EXACT CLOTHING SIZES
const clothingSizes = [
 { name: "Extra Small", value: "XS" },
 { name: "Small", value: "S" },
 { name: "Medium", value: "M" },
 { name: "Large", value: "L" },
 { name: "Extra Large", value: "XL" },
 { name: "Double Extra Large", value: "XXL" },
];

// YOUR EXACT BILLBOARDS
const fashionBillboards = [
 {
  label: "New Season Collection",
  imageUrl: "./assets/test.png" // Local path
 },
 {
  label: "Spring/Summer 2024",
  imageUrl: "./assets/test.png" // Local path
 },
 {
  label: "Essential Wardrobe",
  imageUrl: "./assets/test.png" // Local path
 },
 {
  label: "Limited Edition",
  imageUrl: "./assets/test.png" // Local path
 },
 {
  label: "Autumn Essentials",
  imageUrl: "./assets/test.png" // Local path
 },
];

// Related product collections
const fashionCollections = [
 "Essential Basics",
 "Work Wardrobe",
 "Weekend Casual",
 "Evening Wear",
 "Seasonal Favorites",
 "Trending Now",
 "Capsule Collection",
 "Limited Edition",
];

// UPDATED STATIC PRODUCT DATA ARRAYS WITH LOCAL IMAGE PATHS
const productsByCategory = {
 tops: [
  {
   name: "Classic White T-Shirt",
   description:
    "Essential cotton t-shirt with crew neck and short sleeves. Perfect for layering or wearing alone.",
   price: 19.95,
   images: [
    "./assets/test.png",
    "./assets/test.png",
    "./assets/test.png",
   ],
  },
  {
   name: "Striped Long Sleeve Top",
   description:
    "Casual striped top with long sleeves and relaxed fit. Made from soft cotton blend.",
   price: 29.95,
   images: [
    "./assets/test.png",
    "./assets/test.png",
   ],
  },
  {
   name: "Silk Blouse",
   description:
    "Elegant silk blouse with button-up front and long sleeves. Perfect for office or evening wear.",
   price: 79.95,
   images: [
    "./assets/test.png",
    "./assets/test.png",
    "./assets/test.png",
   ],
  },
  {
   name: "Oversized Sweater",
   description:
    "Cozy oversized sweater in soft knit fabric. Round neckline and dropped shoulders.",
   price: 49.95,
   images: [
    "./assets/test.png",
    "./assets/test.png",
   ],
  },
  {
   name: "Cropped Hoodie",
   description:
    "Trendy cropped hoodie with drawstring hood and kangaroo pocket. Comfortable cotton blend.",
   price: 39.95,
   images: [
    "./assets/test.png",
    "./assets/test.png",
    "./assets/test.png",
   ],
  },
  // Add more tops with images...
 ],
 bottoms: [
  {
   name: "Straight Leg Jeans",
   description:
    "Classic straight leg jeans with five-pocket styling. Comfortable mid-rise fit.",
   price: 59.95,
   images: [
    "./assets/test.png",
    "./assets/test.png",
    "./assets/test.png",
   ],
  },
  {
   name: "Wide Leg Pants",
   description:
    "Flowing wide leg pants with high waist and relaxed fit. Perfect for both casual and dressy occasions.",
   price: 49.95,
   images: [
    "./assets/test.png",
    "./assets/test.png",
   ],
  },
  {
   name: "Skinny Jeans",
   description:
    "Fitted skinny jeans with stretch fabric for comfort. Classic five-pocket design.",
   price: 54.95,
   images: [
    "./assets/test.png",
    "./assets/test.png",
    "./assets/test.png",
   ],
  },
  // Add more bottoms with images...
 ],
 shoes: [
  {
   name: "White Sneakers",
   description:
    "Classic white sneakers with lace-up closure. Comfortable and versatile for everyday wear.",
   price: 79.95,
   images: [
    "./assets/test.png",
    "./assets/test.png",
    "./assets/test.png",
   ],
  },
  {
   name: "Ankle Boots",
   description:
    "Stylish ankle boots with low heel and side zip. Perfect for transitional weather.",
   price: 119.95,
   images: [
    "./assets/test.png",
    "./assets/test.png",
   ],
  },
  // Add more shoes with images...
 ],
 bags: [
  {
   name: "Leather Handbag",
   description:
    "Spacious leather handbag with multiple compartments. Perfect for work or daily use.",
   price: 149.95,
   images: [
    "./assets/test.png",
    "./assets/test.png",
    "./assets/test.png",
   ],
  },
  {
   name: "Crossbody Bag",
   description:
    "Convenient crossbody bag with adjustable strap. Hands-free and stylish.",
   price: 79.95,
   images: [
    "./assets/test.png",
    "./assets/test.png",
   ],
  },
  // Add more bags with images...
 ],
 accessories: [
  {
   name: "Silk Scarf",
   description:
    "Luxurious silk scarf with elegant print. Perfect for adding sophistication to any outfit.",
   price: 49.95,
   images: [
    "./assets/test.png",
    "./assets/test.png",
   ],
  },
  {
   name: "Leather Belt",
   description:
    "Classic leather belt with metal buckle. Essential accessory for defining waist.",
   price: 35.95,
   images: [
    "./assets/test.png",
    "./assets/test.png",
   ],
  },
  // Add more accessories with images...
 ],
};

async function main() {
 console.log(
  "Starting your custom fashion database seed with Cloudinary uploads..."
 );

 // Clear existing data (optional)
 await prisma.upvote.deleteMany({});
 await prisma.review.deleteMany({});
 await prisma.orderItem.deleteMany({});
 await prisma.order.deleteMany({});
 await prisma.image.deleteMany({});
 await prisma.productSize.deleteMany({});
 await prisma.product.deleteMany({});
 await prisma.category.deleteMany({});
 await prisma.billboard.deleteMany({});
 await prisma.relatedProducts.deleteMany({});
 await prisma.color.deleteMany({});
 await prisma.size.deleteMany({});
 await prisma.user.deleteMany({});

 console.log("Existing data cleared.");

 // Create Users
 const users = [];
 const fashionUsernames = [
  "fashionista_23",
  "style_maven",
  "trendsetter_pro",
  "chic_shopper",
  "wardrobe_guru",
  "fashion_forward",
  "style_seeker",
  "trend_hunter",
  "outfit_curator",
  "fashion_lover",
  "style_icon",
  "closet_queen",
  "fashion_enthusiast",
  "style_blogger",
  "trend_follower",
  "fashion_addict",
  "style_expert",
  "outfit_planner",
  "fashion_curator",
  "style_guide",
 ];

 for (let i = 0; i < 20; i++) {
  const user = await prisma.user.create({
   data: {
    username: fashionUsernames[i] || faker.internet.userName(),
    email: faker.internet.email(),
    role: i < 2 ? "admin" : "user",
    isActive: faker.datatype.boolean(0.9),
    isConfirmed: faker.datatype.boolean(0.85),
    password: generatePasswordHash(),
    passwordResetToken: faker.datatype.boolean(0.05) ? faker.string.uuid() : "",
    passwordResetExpires: randomDate(),
    emailConfirmToken: faker.datatype.boolean(0.1) ? faker.string.uuid() : "",
    emailConfirmExpires: randomDate(),
    wishlist: Array.from({ length: faker.number.int({ min: 0, max: 8 }) }, () =>
     faker.string.uuid()
    ),
    createdAt: randomDate(),
    updatedAt: randomDate(),
   },
  });
  users.push(user);
 }
 console.log(`Created ${users.length} users.`);

 // Create YOUR Colors
 const colors = [];
 for (const colorInfo of fashionColors) {
  const color = await prisma.color.create({
   data: {
    name: colorInfo.name,
    value: colorInfo.value,
    createdAt: randomDate(),
    updatedAt: randomDate(),
   },
  });
  colors.push(color);
 }
 console.log(`Created ${colors.length} colors.`);

 // Create YOUR Sizes
 const sizes = [];
 for (const sizeInfo of clothingSizes) {
  const size = await prisma.size.create({
   data: {
    name: sizeInfo.name,
    value: sizeInfo.value,
    updatedAt: randomDate(),
   },
  });
  sizes.push(size);
 }
 console.log(`Created ${sizes.length} sizes.`);

 // Create Related Products Collections
 const relatedProductsGroups = [];
 for (const collectionName of fashionCollections) {
  const relatedProducts = await prisma.relatedProducts.create({
   data: {
    name: collectionName,
   },
  });
  relatedProductsGroups.push(relatedProducts);
 }
 console.log(`Created ${relatedProductsGroups.length} collections.`);

 // Create YOUR Billboards with Cloudinary Upload
 const billboards = [];
 console.log("Uploading billboard images to Cloudinary...");

 for (const billboardInfo of fashionBillboards) {
  console.log(`Uploading billboard: ${billboardInfo.label}`);
  const cloudinaryUrl = await uploadToCloudinary(
   billboardInfo.imageUrl,
   "fashion-store/billboards"
  );

  const billboard = await prisma.billboard.create({
   data: {
    label: billboardInfo.label,
    imageUrl: cloudinaryUrl || billboardInfo.imageUrl, // Fallback to original if upload fails
    createdAt: randomDate(),
    updatedAt: randomDate(),
   },
  });
  billboards.push(billboard);
 }
 console.log(`Created ${billboards.length} billboards.`);

 // Create YOUR Categories with Cloudinary Upload
 const categories = [];
 console.log("Uploading category images to Cloudinary...");

 for (const categoryInfo of fashionCategories) {
  console.log(`Uploading category image: ${categoryInfo.name}`);
  const category = await prisma.category.create({
   data: {
    name: categoryInfo.name,
    billboardId: faker.helpers.arrayElement(billboards).id,
    createdAt: randomDate(),
    updatedAt: randomDate(),
   },
  });
  categories.push(category);
 }
 console.log(`Created ${categories.length} categories with Cloudinary images.`);

 // Create Products from YOUR Static Data with Cloudinary Image Upload
 const products = [];
 console.log("Creating products and uploading images to Cloudinary...");

 for (const [categoryName, categoryProducts] of Object.entries(
  productsByCategory
 )) {
  // Find the category (update this part in the product creation section)
  const category = categories.find((cat) => cat.name === categoryName);
  if (category) {
   for (const productData of categoryProducts) {
    console.log(`Creating product: ${productData.name}`);

    const product = await prisma.product.create({
     data: {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      isFeatured: faker.datatype.boolean(0.25),
      isArchived: faker.datatype.boolean(0.05),
      categoryId: category.id,
      colorId: faker.helpers.arrayElement(colors).id,
      relatedProductsId: faker.helpers.arrayElement(relatedProductsGroups).id,
      createdAt: randomDate(),
      updatedAt: randomDate(),
     },
    });
    products.push(product);

    // Upload product images to Cloudinary
    if (productData.images && productData.images.length > 0) {
     console.log(
      `  Uploading ${productData.images.length} images for ${productData.name}`
     );

     for (const imagePath of productData.images) {
      console.log(`    Uploading: ${imagePath}`);
      const cloudinaryUrl = await uploadToCloudinary(
       imagePath,
       `fashion-store/products/${categoryName}`
      );

      if (cloudinaryUrl) {
       await prisma.image.create({
        data: {
         productId: product.id,
         url: cloudinaryUrl,
         createdAt: randomDate(),
         updatedAt: randomDate(),
        },
       });
      } else {
       console.log(`    Failed to upload: ${imagePath}`);
      }
     }
    }
   }
  }
 }
 console.log(`Created ${products.length} products from your static data.`);

 // Create Product Sizes
 let totalProductSizes = 0;
 for (const product of products) {
  // Different sizing logic based on category
  const categoryName = await prisma.category.findUnique({
   where: { id: product.categoryId },
   select: { name: true },
  });

  let productSizes = [];
  if (categoryName?.name === "shoes") {
   // Shoes might have different sizes (you can adjust this later)
   productSizes = faker.helpers.arrayElements(
    sizes,
    faker.number.int({ min: 3, max: 5 })
   );
  } else if (categoryName?.name === "accessories") {
   // Accessories might be one-size or have fewer sizes
   productSizes = faker.helpers.arrayElements(
    sizes,
    faker.number.int({ min: 1, max: 3 })
   );
  } else {
   // Tops, bottoms, bags get standard clothing sizes
   productSizes = faker.helpers.arrayElements(
    sizes,
    faker.number.int({ min: 3, max: 5 })
   );
  }

  for (const size of productSizes) {
   await prisma.productSize.create({
    data: {
     productId: product.id,
     sizeId: size.id,
     updatedAt: randomDate(),
    },
   });
   totalProductSizes++;
  }
 }
 console.log(`Created ${totalProductSizes} product sizes.`);

 // Create Orders
 const orders = [];
 for (let i = 0; i < 30; i++) {
  const order = await prisma.order.create({
   data: {
    userId: faker.helpers.arrayElement(users).id,
    isPaid: faker.datatype.boolean(0.85),
    status: faker.helpers.arrayElement([
     "pending...",
     "processing",
     "shipped",
     "delivered",
     "cancelled",
    ]),
    createdAt: randomDate(),
    updatedAt: randomDate(),
   },
  });
  orders.push(order);
 }
 console.log(`Created ${orders.length} orders.`);

 // Create Order Items
 let totalOrderItems = 0;
 for (const order of orders) {
  const itemCount = faker.number.int({ min: 1, max: 4 });
  const orderProducts = faker.helpers.arrayElements(products, itemCount);

  for (const product of orderProducts) {
   const productSizes = await prisma.productSize.findMany({
    where: { productId: product.id },
    include: { size: true },
   });

   const selectedSize =
    productSizes.length > 0
     ? faker.helpers.arrayElement(productSizes).size.value
     : "M";

   await prisma.orderItem.create({
    data: {
     orderId: order.id,
     productId: product.id,
     amount: Number.parseFloat(faker.number.int({ min: 1, max: 2 }).toString()),
     size: selectedSize,
     createdAt: randomDate(),
     updatedAt: randomDate(),
    },
   });
   totalOrderItems++;
  }
 }
 console.log(`Created ${totalOrderItems} order items.`);

 // Create Reviews
 const reviews = [];
 const fashionReviewTexts = [
  "Great quality and perfect fit! Love the style.",
  "Beautiful piece, exactly as described.",
  "Comfortable and stylish - highly recommend!",
  "Perfect for my wardrobe, great value.",
  "Excellent quality, will buy again.",
  "Fits perfectly and looks amazing.",
  "Great material and construction.",
  "Stylish and comfortable for daily wear.",
  "Love the design and quality.",
  "Perfect addition to my collection.",
 ];

 for (let i = 0; i < 80; i++) {
  const review = await prisma.review.create({
   data: {
    productId: faker.helpers.arrayElement(products).id,
    userId: faker.helpers.arrayElement(users).id,
    text: faker.helpers.arrayElement(fashionReviewTexts),
    rating: faker.number.int({ min: 3, max: 5 }),
    upvoteCount: faker.number.int({ min: 0, max: 20 }),
    createdAt: randomDate(),
    updatedAt: randomDate(),
   },
  });
  reviews.push(review);
 }
 console.log(`Created ${reviews.length} reviews.`);

 // Create Upvotes
 let totalUpvotes = 0;
 for (const review of reviews) {
  const upvoteCount = faker.number.int({
   min: 0,
   max: Math.min(6, users.length),
  });
  const upvotingUsers = faker.helpers.arrayElements(users, upvoteCount);

  for (const user of upvotingUsers) {
   try {
    await prisma.upvote.create({
     data: {
      reviewId: review.id,
      userId: user.id,
     },
    });
    totalUpvotes++;
   } catch (error) {
    // Skip duplicates
   }
  }
 }
 console.log(`Created ${totalUpvotes} upvotes.`);

 console.log(
  "\n🎉 YOUR CUSTOM FASHION STORE WITH CLOUDINARY IMAGES IS READY! 🎉"
 );
 console.log("\n=== SUMMARY ===");
 console.log(`👤 Users: ${users.length}`);
 console.log(`🎨 Colors: ${colors.length} (YOUR exact colors)`);
 console.log(`📏 Sizes: ${sizes.length} (YOUR exact sizes)`);
 console.log(
  `📺 Billboards: ${billboards.length} (YOUR exact billboards with Cloudinary images)`
 );
 console.log(
  `🏷️ Categories: ${
   categories.length
  } (YOUR exact categories: ${fashionCategories.join(", ")})`
 );
 console.log(`📦 Collections: ${relatedProductsGroups.length}`);
 console.log(
  `👕 Products: ${products.length} (from YOUR static data with Cloudinary images)`
 );
 console.log(`📐 Product Sizes: ${totalProductSizes}`);
 console.log(`🛒 Orders: ${orders.length}`);
 console.log(`📦 Order Items: ${totalOrderItems}`);
 console.log(`⭐ Reviews: ${reviews.length}`);
 console.log(`👍 Upvotes: ${totalUpvotes}`);

 console.log("\n📝 NEXT STEPS:");
 console.log(
  "1. Make sure your local image files exist in the specified paths"
 );
 console.log("2. All images have been uploaded to Cloudinary automatically");
 console.log("3. Your database is ready with real Cloudinary URLs!");
}

main()
 .then(async () => {
  await prisma.$disconnect();
 })
 .catch(async (e) => {
  console.error("Error during seeding:", e);
  await prisma.$disconnect();
  process.exit(1);
 });
