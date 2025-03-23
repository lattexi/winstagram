import {Button, Card} from '@rneui/base';
import {useUserContext} from '../hooks/ContextHooks';
import {useNavigation} from '@react-navigation/native';
import {NavigatorType} from '../types/LocalTypes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Text, View} from 'react-native';
import CustomButton from '../lib/CustomButton';

const Profile = () => {
  const {user, handleLogout} = useUserContext();
  const navigation = useNavigation<NativeStackNavigationProp<NavigatorType>>();
  return (
    <View className="w-[90%] h-[90%] m-auto bg-stone-400 p-4 rounded-lg flex justify-between">
      <View className="flex gap-2">
        <Text className="text-2xl">{user?.username}</Text>
        <Text>{user?.email}</Text>
        <Text>{user?.created_at as string}</Text>
      </View>

      <View className="flex flex-row gap-2">
        <CustomButton onPress={handleLogout}>Logout</CustomButton>
        <CustomButton onPress={() => navigation.navigate('My Files')}>
          My media
        </CustomButton>
      </View>
    </View>
  );
};

export default Profile;
