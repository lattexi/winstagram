import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useMedia} from '../hooks/apiHooks';
import MediaListItem from '../components/MediaListItem';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useUpdateContext} from '../hooks/ContextHooks';
import {useUserContext} from '../hooks/ContextHooks';

const MyFiles = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {user} = useUserContext();
  const {mediaArray, loading} = useMedia(user?.user_id);
  const {triggerUpdate} = useUpdateContext();

  return (
    <View style={styles.container}>
      <FlatList
        data={mediaArray}
        ListHeaderComponent={<Text style={styles.text}>Media</Text>}
        renderItem={({item}) => (
          <MediaListItem item={item} navigation={navigation} />
        )}
        onRefresh={triggerUpdate}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    padding: 20,
  },
});

export default MyFiles;
