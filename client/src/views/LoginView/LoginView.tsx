import Button from '@src/components/Button/Button';
import DotsBackground from '@src/components/DotsBackground/DotsBackground';
import Input from '@src/components/Input/Input';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { login, register, resetLoginError, resetRegisterError } from '@store/slices/userSlice';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import './login-view.scss';

interface User {
  username: string;
  password: string;
}

const LoginView = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<User>();

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleShowLogin = (registeredUser?: User) => {
    setShowRegister(false);
    setRegisteredUser(registeredUser);
  };

  return (
    <div id='login-view'>
      <h1 className='login-title'>{showRegister ? 'Register' : 'Login'}</h1>
      <div id='form-bg' className='floating-window'>
        <LoginForm
          registeredUser={registeredUser}
          className={showRegister ? 'scoot' : ''}
          showRegister={handleShowRegister}
        ></LoginForm>
        <RegisterForm className={showRegister ? 'scoot' : ''} showLogin={handleShowLogin}></RegisterForm>
      </div>
    </div>
  );
};

const LoginForm = ({
  registeredUser,
  showRegister,
  className,
}: {
  registeredUser: User | undefined;
  showRegister: () => void;
  className: string;
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [missingFields, setMissingFields] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!registeredUser?.password && !registeredUser?.username) return;
    const { username, password } = registeredUser;
    if (username) setUsername(username);
    if (password) setPassword(password);
    usernameInputRef.current?.focus();
  }, [registeredUser]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) return setMissingFields(true);
    dispatch(login({ username, password }));
  };

  let errorText = '';
  const badCredentials = useAppSelector((s) => s.user.loginError.forbidden);
  const serverUnreachable = useAppSelector((s) => s.user.loginError.serverUnreachable);
  if (missingFields && !username) errorText = 'Please enter a username.';
  if (missingFields && !password) errorText = 'Please enter a password.';
  if (missingFields && !password && !username) errorText = 'Please enter a username and password.';
  if (badCredentials) errorText = 'Wrong username or password.';
  if (serverUnreachable) errorText = 'Server error';

  return (
    <form
      id='login-form-container'
      name='login'
      onSubmit={handleSubmit}
      autoComplete='off'
      spellCheck='false'
      className={className + ' form-container'}
    >
      <section className='col-section'>
        <Input
          reference={usernameInputRef}
          indicated={badCredentials || (!username && missingFields)}
          value={username}
          name='username'
          label='Username'
          onChange={(e) => {
            if (badCredentials) dispatch(resetLoginError());
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
            if (badCredentials) dispatch(resetLoginError());
            if (missingFields) setMissingFields(false);
            setPassword(e.target.value);
          }}
        ></Input>
      </section>
      <ErrorText>{errorText}</ErrorText>
      <section className='buttons'>
        <Button>Login</Button>
        <Button type='button' onClick={showRegister} underline>
          Register
        </Button>
      </section>
    </form>
  );
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

const RegisterForm = ({ showLogin, className }: { showLogin: (user?: User) => void; className: string }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [errorText, setErrorText] = useState('');
  const [movingToLogin, setMovingToLogin] = useState(false);

  const dispatch = useAppDispatch();

  const usernameTaken = useAppSelector((s) => s.user.registerInfo.usernameTaken);
  useEffect(() => {
    if (usernameTaken) setErrorText('Username taken, sorry.');
  }, [usernameTaken]);

  const success = useAppSelector((s) => s.user.registerInfo.success);
  useEffect(() => {
    if (!success) return;
    setErrorText('Successful registration!');
    setMovingToLogin(true);
    const showLoginTimeout = setTimeout(() => {
      showLogin({ username, password });
      resetRegister();
    }, 2000);
    return () => clearTimeout(showLoginTimeout);
  }, [success]);

  const resetRegister = () => {
    setUsername('');
    setPassword('');
    setPassword2('');
    setErrorText('');
    dispatch(resetRegisterError());
  };

  const usernameMinLength = 5;
  const passwordMinLength = 8;
  const usernameTooShort = username.length < usernameMinLength;
  const passwordTooShort = password.length < passwordMinLength;

  const passwordMismatch = password !== password2;
  // prettier-ignore
  const checkError = () => {
    let err = '';
    if (passwordTooShort)                       err = `Password must be atleast ${passwordMinLength} characters.`;
    if (usernameTooShort)                       err = `Username must be atleast ${usernameMinLength} characters.`;
    if (usernameTooShort && passwordTooShort)   err = `Username and password too short.`;
    if (passwordMismatch)                       err = 'Passwords dont match.';
    if (!username)                              err = 'Please enter a username.';
    if (!password && !password2)                err = 'Please enter a password.';
    if ((!password || !password2) && !username) err = 'Please enter a username and password.';
    if (err) setErrorText(err);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (movingToLogin) return;
    checkError();
    if (errorText) return;
    dispatch(register({ username, password }));
  };

  const usernameInput = () => (
    <Input
      indicated={!!errorText && (!username || usernameTooShort)}
      placeholder='Atleast 5 characters'
      value={username}
      name='username'
      label='Username'
      onChange={(e) => {
        if (errorText) {
          dispatch(resetRegisterError());
          setErrorText('');
        }
        setUsername(e.target.value.trim());
      }}
    ></Input>
  );

  const passwordInput1 = () => (
    <Input
      indicated={!!errorText && (!password || passwordMismatch || passwordTooShort)}
      value={password}
      name='password'
      label='Password (x2)'
      type='password'
      placeholder='Atleast 8 characters'
      onChange={(e) => {
        if (errorText) {
          dispatch(resetRegisterError());
          setErrorText('');
        }
        setPassword(e.target.value);
      }}
    ></Input>
  );

  const passwordInput2 = () => (
    <Input
      indicated={!!errorText && (!password2 || passwordMismatch || passwordTooShort)}
      value={password2}
      name='password'
      type='password'
      placeholder='Atleast 8 characters'
      onChange={(e) => {
        if (errorText) {
          dispatch(resetRegisterError());
          setErrorText('');
        }
        setPassword2(e.target.value);
      }}
    ></Input>
  );

  return (
    <form
      id='register-form-container'
      className={className + ' form-container'}
      name='register'
      onSubmit={handleSubmit}
      autoComplete='off'
      spellCheck='false'
    >
      <section className='col-section'>
        {usernameInput()}
        {passwordInput1()}
        {passwordInput2()}
      </section>
      <ErrorText>{errorText}</ErrorText>
      <section className='buttons'>
        <Button className='register-button'>Register</Button>
        <Button type='button' onClick={showLogin} underline>
          Back
        </Button>
      </section>
    </form>
  );
};

export default LoginView;
