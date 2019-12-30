const numberUnit = {
  namespace: 'number',
  state: {
    num: 0,
    desc: 'number'
  },
  reducers: {
    add(state, { payload, type }) {
      console.log(`answer ${state.num + payload.addNum}`);
      return {
        num: state.num + payload.addNum
      };
    },
    getNum(state, action) {
      return {
        num: state.num
      };
    }
  },
  effects: {
    async addAsync(dispatch, getState, { save }) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 1000);
      })
        .then(response => {
          dispatch({
            // @todo 该位置的type只能取字符串
            type: 'number/add',
            payload: {
              addNum: 10
            }
          });
        })
        .catch(e => {
          console.log('fetch error:', e);
        });
    },
    async saveAsync(dispatch, getState, { save }) {
      return fetch('/mock')
        .then(response => response.json())
        .then(data => {
          save({ num: data.saveNum }, 'number', 'addAsync');
        })
        .catch(e => {
          console.log('fetch error:', e);
        });
    }
  }
};

const userUnit = {
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

export function registerUnit(genji) {
  const numberUnitTypes = genji.model(numberUnit);
  const userUnitTypes = genji.model(userUnit);
  return { numberUnit: numberUnitTypes, userUnit: userUnitTypes };
}
