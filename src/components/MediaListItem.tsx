import {Text, View} from 'react-native';
import {MediaItemWithOwner} from 'hybrid-types/DBTypes';

const MediaListItem = (props: {item: MediaItemWithOwner}) => {
  return (
    <View>
      <Text>MediaListItem</Text>
    </View>
  );
};

export default MediaListItem;
