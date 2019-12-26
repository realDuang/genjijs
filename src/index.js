import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

function reduceReducers(...reducers) {
  return (previous, current) => reducers.reduce((p, r) => r(p, current), previous);
}

const getLoadingKey = effectType => {
  return `${effectType}Loading`;
};

const getTypeTokensFromEffectType = effectType => {
  return effectType.split('/');
};

class Genji {
  constructor(config = {}) {
    this._models = [];
    this._states = {};
    this._reducers = {};
    this._effects = [];
    this.config = config;
  }

  model(model) {
    this._models.push(model);
    const types = {};
    Object.keys(model.reducers).map(key => (types[key] = `${model.namespace}/${key}`));
    Object.keys(model.effects || {}).map(key => (types[key] = `${model.namespace}/${key}`));
    return types;
  }

  start() {
    // 注册state
    for (let i = 0; i < this._models.length; i++) {
      const currentmodel = this._models[i];
      this._states[currentmodel.namespace] = {
        ...currentmodel.state
      };
    }

    // 注册reducers
    const initialState = this._states;
    for (let i = 0; i < this._models.length; i++) {
      const currentmodel = this._models[i];
      const tmpReducers = [];
      Reflect.ownKeys(currentmodel.reducers).map(key => {
        //@todo reducers 重复提示
        //@todo reducer 和 effect 不能重名
        const oldReducer = currentmodel.reducers[key];
        const newReducer = (state = initialState[currentmodel.namespace], action) => {
          if (action.type !== `${currentmodel.namespace}/${key}`) return state;
          return oldReducer(state, action);
        };
        tmpReducers.push(newReducer);
      });

      // const currentmodel = this._models[i];
      if (currentmodel.effects) {
        Reflect.ownKeys(currentmodel.effects).map(key => {
          //@todo effects 重复提示
          //@todo reducer 和 effect 不能重名
          this._effects.push({
            type: `${currentmodel.namespace}/${key}`,
            actionCreator: currentmodel.effects[key]
          });
          const loadingKey = getLoadingKey(key);
          //初始化loading
          if (this.config.injectEffectLoading) {
            this._states[currentmodel.namespace][loadingKey] = false;
            tmpReducers.push((state = initialState[currentmodel.namespace], action) => {
              if (action.type !== `${currentmodel.namespace}/${loadingKey}`) return state;
              state[loadingKey] = action.payload[loadingKey];
              return { ...state };
            });
          }
        });
      }

      const finalReducers = reduceReducers(...tmpReducers);
      this._reducers[currentmodel.namespace] = finalReducers;
    }

    const rootReducer = combineReducers(this._reducers);
    this._store = createStore(rootReducer, initialState, applyMiddleware(thunk));

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
        if (!this.config.autoUpdateEffectLoading) {
          return oldDispatch(foundedEffect.actionCreator);
        }
        const tokens = getTypeTokensFromEffectType(foundedEffect.type);
        const effect = tokens[1];
        const loadingKey = getLoadingKey(effect);
        const updateLoadingAction = toggle => ({
          type: `${foundedEffect.type}Loading`,
          payload: {
            [loadingKey]: toggle
          }
        });
        oldDispatch(updateLoadingAction(true));
        return oldDispatch(foundedEffect.actionCreator).then(() => {
          oldDispatch(updateLoadingAction(false));
        });
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
