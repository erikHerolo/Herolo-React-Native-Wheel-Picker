const getRotateDegreeArr = numOfDisplayedItems => {
    const middleItemIndex = Math.floor(numOfDisplayedItems / 2);
    const arr = [];
    let stepDegrees = 360 / (numOfDisplayedItems * 2);

    for (let i = 0; i < numOfDisplayedItems; i++) {
        arr.push(`${(i - middleItemIndex) * stepDegrees}deg`);
    }
    // console.log('degrees arr', arr);
    return arr;
};
export default getRotateDegreeArr;
