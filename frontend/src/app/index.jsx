import { Provider } from 'react-redux';
import configureStore from 'misc/redux/configureStore';
import React from 'react';

import App from './containers/App';
import rootReducer from './reducers';

import Notification from './components/Notification';

const store = configureStore(rootReducer);
export default function Index() {
  return (
    <Provider store={store} >
      <Notification />
      <App />
    </Provider>
  );
}
