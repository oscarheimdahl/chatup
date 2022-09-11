import { ThemeProvider } from '@emotion/react';
import LoginView from '@views/LoginView/LoginView';
import MainView from '@views/MainView/MainView';
import { useEffect } from 'react';
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
  useLoggedIn();
  useJwtInterceptor();

  const loggedIn = useAppSelector((state) => state.user.loggedIn);

  if (loggedIn === null) return <></>;
  if (!loggedIn) return <LoginView />;

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
