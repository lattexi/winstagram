import {FlatList, Text, View} from 'react-native';
import {useMedia} from '../hooks/apiHooks';
import MediaListItem from '../components/MediaListItem';

const Home = () => {
  const {mediaArray} = useMedia();
  console.log(mediaArray);
  return (
    <View>
      <Text>Home</Text>
      <FlatList
        data={mediaArray}
        renderItem={({item}) => <MediaListItem item={item}></MediaListItem>}
      ></FlatList>
    </View>
  );
};

export default Home;
