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
    add(state, { payload }) {
      return {
        num: state.num + payload
      };
    }
  },
  effects: {
    async addEffect({ payload: value }, { dispatch }) {
      dispatch({
        type: 'count/add',
        payload: value
      });
    },
    async saveEffect({ payload: value }, { save }) {
      save({ num: value });
    },
    async saveAnotherState(action, { save }) {
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
  reducers: {
    setName(state, { payload }) {
      return {
        name: payload.name
      };
    }
  },
  effects: {
    async getNameAsync(action, { dispatch }) {
      return user.getUserName(4).then(data => {
        dispatch({
          type: 'user/setName',
          payload: {
            name: data
          }
        });
      });
    },

    async getPickedState(action, { pick }) {
      return pick('name');
    },

    async getAnotherPickedState(action, { pick }) {
      return pick('num', 'count');
    }
  }
};

test('reducers', () => {
  const app = new Genji();
  app.model(countModel);
  app.start();
  expect(app.getStore().getState().count.num).toEqual(0);
  app.getStore().dispatch({ type: 'count/add', payload: 1 });
  expect(app.getStore().getState().count.num).toEqual(1);
});

test('effects', () => {
  const app = new Genji();
  app.model(countModel);
  app.start();
  expect(app.getStore().getState().count.num).toEqual(0);
  app.getStore().dispatch({ type: 'count/addEffect', payload: 100 });
  expect(app.getStore().getState().count.num).toEqual(100);
});

test('async/await dispatch', async () => {
  const app = new Genji();
  app.model(userModel);
  app.start();
  expect(app.getStore().getState().user.name).toBe('unnamed');
  await app.getStore().dispatch({ type: 'user/getNameAsync' });
  expect(app.getStore().getState().user.name).toBe('huangruichang');
});

test('injectLoading', () => {
  const app = new Genji({ injectEffectLoading: true, autoUpdateEffectLoading: true });
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
  store.dispatch({ type: 'count/saveEffect', payload: 1000 });
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
});
