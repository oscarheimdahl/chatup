import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import Person from '@mui/icons-material/Person';
import { socket } from '@src/App';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { logout } from '@src/store/slices/userSlice';
import { useNavigate } from 'react-router';
import Button from '../Button/Button';
import './control-panel.scss';

const ControlPanel = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loggedIn = useAppSelector((s) => s.user.loggedIn);
  const username = useAppSelector((s) => s.user.username);

  const handleLogout = () => {
    dispatch(logout());
    socket.disconnect();
    navigate({ pathname: '/' });
  };

  if (!loggedIn) return <></>;
  return (
    <div id='control-panel'>
      <div className='bg floating-window'>
        <section className='user'>
          <Person className='user-icon' />
          <b>{username}</b>
        </section>
        <Button onClick={handleLogout}>Logout</Button>
        <KeyboardArrowDownSharpIcon className='indicator' />
      </div>
    </div>
  );
};

export default ControlPanel;
