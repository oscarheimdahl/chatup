import { useAppSelector } from './store/hooks';
import LoginView from './views/LoginView';

const App = () => {
  const loggedIn = useAppSelector((state) => state.user.loggedIn);

  if (!loggedIn)
    return (
      <div>
        <LoginView></LoginView>
      </div>
    );
  return <div>Logged in</div>;
};

export default App;
