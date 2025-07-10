import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

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
const uploadToCloudinary = async (
 imagePath,
 folder = "fashion-store",
 options = {}
) => {
 try {
  const result = await cloudinary.uploader.upload(imagePath, {
   folder,
   resource_type: "image",
   transformation: Array.isArray(options) ? options : [options],
  });
  return result.secure_url;
  //  return "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";
 } catch (error) {
  console.error(`Error uploading ${imagePath}:`, error);
  return null;
 }
};

// Function to read products from JSON file and group by category
const readProductsFromJSON = () => {
 try {
  const jsonPath = path.join(process.cwd(), "./scripts/products.json");
  const jsonData = fs.readFileSync(jsonPath, "utf8");
  const productsArray = JSON.parse(jsonData);

  // Group products by category
  const productsByCategory = {};

  for (const product of productsArray) {
   const category = product.category;
   if (!productsByCategory[category]) {
    productsByCategory[category] = [];
   }
   productsByCategory[category].push(product);
  }

  return productsByCategory;
 } catch (error) {
  console.error("Error reading products.json:", error);
  console.log(
   "Make sure products.json exists in the same directory as this script"
  );
  process.exit(1);
 }
};

// Function to parse price string to number
const parsePrice = (priceObj) => {
 if (typeof priceObj === "object" && priceObj.current) {
  // Extract number from "1,990 EGP" format
  const priceStr = priceObj.current.replace(/[^\d.,]/g, "").replace(",", "");
  return parseFloat(priceStr) || 0;
 }
 return parseFloat(priceObj) || 0;
};

// Function to get color info from product
const getProductColor = async (productColor, availableColors) => {
 if (productColor && productColor.name && productColor.hex) {
  // Try to find existing color by name (case insensitive)
  const existingColor = availableColors.find(
   (c) => c.name.toLowerCase() === productColor.name.toLowerCase()
  );

  if (existingColor) {
   console.log("get the color", existingColor);
   return existingColor;
  }

  // If not found, we could create a new color or use a default
  // For now, let's use a random existing color
  console.log("didnt found the color");
  const color = await prisma.color.create({
   data: {
    name: productColor.name,
    value: productColor.hex
   },
  });
   if(color.name && color.value) console.log("create the color", color)
  return color;
 }
 return faker.helpers.arrayElement(availableColors);
};

// Function to normalize product name for grouping variants
const normalizeProductName = (productName) => {
 // Remove common color words and extra spaces
 const colorWords = [
  "black",
  "white",
  "red",
  "blue",
  "green",
  "yellow",
  "brown",
  "gray",
  "grey",
  "pink",
  "purple",
  "orange",
  "navy",
  "beige",
  "khaki",
  "olive",
  "burgundy",
  "camel",
  "cream",
  "charcoal",
  "taupe",
  "rust",
  "stone",
  "sage",
  "ecru",
 ];

 let normalized = productName
  .toLowerCase()
  .replace(/[^\w\s]/g, "") // Remove special characters
  .trim();

 // Remove color words
 colorWords.forEach((color) => {
  const regex = new RegExp(`\\b${color}\\b`, "gi");
  normalized = normalized.replace(regex, "");
 });

 // Clean up extra spaces and return
 return normalized.replace(/\s+/g, " ").trim();
};

// Function to find or create related product group
const findOrCreateRelatedProductGroup = async (
 productName,
 relatedProductsGroups
) => {
 const normalizedName = normalizeProductName(productName);

 // Check if a related product group already exists for this product type
 const existingGroup = relatedProductsGroups.find(
  (group) => normalizeProductName(group.name) === normalizedName
 );

 if (existingGroup) {
  return existingGroup;
 }

 // Create new related product group
 const newGroup = await prisma.relatedProducts.create({
  data: {
   name: normalizedName,
  },
 });

 relatedProductsGroups.push(newGroup);
 return newGroup;
};

// YOUR EXACT CATEGORIES STRUCTURE
const fashionCategories = [
 { name: "tops" },
 { name: "bottoms" },
 { name: "shoes | bags" },
 { name: "accessories" },
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
  label: "Featured",
  imageUrl: "./assets/billboard-2.jpg",
 },
 {
  label: "New Season Collection",
  imageUrl: "./assets/billboard-1.jpg",
 },
 {
  label: "Spring/Summer 2024",
  imageUrl: "./assets/billboard-2.jpg",
 },
 {
  label: "Essential Wardrobe",
  imageUrl: "./assets/billboard-1.jpg",
 },
 {
  label: "Limited Edition",
  imageUrl: "./assets/billboard-2.jpg",
 },
 {
  label: "Autumn Essentials",
  imageUrl: "./assets/billboard-1.jpg",
 },
];

async function main() {
 console.log(
  "Starting your custom fashion database seed with JSON products and Cloudinary uploads..."
 );

 // Read products from JSON file
 console.log("Reading products from products.json...");
 const productsByCategory = readProductsFromJSON();
 console.log(
  `Loaded products for categories: ${Object.keys(productsByCategory).join(
   ", "
  )}`
 );

 // Log product counts per category
 Object.entries(productsByCategory).forEach(([category, products]) => {
  console.log(`  ${category}: ${products.length} products`);
 });

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
  "admin",
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
    email: i < 1 ? "admin@me.com" : faker.internet.email(),
    role: i < 1 ? "admin" : "user",
    isActive: i < 1 ? true : faker.datatype.boolean(0.9),
    isConfirmed: i < 1 ? true : faker.datatype.boolean(0.85),
    password:
     //  i < 1
     // ?
     "$2a$10$CxrVY9esWeq6Z2fTEtnVluh5JCCjacG7MVizCcPx4m5vAWN0BdeI6",
    // : generatePasswordHash(),
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

 // Initialize related products groups array (will be populated as we create products)
 const relatedProductsGroups = [];

 // Create YOUR Billboards with Cloudinary Upload
 const billboards = [];
 console.log("Uploading billboard images to Cloudinary...");

 for (const billboardInfo of fashionBillboards) {
  console.log(`Uploading billboard: ${billboardInfo.label}`);
  const cloudinaryUrl = await uploadToCloudinary(
   billboardInfo.imageUrl,
   "fashion-store/billboards",
   { width: 1200, height: 290, crop: "fill", gravity: "auto", quality: "auto" }
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

 // Create YOUR Categories
 const categories = [];
 for (const categoryInfo of fashionCategories) {
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
 console.log(`Created ${categories.length} categories.`);

 // Create Products from JSON Data with Cloudinary Image Upload
 const products = [];
 console.log(
  "Creating products from JSON data and uploading images to Cloudinary..."
 );

 let totalProductsCreated = 0;
 for (const [categoryName, categoryProducts] of Object.entries(
  productsByCategory
 )) {
  // Find the category
  const category = categories.find((cat) => cat.name === categoryName);
  if (!category) {
   console.log(
    `⚠️  Category "${categoryName}" not found, skipping products...`
   );
   continue;
  }

  console.log(
   `\nProcessing ${categoryProducts.length} products for category: ${categoryName}`
  );

  for (const productData of categoryProducts) {
   console.log(`  Creating product: ${productData.name}`);

   // Validate required fields
   if (!productData.name || !productData.description || !productData.price) {
    console.log(
     `    ⚠️  Skipping product due to missing required fields: ${JSON.stringify(
      productData
     )}`
    );
    continue;
   }

   // Parse price from your JSON format
   const parsedPrice = parsePrice(productData.price);

   // Get color for this product
   const productColor = await getProductColor(productData.color, colors);

   // Find or create related product group based on product name
   const relatedProductGroup = await findOrCreateRelatedProductGroup(
    productData.name,
    relatedProductsGroups
   );

   console.log(
    `    Linked to related product group: "${relatedProductGroup.name}"`
   );

   const product = await prisma.product.create({
    data: {
     name: productData.name,
     description: productData.description,
     price: parsedPrice,
     isFeatured: faker.datatype.boolean(0.25),
     isArchived: faker.datatype.boolean(0.05),
     categoryId: category.id,
     colorId: productColor.id,
     relatedProductsId: relatedProductGroup.id,
     createdAt: randomDate(),
     updatedAt: randomDate(),
    },
   });
   products.push(product);
   totalProductsCreated++;

   // Upload product images to Cloudinary
   if (
    productData.images &&
    Array.isArray(productData.images) &&
    productData.images.length > 0
   ) {
    console.log(
     `    Uploading ${productData.images.length} images for ${productData.name}`
    );

    // Handle imageCover if needed (create first image as cover)
    if (
     productData.imageCover
     //  &&
     //  !productData.images?.includes(productData.imageCover)
    ) {
     const coverImagePath = path.join(
      process.cwd(),
      "assets",
      productData.imageCover
     );

     if (fs.existsSync(coverImagePath)) {
      console.log(`    Uploading cover image: ${productData.imageCover}`);
      const cloudinaryUrl = await uploadToCloudinary(
       coverImagePath,
       `fashion-store/products/${categoryName}`,
       {
        width: 316,
        height: 475,
        crop: "fill",
        gravity: "auto",
        quality: "auto",
       }
      );

      if (cloudinaryUrl) {
       await prisma.image.create({
        data: {
         productId: product.id,
         url: cloudinaryUrl,
         createdAt: new Date(),
         updatedAt: new Date(),
        },
       });
      }
     }
    }

    if (!productData.images || productData.images.length === 0) {
     console.log(`    ⚠️  No images found for ${productData.name}`);
    }

    for (const imageFileName of productData.images) {
     // Construct full path (assuming images are in ./assets/ folder)
     const imagePath = path.join(process.cwd(), "assets", imageFileName);

     // Check if image path exists
     if (!fs.existsSync(imagePath)) {
      console.log(`    ⚠️  Image not found: ${imagePath}`);
      continue;
     }

     console.log(`      Uploading: ${imageFileName}`);
     const cloudinaryUrl = await uploadToCloudinary(
      imagePath,
      `fashion-store/products/${categoryName}`,
      {
       width: 750,
       height: 1125,
       crop: "fill",
       gravity: "auto",
       quality: "auto",
      }
     );

     if (cloudinaryUrl) {
      await prisma.image.create({
       data: {
        productId: product.id,
        url: cloudinaryUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
       },
      });
     } else {
      console.log(`      ❌ Failed to upload: ${imageFileName}`);
     }
    }
   }
  }
 }
 console.log(`\nCreated ${totalProductsCreated} products from JSON data.`);

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
     amount: parseFloat(faker.number.int({ min: 1, max: 2 }).toString()),
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
  "\n🎉 YOUR CUSTOM FASHION STORE WITH PRODUCT VARIANTS IS READY! 🎉"
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
  } (YOUR exact categories: ${fashionCategories.map((c) => c.name).join(", ")})`
 );
 console.log(`📦 Product Variants Groups: ${relatedProductsGroups.length}`);
 console.log(
  `👕 Products: ${products.length} (from YOUR JSON file with automatic variant grouping)`
 );
 console.log(`📐 Product Sizes: ${totalProductSizes}`);
 console.log(`🛒 Orders: ${orders.length}`);
 console.log(`📦 Order Items: ${totalOrderItems}`);
 console.log(`⭐ Reviews: ${reviews.length}`);
 console.log(`👍 Upvotes: ${totalUpvotes}`);

 console.log("\n📝 PRODUCT VARIANT LOGIC:");
 console.log(
  "✅ Products with similar names are automatically grouped together"
 );
 console.log(
  "✅ Each product creates or joins a related product group based on its name"
 );
 console.log("✅ Color variations of the same product are now properly linked");
 console.log("✅ Users can now see all color variants of a product");

 console.log("\n🔗 RELATED PRODUCT GROUPS CREATED:");
 relatedProductsGroups.forEach((group, index) => {
  console.log(`${index + 1}. "${group.name}"`);
 });
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
