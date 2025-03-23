import {Text, TextInput, View} from 'react-native';
import {useUserContext} from '../hooks/ContextHooks';
import {useEffect, useState} from 'react';
import {useCommentStore} from '../hooks/storeHooks';
import {useComment} from '../hooks/apiHooks';
import {Controller, useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {FlatList} from 'react-native';
import CustomButton from '../lib/CustomButton';
import CustomInput from '../lib/CustomInput';

const initValues = {
  comment_text: '',
};

const Comments = ({item}: {item: MediaItemWithOwner}) => {
  const {comments, setComments} = useCommentStore();
  const {postComment, getCommentsByMediaId} = useComment();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
    mode: 'onChange',
  });

  const getComments = async () => {
    try {
      const comments = await getCommentsByMediaId(item.media_id);
      setComments(comments);
    } catch (e) {
      setComments([]);
      console.error(e);
    }
  };

  const doComment = async (inputs: {comment_text: string}) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const comment = await postComment(
        inputs.comment_text,
        item.media_id,
        token,
      );
      getComments();
      reset();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getComments();
  }, [item.media_id]);

  return (
    <View className="min-h-48">
      <Text>Comments</Text>
      <FlatList
        data={comments}
        renderItem={({item}) => <Text>{item.comment_text}</Text>}
      />
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <CustomInput
            placeholder="Comment"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
        name="comment_text"
        rules={{required: 'Comment is required'}}
      />
      <CustomButton onPress={handleSubmit(doComment)}>Add comment</CustomButton>
    </View>
  );
};

export default Comments;
