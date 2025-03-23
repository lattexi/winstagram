import {
  Like,
  MediaItem,
  MediaItemWithOwner,
  UserWithNoPassword,
  Comment,
} from 'hybrid-types/DBTypes';
import {useEffect, useState} from 'react';
import {fetchData} from '../lib/functions';
import {Credentials, RegisterCredentials} from '../types/LocalTypes';
import {
  AvailableResponse,
  LoginResponse,
  MessageResponse,
  UploadResponse,
  UserResponse,
} from 'hybrid-types/MessageTypes';
import * as FileSystem from 'expo-file-system';
import {useUpdateContext} from './ContextHooks';

const useMedia = (userId?: number, initialLimit = 5) => {
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const {update} = useUpdateContext();

  const fetchMedia = async (pageNumber = 1) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const apiUrl = `${process.env.EXPO_PUBLIC_MEDIA_API}/media?page=${pageNumber}&limit=${initialLimit}`;

      const media: MediaItem[] = (await fetchData<MediaItem[]>(apiUrl)) || [];
      const mediaWithOwner: MediaItemWithOwner[] = await Promise.all(
        media.map(async (item) => {
          const owner = await fetchData<UserWithNoPassword>(
            `${process.env.EXPO_PUBLIC_AUTH_API}/users/${item.user_id}`,
          );
          const mediaItem: MediaItemWithOwner = {
            ...item,
            username: owner.username,
          };
          if (
            mediaItem.screenshots &&
            typeof mediaItem.screenshots === 'string'
          ) {
            mediaItem.screenshots = JSON.parse(mediaItem.screenshots).map(
              (screenshot: string) =>
                process.env.EXPO_PUBLIC_FILE_URL + screenshot,
            );
          }
          return mediaItem;
        }),
      );

      if (pageNumber === 1) {
        setMediaArray(mediaWithOwner);
      } else {
        setMediaArray((prev) => [...prev, ...mediaWithOwner]);
      }

      setHasMore(mediaWithOwner.length === initialLimit);
    } catch (e) {
      console.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchMedia(1);
    console.log('fetching media');
  }, [userId, update]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMedia(nextPage);
    }
  };

  const postMedia = async (
    file: UploadResponse,
    inputs: Record<string, string>,
    token: string,
  ) => {
    const media: Omit<
      MediaItem,
      'media_id' | 'user_id' | 'thumbnail' | 'created_at' | 'screenshots'
    > = {
      title: inputs.title,
      description: inputs.description,
      filename: file.data.filename,
      media_type: file.data.media_type,
      filesize: file.data.filesize,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(media),
    };

    try {
      return await fetchData<MediaItem>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/media',
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const deleteMedia = async (media_id: number, token: string) => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      return await fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/media/' + media_id,
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {
    mediaArray,
    postMedia,
    loading,
    loadMore,
    deleteMedia,
  };
};

const useFile = () => {
  const postFile = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };
    try {
      return await fetchData<UploadResponse>(
        process.env.EXPO_PUBLIC_UPLOAD_API + '/upload',
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const postExpoFile = async (
    imageUri: string,
    token: string,
  ): Promise<UploadResponse> => {
    // TODO: display loading indicator
    const fileResult = await FileSystem.uploadAsync(
      process.env.EXPO_PUBLIC_UPLOAD_API + '/upload',
      imageUri,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );
    // TODO: hide loading indicator
    return fileResult.body && JSON.parse(fileResult.body);
  };

  return {postFile, postExpoFile};
};

const useAuthentication = () => {
  const postLogin = async (credentials: Credentials) => {
    console.log('post', credentials);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
    try {
      return await fetchData<LoginResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/auth/login',
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {postLogin};
};

const useUser = () => {
  const getUserByToken = async (token: string) => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      return await fetchData<UserResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/users/token',
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getUserById = async (user_id: number) => {
    try {
      console.log('user_id', user_id);
      return await fetchData<UserWithNoPassword>(
        process.env.EXPO_PUBLIC_AUTH_API + '/users/' + user_id,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const postRegister = async (credentials: RegisterCredentials) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
    try {
      return await fetchData<UserResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/users',
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getUsernameAvailable = async (username: string) => {
    try {
      const response = await fetchData<AvailableResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/users/username/' + username,
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getEmailAvailable = async (email: string) => {
    try {
      const response = await fetchData<AvailableResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/users/email/' + email,
      );
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {
    getUserByToken,
    postRegister,
    getUsernameAvailable,
    getEmailAvailable,
    getUserById,
  };
};

const useLike = () => {
  const postLike = async (media_id: number, token: string) => {
    // Send a POST request to /likes with object { media_id } and the token in the
    // Authorization header.
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({media_id}),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/likes',
      options,
    );
  };

  const deleteLike = async (like_id: number, token: string) => {
    // Send a DELETE request to /likes/:like_id with the token in the Authorization header.
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/likes/' + like_id,
      options,
    );
  };

  const getCountByMediaId = async (media_id: number) => {
    // Send a GET request to /likes/count/:media_id to get the number of likes.
    return await fetchData<{count: number}>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/likes/count/' + media_id,
    );
  };

  const getUserLike = async (media_id: number, token: string) => {
    // Send a GET request to /likes/bymedia/user/:media_id to get the user's like on the media.
    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<Like>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/likes/bymedia/user/' + media_id,
      options,
    );
  };

  return {postLike, deleteLike, getCountByMediaId, getUserLike};
};

const useComment = () => {
  const {getUserById} = useUser();
  const postComment = async (
    comment_text: string,
    media_id: number,
    token: string,
  ) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({comment_text, media_id}),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/comments',
      options,
    );
  };

  const getCommentsByMediaId = async (media_id: number) => {
    const comments = await fetchData<Comment[]>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/comments/bymedia/' + media_id,
    );
    const commentsWithUsername = await Promise.all<
      Comment & {username: string}
    >(
      comments.map(async (comment) => {
        const user = await getUserById(comment.user_id);
        return {...comment, username: user.username};
      }),
    );
    return commentsWithUsername;
  };

  return {postComment, getCommentsByMediaId};
};

export {useMedia, useUser, useComment, useFile, useAuthentication, useLike};
