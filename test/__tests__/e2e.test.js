import { render, fireEvent, cleanup } from '@testing-library/react';
import { connect, Provider } from 'react-redux';
import Genji from '../../src';
import React, { useEffect } from 'react';

afterEach(cleanup);

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

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
    async addAsync(dispatch) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }).then(() => {
        dispatch({
          type: 'count/add',
          payload: {
            addNum: 10
          }
        });
      });
    }
  }
};

test('connect', async () => {
  const app = new Genji();
  app.model(countModel);
  app.start();

  const mapStateToProps = rootState => {
    return { ...rootState };
  };

  const mapDispatchToProps = dispatch => {
    return {
      dispatch,
      add: () => {
        dispatch({
          type: 'count/add',
          payload: {
            addNum: 1
          }
        });
      },
      addAsync: () => {
        dispatch({
          type: 'count/addAsync',
          payload: {
            addNum: 10
          }
        });
      }
    };
  };

  const App = connect(
    mapStateToProps,
    mapDispatchToProps
  )(props => {
    return (
      <div>
        <div
          onClick={() => {
            props.addAsync();
          }}
        >
          add
        </div>
        <div data-testid="count">{props.count.num}</div>
      </div>
    );
  });

  const store = app.getStore();
  const { getByTestId, getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  fireEvent.click(getByText('add'));
  await delay(2000);
  expect(getByTestId('count').innerHTML).toEqual('10');
});
