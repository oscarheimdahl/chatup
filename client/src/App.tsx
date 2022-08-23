import LoginView from '@views/LoginView/LoginView';
import MainView from '@views/MainView/MainView';
import DotsBackground from './components/DotsBackground/DotsBackground';
import useLoggedIn from './hooks/useLoggedIn';
import './index.scss';
import { useAppSelector } from './store/hooks';

const View = () => {
  const loggedIn = useAppSelector((state) => state.user.loggedIn);

  console.log(loggedIn);
  if (loggedIn === null) return <></>;
  if (!loggedIn) return <LoginView />;

  return <MainView />;
};

const App = () => {
  useLoggedIn();

  return (
    <>
      <DotsBackground />
      <View />
    </>
  );
};

export default App;
