"use client";

// src/contexts/ProductContext.ts
import { createContext } from "react";
import { type ProductItem } from "@/lib/utils";

export const ProductContext = createContext<ProductItem>({} as ProductItem);
