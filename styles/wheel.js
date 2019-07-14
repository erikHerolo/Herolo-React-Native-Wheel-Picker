import styled from "styled-components/native";

// TODO: Remove margin in production
export const ScrollWrapper = styled.View`
  overflow: hidden;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  justify-content: space-between;
  align-items: center;
  margin: 50px;
`;

export const Item = styled.View`
  height: ${props => props.itemHeight}px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const ItemText = styled.Text`
  color: black;
`;

export const WheelScroller = styled.ScrollView`
  width: 100%;
`;

export const Cover = styled.View`
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
