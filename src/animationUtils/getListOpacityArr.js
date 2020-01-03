const getListOpacityArr = numOfDisplayedItems => {
    const arr = [];
    const middle = Math.floor(numOfDisplayedItems / 2);
    const stepOpacity = 1 / middle;
    for (let i = 0; i < numOfDisplayedItems; i++) {
        arr.push(1 - Math.abs(stepOpacity * i - 1));
    }
    arr[0] = 1 / numOfDisplayedItems;
    arr[arr.length - 1] = 1 / numOfDisplayedItems;

    return arr;
};

export default getListOpacityArr
