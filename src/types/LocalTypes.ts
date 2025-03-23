import {Video} from 'expo-av';
import {
  MediaItemWithOwner,
  User,
  UserWithNoPassword,
} from 'hybrid-types/DBTypes';
import {cssInterop} from 'nativewind';

export type Credentials = Pick<User, 'username' | 'password'>;
export type RegisterCredentials = Pick<User, 'username' | 'password' | 'email'>;

export type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
};

export type NavigatorType = {
  // Tab navigator screens
  'All Media': undefined;
  'My Profile': undefined;
  Upload: undefined;

  // Stack navigator screens
  Tabs: undefined;
  Single: {item: MediaItemWithOwner};
  'My Files': undefined;
  'My media app - login': undefined;
  Modal: {item: MediaItemWithOwner};
  Modify: {item: MediaItemWithOwner};
};

export const StyledVideo = cssInterop(Video, {
  className: 'style',
});
