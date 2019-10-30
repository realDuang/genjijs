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
import Genji from '../src/index';
const app = new Genji();
const addModelTypes = app.unit(addModel);
const userModelTypes = app.unit(userModel);

app.start();

const store = app.getStore();

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
