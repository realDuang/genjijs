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
      return { ...state, num: state.num + payload.addNum };
    },
    getNum(state, action) {
      console.log(`getNum ${state.num}`);
      return { ...state, num: state.num };
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
    name: 'richirhuang'
  },
  reducers: {
    modify(state, { payload }) {
      if (!payload) return state;
      const { name } = payload;
      console.log(`change name ${name}`);
      return { ...state, name };
    }
  }
};

const app = new Genji({ injectEffectLoading: true, autoUpdateEffectLoading: true });
const addModelTypes = app.model(addModel);
const userModelTypes = app.model(userModel);

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
      },
      addAsync: () => {
        dispatch({
          type: addModelTypes.addAsync,
          payload: {
            addNum: 10
          }
        });
      },
      modifyName: () => {
        dispatch({
          type: userModelTypes.modify,
          payload: {
            name: 'synccheng'
          }
        });
      }
    };
  }
)(props => {
  return (
    <div>
      <div onClick={props.add}>action test:{props.number.num}(click me)</div>
      <div onClick={props.addAsync}>effect test:{props.number.num}(click me)</div>
      <div onClick={props.modifyName}>name:{props.user.name}(click me)</div>
    </div>
  );
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

store.subscribe(() => {
  console.log(JSON.stringify(store.getState()));
});
