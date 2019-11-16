# react-native-wheelpicker

A highly customizable wheel picker for react-native.


## Installation

Using npm:
```bash
npm i @herolo/react-native-wheelpicker
```

Using yarn:
```bash
yarn add @herolo/react-native-wheelpicker
```


## Usage

```react
import WheelPicker from '@herolo/rn-wheelpicker';

export const Home = (props) => {
  return (
    <View>
      <WheelPicker
        height={100} 
        width={100}
        options={['David', 'Sarah', 'Daniel', 'Michelle']}
        selectedColor="lightblue"
      />

    </View>
  );
};
```

## Props

| Prop name           | Description                                                                                                | Type                | Default                          |
|---------------------|------------------------------------------------------------------------------------------------------------|---------------------|----------------------------------|
| height              | The height of the wheelpicker                                                                              | number              | 200                              |
| width               | The width of the wheelpicker                                                                               | number              | 80                               |
| numOfDisplayedItems | Determines how many items appear                                                                           | number              | 5                                |
| decelerationRate    | Determines the deceleration rate of the ScrollView element containing the options                          | number              | 0.95                             |
| scrollEventThrottle | Determines the scroll event throttle rate of the FlatList                                                  | number              | 16                               |
| itemStyles          | Styles of items in the wheel picker                                                                        | Style object        | {}                               |
| borderWidth         | Border with of the selected item                                                                           | number              | 0                                |
| selected            | The index of the selected item. This was chosen over the value, due to the possibility of duplicate values | number              | 0                                |
| selectedColor       | Font color of the selected item                                                                            | string              | red                              |
| selectedItemStyle   | Style of the selected item box                                                                             | Style object        | {}                               |
| onSelect            | A function that takes the value as a parameter                                                             | (value: any) => any | ()=>{}                           |
| borderColor         | Color of the border of the selected item                                                                   | string              | yellow                           |
| options             | An array of the options to be displayed and chosen from                                                    | Array<any>          | ['Daniel', 'Moses', 1, 2, 3, 42] |

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)