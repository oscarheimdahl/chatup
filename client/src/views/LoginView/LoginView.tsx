import Button from '@src/components/Button/Button';
import DotsBackground from '@src/components/DotsBackground/DotsBackground';
import Input from '@src/components/Input/Input';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { login, resetLoginInfo } from '@store/slices/userSlice';
import { FormEvent, useMemo, useState } from 'react';
import './login-view.scss';

const LoginView = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const handleShowRegister = () => {
    setShowLogin(false);
    setTimeout(() => setShowRegister(true), 700);
  };

  const handleShowLogin = () => {
    setShowRegister(false);
    setTimeout(() => setShowLogin(true), 700);
  };

  return (
    <div id='login-view'>
      <LoginForm show={showLogin} showRegister={handleShowRegister}></LoginForm>
      <RegisterForm show={showRegister} showLogin={handleShowLogin}></RegisterForm>
    </div>
  );
};

const LoginForm = ({ show, showRegister }: { show: boolean; showRegister: () => void }) => {
  const [username, setUsername] = useState('oscar');
  const [password, setPassword] = useState('heimdahl');
  const [missingFields, setMissingFields] = useState(false);

  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) return setMissingFields(true);
    dispatch(login({ username, password }));
  };

  let errorText = '';
  const badCredentials = useAppSelector((s) => s.user.login.forbidden);
  if (missingFields && !username) errorText = 'Please enter a username.';
  if (missingFields && !password) errorText = 'Please enter a password.';
  if (missingFields && !password && !username) errorText = 'Please enter a username and password.';
  if (badCredentials) errorText = 'Wrong username or password.';

  const randomDisplacementStyle = useMemo(() => getRandomDisplacement(show), [show]);

  return (
    <div style={randomDisplacementStyle} id='login-form-container'>
      <form name='login' onSubmit={handleSubmit} autoComplete='off' spellCheck='false'>
        <p className='form-info'></p>
        <Input
          indicated={badCredentials || (!username && missingFields)}
          value={username}
          name='username'
          label='Username'
          onChange={(e) => {
            if (badCredentials) dispatch(resetLoginInfo());
            if (missingFields) setMissingFields(false);
            setUsername(e.target.value);
          }}
        ></Input>
        <Input
          indicated={badCredentials || (!password && missingFields)}
          value={password}
          name='password'
          label='Password'
          type='password'
          onChange={(e) => {
            if (badCredentials) dispatch(resetLoginInfo());
            if (missingFields) setMissingFields(false);
            setPassword(e.target.value);
          }}
        ></Input>
        <ErrorText>{errorText}</ErrorText>
        <section>
          <Button>Login</Button>
          <Button type='button' onClick={showRegister} underline className='register-button'>
            Register
          </Button>
        </section>
      </form>
    </div>
  );
};

const getRandomDisplacement = (show: boolean) => {
  if (show) return { transform: 'translateX(0) translateY(0) ' };
  const randomDirection = Math.floor(Math.random() * 4);
  switch (randomDirection) {
    case 0:
      return {
        transform: 'translateX(100vw) translateY(0)',
        // transitionTimingFunction: 'cubic-bezier(0.56, 1.08, 0, 1.29)',
      };
    case 1:
      return {
        transform: 'translateX(-100vw) translateY(0)',
        // transitionTimingFunction: 'cubic-bezier(0.56, 1.08, 0, 1.29)',
      };
    case 2:
      return {
        transform: 'translateX(0) translateY(100vh)',
        // transitionTimingFunction: 'cubic-bezier(0.56, 1.08, 0, 1.29)',
      };
    case 3:
      return {
        transform: 'translateX(0) translateY(-100vh)',
        // transitionTimingFunction: 'cubic-bezier(0.56, 1.08, 0, 1.29)',
      };
  }
};

interface ErrorTextProps {
  children: string;
}

const ErrorText = ({ children }: ErrorTextProps) => {
  return (
    <p className={children ? 'show' : ''} id='error-text'>
      {children}
    </p>
  );
};

const RegisterForm = ({ show, showLogin }: { show: boolean; showLogin: () => void }) => {
  const [username, setUsername] = useState('oscar');
  const [password, setPassword] = useState('heimdahl');
  const [missingFields, setMissingFields] = useState(false);

  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) return setMissingFields(true);
    dispatch(login({ username, password }));
  };

  let errorText = '';
  const badCredentials = useAppSelector((s) => s.user.login.forbidden);
  if (missingFields && !username) errorText = 'Please enter a username.';
  if (missingFields && !password) errorText = 'Please enter a password.';
  if (missingFields && !password && !username) errorText = 'Please enter a username and password.';
  if (badCredentials) errorText = 'Wrong username or password.';

  const randomDisplacementStyle = useMemo(() => getRandomDisplacement(show), [show]);

  return (
    <div style={randomDisplacementStyle} id='login-form-container'>
      <form name='login' onSubmit={handleSubmit} autoComplete='off' spellCheck='false'>
        <p className='form-info'></p>
        <Input
          indicated={badCredentials || (!username && missingFields)}
          value={username}
          name='username'
          label='Username'
          onChange={(e) => {
            if (badCredentials) dispatch(resetLoginInfo());
            if (missingFields) setMissingFields(false);
            setUsername(e.target.value);
          }}
        ></Input>
        <Input
          indicated={badCredentials || (!password && missingFields)}
          value={password}
          name='password'
          label='Password'
          type='password'
          onChange={(e) => {
            if (badCredentials) dispatch(resetLoginInfo());
            if (missingFields) setMissingFields(false);
            setPassword(e.target.value);
          }}
        ></Input>
        <ErrorText>{errorText}</ErrorText>
        <section>
          <Button>Login</Button>
          <Button type='button' onClick={showLogin} underline className='register-button'>
            Register
          </Button>
        </section>
      </form>
    </div>
  );
};

export default LoginView;
