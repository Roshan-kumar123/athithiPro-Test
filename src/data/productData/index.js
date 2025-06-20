import { leadsProductData } from "./leadsProduct";
import { createProductData } from "./createProduct";
import { targetProductData } from "./targetProduct";
import { planProductData } from "./planProduct";
import { assistProductData } from "./assistProduct";
import { docuhelpProductData } from "./docuhelpProduct";

export const allProducts = {
  leads: leadsProductData,
  create: createProductData,
  target: targetProductData,
  plan: planProductData,
  assist: assistProductData,
  docuhelp: docuhelpProductData,
};

export const getAllProducts = () => {
  return Object.values(allProducts);
};

export const getProductByKey = (key) => {
  return allProducts[key];
};
