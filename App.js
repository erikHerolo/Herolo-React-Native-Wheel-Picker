import React, {useCallback, useRef} from "react";
import {Animated, Text, View} from "react-native";
import PropTypes from "prop-types";
import {Item, ScrollWrapper, WheelScroller} from "./src/styles/wheel";
import WheelItems from "./src/WheelItems";
import {lockOnItem} from "./src/utils/functions";


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
    const selectedArea = height / numOfDisplayedItems * 1.14;

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
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ScrollWrapper height={height} width={width}>
                <View style={{
                    position: 'absolute',
                    width: 100,
                    height: height,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        width: 100,
                        height: selectedArea,
                        borderColor: selectedColor,
                        borderTopWidth: 1,
                        borderBottomWidth: 1
                    }}/>
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
                    <WheelItems
                        options={options} itemStyles={itemStyles} selectedColor={selectedColor}
                        animationValue={animatedValueScrollY} itemHeight={itemHeight}
                        numOfDisplayedItems={numOfDisplayedItems} selectedArea={selectedArea}
                    />
                </WheelScroller>
            </ScrollWrapper>
        </View>
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
    selected: 3,
    selectedColor: 'red',
    onSelect: value => console.log("value: ", value),
    borderColor: "black",
    options: Array(100)
        .fill("")
        .map((_, i) => i + 1)
};

export default App;
