const addModel = {
  namespace: "number",
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
  }
};

const userModel = {
  namespace: "user",
  state: {
    name: ""
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
import Genji from "./src/index";
const app = new Genji();
const addModelTypes = app.unit(addModel);
const userModelTypes = app.unit(userModel);

app.start();

const store = app.getStore();
store.dispatch({
  type: addModelTypes.add,
  payload: {
    addNum: 3
  }
});

store.dispatch({
  type: addModelTypes.add,
  payload: {
    addNum: 5
  }
});

store.dispatch({
  type: addModelTypes.getNum,
  payload: {}
});

store.dispatch({
  type: userModelTypes.modify,
  payload: {
    name: "synccheng"
  }
});

// console.log(app);
console.log(store.getState());
console.log(store);
