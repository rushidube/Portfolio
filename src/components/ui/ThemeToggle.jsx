import { useRef } from "react";
import { motion } from "motion/react";
import { Monitor, Moon, Sun } from "lucide-react";

import { SPRING, themeIcon } from "../../lib/animations";
import { useTheme } from "../../lib/theme";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "system", label: "System", Icon: Monitor },
  { value: "dark", label: "Dark", Icon: Moon },
];

/**
 * Three-way theme control: Light / System / Dark.
 *
 * Built as a segmented pill rather than a two-state switch, because "system" is
 * a real choice and a binary switch has nowhere to put it. The selection
 * indicator is a single element shared across the options via `layoutId`, so it
 * slides between them instead of fading in and out - the same trick the navbar
 * underline uses, which is what ties the two together visually.
 *
 * Accessibility follows the WAI-ARIA radiogroup pattern: arrow keys and
 * Home/End move the selection, and roving `tabIndex` means the group is a
 * single tab stop rather than three.
 *
 * @param layoutId  Must be unique per rendered instance. Two toggles sharing an
 *                  id would fight over one indicator.
 */
export default function ThemeToggle({ layoutId = "theme-thumb", className = "" }) {
  const { theme, setTheme } = useTheme();
  const buttonRefs = useRef([]);

  const selectAt = (index) => {
    setTheme(OPTIONS[index].value);
    buttonRefs.current[index]?.focus();
  };

  const handleKeyDown = (event) => {
    const current = OPTIONS.findIndex((option) => option.value === theme);
    let next;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = (current + 1) % OPTIONS.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = (current - 1 + OPTIONS.length) % OPTIONS.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = OPTIONS.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectAt(next);
  };

  return (
    <div
      className={`theme-toggle ${className}`.trim()}
      role="radiogroup"
      aria-label="Colour theme"
      onKeyDown={handleKeyDown}
    >
      {OPTIONS.map((option, index) => {
        const selected = theme === option.value;
        const { Icon } = option;

        return (
          <button
            key={option.value}
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${option.label} theme`}
            title={`${option.label} theme`}
            // Roving tabindex: only the active option is reachable by Tab.
            tabIndex={selected ? 0 : -1}
            className="theme-toggle-option"
            onClick={() => setTheme(option.value)}
          >
            {selected ? (
              <motion.span
                className="theme-toggle-thumb"
                layoutId={layoutId}
                transition={SPRING}
              />
            ) : null}

            <motion.span
              className="theme-toggle-icon"
              variants={themeIcon}
              // No entrance animation: on first paint the theme is already
              // decided, and animating it would read as a glitch.
              initial={false}
              animate={selected ? "active" : "inactive"}
            >
              <Icon size={15} strokeWidth={2} aria-hidden="true" />
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}
