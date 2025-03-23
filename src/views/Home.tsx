import {FlatList, View} from 'react-native';
import {useMedia} from '../hooks/apiHooks';
import MediaListItem from '../components/MediaListItem';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useUpdateContext} from '../hooks/ContextHooks';

const Home = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {mediaArray, loading, loadMore} = useMedia();
  const {triggerUpdate} = useUpdateContext();
  console.log(mediaArray);

  return (
    <View>
      <FlatList
        data={mediaArray}
        renderItem={({item}) => (
          <MediaListItem item={item} navigation={navigation} />
        )}
        onRefresh={() => {
          triggerUpdate();
        }}
        refreshing={loading && mediaArray.length === 0}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default Home;
