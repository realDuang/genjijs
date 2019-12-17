import Genji from '../src/index';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './app';
import { registerUnit } from './unit.js';

export const genji = new Genji();
export const unitTypes = registerUnit(genji);
genji.start();
console.log(unitTypes);

const store = genji.getStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
