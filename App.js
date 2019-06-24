import React, { useRef, useEffect } from "react";
import styled from "styled-components/native";

import { Text } from "react-native";

const scrollToNumber = (offset, itemHeight, scroller) => {
  remain = offset % itemHeight;
  const newPosition =
    remain < itemHeight / 2 ? offset - remain : offset + (itemHeight - remain);
  scroller.current.scrollTo({ y: newPosition });
};

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
      <Sv
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
      </Sv>
    </ScrollWrapper>
  );
};

// TODO: Remove margin in production
const ScrollWrapper = styled.View`
  overflow: hidden;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  justify-content: space-between;
  align-items: center;
  margin: 50px;
`;

const Item = styled.View`
  height: ${props => props.itemHeight}px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ItemText = styled.Text`
  color: black;
`;

const Sv = styled.ScrollView`
  width: 100%;
`;

const Cover = styled.View`
  position: absolute;
  top: ${({ itemHeight, items }) => itemHeight * (items / 2 - 0.5)}px;
  left: -25%;
  height: ${props => props.itemHeight}px;
  width: 150%;
  border-top-width: ${props => props.borderWidth}px;
  border-top-color: ${props => props.borderColor};
  background-color: rgba(255, 255, 255, 0);
  z-index: 1;
`;

export default App;
