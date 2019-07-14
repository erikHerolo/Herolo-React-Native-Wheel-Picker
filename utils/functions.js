export const scrollToNumber = (offset, itemHeight, scroller) => {
  remain = offset % itemHeight;
  const newPosition =
    remain < itemHeight / 2 ? offset - remain : offset + (itemHeight - remain);
  scroller.current.scrollTo({ y: newPosition });
};
