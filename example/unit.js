const numberUnit = {
  namespace: 'number',
  state: {
    num: 0,
    desc: 'number'
  },
  reducers: {
    add(state, { payload, type }) {
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
    async addAsync(dispatch, getState, { pick }) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 500);
      })
        .then(response => {
          const prevNum = pick('num');
          const otherName = pick('name', 'user');
          console.log(prevNum, otherName);
          dispatch({
            // @todo 该位置的type只能取字符串
            type: 'number/add',
            payload: {
              addNum: Math.floor(prevNum / 2),
              desc: otherName
            }
          });
        })
        .catch(e => {
          console.error('fetch error:', e);
        });
    },
    async saveAsync(dispatch, getState, { save }) {
      return fetch('/mock')
        .then(response => response.json())
        .then(data => {
          save({ num: data.saveNum });
        })
        .catch(e => {
          console.error('fetch error:', e);
        });
    }
  }
};

const userUnit = {
  namespace: 'user',
  state: {
    name: 'zhangsan'
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
  },

  effects: {
    async saveOther(dispatch, getState, { save, pick }) {
      console.log();
      return fetch('/mock')
        .then(response => response.json())
        .then(data => {
          save({ num: data.saveNum + pick('num', 'number') }, 'number');
          console.log(getState());
        })
        .catch(e => {
          console.error('fetch error:', e);
        });
    }
  }
};

export function registerUnit(genji) {
  const numberUnitTypes = genji.model(numberUnit);
  const userUnitTypes = genji.model(userUnit);
  return { numberUnit: numberUnitTypes, userUnit: userUnitTypes };
}
