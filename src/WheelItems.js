import React, { useCallback } from "react";
import {Animated, Text, View} from "react-native";
import {Item, ItemText} from "./styles/wheel";
import animationUtils from "./animationUtils";
import {calculateDisplayedItemHeights} from "./utils/functions";

const WheelItems = ({options, itemStyles, selectedColor, animationValue, itemHeight, numOfDisplayedItems, selectedArea}) => {
    const middleItemIndex = Math.floor(numOfDisplayedItems / 2);

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
        return arr;
    }, []);

    const spaces = useCallback(isTop =>
        Array(numOfDisplayedItems / 2 - 0.5)
            .fill(" ")
            .map((item, index) => (
                <Item
                    key={ isTop ? `top-space${ index }` : `bottom-space${ index }` }
                    style={ itemStyles }
                    itemHeight={ itemHeight }
                >
                    <Text>{ item }</Text>
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
            const tightInputRange = [ inputRange[middleItemIndex] - tightRange, inputRange[middleItemIndex], inputRange[middleItemIndex] + tightRange ];
            console.log({ tightInputRange });

            return (
                <View style={ { height: itemHeight } }>
                    <Item
                        key={ index }
                        style={ [
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
                                    }
                                ],
                                opacity: animationValue.interpolate({
                                    inputRange: inputRange,
                                    outputRange: animationUtils.getListOpacityArr(numOfDisplayedItems)
                                }),
                            },
                            itemStyles
                        ] }
                        itemHeight={ itemHeight }
                        as={ Animated.View }
                    >
                        <Animated.View
                            style={
                                {
                                    opacity: animationValue.interpolate({
                                        inputRange: tightInputRange,
                                        outputRange: animationUtils.getNotSelectedOpacityArr(tightInputRange.length)
                                    })
                                }
                            }
                        >
                            <ItemText
                                key={ `${ value }` }
                                as={ Animated.Text }
                                style={ [ {
                                    transform: [
                                        {
                                            scale: animationValue.interpolate({
                                                inputRange,
                                                outputRange: animationUtils.getScaleArr(numOfDisplayedItems)
                                            })
                                        },
                                    ],

                                }, { color: '#000000' } ] }>{ value }</ItemText>
                        </Animated.View>
                        <Animated.View
                            style={
                                {
                                    position: 'absolute',
                                    opacity: animationValue.interpolate({
                                        inputRange: tightInputRange,
                                        outputRange: animationUtils.getSelectedOpacityArr(tightInputRange.length)
                                    })
                                }
                            }
                        >
                            <ItemText
                                key={ `${ value }-selected` }
                                as={ Animated.Text }
                                style={ [ {
                                    transform: [
                                        {
                                            scale: animationValue.interpolate({
                                                inputRange,
                                                outputRange: animationUtils.getScaleArr(numOfDisplayedItems)
                                            })
                                        },
                                    ],
                                }, {
                                    width: 100,
                                    padding: 10,
                                    textAlign: 'center',
                                    color: selectedColor,
                                    borderColor: selectedColor,
                                    fontWeight: 'bold'
                                } ] }>{ value }</ItemText>
                        </Animated.View>
                    </Item>
                </View>
            );
        }),
        ...spaces(false)
    ];
};

export default WheelItems;
