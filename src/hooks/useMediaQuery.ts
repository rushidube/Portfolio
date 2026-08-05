import { useEffect, useState } from "react";

/**
 * Subscribes to a CSS media query from JS.
 *
 * Used to keep expensive interactions off devices that shouldn't run them:
 * tilt, magnetic buttons and the custom cursor are all desktop-pointer only,
 * and the mobile nav drawer only mounts its animation below the CSS breakpoint.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Sync once in case the query changed between render and effect.
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True only on devices with a precise, hovering pointer (mouse / trackpad). */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/** Mirrors the 768px breakpoint used by index.css for the mobile nav. */
export function useIsMobileNav(): boolean {
  return useMediaQuery("(max-width: 768px)");
}
