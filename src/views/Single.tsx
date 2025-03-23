import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {StyledVideo} from '../types/LocalTypes';
import {ScrollView} from 'react-native';
import {useMedia} from '../hooks/apiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUserContext} from '../hooks/ContextHooks';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import CustomButton from '../lib/CustomButton';
import Comments from '../components/Comments';
import {useState} from 'react';

const Single = ({route}: any) => {
  const item: MediaItemWithOwner = route.params.item;
  const {deleteMedia} = useMedia();
  const {user} = useUserContext();
  const navigate = useNavigation<NavigationProp<ParamListBase>>();

  const handleDelete = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return;
    }
    try {
      await deleteMedia(item.media_id, token);
      navigate.goBack();
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <ScrollView>
        <Text>{item.title}</Text>
        <Text>{new Date(item.created_at).toLocaleString('fi-FI')}</Text>
        <View className="">
          {item.media_type.includes('image') ? (
            <Image className="h-[500px]" src={item.filename} />
          ) : (
            <StyledVideo
              className="h-[500px]"
              source={{uri: item.filename}}
              useNativeControls
              isLooping
            />
          )}
        </View>
        {/* <Likes item={item} /> */}
        <Text>{item.description}</Text>
        <Text>Owner: {item.username}</Text>
        <Text>Type: {item.media_type}</Text>
        <Text>Size: {Math.round(item.filesize / 1024)} kB</Text>
        <CustomButton onPress={() => setModalVisible(true)}>
          Comments
        </CustomButton>

        {user && user.user_id === item.user_id && (
          <View className="flex justify-between gap-2 mb-8 mt-4">
            <CustomButton onPress={() => navigate.navigate('Modify', {item})}>
              Modify
            </CustomButton>
            <CustomButton className="bg-red-600" onPress={handleDelete}>
              Delete
            </CustomButton>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end mb-[-50%]">
            <TouchableOpacity activeOpacity={1}>
              <View className="h-[80%] bg-stone-500 rounded-t-xl p-4 bottom-[0]">
                <Text className="text-lg font-bold mb-2">Kommentit</Text>
                <Comments item={item} />
                <CustomButton
                  onPress={() => setModalVisible(false)}
                  className="bg-red-600"
                >
                  Sulje
                </CustomButton>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5a5',
    marginBottom: 10,
  },
  image: {height: 400},
});

export default Single;
