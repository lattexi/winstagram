import {useState} from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Button} from '@rneui/base';
import {useUserContext} from '../hooks/ContextHooks';
import {ScrollView} from 'react-native';

const Login = () => {
  const [displayRegister, setDisplayRegister] = useState(false);
  const {handleAutoLogin} = useUserContext();

  const toggleRegister = () => {
    setDisplayRegister(!displayRegister);
  };

  handleAutoLogin();

  return (
    <>
      <ScrollView>
        {displayRegister ? (
          <RegisterForm setDisplayRegister={setDisplayRegister} />
        ) : (
          <LoginForm />
        )}
        <Button onPress={toggleRegister}>
          or {displayRegister ? 'login' : 'register'}?
        </Button>
      </ScrollView>
    </>
  );
};

export default Login;
