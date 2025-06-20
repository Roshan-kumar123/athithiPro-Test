import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByKey } from "../../data/productData";
import ProductPageTemplate from "../../components/products/ProductPageTemplate";
import NotFound from "./NotFound";
import { useToast } from "../../components/ui/use-toast";

const ProductPage = () => {
  const { productKey } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get product data based on URL parameter
  const productData = productKey ? getProductByKey(productKey) : undefined;

  useEffect(() => {
    // If invalid product key and not undefined (which happens before first render)
    if (productKey && !productData) {
      toast({
        title: "Product not found",
        description:
          "The requested product doesn't exist or isn't available yet.",
        variant: "destructive",
      });
    }
  }, [productKey, productData, toast]);

  // If product not found, show 404 page
  if (productKey && !productData) {
    return <NotFound />;
  }

  // If no product data yet (initial load), return loading state
  if (!productData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-travel-blue text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ProductPageTemplate
      module={productData}
      problems={productData.problems}
      solutions={productData.solutions}
      features={productData.features}
      faqs={productData.faqs}
    />
  );
};

export default ProductPage;
