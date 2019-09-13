const getScaleArr = (numOfDisplayedItems, jumpsScale = 1)=> {
    // const middle = Math.floor(numOfDisplayedItems / 2);
    //     // const arr = [ ...new Array(numOfDisplayedItems).fill(0) ];
    //     // const jumps = jumpsScale ? 1 / numOfDisplayedItems * jumpsScale : 0;
    //     //
    //     // const m = jumps;
    //     // const b = -middle * m;
    //     // const selectedSize = 1;
    //     //
    //     // const y = arr.map((_,x) => selectedSize - Math.abs(m * x + b));
    //     // console.log({jumps, scaleArr: y});
    
    
    
    
    
    // const iradKing = [ ...Array(numOfDisplayedItems)].map((_,index) => index * 100 + 1);
    const iradKing = [0.75 + 0.5, 1.25 + 0.25, 1.75, 1.25 + 0.25, 0.75 + 0.5];
    console.warn(iradKing.join(','));

    return iradKing;
    // return y
};

export default getScaleArr;
