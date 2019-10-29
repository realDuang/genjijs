import { createStore } from "./createStore";
import { combineReducers as combineReducer } from "./combineReducer";

function reduceReducers(...reducers) {
  return (previous, current) =>
    reducers.reduce((p, r) => r(p, current), previous);
}

class Genji {
  constructor() {
    this._units = [];
    this._states = {};
    this._reducers = {};
  }

  unit(unit) {
    this._units.push(unit);
    const types = {};
    Object.keys(unit.reducers).map(
      key => (types[key] = `${unit.namespace}/${key}`)
    );
    return types;
  }

  start() {
    // 注册所有的state与reducers
    for (let i = 0; i < this._units.length; i++) {
      const currentUnit = this._units[i];
      this._states[currentUnit.namespace] = {
        ...currentUnit.state
      };
    }
    const initialState = this._states;
    for (let i = 0; i < this._units.length; i++) {
      const currentUnit = this._units[i];
      const tmpReducers = [];
      Reflect.ownKeys(currentUnit.reducers).map(key => {
        const oldReducer = currentUnit.reducers[key];
        const newReducer = (state = initialState, action) => {
          if (action.type !== `${currentUnit.namespace}/${key}`) return state;
          return oldReducer(state, action);
        };
        tmpReducers.push(newReducer);
      });
      const finalReducers = reduceReducers(...tmpReducers);
      this._reducers[currentUnit.namespace] = finalReducers;
    }

    const rootReducer = combineReducer(this._reducers);
    this._store = createStore(rootReducer, initialState);
    //劫持 store
    const store = this._store;
    let oldDispatch = store.dispatch;
    store.dispatch = action => {
      //@todo
      // console.log("proxy dispatch");
      oldDispatch(action);
    };
  }

  getStore() {
    return this._store;
  }
}

export default Genji;
