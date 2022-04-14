import { FormEvent, useState } from 'react';
import { useAppDispatch } from '@store/hooks';
import { login, register } from '@store/slices/userSlice';
import DotsBackground from '@src/components/DotsBackground';
import './login-view.scss';
import Input from '@src/components/Input/Input';
import Button from '@src/components/Button/Button';

const LoginView = () => {
  const [username, setUsername] = useState('oscar');
  const [password, setPassword] = useState('heimdahl');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <>
      <DotsBackground />
      {/* <Register></Register> */}
      <div id='login-view'>
        <form name='login' onSubmit={handleSubmit}>
          <Input value={username} id='username' label='Username' onChange={(e) => setUsername(e.target.value)}></Input>
          <Input value={password} id='password' label='Password' onChange={(e) => setPassword(e.target.value)}></Input>
          {/* <input value='Login' type='submit'></input> */}
          <Button>Login</Button>
        </form>
      </div>
    </>
  );
};

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(register({ username, password }));
  };

  return (
    <div>
      <form name='login' onSubmit={handleSubmit}>
        <label htmlFor='username'>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type='text'
          name='username'
          id='register-username'
        />
        <label htmlFor='username'>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          name='password'
          id='register-password'
        />
        <input value='Register' type='submit'></input>
      </form>
    </div>
  );
};

export default LoginView;
