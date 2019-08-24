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


    scroller.current._component.scrollTo({y: newPosition});

    const selectedItem = Math.round(newPosition / itemHeight);

    onSelect(options[selectedItem]);
};

export const calculateDisplayedItemHeights =
    (numOfDisplayedItems, itemHeight, distanceFromViewCenter) => {
        const middleItemIndex = Math.floor(numOfDisplayedItems / 2);
        const arr = [];
        for (let i = 0; i < numOfDisplayedItems; i++) {
            arr.push(distanceFromViewCenter + (i - middleItemIndex) * itemHeight);
        }

        return arr;
    };
