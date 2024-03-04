export const modalContainerVariants = {
  start: {
    opacity: 0,
  },
  end: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export const modalItemVariants = {
  start: {
    opacity: 0,
    y: 400,
  },
  end: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "tween",
    },
  },
  exit: {
    opacity: 0,
    y: 400,
  },
};
