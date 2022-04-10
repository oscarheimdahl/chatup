import { useAppSelector } from './store/hooks';
import LoginView from '@views/LoginView/LoginView';
import MainView from '@views/MainView/MainView';
import './index.scss';

const App = () => {
  const loggedIn = useAppSelector((state) => state.user.loggedIn);

  if (!loggedIn) return <LoginView />;
  return <MainView />;
};

export default App;
