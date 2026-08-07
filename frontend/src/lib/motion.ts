export const springConfig = {
  type: "spring",
  stiffness: 500,
  damping: 40,
  mass: 1,
};

export const springSlowConfig = {
  type: "spring",
  stiffness: 400,
  damping: 50,
  mass: 1,
};

export const pageTransitionVariants = {
  initial: { opacity: 0, y: 12, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: springSlowConfig },
  exit: { opacity: 0, y: -12, filter: "blur(4px)", transition: springSlowConfig },
};

export const staggerContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};

export const staggerItemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: springConfig },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: "easeIn" } },
};

export const slideInRightVariants = {
  initial: { opacity: 0, x: "100%" },
  animate: { opacity: 1, x: 0, transition: springConfig },
  exit: { opacity: 0, x: "100%", transition: springConfig },
};

export const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
};
