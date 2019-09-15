const getScaleArr = (numOfDisplayedItems)=> {
    const middle = Math.floor(numOfDisplayedItems / 2);
    const arr = [...Array(numOfDisplayedItems).fill(1)];
    arr[middle] = 1.2;
    return arr;
};

export default getScaleArr;
