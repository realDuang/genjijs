import Genji from '../src/index';
import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';

const addModel = {
  namespace: 'number',
  state: {
    num: 0
  },
  reducers: {
    add(state, { payload, type }) {
      console.log(`answer ${state.num + payload.addNum}`);
      return {
        num: state.num + payload.addNum
      };
    },
    getNum(state, action) {
      console.log(`getNum ${state.num}`);
      return {
        num: state.num
      };
    }
  },
  effects: {
    async addAsync(dispatch) {
      return fetch('/test')
        .then(response => {
          dispatch({
            type: addModelTypes.add,
            payload: {
              addNum: 10
            }
          });
          return response.json();
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getNumAsync() {}
  }
};

const userModel = {
  namespace: 'user',
  state: {
    name: ''
  },
  reducers: {
    modify(state, { payload }) {
      if (!payload) return state;
      const { name } = payload;
      console.log(`change name ${name}`);
      return {
        name
      };
    }
  }
};

const app = new Genji();
const addModelTypes = app.unit(addModel);
const userModelTypes = app.unit(userModel);

app.start();

const store = app.getStore();

const App = connect(
  state => state,
  dispatch => {
    return {
      add: () => {
        dispatch({
          type: addModelTypes.add,
          payload: {
            addNum: 1
          }
        });
      }
    };
  }
)(props => {
  return <div onClick={props.add}>{props.number.num}</div>;
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

store.dispatch({
  type: addModelTypes.add,
  payload: {
    addNum: 1
  }
});

store.dispatch({
  type: addModelTypes.add,
  payload: {
    addNum: 1
  }
});

store.dispatch({
  type: userModelTypes.modify,
  payload: {
    name: 'synccheng'
  }
});

(async () => {
  const result = await store.dispatch({
    type: addModelTypes.addAsync
  });
  console.log(result);
  console.log(store.getState());
})();
