import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Expand, ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
const Category = () => {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const { categories } = useSelector((state) => state.product);
  const params = useParams();

  const fetchCategory = async () => {
    try {
      const products = await axios.get(
        `/api/v1/categories/${params.categoryName}`,
      );
      setData([products.data.category]);
      setProducts(products.data.category.products);
      // console.log(products.data.category);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [params.categoryName]);

  return (
    <>
      {data.length > 0 && (
        <div className="relative">
          <img
            src={`/img/billboard/${data[0].billboard.imageUrl}`}
            alt="billboard"
            className="w-full mt-4 mb-12"
          />
          <h1 className="absolute bottom-[45%] text-center w-full  text-5xl">
            {data[0].billboard.label}
          </h1>
        </div>
      )}
      {products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-12">
          {products.map((product, index) => (
            <Card key={product.id} className="w-full group cursor-pointer">
              <CardContent>
                <div className="overflow-hidden relative">
                  <img
                    src={`/img/product/${product.images[0]?.url}`}
                    alt={"product.name"}
                    className=" group-hover:scale-110 transition-all duration-300 "
                  />
                  <div className="absolute bottom-2 w-full flex items-center justify-center gap-6  group-hover:opacity-100 opacity-0 transition-all duration-300">
                    <Expand className="h-8 w-8 hover:scale-[1.08] duration-300 transition-all" />
                    <ShoppingCart className="h-8 w-8 hover:scale-[1.08] duration-300 transition-all" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <h2 className="text-2xl font-semibold">{product.name}</h2>
                <p>{product.category.name}</p>
                <h3 className="my-3 text-2xl">${product.price}</h3>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <h1>Loading</h1>
      )}
    </>
  );
};

export default Category;
