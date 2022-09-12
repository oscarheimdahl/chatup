import { ThemeProvider } from '@emotion/react';
import LoginView from '@views/LoginView/LoginView';
import MainView from '@views/MainView/MainView';
import { useEffect, useState } from 'react';
import { Route, Router, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import ControlPanel from './components/ControlPanel/ControlPanel';
import DotsBackground from './components/DotsBackground/DotsBackground';
import { theme } from './config/theme';
import { useJwtInterceptor } from './hooks/useJwtInterceptor';
import useLoggedIn from './hooks/useLoggedIn';
import './index.scss';
import { useAppSelector } from './store/hooks';
import ChatroomView from './views/ChatroomView/ChatroomView';

const View = () => {
  const [showMainView, setShowMainView] = useState(false);
  const [loginTransition, setLoginTransition] = useState(false);
  useLoggedIn();
  useJwtInterceptor();

  const loggedIn = useAppSelector((state) => state.user.loggedIn);

  useEffect(() => {
    if (loggedIn) {
      if (localStorage.getItem('show-login-transition')) {
        setLoginTransition(true);
        setTimeout(() => setShowMainView(true), 1000);
      } else {
        setShowMainView(true);
      }
    } else {
      setLoginTransition(false);
      setShowMainView(false);
    }
  }, [loggedIn]);

  if (loggedIn === null) return <></>;
  if (!showMainView) return <LoginView loginTransition={loginTransition} />;

  return (
    <Routes>
      <Route path='/' element={<MainView />} />
      <Route path='/room' element={<ChatroomView />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <DotsBackground />
        <ControlPanel />
        <View />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
