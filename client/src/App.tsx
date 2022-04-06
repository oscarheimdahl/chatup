import { increment } from './store/counterSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';

const App = () => {
  //@ts-ignore
  const count = useAppSelector((state) => state.counter.value);
  return (
    <div>
      {count}
      <br />
      <br />
      <br />
      <br />
      <BigButton></BigButton>
    </div>
  );
};

const BigButton = () => {
  const dispatch = useAppDispatch();
  return (
    <div>
      <h1>asdssd</h1>
      <br />
      <button
        onClick={() => {
          console.log('Increment');
          dispatch(increment());
        }}
      >
        Increment
      </button>
    </div>
  );
};

export default App;
