import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

/** What the visitor chose. "system" defers to the OS. */
export type Theme = "light" | "dark" | "system";

/** What is actually painted. "system" has been resolved away. */
export type ResolvedTheme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

/**
 * Shared with the blocking script in index.html. If this ever changes, that
 * script has to change with it or the page will flash the wrong theme.
 */
const STORAGE_KEY = "theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

/** How long the cross-fade between palettes runs. Matches the CSS duration. */
const TRANSITION_MS = 320;

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark" || value === "system";

function readStoredTheme(): Theme {
  try {
    const stored: unknown = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : "system";
  } catch {
    // Private mode or blocked storage - fall back to following the OS.
    return "system";
  }
}

/* ------------------------------------------------------------------ */
/* System preference, as an external store                             */
/* ------------------------------------------------------------------ */

/*
 * The OS preference is genuinely external state, so it is read with
 * useSyncExternalStore rather than mirrored into React state via an effect.
 * That keeps it tear-free and means flipping the OS theme updates the page
 * immediately, with no extra render pass.
 */
function subscribeToSystem(onChange: () => void): () => void {
  const query = window.matchMedia(MEDIA_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
}

/** Only reached if this ever runs through a server renderer. */
const getSystemThemeFallback = (): ResolvedTheme => "dark";

/* ------------------------------------------------------------------ */
/* Palette cross-fade                                                  */
/* ------------------------------------------------------------------ */

let transitionTimer = 0;

/**
 * Flags the document for a few hundred milliseconds so the stylesheet can
 * cross-fade colours instead of hard-cutting between palettes.
 *
 * Deliberately *not* applied on first paint: the blocking script sets the
 * theme before anything renders, and a page that fades in from the wrong
 * palette on load is exactly the flicker this system exists to avoid.
 */
function playThemeTransition(): void {
  const root = document.documentElement;
  root.setAttribute("data-theme-transition", "");

  window.clearTimeout(transitionTimer);
  transitionTimer = window.setTimeout(() => {
    root.removeAttribute("data-theme-transition");
  }, TRANSITION_MS);
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);

  const systemTheme = useSyncExternalStore(
    subscribeToSystem,
    getSystemTheme,
    getSystemThemeFallback,
  );

  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;

  // Push the resolved theme onto the document. `color-scheme` is what tells the
  // browser to restyle scrollbars, form controls and the like.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  // Keep other open tabs in step.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      if (isTheme(event.newValue)) setThemeState(event.newValue);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    playThemeTransition();

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Preference simply will not survive a reload; the UI still works.
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside a <ThemeProvider>.");
  }

  return context;
}
