import { useQuery } from "@tanstack/react-query";
import type { Category } from "../backend.d";
import type { Product, ProductFilter } from "../types";
import { useActor } from "./useBackend";

const DEFAULT_FILTER: ProductFilter = { inStockOnly: false };

export function useProducts(filter: ProductFilter = DEFAULT_FILTER) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ["products", filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts(filter) as Promise<Product[]>;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useProduct(productId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ["product", productId?.toString()],
    queryFn: async () => {
      if (!actor || productId === null) return null;
      return actor.getProduct(productId) as Promise<Product | null>;
    },
    enabled: !!actor && !actorFetching && productId !== null,
  });
}

export function useProductsByCategory(category?: Category) {
  const filter: ProductFilter = {
    inStockOnly: false,
    category,
  };
  return useProducts(filter);
}

export function useSellerProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ["sellerProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyProducts() as Promise<Product[]>;
    },
    enabled: !!actor && !actorFetching,
  });
}
