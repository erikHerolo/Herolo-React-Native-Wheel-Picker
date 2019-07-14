import React, { useRef, useEffect, useCallback } from "react";
import { Text } from "react-native";

import {
  ScrollWrapper,
  Item,
  ItemText,
  WheelScroller,
  Cover
} from "./styles/wheel";
import { lockOnItem } from "./utils/functions";

const createList = (options, itemHeight, itemStyles, textStyles, spaces) => {
  return [
    ...spaces,
    ...options.map((value, index) => (
      <Item key={index} style={itemStyles} itemHeight={itemHeight}>
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
  selected = 999,
  onSelect = value => {
    console.log("value: ", value);
  },
  borderColor = "black",
  options = [
    ...Array(50)
      .fill(" ")
      .map((_, i) => i + 50)
  ]
}) => {
  const doesIndexExist = options.length > selected && selected >= 0;
  selected = doesIndexExist ? selected : 0;

  if (!doesIndexExist) {
    console.warn("given index is out of range");
  }

  const scroller = useRef(null);

  const itemHeight = height / items;

  // Creates empty items to be able to choose first and last items from given array, without the empty items user cant reach to first or last item
  const spaces = Array(items / 2 - 0.5)
    .fill(" ")
    .map((item, index) => (
      <Item style={itemStyles} itemHeight={itemHeight}>
        <Text>{item}</Text>
      </Item>
    ));

  useEffect(() => {
    setTimeout(() => {
      lockOnItem({
        offset: selected * itemHeight,
        itemHeight,
        scroller,
        onSelect,
        options
      });
    }, 200);
  }, [selected, scroller]);

  //TODO: Make two covers with border top/bottom instead of one
  //TODO: Implement 'onSelect'

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
          lockOnItem({
            offset: event.nativeEvent.contentOffset.y,
            itemHeight,
            scroller,
            onSelect,
            options
          });
        }}
      >
        {createList(options, itemHeight, itemStyles, textStyles, spaces)}
      </WheelScroller>
    </ScrollWrapper>
  );
};

export default App;
