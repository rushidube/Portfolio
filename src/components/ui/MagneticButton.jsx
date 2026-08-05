import { motion, useSpring, useTransform } from "motion/react";
import { BUTTON_LIFT, SPRING, buttonHover } from "../../lib/animations";
import { useMagnetic } from "../../hooks/useMagnetic";
import { useFinePointer } from "../../hooks/useMediaQuery";

/**
 * Button / link with a lift-on-hover and a very subtle magnetic pull.
 *
 * The pull is capped at a few pixels: enough that the control feels alive under
 * the cursor, small enough that it never looks like it is running away. It is
 * disabled entirely on touch devices, where there is no pointer to attract to.
 *
 * The magnetic offset and the hover lift are summed into a single `y` motion
 * value rather than being split between a motion value and a variant, because
 * a variant animating `y` would detach the pointer binding.
 *
 * Renders an `<a>` when `href` is given, otherwise a `<button>` - so existing
 * markup semantics (download links, submit buttons) are preserved exactly.
 */
export default function MagneticButton({
  href,
  className,
  children,
  strength = 6,
  ...rest
}) {
  const finePointer = useFinePointer();
  const { x, y: magneticY, onPointerMove, onPointerLeave } = useMagnetic({
    strength,
    disabled: !finePointer,
  });

  const lift = useSpring(0, SPRING);
  const y = useTransform([magneticY, lift], ([pull, raise]) => pull + raise);

  const Tag = href ? motion.a : motion.button;

  return (
    <Tag
      href={href}
      className={className}
      style={{ x, y }}
      variants={buttonHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      whileFocus="hover"
      onHoverStart={() => lift.set(BUTTON_LIFT)}
      onHoverEnd={() => lift.set(0)}
      // Keyboard users get the same lift as pointer users.
      onFocus={() => lift.set(BUTTON_LIFT)}
      onBlur={() => lift.set(0)}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        onPointerLeave();
        lift.set(0);
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
