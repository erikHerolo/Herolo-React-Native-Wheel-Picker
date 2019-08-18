import React, {useCallback, useRef, useState} from "react";
import {Animated, Text, View} from "react-native";
import PropTypes from "prop-types";
import {Item, ItemText, ScrollWrapper, WheelScroller} from "./styles/wheel";
import {lockOnItem} from "./utils/functions";

const App = ({
                 height,
                 width,
                 numOfDisplayedItems,
                 itemStyles,
                 textStyles,
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
            const middleItem = Math.floor(numOfDisplayedItems / 2);

            for (let i = 0; i < numOfDisplayedItems; i++) {
                arr.push(distanceFromViewCenter + (i - middleItem) * itemHeight);
            }

            return arr;
        },
        []
    );

    const getDegreesByItemAmount = useCallback(numOfDisplayedItems => {
        const arr = [];
        let stepDegrees = 180 / numOfDisplayedItems;
        const middleItem = Math.floor(numOfDisplayedItems / 2);

        for (let i = 0; i < numOfDisplayedItems; i++) {
            arr.push(`${(i - middleItem) * stepDegrees}deg`);
        }
        // console.log('degrees arr', arr);
        return arr;
    }, []);

    const getYOffsetByItemAmount = useCallback(numOfDisplayedItems => {
        const arr = [];
        let stepDegrees = numOfDisplayedItems / 1.5;
        const middleItem = Math.floor(numOfDisplayedItems / 2);

        for (let i = 0; i < numOfDisplayedItems; i++) {
            arr.push((i - middleItem) * stepDegrees / 10 * -itemHeight);
        }
        console.log('yOffset arr1111', arr);
        return arr;
    }, []);

    const getOpacityByItemAmount = useCallback(numOfDisplayedItems => {
        const arr = [];
        const middleItem = Math.floor(numOfDisplayedItems / 2);
        const middle = numOfDisplayedItems / 2;
        const stepOpacity = 1 / middleItem;

        for (let i = 0; i < numOfDisplayedItems; i++) {
            arr.push(1 - Math.abs(stepOpacity * i - 1));
        }
        arr[0] = 0.2;
        arr[arr.length - 1] = 0.2;
        // console.log('opacity arr', arr);
        // console.log({middle});

        return arr;
    }, []);


    const createList = useCallback((itemStyles, textStyles, animationValue) => {
        return [
            ...spaces(true),
            ...options.map((value, index) => {
                const distanceFromViewCenter = Math.abs(index * itemHeight);

                const inputRange = calculateDisplayedItemHeights(
                    numOfDisplayedItems,
                    itemHeight,
                    distanceFromViewCenter
                );
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
                            <ItemText style={textStyles}>{value}</ItemText>
                        </Item>
                    </View>
                );
            }),
            ...spaces(false)
        ];
    }, []);

    const initialLock = useCallback(
        offset =>
            lockOnItem({
                offset,
                itemHeight,
                scroller,
                onSelect,
                options
            }),
        [options, onSelect, itemHeight]
    );

    const animatedValueScrollY = new Animated.Value(0);

    // const onScroll = Animated.event([{nativeEvent: {contentOffset: {y: scrollerY}}}], {useNativeDriver: true});
    // const onScroll = e => console.log({e});
    const [scrollY, setScrollY] = useState(animatedValueScrollY);

    //TODO: Make two covers with border top/bottom instead of one

    // console.log("rendered");

    return (
        <ScrollWrapper height={height} width={width}>
            <WheelScroller
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
                    console.warn(Math.round(event.nativeEvent.contentOffset.y / itemHeight) + 1);
                    initialLock(event.nativeEvent.contentOffset.y)
                }
                }
            >
                {createList(itemStyles, textStyles, animatedValueScrollY)}
            </WheelScroller>
        </ScrollWrapper>
    );
};

App.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    numOfDisplayedItems: PropTypes.number,
    itemStyles: PropTypes.object,
    textStyles: PropTypes.object,
    borderWidth: PropTypes.number,
    selected: PropTypes.number,
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
    textStyles: {},
    borderWidth: 2,
    selected: 9,
    onSelect: value => console.log("value: ", value),
    borderColor: "black",
    options: Array(100)
        .fill("")
        .map((_, i) => i + 1)
};

export default App;
