import { w as useActor, y as useQuery } from "./index-BB5MO6AH.js";
const DEFAULT_FILTER = { inStockOnly: false };
function useProducts(filter = DEFAULT_FILTER) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery({
    queryKey: ["products", filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts(filter);
    },
    enabled: !!actor && !actorFetching
  });
}
function useProduct(productId) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery({
    queryKey: ["product", productId == null ? void 0 : productId.toString()],
    queryFn: async () => {
      if (!actor || productId === null) return null;
      return actor.getProduct(productId);
    },
    enabled: !!actor && !actorFetching && productId !== null
  });
}
function useSellerProducts() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery({
    queryKey: ["sellerProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyProducts();
    },
    enabled: !!actor && !actorFetching
  });
}
export {
  useProduct as a,
  useSellerProducts as b,
  useProducts as u
};
