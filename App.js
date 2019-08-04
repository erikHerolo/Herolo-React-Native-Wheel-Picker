import React, {useCallback, useRef, useState} from 'react';
import {Animated, Text} from 'react-native';
import PropTypes from 'prop-types';
import {Cover, Item, ItemText, ScrollWrapper, WheelScroller} from './styles/wheel';
import {lockOnItem} from './utils/functions';


const App = ({
                 height,
                 width,
                 items,
                 itemStyles,
                 textStyles,
                 borderWidth,
                 selected,
                 onSelect,
                 borderColor,
                 options,
             }) => {
    const doesIndexExist = options.length > selected && selected >= 0;
    selected = doesIndexExist ? selected : 0;

    if (!doesIndexExist) {
        console.warn('given index is out of range');
    }

    const scroller = useRef(null);

    const itemHeight = height / items;

    // Creates empty items to be able to choose first and last items from given array, without the empty items user cant reach to first or last item
    const spaces = isTop =>
        Array(items / 2 - 0.5)
            .fill(' ')
            .map((item, index) => (
                <Item key={isTop ? `top-space${index}` : `bottom-space${index}`} style={itemStyles}
                      itemHeight={itemHeight}>
                    <Text>{item}</Text>
                </Item>
            ));

    const createList = useCallback((itemStyles, textStyles, animationValue) => {
        const middleItem = Math.floor(options.length / 2) - 1;
        return [
            ...spaces(true),
            ...options.map((value, index) => {
                const distanceFromViewCenter = Math.abs(index * itemHeight);
                console.log(distanceFromViewCenter);
                const inputRange = [
                    distanceFromViewCenter - 2 * itemHeight,
                    distanceFromViewCenter - itemHeight,
                    distanceFromViewCenter, // Middle of picker
                    distanceFromViewCenter + itemHeight,
                    distanceFromViewCenter + 2 * itemHeight,
                ];
                return (
                    <Item key={index} style={[{
                        // transform: [
                        //     { rotateX: `${(middleItem - index) * 45}deg` }
                        // ],
                        transform: [
                            {
                                rotateX: animationValue.interpolate({
                                    inputRange,
                                    outputRange: ['-72deg', '-36deg', '0deg', '36deg', '72deg'],
                                })
                            }
                        ],
                        opacity: animationValue.interpolate({
                            inputRange,
                            outputRange: [0.1, 0.3, 1.0, 0.3, 0.1],
                        })
                    }, itemStyles]} itemHeight={itemHeight} as={Animated.View}>
                        <ItemText style={textStyles}>{value}</ItemText>
                    </Item>
                );
            }),
            ...spaces(false),
        ];
    }, []);

    const initialLock = useCallback(
        offset =>
            lockOnItem({
                offset,
                itemHeight,
                scroller,
                onSelect,
                options,
            }),
        [options, onSelect, itemHeight]
    );


    const animatedValueScrollY = new Animated.Value(0);

    // const onScroll = Animated.event([{nativeEvent: {contentOffset: {y: scrollerY}}}], {useNativeDriver: true});
    // const onScroll = e => console.log({e});
    const [scrollY, setScrollY] = useState(animatedValueScrollY);

    //TODO: Make two covers with border top/bottom instead of one

    return (
        <ScrollWrapper height={height} width={width}>
            <Cover
                pointerEvents="box-none"
                itemHeight={itemHeight}
                borderWidth={borderWidth}
                borderColor={borderColor}
                items={items}
            />
            <WheelScroller
                as={Animated.ScrollView}
                onLayout={() => initialLock(selected * itemHeight)}
                ref={scroller}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: animatedValueScrollY } } }],
                    {
                        useNativeDriver: true,
                    }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                onMomentumScrollEnd={event => initialLock(event.nativeEvent.contentOffset.y)}
            >
                {createList(itemStyles, textStyles, animatedValueScrollY)}
            </WheelScroller>
        </ScrollWrapper>
    );
};

App.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    items: PropTypes.number,
    itemStyles: PropTypes.object,
    textStyles: PropTypes.object,
    borderWidth: PropTypes.number,
    selected: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
    borderColor: PropTypes.string,
    options: PropTypes.array.isRequired,
};

App.defaultProps = {
    height: 400,
    width: 80,
    items: 7,
    itemStyles: {},
    textStyles: {},
    borderWidth: 2,
    selected: 9,
    onSelect: value => console.log('value: ', value),
    borderColor: 'black',
    options: Array(50)
        .fill('')
        .map((_, i) => i + 50),
};

export default App;
