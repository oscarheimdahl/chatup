import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import store from './store/store';
import App from './app';

const container = document.getElementById('root');
const root = createRoot(container);

export const host = 'http://localhost:3000/';

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
