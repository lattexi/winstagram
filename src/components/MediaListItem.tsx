import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import {MediaItemWithOwner} from 'hybrid-types/DBTypes';

const MediaListItem = (props: {item: MediaItemWithOwner}) => {
  const {item} = props;

  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.item}>MediaListItem</Text>
      <Image
        source={{
          uri:
            item.thumbnail ||
            (item.screenshots && item.screenshots[2]) ||
            undefined,
        }}
        style={styles.image}
      />
      <Text>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>{item.username}</Text>
      <Text></Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'gray',
  },
  item: {
    padding: 10,
  },
  image: {
    height: 500,
  },
  text: {
    fontSize: 20,
  },
});

export default MediaListItem;
