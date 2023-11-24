import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { DataProvider } from './auth/data-provider.ctx';
import { store } from './redux/store';

// style
import './index.css';
// comp
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
