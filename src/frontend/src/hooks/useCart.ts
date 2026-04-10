import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Cart } from "../types";
import { useActor } from "./useBackend";

export function useCart() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor)
        return {
          buyerId: null as unknown as Cart["buyerId"],
          items: [],
          totalAmount: 0n,
        };
      return actor.getCart() as Promise<Cart>;
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });

  const addToCart = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: bigint; quantity: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.addToCart(productId, quantity);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeFromCart = useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.removeFromCart(productId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const updateCartItem = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: bigint; quantity: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateCartItem({ productId, quantity });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const clearCart = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.clearCart();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0;
  const totalAmount = cart?.totalAmount ?? 0n;

  return {
    cart,
    isLoading,
    itemCount,
    totalAmount,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
  };
}
