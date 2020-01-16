import Genji from '../../src/index';
import * as user from '../user';

jest.mock('../request');

const countModel = {
  namespace: 'count',
  state: {
    num: 0,
    name: ''
  },
  reducers: {
    addReducer(state, { payload }) {
      return {
        num: state.num + payload
      };
    }
  },
  actionCreators: {
    add({ payload }, { save, pick }) {
      const num = pick('num');
      save({ num: num + payload });
    },
    saveState({ payload: value }, { save }) {
      save({ num: value });
    },
    saveAnotherState(action, { save }) {
      save({ name: 'from count model' }, 'user');
    }
  }
};

const userModel = {
  namespace: 'user',
  state: {
    name: 'unnamed',
    num: -1
  },

  actionCreators: {
    async getNameAsync(action, { save }) {
      return user.getUserName(4).then(data => {
        save({ name: data });
      });
    },

    getPickedState(action, { pick }) {
      return pick('name');
    },

    getAnotherPickedState(action, { pick }) {
      return pick('num', 'count');
    },

    getAllPickedState(action, { pick }) {
      const { num } = pick();
      return num;
    },

    getArrayPickedState(action, { pick }) {
      const { num } = pick(['num', 'count']);
      return num;
    },

    getIllegalPickedState(action, { pick }) {
      const state = pick(123);
      return state;
    }
  }
};

test('reducers', () => {
  const app = new Genji();
  app.model(countModel);
  app.start();
  expect(app.getStore().getState().count.num).toEqual(0);
  app.getStore().dispatch({ type: 'count/addReducer', payload: 1 });
  expect(app.getStore().getState().count.num).toEqual(1);
});

test('non-async actionCreators', () => {
  const app = new Genji();
  app.model(countModel);
  app.start();
  expect(app.getStore().getState().count.num).toEqual(0);
  app.getStore().dispatch({ type: 'count/add', payload: 100 });
  expect(app.getStore().getState().count.num).toEqual(100);
});

test('async/await actionCreators', async () => {
  const app = new Genji();
  app.model(userModel);
  app.start();
  expect(app.getStore().getState().user.name).toBe('unnamed');
  await app.getStore().dispatch({ type: 'user/getNameAsync' });
  expect(app.getStore().getState().user.name).toBe('huangruichang');
});

test('injectLoading', () => {
  const app = new Genji({ injectAsyncLoading: true, autoUpdateAsyncLoading: true });
  app.model(userModel);
  app.start();
  expect(app.getStore().getState().user.getNameAsyncLoading).toBe(false);
  const promise = app.getStore().dispatch({ type: 'user/getNameAsync' });
  expect(app.getStore().getState().user.getNameAsyncLoading).toBe(true);
  promise.then(() => {
    expect(app.getStore().getState().user.getNameAsyncLoading).toBe(false);
  });
});

test('save functions', () => {
  const app = new Genji();
  app.model(countModel);
  app.model(userModel);
  app.start();
  const store = app.getStore();

  expect(store.getState().count.num).toEqual(0);
  expect(store.getState().user.num).toEqual(-1);
  store.dispatch({ type: 'count/saveState', payload: 1000 });
  expect(store.getState().count.num).toEqual(1000);
  expect(store.getState().user.num).toEqual(-1);

  expect(store.getState().count.name).toEqual('');
  expect(store.getState().user.name).toEqual('unnamed');
  store.dispatch({ type: 'count/saveAnotherState' });
  expect(store.getState().count.name).toEqual('');
  expect(store.getState().user.name).toEqual('from count model');
});

test('pick functions', () => {
  const app = new Genji();
  app.model(countModel);
  app.model(userModel);
  app.start();
  const store = app.getStore();

  expect(store.getState().count.name).toEqual('');
  expect(store.getState().user.name).toEqual('unnamed');
  store.dispatch({ type: 'user/getPickedState' }).then(res => expect(res).toEqual('unnamed'));

  expect(store.getState().count.num).toEqual(0);
  expect(store.getState().user.num).toEqual(-1);
  store.dispatch({ type: 'user/getAnotherPickedState' }).then(res => expect(res).toEqual(0));

  expect(store.getState().count.num).toEqual(0);
  expect(store.getState().user.num).toEqual(-1);
  store.dispatch({ type: 'user/getAllPickedState' }).then(res => expect(res).toEqual(-1));

  expect(store.getState().count.num).toEqual(0);
  expect(store.getState().user.num).toEqual(-1);
  store.dispatch({ type: 'user/getArrayPickedState' }).then(res => expect(res).toEqual(-1));

  store.dispatch({ type: 'user/getIllegalPickedState' }).then(res => expect(res).toEqual(undefined));
});
