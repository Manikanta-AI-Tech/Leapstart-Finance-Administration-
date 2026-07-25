import { type Variants } from "framer-motion";

export const springs = {
  gentle: { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.5 },
  snappy: { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.5 },
  bouncy: { type: "spring" as const, stiffness: 300, damping: 15, mass: 0.5 },
  smooth: { type: "spring" as const, stiffness: 150, damping: 20, mass: 0.5 },
};

export const transitions = {
  fast: { duration: 0.15, ease: [0.16, 1, 0.3, 1] as const },
  normal: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
  slow: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
};

export const fadeInUp: Variants = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 } };
export const scaleIn: Variants = { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 } };
export const staggerItem: Variants = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };
export const pageTransition: Variants = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };
export const backdropVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
export const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.95, y: -4, transition: { duration: 0.1 } },
};
export const sidebarDrawerVariants: Variants = {
  hidden: { x: "-100%" },
  visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { x: "-100%", transition: { duration: 0.2 } },
};
