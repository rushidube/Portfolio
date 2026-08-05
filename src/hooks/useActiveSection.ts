import { useEffect, useState } from "react";

/**
 * Scroll-spy for the navbar.
 *
 * Keeps the original "which section owns the current scroll offset" logic, but
 * moves the work into a requestAnimationFrame tick behind a passive listener so
 * scrolling never blocks the main thread. Also adds a bottom-of-page guard: the
 * final section can be too short to reach the activation offset, which used to
 * leave the last nav item unhighlighted.
 *
 * @param ids  Section ids in document order.
 * @param offset  Pixels above a section's top where it becomes active
 *                (roughly the fixed header height plus breathing room).
 */
export function useActiveSection(ids: string[], offset = 130): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    let frame = 0;

    const resolve = () => {
      frame = 0;
      const scrollY = window.scrollY;

      // Within a screen-height of the document end, the last section wins.
      const atBottom =
        window.innerHeight + scrollY >= document.body.scrollHeight - 80;
      if (atBottom) {
        setActive(ids[ids.length - 1] ?? "");
        return;
      }

      let current = ids[0] ?? "";
      for (const id of ids) {
        const section = document.getElementById(id);
        if (!section) continue;

        const top = section.offsetTop - offset;
        if (scrollY >= top && scrollY < top + section.offsetHeight) {
          current = id;
        }
      }

      setActive(current);
    };

    const onScroll = () => {
      // Coalesce bursts of scroll events into one read per frame.
      if (frame === 0) frame = window.requestAnimationFrame(resolve);
    };

    resolve();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return active;
}
