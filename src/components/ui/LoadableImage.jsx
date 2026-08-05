import { useCallback, useState } from "react";
import { motion } from "motion/react";
import { ImageOff } from "lucide-react";
import { EASE } from "../../lib/animations";

/**
 * `<img>` with the two states a plain tag never surfaces: a skeleton while it
 * decodes, and a graceful fallback if the request fails, instead of a broken-
 * image glyph. Fades in on load rather than popping in at full opacity.
 *
 * Assumes its parent is already `position: relative` and sized (every current
 * caller's wrapper is) - the skeleton positions itself absolute to fill it,
 * so this component never has to guess at aspect ratio itself.
 */
export default function LoadableImage({
  src,
  alt,
  className,
  fallbackIcon: FallbackIcon = ImageOff,
  ...rest
}) {
  const [status, setStatus] = useState("loading");

  // A cached image can already be `complete` the instant the node mounts,
  // before the `onLoad` event would ever fire - checked here, in the ref
  // callback itself, so the skeleton never gets stuck covering an image
  // that's already there.
  const handleRef = useCallback((node) => {
    if (node?.complete) {
      setStatus(node.naturalWidth > 0 ? "loaded" : "error");
    }
  }, []);

  return (
    <>
      {status !== "loaded" ? (
        <div
          className={`img-skeleton${status === "error" ? " img-skeleton-error" : ""}`}
          aria-hidden="true"
        >
          {status === "error" ? <FallbackIcon size={32} /> : null}
        </div>
      ) : null}

      <motion.img
        ref={handleRef}
        src={src}
        alt={alt}
        className={className}
        initial={false}
        animate={{ opacity: status === "loaded" ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        {...rest}
      />
    </>
  );
}
