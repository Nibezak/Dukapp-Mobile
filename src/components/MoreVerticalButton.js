import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function MoreVerticalButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <MaterialIcons name="more-vert" size={24} color="#4a5568" />
    </TouchableOpacity>
  );
}
