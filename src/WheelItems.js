import React, {useCallback} from "react";
import {Animated, Text, View} from "react-native";
import {Item, ItemText} from "./styles/wheel";
import animationUtils from "./animationUtils";
import {calculateDisplayedItemHeights} from "./utils/functions";

const WheelItems = ({options, itemStyle, selectedColor, animationValue, itemHeight, numOfDisplayedItems, selectedArea}) => {
    const middleItemIndex = Math.floor(numOfDisplayedItems / 2);

    const getYOffsetByItemAmount = useCallback(numOfDisplayedItems => {
        const arr = [];

        const translateIndexToNum = (index) => {
            let resultNum = 0;
            for (let i = 1; i <= index; i++) {
                resultNum += itemHeight * 0.625 / i;
            }
            return resultNum;
        };

        for (let i = 0; i < numOfDisplayedItems; i++) {
            arr.push(i - middleItemIndex);
        }

        const resultArr = [];
        for (let i of arr) {
            resultArr.push(i >= 0 ? -translateIndexToNum(Math.abs(i)) : translateIndexToNum(Math.abs(i)));
        }

        return resultArr;
    }, []);
    
    /*
    The variable name 't' represents the length of an edge in a tangential polygon.
    For further reading, and the explanation of what is behind the following calculation:

    https://en.wikipedia.org/wiki/Incircle_and_excircles_of_a_triangle
    https://en.wikipedia.org/wiki/Tangential_polygon
    */
    const t = 2 * itemHeight * (numOfDisplayedItems / 2) * Math.sin(Math.PI / (2 * numOfDisplayedItems));

    const spaces = useCallback(isTop =>
        Array(numOfDisplayedItems / 2 - 0.5)
            .fill(" ")
            .map((item, index) => (
                <Item
                    key={isTop ? `top-space${index}` : `bottom-space${index}`}
                    style={itemStyle}
                    itemHeight={itemHeight}
                >
                    <Text>{item}</Text>
                </Item>
            )));
    return [
        ...spaces(true),
        ...options.map((value, index) => {
            const distanceFromViewCenter = Math.abs(index * itemHeight);

            const inputRange = calculateDisplayedItemHeights(
                numOfDisplayedItems,
                itemHeight,
                distanceFromViewCenter
            );

            const tightRange = selectedArea / 2;
            const tightInputRange = [inputRange[middleItemIndex] - tightRange, inputRange[middleItemIndex], inputRange[middleItemIndex] + tightRange];

            return (
                <View key={`item_${index}`} style={{height: itemHeight}}>
                    <Item
                        style={[
                            {
                                transform: [
                                    {
                                        rotateX: animationValue.interpolate({
                                            inputRange,
                                            outputRange: animationUtils.getRotateDegreeArr(numOfDisplayedItems)
                                        })
                                    },
                                    {
                                        translateY: animationValue.interpolate({
                                            inputRange,
                                            outputRange: getYOffsetByItemAmount(numOfDisplayedItems)
                                        })
                                    },
                                    {
                                        perspective: 1000
                                    },
                                    {
                                        scale: t / itemHeight
                                    },
                                ],
                                opacity: animationValue.interpolate({
                                    inputRange: inputRange,
                                    outputRange: animationUtils.getListOpacityArr(numOfDisplayedItems)
                                }),
                            },
                            itemStyle
                        ]}
                        itemHeight={itemHeight}
                        as={Animated.View}
                    >
                        <Animated.View
                            style={
                                {
                                    transform: [
                                        {
                                            scale: animationValue.interpolate({
                                                inputRange: tightInputRange,
                                                outputRange: animationUtils.getScaleArr(tightInputRange.length)
                                            })
                                        },
                                    ],
                                    opacity: animationValue.interpolate({
                                        inputRange: tightInputRange,
                                        outputRange: animationUtils.getNotSelectedOpacityArr(tightInputRange.length)
                                    }),
                                }
                            }
                        >
                            <ItemText
                                key={`${value}`}
                                as={Animated.Text}
                                style={{color: '#000000'}}>{value}</ItemText>
                        </Animated.View>
                        <Animated.View
                            style={
                                {
                                    position: 'absolute',
                                    transform: [
                                        {
                                            scale: animationValue.interpolate({
                                                inputRange: tightInputRange,
                                                outputRange: animationUtils.getScaleArr(tightInputRange.length)
                                            })
                                        },
                                    ],
                                    opacity: animationValue.interpolate({
                                        inputRange: tightInputRange,
                                        outputRange: animationUtils.getSelectedOpacityArr(tightInputRange.length)
                                    })
                                }
                            }
                        >
                            <ItemText
                                key={`${value}-selected`}
                                as={Animated.Text}
                                style={{
                                    width: 100,
                                    padding: 10,
                                    textAlign: 'center',
                                    color: selectedColor,
                                    borderColor: selectedColor,
                                    fontWeight: 'bold'
                                }}>{value}</ItemText>
                        </Animated.View>
                    </Item>
                </View>
            );
        }),
        ...spaces(false)
    ];
};

export default WheelItems;
