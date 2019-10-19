import getRotateDegreeArr from './getRotateDegreeArr';
const getYOffset = (numOfDisplayedItems, itemHeight) => {
    const rotateDegrees = getRotateDegreeArr(numOfDisplayedItems);
    const middleItemIndex = Math.floor(numOfDisplayedItems / 2);
    const arr = [];
    let stepDegrees = numOfDisplayedItems / 5;

    for (let i = 0; i < numOfDisplayedItems; i++) {
        arr.push((i - middleItemIndex) * stepDegrees / 10 * -itemHeight);
    }

    return arr;
    const far = 150;
    const middle = 75;

    return [
        far,
        middle,
        0,
        -middle,
        -far
    ];
};

export default getYOffset;
