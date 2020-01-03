const getSelectedOpacityArr = numOfDisplayedItems => {
    const middle = Math.floor(numOfDisplayedItems / 2);
    const arr = [ ...new Array(numOfDisplayedItems).fill(0) ];
    arr[middle] = 1;
    return arr;
};

export default getSelectedOpacityArr;
