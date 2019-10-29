const addModel = {
  namespace: 'add',
  state: {
    num: 0
  },
  reducers: {
    add(state, { payload }) {
      console.log(`answer ${state.num + payload.addNum}`);
      return {
        num: state.num + payload.addNum
      };
    },
    getNum(state, action) {
      console.log(`getNum ${state.num}`);
      return {
        num
      };
    }
  }
};

const userModel = {
  namespace: 'user',
  state: {
    name: ''
  },
  reducers: {
    modify(state, { payload }) {
      const { name } = payload;
      console.log(`change name ${name}`);
      return {
        name
      };
    }
  }
};

import Genji from '../src/index';
const app = new Genji();
app.unit(addModel);
app.unit(userModel);

app.start();
app._store.dispatch({
  type: 'addModel/add',
  payload: {
    addNum: 1
  }
});

app._store.dispatch({
  type: 'user/modify',
  payload: {
    name: 'synccheng'
  }
});

console.log(app);
