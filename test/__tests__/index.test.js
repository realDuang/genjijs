import Genji from '../../src/index';
import * as user from '../user';

jest.mock('../request');

const countModel = {
  namespace: 'count',
  state: {
    num: 0
  },
  reducers: {
    add(state, { payload }) {
      return {
        num: state.num + payload.addNum
      };
    }
  },
  effects: {
    add100(dispatch) {
      dispatch({
        type: 'count/add',
        payload: {
          addNum: 100
        }
      });
    },
    save1000(dispatch, getState, { save }) {
      save({ num: 1000 })
    }
  }
};

const userModel = {
  namespace: 'user',
  state: {
    name: 'unnamed'
  },
  reducers: {
    setName(state, { payload }) {
      return {
        name: payload.name
      };
    }
  },
  effects: {
    async getNameAsync(dispatch) {
      return user.getUserName(4).then(data => {
        dispatch({
          type: 'user/setName',
          payload: {
            name: data
          }
        });
      });
    }
  }
};

test('reducers', () => {
  const app = new Genji();
  app.model(countModel);
  app.start();
  expect(app.getStore().getState().count.num).toEqual(0);
  app.getStore().dispatch({ type: 'count/add', payload: { addNum: 1 } });
  expect(app.getStore().getState().count.num).toEqual(1);
});

test('effects', () => {
  const app = new Genji();
  app.model(countModel);
  app.start();
  expect(app.getStore().getState().count.num).toEqual(0);
  app.getStore().dispatch({ type: 'count/add100' });
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

test('internal functions', () => {
  const app = new Genji();
  app.model(countModel);
  app.start();
  expect(app.getStore().getState().count.num).toEqual(0);
  app.getStore().dispatch({ type: 'count/save1000' });
  expect(app.getStore().getState().count.num).toEqual(1000);
});
