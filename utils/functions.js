export const lockOnItem = ({
                               offset,
                               itemHeight,
                               scroller,
                               onSelect,
                               options
                           }) => {
    const remain = offset % itemHeight;

    const newPosition =
        remain < itemHeight / 2 ? offset - remain : offset + (itemHeight - remain);

    console.log({scroller});

    scroller.current._component.scrollTo({y: newPosition});

    const selectedItem = Math.round(newPosition / itemHeight);

    onSelect(options[selectedItem]);
};
