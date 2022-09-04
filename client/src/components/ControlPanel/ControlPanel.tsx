import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { logout } from '@src/store/slices/userSlice';
import Button from '../Button/Button';
import './control-panel.scss';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import Person from '@mui/icons-material/Person';
import { theme } from '@src/config/theme';

const ControlPanel = () => {
  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector((s) => s.user.loggedIn);
  const username = useAppSelector((s) => s.user.username);

  if (!loggedIn) return <></>;
  return (
    <div id='control-panel'>
      <div className='bg floating-window'>
        <section className='user'>
          <Person className='user-icon' />
          <b>{username}</b>
        </section>
        <Button onClick={() => dispatch(logout())}>Logout</Button>
        <KeyboardArrowDownSharpIcon className='indicator' />
      </div>
    </div>
  );
};

export default ControlPanel;
