import { ThemeProvider } from '@emotion/react';
import LoginView from '@views/LoginView/LoginView';
import MainView from '@views/MainView/MainView';
import { useEffect } from 'react';
import ControlPanel from './components/ControlPanel/ControlPanel';
import DotsBackground from './components/DotsBackground/DotsBackground';
import { theme } from './config/theme';
import { useJwtInterceptor } from './hooks/useJwtInterceptor';
import useLoggedIn from './hooks/useLoggedIn';
import './index.scss';
import { useAppSelector } from './store/hooks';

const View = () => {
  const loggedIn = useAppSelector((state) => state.user.loggedIn);

  if (loggedIn === null) return <></>;
  if (!loggedIn) return <LoginView />;

  return <MainView />;
};

const App = () => {
  useLoggedIn();
  useJwtInterceptor();

  return (
    <ThemeProvider theme={theme}>
      <DotsBackground />
      <View />
      <ControlPanel />
    </ThemeProvider>
  );
};

export default App;
