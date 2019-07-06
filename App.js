import React, { useRef, useEffect } from "react";

import { Text } from "react-native";
import { ScrollWrapper, Item, ItemText, Sv, Cover } from './styles/wheel';
import { scrollToNumber } from './utils/functions';

const createList = (options, itemHeight, itemStyles, textStyles, spaces) => {
  return [
    ...spaces,
    ...options.map((value, index) => (
      <Item index={index} style={itemStyles} itemHeight={itemHeight}>
        <ItemText style={textStyles}>{value}</ItemText>
      </Item>
    )),
    ...spaces
  ];
};

const App = ({
  height = 200,
  width = 80,
  items = 7,
  itemStyles = {},
  textStyles = {},
  borderWidth = 2,
  selected = 0,
  onSelect = () => {},
  borderColor = "black",
  options = [
    ...Array(50)
      .fill(" ")
      .map((_, i) => i)
  ]
}) => {
  useEffect(() => {
    scrollToNumber((itemHeight * items) / 2, itemHeight, scroller);
  });

  //TODO: Make two covers with border top/bottom instead of one
  //TODO: Implement 'selected'
  //TODO: Implement 'onSelect'

  const scroller = useRef(null);
  items = ![3, 5, 7].includes(items) ? 5 : items; // TODO: Fix to  %2 === 1

  const itemHeight = height / items;

  // Creates empty items to be able to choose first and last items from given array, without the empty items user cant reach to first or last item
  const spaces = Array(items / 2 - 0.5)
    .fill(" ")
    .map((item, index) => (
      <Item index={index} style={itemStyles} itemHeight={itemHeight}>
        <Text>{item}</Text>
      </Item>
    ));

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
        showsVerticalScrollIndicator={false}
        ref={scroller}
        onMomentumScrollEnd={event => {
          scrollToNumber(
            event.nativeEvent.contentOffset.y,
            itemHeight,
            scroller
          );
        }}
      >
        {createList(options, itemHeight, itemStyles, textStyles, spaces)}
      </WheelScroller>
    </ScrollWrapper>
  );
};


export default App;
