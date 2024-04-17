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
import { Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [sizeId, setSizeId] = useState("");
  const [colorId, setColorId] = useState("");
  const [imageCover, setImageCover] = useState(null);
  const [images, setImages] = useState([]);

  const [imageCoverPreview, setImageCoverPreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);
  const formData = new FormData();

  const nav = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !name ||
      !price ||
      !categoryId ||
      !sizeId ||
      !colorId ||
      !imageCover ||
      !images
    ) {
      return toast.warning("Some fields are missing!");
    }

    formData.append("name", name);
    formData.append("price", price);
    formData.append("isFeatured", isFeatured);
    formData.append("isArchived", isArchived);
    formData.append("categoryId", categoryId);
    formData.append("sizeId", sizeId);
    formData.append("colorId", colorId);
    formData.append("imageCover", imageCover);
    images.forEach((image) => {
      formData.append("images", image);
    });
    try {
      console.log(formData);
      const res = await axios.post("/api/v1/products", formData);
      if (res.status === 201) {
        toast.success("Product created");
      }
      console.log(res.data);
      setTimeout(() => {
        nav("/dashboard?tab=products");
      }, 2000);
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
  const handleImagesChange = (event) => {
    const uploadedImages = event.target.files;

    if (
      images.length === 3 ||
      uploadedImages > 3 ||
      images.length + uploadedImages.length > 3
    ) {
      toast.error("You can only upload a maximum of 3 images.");
      return;
    }
    const imagesPreviewArray = [];

    for (let i = 0; i < uploadedImages.length; i++) {
      setImages((prev) => [...prev, uploadedImages[i]]);
      const reader = new FileReader();

      reader.onload = ((file) => {
        return () => {
          imagesPreviewArray.push(reader.result);

          if (imagesPreviewArray.length === uploadedImages.length) {
            setImagesPreview((prev) => [...prev, ...imagesPreviewArray]);
          }
        };
      })(uploadedImages[i]);

      reader.readAsDataURL(uploadedImages[i]);
    }
    // console.log("image", imageCover);
    console.log("images", images);
  };

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

  useEffect(() => {
    fetchCategories();
    fetchColors();
    fetchSizes();
  }, []);

  return (
    <>
      <div className="py-4 border-b ">
        <h1 className="font-bold text-4xl">Create Product</h1>
        <p className="text-gray-700">Add a new product</p>
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
        />
        <Label htmlFor="categoryId" className="font-semibold text-md">
          Category
        </Label>
        <div className="mt-4 mb-8">
          <Select id="categoryId" onValueChange={(val) => setCategoryId(val)}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select a category" />
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
        <div className="flex justify-between gap-12">
          <div className="flex-1">
            <Label htmlFor="sizeId" className="font-semibold text-md">
              Size
            </Label>
            <div className="mt-4 mb-8">
              <Select id="sizeId" onValueChange={(val) => setSizeId(val)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {sizes.length > 0 &&
                      sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex-1">
            <Label htmlFor="colorId" className="font-semibold text-md">
              Color
            </Label>
            <div className="mt-4 mb-8">
              <Select id="colorId" onValueChange={(val) => setColorId(val)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a color" />
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
                >
                  <Trash />
                </Button>
              </div>
            )}
          </div>
          <div className="flex-1">
            <Label htmlFor="coverImage" className="font-semibold text-md">
              Alternative images(max-3)
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
          Create
        </Button>
      </form>
    </>
  );
};

export default CreateProduct;
