const getRotateDegreeArr = numOfDisplayedItems => {
    const middleItemIndex = Math.floor(numOfDisplayedItems / 2);
    const arr = [];
    let stepDegrees = 180 / numOfDisplayedItems;

    for (let i = 0; i < numOfDisplayedItems; i++) {
        arr.push(`${(i - middleItemIndex) * stepDegrees}deg`);
    }
    // console.log('degrees arr', arr);
    return arr;
};
