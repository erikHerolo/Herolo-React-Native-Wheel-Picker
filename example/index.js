import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import WheelPicker from '../App';

export default () => {
  const [selected, setSelected] = useState(0);

  return (
    <View>
      <WheelPicker selected={selected} borderColor="#ef5de1" borderWidth={10} onSelect={(value)=>setSelected(value)} />
      <TouchableOpacity onPress={()=>setSelected(selected - 1)}><Text> - </Text></TouchableOpacity>
      <TouchableOpacity onPress={()=>setSelected(selected + 1)}><Text> + </Text></TouchableOpacity>
    </View>
  );
};