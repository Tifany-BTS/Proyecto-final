import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  commitOrderStock,
  fetchProducts,
  type PurpleBloomProduct,
} from "../services/product-service";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCommitOrderStock() {
  const queryClient = useQueryClient();

  return (purchasedLines: { productId: string; size?: string; quantity: number }[]) => {
    const updatedProducts = commitOrderStock(purchasedLines);
    queryClient.setQueryData<PurpleBloomProduct[]>(["products"], updatedProducts);
  };
}
