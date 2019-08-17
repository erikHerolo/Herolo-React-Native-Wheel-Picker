import React, {useCallback, useRef, useState} from "react";
import {Animated, Text} from "react-native";
import PropTypes from "prop-types";
import {
  Cover,
  Item,
  ItemText,
  ScrollWrapper,
  WheelScroller
} from "./styles/wheel";
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

    return arr;
  }, []);

  const getOpacityByItemAmount = useCallback(numOfDisplayedItems => {
    const arr = [];
    const middleItem = Math.floor(numOfDisplayedItems / 2);
    const stepOpacity = 1 / middleItem;

    for (let i = 0; i < numOfDisplayedItems; i++) {
      const opacity = Math.abs(Math.abs((i - middleItem) * stepOpacity) - 1);

      arr.push(opacity === 0 ? stepOpacity : opacity);
    }

    return arr;
  }, []);

  const getHeightByIndex = useCallback(
    (index, numOfDisplayedItems, options) => {
      let stepDegrees = 180 / numOfDisplayedItems;

      const middleItem = Math.floor(numOfDisplayedItems / 2) - 1;

      //implement
    },
    []
  );

  const returnTriangleSequence = (numOfItems) => {
    const sequence = [];
    const divider = Math.ceil(numOfItems / 2);
    for (let i = 0; i < numOfItems; i++) {
      if (i < divider) {
        sequence.push(i);
      } else {
        sequence.push(numOfItems - i - 1);
      }
    }
    let mappedSequence: *;
    mappedSequence = sequence.map(item => Math.pow(numOfItems - item - divideEr, 5));
    // console.log(sequence);
    // console.log({mappedSequence});
    return mappedSequence;
  };

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

        // const newItemHeight = getHeightByDegrees(index, numOfDisplayedItems);

        return (
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
                  // {
                  //     translateY: animationValue.interpolate({
                  //         inputRange,
                  //         outputRange: returnTriangleSequence(numOfDisplayedItems)
                  //     })
                  // }
                ],
                // opacity: animationValue.interpolate({
                //     inputRange: inputRange,
                //     outputRange: getOpacityByItemAmount(numOfDisplayedItems)
                // })
              },
              itemStyles
            ]}
            itemHeight={itemHeight}
            as={Animated.View}
          >
            <ItemText style={textStyles}>{value}</ItemText>
          </Item>
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
          [{ nativeEvent: { contentOffset: { y: animatedValueScrollY } } }],
          {
            useNativeDriver: true
          }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={event =>
          initialLock(event.nativeEvent.contentOffset.y)
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
  height: 400,
  width: 80,
  numOfDisplayedItems: 5,
  itemStyles: {},
  textStyles: {},
  borderWidth: 2,
  selected: 9,
  onSelect: value => console.log("value: ", value),
  borderColor: "black",
  options: Array(50)
    .fill("")
    .map((_, i) => i + 50)
};

export default App;
