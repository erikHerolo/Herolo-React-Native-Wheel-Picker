import React, {useCallback, useRef} from "react";
import {Animated, Text, View} from "react-native";
import PropTypes from "prop-types";
import {Item, ItemText, ScrollWrapper, WheelScroller} from "./styles/wheel";
import {lockOnItem} from "./utils/functions";

let renderCount = 0;

const App = ({
                 height,
                 width,
                 numOfDisplayedItems,
                 itemStyles,
                 selectedColor,
                 borderWidth,
                 selected,
                 onSelect,
                 borderColor,
                 options
             }) => {
    const doesIndexExist = options.length > selected && selected >= 0;
    selected = doesIndexExist ? selected : 0;

    if (!doesIndexExist) {
        console.warn("given index is out of range");
    }

    const scroller = useRef(null);

    const itemHeight = height / numOfDisplayedItems;
    const middleItemIndex = Math.floor(numOfDisplayedItems / 2);

    // Creates empty items to be able to choose first and last items from given array, without the empty items user cant reach to first or last item
    const spaces = isTop =>
        Array(numOfDisplayedItems / 2 - 0.5)
            .fill(" ")
            .map((item, index) => (
                <Item
                    key={isTop ? `top-space${index}` : `bottom-space${index}`}
                    style={itemStyles}
                    itemHeight={itemHeight}
                >
                    <Text>{item}</Text>
                </Item>
            ));

    const calculateDisplayedItemHeights = useCallback(
        (numOfDisplayedItems, itemHeight, distanceFromViewCenter) => {
            const arr = [];

            for (let i = 0; i < numOfDisplayedItems; i++) {
                arr.push(distanceFromViewCenter + (i - middleItemIndex) * itemHeight);
            }

            return arr;
        },
        []
    );

    const getDegreesByItemAmount = useCallback(numOfDisplayedItems => {
        const arr = [];
        let stepDegrees = 180 / numOfDisplayedItems;

        for (let i = 0; i < numOfDisplayedItems; i++) {
            arr.push(`${(i - middleItemIndex) * stepDegrees}deg`);
        }
        // console.log('degrees arr', arr);
        return arr;
    }, []);

    const getYOffsetByItemAmount = useCallback(numOfDisplayedItems => {
        const arr = [];
        let stepDegrees = numOfDisplayedItems / 1.5;

        for (let i = 0; i < numOfDisplayedItems; i++) {
            arr.push((i - middleItemIndex) * stepDegrees / 10 * -itemHeight);
        }
        console.log('yOffset arr1111', arr);
        return arr;
    }, []);

    const getOpacityByItemAmount = useCallback(numOfDisplayedItems => {
        const arr = [];
        const middle = numOfDisplayedItems / 2;
        const stepOpacity = 1 / middleItemIndex;

        for (let i = 0; i < numOfDisplayedItems; i++) {
            arr.push(1 - Math.abs(stepOpacity * i - 1));
        }
        arr[0] = 0.2;
        arr[arr.length - 1] = 0.2;
        // console.log('opacity arr', arr);
        // console.log({middle});

        return arr;
    }, []);

    const getTextOpacity = useCallback(numOfDisplayedItems => {
        const middle = Math.floor(numOfDisplayedItems / 2);
        const arr = [...new Array(numOfDisplayedItems).fill(1)];
        arr[middle] = 0;
        console.log({arr});
        return arr;
    });

    const getSelectedColor = useCallback(numOfDisplayedItems => {
        const middle = Math.floor(numOfDisplayedItems / 2);
        const arr = [...new Array(numOfDisplayedItems).fill(0)];
        arr[middle] = 1;
        return arr;
    });


    const createList = useCallback((itemStyles, selectedColor, animationValue) => {
        return [
            ...spaces(true),
            ...options.map((value, index) => {
                const distanceFromViewCenter = Math.abs(index * itemHeight);

                const inputRange = calculateDisplayedItemHeights(
                    numOfDisplayedItems,
                    itemHeight,
                    distanceFromViewCenter
                );

                const tightRange = height / 10;
                const tightInputRange = [inputRange[middleItemIndex] - tightRange, inputRange[middleItemIndex], inputRange[middleItemIndex] + tightRange];
                console.log({tightInputRange});

                return (
                    <View style={{height: itemHeight}}>
                        <Item
                            key={index}
                            style={[
                                {
                                    transform: [
                                        {
                                            rotateX: animationValue.interpolate({
                                                inputRange,
                                                outputRange: getDegreesByItemAmount(numOfDisplayedItems)
                                            })
                                        },
                                        {
                                            translateY: animationValue.interpolate({
                                                inputRange,
                                                outputRange: getYOffsetByItemAmount(numOfDisplayedItems)
                                            })
                                        }
                                    ],
                                    opacity: animationValue.interpolate({
                                        inputRange: inputRange,
                                        outputRange: getOpacityByItemAmount(numOfDisplayedItems)
                                    }),
                                },
                                itemStyles
                            ]}
                            itemHeight={itemHeight}
                            as={Animated.View}
                        >
                            <ItemText
                                as={Animated.Text}
                                style={[{
                                    transform: [
                                        {
                                            scale: animationValue.interpolate({
                                                inputRange,
                                                outputRange: [0.7, 0.9, 1.2, 0.9, 0.7]
                                            })
                                        },
                                    ],
                                    opacity: animationValue.interpolate({
                                        inputRange: tightInputRange,
                                        outputRange: getTextOpacity(tightInputRange.length)
                                    })
                                }, {color: '#000000'}]}>{value}</ItemText>
                            {/*Selected Text:*/}
                            <ItemText
                                as={Animated.Text}
                                style={[{
                                    transform: [
                                        {
                                            scale: animationValue.interpolate({
                                                inputRange,
                                                outputRange: [0.7, 0.9, 1.2, 0.9, 0.7]
                                            })
                                        },
                                    ],
                                    opacity: animationValue.interpolate({
                                        inputRange: tightInputRange,
                                        outputRange: getSelectedColor(tightInputRange.length)
                                    })
                                    // color: animationValue.a
                                }, {
                                    // borderBottomWidth: 1,
                                    // borderTopWidth: 1,
                                    width: 100,
                                    padding: 10,
                                    textAlign: 'center',
                                    color: selectedColor,
                                    position: 'absolute',
                                    borderColor: selectedColor,
                                    fontWeight: 'bold'
                                }]}>{value}</ItemText>
                        </Item>
                    </View>
                );
            }),
            ...spaces(false)
        ];
    }, []);

    const initialLock = useCallback(
        offset => {
            lockOnItem({
                offset,
                itemHeight,
                scroller,
                onSelect,
                options
            });
        },
        [options, onSelect, itemHeight]
    );


    const animatedValueScrollY = new Animated.Value(0);

    //TODO: Make two covers with border top/bottom instead of one

    // console.log("rendered");
    renderCount += 1;
    console.warn({renderCount});
    return (
        <ScrollWrapper height={height} width={width}>
            <View style={{position: 'absolute', width: 100, height: height, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                <View style={{width: 100, height: height / 3.5, borderColor: selectedColor, borderTopWidth: 1, borderBottomWidth: 1}}/>
            </View>
            <WheelScroller
                decelerationRate={0.95}
                as={Animated.ScrollView}
                onLayout={() => initialLock(selected * itemHeight)}
                ref={scroller}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: animatedValueScrollY}}}],
                    {
                        useNativeDriver: true
                    }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                onMomentumScrollEnd={event => {
                    initialLock(event.nativeEvent.contentOffset.y)
                }
                }
            >
                {createList(itemStyles, selectedColor, animatedValueScrollY)}
            </WheelScroller>
        </ScrollWrapper>
    );
};

App.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    numOfDisplayedItems: PropTypes.number,
    itemStyles: PropTypes.object,
    borderWidth: PropTypes.number,
    selected: PropTypes.number,
    selectedColor: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    borderColor: PropTypes.string,
    options: PropTypes.array.isRequired
};

App.defaultProps = {
    height: 200,
    width: 80,
    numOfDisplayedItems: 5,
    chosenItemStyle: {
        color: 'red'
    },
    itemStyles: {},
    borderWidth: 2,
    selected: 9,
    selectedColor: 'red',
    onSelect: value => console.log("value: ", value),
    borderColor: "black",
    options: Array(100)
        .fill("")
        .map((_, i) => i + 1)
};

export default App;
