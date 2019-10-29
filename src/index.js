import createStore from './createStore';
import combineReducer from './combineReducer';

class Genji {
  constructor() {
    this._units = [];
    this._reducers = [];
    this._states = {};
  }

  unit(unit) {
    this._units.push(unit);
  }

  start() {
    // 注册所有的state与reducers
    for (let i = 0; i < this._units.length; i++) {
      this._states[this._units[i].namespace] = {
        ...this._units[i].state
      };
      Reflect.ownKeys(this._units[i].reducers).forEach((key) => {
        this._reducers.push(this._units[i].reducers[key]);
      });
    }
    const rootReducer = combineReducer(this._reducers);
    this._store = createStore(rootReducer, this._states);
  }
}

export default Genji;
