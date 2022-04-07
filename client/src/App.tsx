import { useAppSelector } from './store/hooks';
import LoginView from './views/LoginView';

const App = () => {
  const user = useAppSelector((state) => state.user);

  if (!user.loggedIn)
    return (
      <div>
        <LoginView></LoginView>
      </div>
    );
  return <div></div>;
};

export default App;
