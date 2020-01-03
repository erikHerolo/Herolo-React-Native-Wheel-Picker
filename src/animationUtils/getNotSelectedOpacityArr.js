const getNotSelectedOpacityArr = (numOfDisplayedItems) => {
    const middle = Math.floor(numOfDisplayedItems / 2);
    const arr = [ ...new Array(numOfDisplayedItems).fill(0.5) ];
    arr[middle] = 0;
    return arr;
};

export default getNotSelectedOpacityArr
