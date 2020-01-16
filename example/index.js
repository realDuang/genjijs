import Genji from '../src/index';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './app';
import { registerUnit } from './unit.js';

export const genji = new Genji({ injectAsyncLoading: true, autoUpdateAsyncLoading: true });
export const unitTypes = registerUnit(genji);
genji.start();

const store = genji.getStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
