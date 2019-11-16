import React, {useCallback, useRef} from "react";
import {Animated, Text, View} from "react-native";
import styled from 'styled-components/native';
import PropTypes from "prop-types";
import {Item, ScrollWrapper, WheelScroller} from "./src/styles/wheel";
import WheelItems from "./src/WheelItems";
import {lockOnItem} from "./src/utils/functions";

const App = (props) => {
    let {
        height,
        width,
        numOfDisplayedItems,
        itemStyles,
        selectedColor,
        borderWidth,
        selected,
        onSelect,
        borderColor,
        options,
        selectedItemStyle,
        decelerationRate,
        scrollEventThrottle
    } = props;

    const doesIndexExist = options.length > selected && selected >= 0;
    selected = doesIndexExist ? selected : 0;

    if (!doesIndexExist) {
        console.warn('[Wheelpicker] Given index is out of range');
    }

    const scroller = useRef(null);

    const itemHeight = height / numOfDisplayedItems;
    const itemSurface = 2 * itemHeight * (numOfDisplayedItems / 2) * Math.sin(Math.PI / (2 * numOfDisplayedItems));
    const selectedArea = itemSurface;

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

    const onMomentumScrollEnd = event => {
        initialLock(event.nativeEvent.contentOffset.y);
    };

    const onScroll = useCallback(Animated.event(
        [{nativeEvent: {contentOffset: {y: animatedValueScrollY}}}],
        {
            useNativeDriver: true
        }),[animatedValueScrollY]);

    //TODO: Make two covers with border top/bottom instead of one

    return (
        <ScrollWrapper height={height} width={width}>
            <WheelCover height={height}>
                <SelectedOptionCover selectedArea={selectedArea} selectedColor={selectedColor} />
            </WheelCover>

            <WheelScroller
                decelerationRate={decelerationRate}
                as={Animated.ScrollView}
                onLayout={() => initialLock(selected * itemHeight)}
                ref={scroller}
                onScroll={onScroll}
                scrollEventThrottle={scrollEventThrottle}
                showsVerticalScrollIndicator={false}
                onMomentumScrollEnd={onMomentumScrollEnd}
            >
                <WheelItems
                    itemStyle={selectedItemStyle}
                    options={options} itemStyles={itemStyles} selectedColor={selectedColor}
                    animationValue={animatedValueScrollY} itemHeight={itemHeight}
                    numOfDisplayedItems={numOfDisplayedItems} selectedArea={selectedArea}
                />
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
    options: PropTypes.array.isRequired,
    selectedItemStyle: PropTypes.object,
    decelerationRate: PropTypes.number,
    scrollEventThrottle: PropTypes.number
};

App.defaultProps = {
    height: 200,
    width: 80,
    numOfDisplayedItems: 5,
    chosenItemStyle: {
        color: 'red'
    },
    decelerationRate: 0.95,
    scrollEventThrottle: 16,
    itemStyles: { },
    borderWidth: 2,
    selected: 3,
    selectedColor: 'red',
    selectedItemStyle: {},
    onSelect: value => {},
    borderColor: "black",
    options: Array(100)
    .fill("")
    .map((_, i) => i + 1)
};

const WheelCover = styled.View`
    position: absolute;
    width: 100;
    height: ${props => props.height};
    align-self: center;
    align-items: center;
    justify-content: center;
`;

const SelectedOptionCover = styled.View`
    width: 100;
    height: ${props => props.selectedArea};
    border-color: ${props => props.selectedColor || 'white'};
    border-top-width: 1;
    border-bottom-width: 1;
`;

export default App;
