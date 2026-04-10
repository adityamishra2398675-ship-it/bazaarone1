import { useActor as useActorFromInfra } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { Backend } from "../backend";

/**
 * Custom hook to get the typed backend actor.
 * Wraps core-infrastructure's useActor with the project's createActor function.
 */
export function useActor(): { actor: Backend | null; isFetching: boolean } {
  return useActorFromInfra(createActor) as {
    actor: Backend | null;
    isFetching: boolean;
  };
}
