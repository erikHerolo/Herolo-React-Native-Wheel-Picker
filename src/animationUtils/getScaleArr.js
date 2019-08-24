const getScaleArr = (numOfDisplayedItems, jumpsScale = 1)=> {
    const middle = Math.floor(numOfDisplayedItems / 2);
    const arr = [ ...new Array(numOfDisplayedItems).fill(0) ];
    const jumps = jumpsScale ? 1 / numOfDisplayedItems * jumpsScale : 0;

    const m = jumps;
    const b = -middle * m;
    const selectedSize = 1;

    const y = arr.map((_,x) => selectedSize - Math.abs(m * x + b));
    console.log({jumps, scaleArr: y});
    return [1,1,1.2,1,1];
    // return y
};

export default getScaleArr;
