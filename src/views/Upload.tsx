import {useFile, useMedia} from '../hooks/apiHooks';
import {Card, Input} from '@rneui/base';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useUpdateContext} from '../hooks/ContextHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NavigatorType} from '../types/LocalTypes';
import CustomButton from '../lib/CustomButton';
import CustomInput from '../lib/CustomInput';

type UploadInputs = {
  title: string;
  description: string;
};

const initValues: UploadInputs = {
  title: '',
  description: '',
};

const Upload = () => {
  const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<NavigatorType>>();
  const {postMedia} = useMedia();
  const {postExpoFile} = useFile();
  const {triggerUpdate} = useUpdateContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
    mode: 'onChange',
  });

  const doUpload = async (inputs: UploadInputs) => {
    setLoading(true);
    if (!image) {
      Alert.alert('Upload failed: no image');
      return;
    }

    const token = await AsyncStorage.getItem('token');

    if (!token || !image.assets) {
      Alert.alert('Upload failed: no token or image');
      return;
    }

    const fileResponse = await postExpoFile(image.assets[0].uri, token);

    const mediaResponse = await postMedia(fileResponse, inputs, token);

    setLoading(false);
    reset();
    navigation.navigate('All Media');
    triggerUpdate();

    if (!mediaResponse) {
      Alert.alert('Upload failed: no media');
      return;
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      quality: 0.6,
    });

    console.log(result);

    if (!result.canceled && result.assets) {
      setImage(result);
    } else {
      setImage(null);
    }
  };

  return (
    <>
      {loading ? (
        <View className="w-[90%] bg-stone-400 p-4 m-auto rounded-lg">
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="w-[90%] bg-stone-400 p-4 m-auto rounded-lg">
            <Controller
              control={control}
              rules={{required: 'Title is required'}}
              name="title"
              render={({
                field: {onChange, onBlur, value},
                fieldState: {error},
              }) => (
                <CustomInput
                  autoCapitalize="words"
                  placeholder="Title"
                  className="h-12"
                  error={error?.message}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              rules={{required: 'Description is required'}}
              name="description"
              render={({
                field: {onChange, onBlur, value},
                fieldState: {error},
              }) => (
                <CustomInput
                  autoCapitalize="sentences"
                  placeholder="Description"
                  multiline={true}
                  containerClassName=""
                  className="text-white h-32"
                  error={error?.message}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {image ? (
              <Pressable onPress={pickImage}>
                <Image
                  className="h-[350px] my-4 rounded-lg bg-slate-500"
                  source={{uri: image?.assets![0].uri}}
                />
              </Pressable>
            ) : (
              <CustomButton
                className="h-[350px] w-full my-4 rounded-lg bg-stone-500"
                onPress={pickImage}
              >
                Pick a image
              </CustomButton>
            )}

            <CustomButton onPress={handleSubmit(doUpload)}>Upload</CustomButton>
          </View>
        </TouchableWithoutFeedback>
      )}
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

export default Upload;
