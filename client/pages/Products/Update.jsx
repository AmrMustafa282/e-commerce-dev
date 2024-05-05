import { useState } from "react";
import axios from "axios";

import { Button } from "../../src/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
 Select,
 SelectContent,
 SelectGroup,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const UpdateProduct = () => {
 const params = useParams();
 const { productId } = params;
 const [product, setProduct] = useState(null);

 const [categories, setCategories] = useState([]);
 const [sizes, setSizes] = useState([]);
 const [colors, setColors] = useState([]);
 const [relatedProducts, setRelatedProducts] = useState([]);

 const [name, setName] = useState("");
 const [description, setDescription] = useState("");
 const [price, setPrice] = useState(0);
 const [isFeatured, setIsFeatured] = useState(null);
 const [isArchived, setIsArchived] = useState(null);
 const [categoryId, setCategoryId] = useState("");
 //  const [sizeId, setSizeId] = useState("");
 const [colorId, setColorId] = useState("");
 const [productSizes, setProductSizes] = useState([]);
 const [imageCover, setImageCover] = useState(null);
 const [images, setImages] = useState([]);
 const [relatedProductsId, setRelatedProductsId] = useState("");
 const [relatedProductsName, setRelatedProductsName] = useState("");
 const [newRelation, setNewRelation] = useState(false);

 const [imageCoverPreview, setImageCoverPreview] = useState(null);
 const [imagesPreview, setImagesPreview] = useState([]);
 const formData = new FormData();

 const nav = useNavigate();
 const handleSubmit = async (event) => {
  event.preventDefault();
  if (name) {
   formData.append("name", name);
  }
  if (description) {
   formData.append("description", description);
  }
  if (price) {
   formData.append("price", price);
  }
  if (productSizes.length < 1) {
   return toast.warning("Porduct must have at least one size");
  }

  formData.append("isFeatured", isFeatured);

  formData.append("isArchived", isArchived);

  formData.append("relatedProductsId", relatedProductsId);
  formData.append("relatedProductsName", relatedProductsName);

  if (categoryId) {
   formData.append("categoryId", categoryId);
  }
  if (colorId) {
   formData.append("colorId", colorId);
  }

  formData.append("imageCover", imageCover);
  images.forEach((image) => {
   formData.append("images", image);
  });
  productSizes.forEach((size) => {
   formData.append("productSizes", JSON.stringify(size));
  });
  try {
  //  console.log(formData);
   const res = await axios.patch(`/api/v1/products/${productId}`, formData);
   if (res.status === 201) {
    toast.success("Product updated");
   }
  //  console.log(res.data);
   setTimeout(() => {
    nav("/dashboard?tab=products");
   }, 1000);
  } catch (error) {
   toast.error(error);
  }
 };

 const handleImageCoverChange = (event) => {
  const uploadedImage = event.target.files[0];
  setImageCover(uploadedImage);
  const reader = new FileReader();
  reader.onload = () => {
   setImageCoverPreview(reader.result);
  };
  reader.readAsDataURL(uploadedImage);
 };
 // console.log(images);

 const handleImagesChange = (event) => {
  const uploadedImages = event.target.files;

  // Check if the number of uploaded images exceeds the limit
  if (
   images.length === 10 ||
   uploadedImages > 10 ||
   images.length + uploadedImages.length > 10
  ) {
   toast.error("You can only upload a maximum of 10 images.");
   return;
  }

  const newImagesArray = [...images];
  const imagesPreviewArray = [];

  for (let i = 0; i < uploadedImages.length; i++) {
   // console.log("uploaded", uploadedImages[i]);
   // console.log(i);
   setImages((prev) => [...prev, uploadedImages[i]]);
   // console.log(images);
   // console.log(imageCover);
   const reader = new FileReader();

   reader.onload = ((file) => {
    return () => {
     imagesPreviewArray.push(reader.result);

     if (imagesPreviewArray.length === uploadedImages.length) {
      const updatedImagesArray = newImagesArray.concat(uploadedImages);
      // const uploadedImage = uploadedImages[i];
      // const imageName = uploadedImage.name;
      // console.log("cover", imageCover);
      // formData.append("images", uploadedImage[0]);

      // formData.append("images", uploadedImage, imageName);
      setImagesPreview((prev) => [...prev, ...imagesPreviewArray]);
      // setImages(updatedImagesArray);[here]
     }
    };
   })(uploadedImages[i]);

   reader.readAsDataURL(uploadedImages[i]);
  }
 };
 console.log(images);
 console.log(imagesPreview);
 const handleDeleteImages = (index) => {
  // Retrieve the image file extension
  const imageType = images[index].name.split(".").pop().toLowerCase();
  const supportedImageTypes = ["jpg", "jpeg", "png", "gif", "bmp"];
  if (supportedImageTypes.includes(imageType)) {
   // Add the image type to the setImages state variable
   setImages((prevImages) => new Set([...prevImages, imageType]));
  }

  // Remove the deleted image from imagesPreview and images arrays
  const updatedImagesPreview = imagesPreview.filter((_, i) => i !== index);
  const updatedImages = images.filter((_, i) => i !== index);

  // Update the state variables
  setImagesPreview(updatedImagesPreview);
  setImages(updatedImages);
 };

 const handleDeleteCoverImage = () => {
  setImageCoverPreview(null);
  setImageCover(null);
 };
 const handelDeleteRelatoin = async (id) => {
  try {
   const res = await axios.delete(`/api/v1/products/relations/${id}`);
   if (res.status === 204) {
    setRelatedProducts(
     relatedProducts.filter((relation) => relation.id !== id)
    );
    toast.success("Relation deleted");
   }
  } catch (error) {
   toast.warning("There are products in this relation");
  }
 };

 const fetchCategories = async () => {
  try {
   const res = await axios.get("/api/v1/categories");
   if (res.status === 200) {
    setCategories(res.data.categories);
   }
  } catch (err) {
   console.log(err);
  }
 };
 const fetchColors = async () => {
  try {
   const res = await axios.get("/api/v1/colors");
   if (res.status === 200) {
    setColors(res.data.colors);
   }
  } catch (err) {
   console.log(err);
  }
 };
 const fetchSizes = async () => {
  try {
   const res = await axios.get("/api/v1/sizes");
   if (res.status === 200) {
    setSizes(res.data.sizes);
   }
  } catch (err) {
   console.log(err);
  }
 };
 const fetchProduct = async () => {
  try {
   const res = await axios.get(`/api/v1/products/${productId}`);
   const prod = res.data.product;
   setProduct(prod);
   setProductSizes(prod.productSizes.map((e) => e.size));

   // Convert image names to URLs
   const imageCoverUrl = `/img/product/${prod.images[0].url}`;
   const imageUrls = prod.images
    .slice(1)
    .map((image) => `/img/product/${image.url}`);

   // Convert image URLs to files
   //  console.log("ursl", imageUrls);
   const imageCoverFile = await urlToFile(imageCoverUrl, prod.images[0].url);
   const imageFiles = await Promise.all(
    [imageCoverFile, ...imageUrls].map((imageUrl, index) =>
     urlToFile(imageUrl, prod.images[index].url)
    )
   );

   setImageCover(imageCoverFile);
   setImages(imageFiles.slice(1));

   setImageCoverPreview(imageCoverUrl);
   setImagesPreview(imageUrls);

   setIsArchived(prod.isArchived);
   setIsFeatured(prod.isFeatured);
  } catch (error) {
   console.error("Error fetching product:", error);
  }
 };
 const fetchRelatedProducts = async () => {
  try {
   const res = await axios.get("/api/v1/products/related");
   if (res.status === 200) {
    setRelatedProducts(res.data.relatedProducts);
   }
  } catch (err) {
   console.log(err);
  }
 };

 const urlToFile = async (url, name) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], name, { type: "image/jpeg" });
  return file;
 };

 useEffect(() => {
  fetchProduct();
 }, []);
 useEffect(() => {
  fetchCategories();
  fetchColors();
  fetchSizes();
  fetchRelatedProducts();
 }, []);
 //  console.log(productSizes[0].size.id===sizes[0].id);
 //  console.log(sizes[0]);
//  console.log(productSizes);

 return (
  <>
   {product && (
    <>
     <div className="py-4 border-b ">
      <h1 className="font-bold text-4xl">Updated Product</h1>
      <p className="text-gray-700">Updated an existing product</p>
     </div>
     <form className="my-4" onSubmit={handleSubmit}>
      <Label htmlFor="name" className="font-semibold text-md">
       Name
      </Label>
      <Input
       onChange={(e) => {
        setName(e.target.value);
       }}
       id="name"
       className="mt-4 mb-8"
       placeholder="product name"
       defaultValue={product?.name}
      />
      <Label htmlFor="description" className="font-semibold text-md">
       Description
      </Label>
      <Textarea
       onChange={(e) => {
        setDescription(e.target.value);
       }}
       id="description"
       className="mt-4 mb-8"
       placeholder="product description"
       defaultValue={product?.description}
      />
      <Label htmlFor="price" className="font-semibold text-md">
       Price
      </Label>
      <Input
       onChange={(e) => {
        setPrice(e.target.value);
       }}
       id="price"
       type="number"
       className="mt-4 mb-8"
       placeholder="0"
       defaultValue={product?.price}
      />
      <div className="flex gap-12">
       <div className="flex-1">
        <Label htmlFor="categoryId" className="font-semibold text-md">
         Category
        </Label>
        <div className="mt-4 mb-8">
         <Select
          id="categoryId"
          // defaultValue={product?.category}
          onValueChange={(val) => setCategoryId(val)}
         >
          <SelectTrigger className="">
           <SelectValue placeholder={product.category.name} />
          </SelectTrigger>
          <SelectContent>
           <SelectGroup>
            {categories.length > 0 &&
             categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
               {category.name}
              </SelectItem>
             ))}
           </SelectGroup>
          </SelectContent>
         </Select>
        </div>
       </div>
       <div className="flex-1">
        <div className="flex gap-4">
         <Label htmlFor="relation" className="font-semibold text-md">
          Relation (optional)
         </Label>
         <div className="flex items-center space-x-2">
          <Switch
           id="airplane-mode"
           checked={newRelation}
           onCheckedChange={(e) => {
            setRelatedProductsId("");
            setRelatedProductsName("");
            setNewRelation(e);
           }}
          />
          <Label htmlFor="airplane-mode">New</Label>
         </div>
        </div>
        <div className="mt-4 mb-8">
         {newRelation ? (
          <Input
           onChange={(e) => {
            setRelatedProductsName(e.target.value);
           }}
           id="relation"
           className="mt-4 mb-8"
           placeholder="Relation name"
          />
         ) : (
          <Select
           id="relation"
           onValueChange={(val) => setRelatedProductsId(val)}
          >
           <SelectTrigger className="">
            <SelectValue placeholder={product.relatedProducts.name} />
           </SelectTrigger>
           <SelectContent>
            <SelectGroup>
             {relatedProducts.length > 0 &&
              relatedProducts.map((relation) => (
               <div className="flex justify-between" key={relation.id}>
                <SelectItem key={relation.id} value={relation.id}>
                 {relation.name}
                </SelectItem>
                <Button
                 variant="destructive"
                 onClick={() => handelDeleteRelatoin(relation.id)}
                 className="p-1 m-1"
                 type="button"
                >
                 <Trash />
                </Button>
               </div>
              ))}
            </SelectGroup>
           </SelectContent>
          </Select>
         )}
        </div>
       </div>
      </div>
      <div className="flex justify-between gap-12">
       <div className="flex-1">
        <Label htmlFor="sizeId" className="font-semibold text-md">
         Sizes
        </Label>
        <div className="mt-4 mb-8 flex gap-2 flex-wrap">
         {sizes.map((size, index) => (
          <div key={size.id}>
           <Label
            htmlFor={size.id}
            onClick={() => {
             if (!productSizes.find((item) => item.id === size.id)) {
              setProductSizes((prev) => [...prev, size]);
             } else {
              setProductSizes(productSizes.filter((s) => s.id !== size.id));
             }
            }}
           >
            <div
             className="px-4 py-2 border rounded-sm cursor-pointer hover:bg-gray-300 duration-300"
             style={
              productSizes.find((item) => item.id === size.id)
               ? { background: "#ccc" }
               : {}
             }
            >
             {size.value}
            </div>
           </Label>
          </div>
         ))}
        </div>
       </div>
       <div className="flex-1">
        <Label htmlFor="colorId" className="font-semibold text-md">
         Color
        </Label>
        <div className="mt-4 mb-8">
         <Select id="colorId" onValueChange={(val) => setColorId(val)}>
          <SelectTrigger className="">
           <SelectValue placeholder={product.color.name} />
          </SelectTrigger>
          <SelectContent>
           <SelectGroup>
            {colors.length > 0 &&
             colors.map((color) => (
              <SelectItem key={color.id} value={color.id}>
               {color.name}
              </SelectItem>
             ))}
           </SelectGroup>
          </SelectContent>
         </Select>
        </div>
       </div>
      </div>
      <div className="flex justify-between gap-12 mt-4 mb-12">
       <div className="flex-1 flex gap-4 ">
        <Checkbox
         id="isFeatured"
         className="mt-1 w-5 h-5"
         checked={isFeatured}
         defaultValue={product.isFeatured}
         onCheckedChange={(val) => {
          setIsFeatured(val);
         }}
        />
        <Label htmlFor="isFeatured" className="font-semibold text-md">
         <h2 className="text-xl">Featured</h2>
         <p className="font-normal text-gray-700">
          This product will appear on the home page.
         </p>
        </Label>
       </div>
       <div className="flex-1 flex gap-4 ">
        <Checkbox
         id="isArchived"
         className="mt-1 w-5 h-5"
         checked={isArchived}
         defaultValue={product.isArchived}
         onCheckedChange={(val) => {
          setIsArchived(val);
         }}
        />
        <Label htmlFor="isArchived" className="font-semibold text-md">
         <h2 className="text-xl">Archived</h2>
         <p className="font-normal text-gray-700">
          This product will not appear anywhere in the store.
         </p>
        </Label>
       </div>
      </div>

      <div className="flex justify-between gap-4">
       <div className="flex-[1/2]">
        <Label htmlFor="coverImage" className="font-semibold text-md">
         Cover image
        </Label>
        <Input
         onChange={handleImageCoverChange}
         type="file"
         id="coverImage"
         className="mt-4 mb-8"
        />
        {imageCoverPreview && (
         <div className="relative max-w-[200px]">
          <img
           src={imageCoverPreview}
           alt="Uploaded"
           className="max-w-[200px] max-h-[200px]"
          />
          <Button
           variant="destructive"
           onClick={handleDeleteCoverImage}
           className="absolute top-2 right-2 p-2"
           type="button"
          >
           <Trash />
          </Button>
         </div>
        )}
       </div>
       <div className="flex-1">
        <Label htmlFor="coverImage" className="font-semibold text-md">
         Alternative images(max-10)
        </Label>
        <Input
         onChange={handleImagesChange}
         type="file"
         id="coverImage"
         className="mt-4 mb-8"
         multiple
        />
        {imagesPreview && (
         <div className="flex flex-wrap justify-start items-center gap-2">
          {imagesPreview.map((imagePreview, index) => (
           <div key={index} className="relative w-[200px]">
            <img
             src={imagePreview}
             alt={`Uploaded ${index}`}
             className="max-w-[200px] max-h-[200px] mb-4"
            />
            <Button
             variant="destructive"
             onClick={() => handleDeleteImages(index)}
             className="absolute top-2 right-2 p-2"
             type="button"
            >
             <Trash />
            </Button>
           </div>
          ))}
         </div>
        )}
       </div>
      </div>
      <Button type="submit" className="w-full mt-12 mb-8">
       Save
      </Button>
     </form>
    </>
   )}
  </>
 );
};

export default UpdateProduct;
