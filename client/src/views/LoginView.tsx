import { isFulfilled } from '@reduxjs/toolkit';
import { FormEvent, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/userSlice';
import { register } from '../store/userSlice';

const LoginView = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <>
      <Register></Register>
      <div>
        <form name='login' onSubmit={handleSubmit}>
          <label htmlFor='username'>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type='text'
            name='username'
            id='username'
          />
          <label htmlFor='username'>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            name='password'
            id='password'
          />
          <input value='Login' type='submit'></input>
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
    const res = await dispatch(register({ username, password }));
    if (isFulfilled()(res)) {
      // do stuff
    }
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
          id='username'
        />
        <label htmlFor='username'>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          name='password'
          id='password'
        />
        <input value='Register' type='submit'></input>
      </form>
    </div>
  );
};

export default LoginView;
