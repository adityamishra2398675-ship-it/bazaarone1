import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SaveProfileInput } from "../backend.d";
import type { UserProfile } from "../types";
import { UserRole } from "../types";
import { useActor } from "./useBackend";

export function useAuth() {
  const { loginStatus, login, clear, identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useQuery<UserProfile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });

  const saveProfile = useMutation({
    mutationFn: async (input: SaveProfileInput) => {
      if (!actor) throw new Error("No actor");
      return actor.saveCallerUserProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    isAuthenticated,
    identity,
    loginStatus,
    login,
    logout: clear,
    profile,
    profileLoading: profileLoading || actorFetching,
    saveProfile,
    refetchProfile,
    isProfileComplete: !!profile?.displayName && !!profile?.role,
    role: profile?.role ?? null,
    isSeller: profile?.role === UserRole.seller,
    isBuyer: profile?.role === UserRole.buyer,
  };
}
