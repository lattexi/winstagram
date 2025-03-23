import React from 'react';
import {View, Text} from 'react-native';

const Modify = ({route}: any) => {
  const {item} = route.params;

  return (
    <View>
      <Text>Modify: {item.title}</Text>
      {/* Lomake median muokkaamista varten */}
    </View>
  );
};

export default Modify;
