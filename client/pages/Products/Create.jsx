import { useState } from "react";
import axios from "axios";

import { Button } from "../../src/components/ui/button";

import { useNavigate } from "react-router-dom";
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
import { Grip, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Reorder } from "framer-motion";

const CreateProduct = () => {
 const [categories, setCategories] = useState([]);
 const [sizes, setSizes] = useState([]);
 const [colors, setColors] = useState([]);
 const [relatedProducts, setRelatedProducts] = useState([]);

 const [name, setName] = useState("");
 const [description, setDescription] = useState("");
 const [price, setPrice] = useState(0);
 const [isFeatured, setIsFeatured] = useState(false);
 const [isArchived, setIsArchived] = useState(false);
 const [categoryId, setCategoryId] = useState("");
 //  const [sizeId, setSizeId] = useState("");
 const [productSizes, setProductSizes] = useState([]);
 const [colorId, setColorId] = useState("");
 const [imageCover, setImageCover] = useState(null);
 const [images, setImages] = useState([]);
 const [relatedProductsId, setRelatedProductsId] = useState("");
 const [relatedProductsName, setRelatedProductsName] = useState("");
 const [newRelation, setNewRelation] = useState(false);

 const [imageCoverPreview, setImageCoverPreview] = useState(null);
 const [imagesPreview, setImagesPreview] = useState([]);
 const [loading, setLoading] = useState(false);
 let imgs;

 const formData = new FormData();

 const nav = useNavigate();

 const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);
  if (
   !name ||
   !description ||
   !price ||
   !categoryId ||
   //  !sizeId ||
   !colorId ||
   !imageCover ||
   !images ||
   productSizes.length < 1
  ) {
   return toast.warning("Some fields are missing!");
  }

  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("isFeatured", isFeatured);
  formData.append("isArchived", isArchived);
  formData.append("categoryId", categoryId);
  // formData.append("sizeId", sizeId);
  // formData.append("sizes", productSizes);
  formData.append("colorId", colorId);
  formData.append("relatedProductsId", relatedProductsId);
  formData.append("relatedProductsName", relatedProductsName);
  formData.append("imageCover", imageCover);
  images.forEach((image) => {
   formData.append("images", image);
  });
  productSizes.forEach((size) => {
   formData.append("productSizes", JSON.stringify(size));
  });

  try {
   const res = await axios.post("/api/v1/products", formData);
   if (res.status === 201) {
    toast.success("Product created");
   }
   console.log(res.data);
   setTimeout(() => {
    nav("/dashboard?tab=products");
   }, 1000);
  } catch (error) {
   toast.error(error);
  } finally {
   setLoading(false);
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
 const handleImagesChange = async (event) => {
  const uploadedImages = event.target.files;

  if (
   images.length === 10 ||
   uploadedImages > 10 ||
   images.length + uploadedImages.length > 10
  ) {
   toast.error("You can only upload a maximum of 10 images.");
   return;
  }
  const imagesPreviewArray = [];

  for (let i = 0; i < uploadedImages.length; i++) {
   setImages((prev) => [...prev, uploadedImages[i]]);
   const imageDataURL = await readImage(uploadedImages[i]);
   imagesPreviewArray.push(imageDataURL);
   setImagesPreview((prev) => [...prev, imageDataURL]);
   imgs = imagesPreview;
  }
 };
 const readImage = (file) => {
  return new Promise((resolve, reject) => {
   const reader = new FileReader();
   reader.onload = () => resolve(reader.result);
   reader.onerror = reject;
   reader.readAsDataURL(file);
  });
 };
 //  const useImageSrc = (file) => {
 //   // useEffect(() => {
 //   const reader = new FileReader();
 //   reader.onload = () => {
 //    return reader.result;
 //   };
 //   reader.readAsDataURL(file);
 //   return () => {
 //    reader.abort();
 //   };
 //  };

 const handleDeleteImages = (index) => {
  const updatedImagesPreview = imagesPreview.filter((_, i) => i !== index);
  const updatedImages = images.filter((_, i) => i !== index);
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

 useEffect(() => {
  fetchCategories();
  fetchColors();
  fetchSizes();
  fetchRelatedProducts();
 }, []);

 return (
  <>
   <div className="py-4 border-b ">
    <h1 className="font-bold text-4xl">Create Product</h1>
    <p className="text-gray-700">Add a new product</p>
   </div>
   <form className="my-4" onSubmit={handleSubmit}>
    <Label htmlFor="name" className="font-semibold text-base">
     Name
    </Label>
    <Input
     onChange={(e) => {
      setName(e.target.value);
     }}
     id="name"
     className="mt-4 mb-8"
     placeholder="product name"
    />
    <Label htmlFor="description" className="font-semibold text-base">
     Description
    </Label>
    <Textarea
     onChange={(e) => {
      setDescription(e.target.value);
     }}
     id="description"
     className="mt-4 mb-8"
     placeholder="product description"
    />
    <Label htmlFor="price" className="font-semibold text-base">
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
    />

    <div className="flex justify-between gap-12">
     <div className="flex-1">
      <Label htmlFor="categoryId" className="font-semibold text-base">
       Category
      </Label>
      <div className="mt-4 mb-8">
       <Select id="categoryId" onValueChange={(val) => setCategoryId(val)}>
        <SelectTrigger className="">
         <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
         <SelectGroup>
          {categories?.length > 0 &&
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
       <Label htmlFor="relation" className="font-semibold text-base">
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
          <SelectValue placeholder="Select a relation" />
         </SelectTrigger>
         <SelectContent>
          <SelectGroup>
           {relatedProducts?.length > 0 &&
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
      <Label htmlFor="sizeId" className="font-semibold text-base">
       Sizes
      </Label>
      <div className="mt-4 mb-8 flex gap-2 flex-wrap">
       {sizes?.map((size) => (
        <div key={size.id}>
         <Label htmlFor={size.id}>
          <div
           className="px-4 py-2 border rounded-sm cursor-pointer hover:bg-gray-300 duration-300"
           style={productSizes.includes(size) ? { background: "#ccc" } : {}}
          >
           {size.value}
          </div>
         </Label>
         <Checkbox
          id={size.id}
          className="hidden"
          onCheckedChange={(val) => {
           if (val) {
            setProductSizes((prev) => [...prev, size]);
           } else {
            setProductSizes(productSizes.filter((s) => s.id !== size.id));
           }
          }}
         />
        </div>
       ))}
      </div>
     </div>
     <div className="flex-1">
      <Label htmlFor="colorId" className="font-semibold text-base">
       Color
      </Label>
      <div className="mt-4 mb-8">
       <Select id="colorId" onValueChange={(val) => setColorId(val)}>
        <SelectTrigger className="">
         <SelectValue placeholder="Select a color" />
        </SelectTrigger>
        <SelectContent>
         <SelectGroup>
          {colors?.length > 0 &&
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
       onCheckedChange={(val) => {
        setIsFeatured(val);
       }}
      />
      <Label htmlFor="isFeatured" className="font-semibold text-base">
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
       onCheckedChange={(val) => {
        setIsArchived(val);
       }}
      />
      <Label htmlFor="isArchived" className="font-semibold text-base">
       <h2 className="text-xl">Archived</h2>
       <p className="font-normal text-gray-700">
        This product will not appear anywhere in the store.
       </p>
      </Label>
     </div>
    </div>

    <div className="flex justify-between gap-4">
     <div className="flex-[1/2]">
      <Label htmlFor="coverImage" className="font-semibold text-base">
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
         loading="lazy"
         src={imageCoverPreview}
         alt="Uploaded"
         className="max-w-[200px] max-h-[200px]"
        />
        <Button
         variant="destructive"
         onClick={handleDeleteCoverImage}
         className="absolute top-2 right-2 p-2"
        >
         <Trash />
        </Button>
       </div>
      )}
     </div>
     <div className="flex-1">
      <Label htmlFor="coverImage" className="font-semibold text-base">
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
        {imagesPreview.map((img, index) => (
         <div key={index} className="relative w-[200px]">
          <img
           loading="lazy"
           src={img}
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
    <Button type="submit" className="w-full mt-12 mb-8" disabled={loading}>
     Create
    </Button>
   </form>
  </>
 );
};

export default CreateProduct;
