import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

function reduceReducers(...reducers) {
  return (previous, current) => reducers.reduce((p, r) => r(p, current), previous);
}

class Genji {
  constructor() {
    this._units = [];
    this._states = {};
    this._reducers = {};
    this._effects = [];
  }

  unit(unit) {
    this._units.push(unit);
    const types = {};
    Object.keys(unit.reducers).map(key => (types[key] = `${unit.namespace}/${key}`));
    Object.keys(unit.effects || {}).map(key => (types[key] = `*${unit.namespace}/${key}`));
    return types;
  }

  start() {
    // 注册state
    for (let i = 0; i < this._units.length; i++) {
      const currentUnit = this._units[i];
      this._states[currentUnit.namespace] = {
        ...currentUnit.state
      };
    }

    // 注册reducers
    const initialState = this._states;
    for (let i = 0; i < this._units.length; i++) {
      const currentUnit = this._units[i];
      const tmpReducers = [];
      Reflect.ownKeys(currentUnit.reducers).map(key => {
        //@todo reducers 重复提示
        //@todo reducer 和 effect 不能重名
        const oldReducer = currentUnit.reducers[key];
        const newReducer = (state = initialState, action) => {
          if (action.type !== `${currentUnit.namespace}/${key}`) return state;
          return { ...state, ...oldReducer(state, action) };
        };
        tmpReducers.push(newReducer);
      });
      const finalReducers = reduceReducers(...tmpReducers);
      this._reducers[currentUnit.namespace] = finalReducers;
    }
    const rootReducer = combineReducers(this._reducers);
    this._store = createStore(rootReducer, initialState, applyMiddleware(thunk));

    //注册effects
    for (let i = 0; i < this._units.length; i++) {
      const currentUnit = this._units[i];
      if (!currentUnit.effects) break;
      Reflect.ownKeys(currentUnit.effects).map(key => {
        //@todo effects 重复提示
        //@todo reducer 和 effect 不能重名
        this._effects.push({
          type: `*${currentUnit.namespace}/${key}`,
          actionCreator: currentUnit.effects[key]
        });
      });
    }

    //劫持 store
    const store = this._store;
    let oldDispatch = store.dispatch;
    store.dispatch = action => {
      //@todo
      // console.log("proxy dispatch");
      let foundedEffect;
      this._effects.map(effect => {
        if (effect.type === action.type) {
          foundedEffect = effect;
        }
      });
      if (foundedEffect) {
        return oldDispatch(foundedEffect.actionCreator);
      }
      oldDispatch(action);
      return Promise.resolve();
    };
  }

  getStore() {
    return this._store;
  }

  replaceModel() {
    //@todo
  }

  uninstall() {
    //@todo
  }
}

export default Genji;
