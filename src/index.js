import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

function reduceReducers(reducers) {
  if (!reducers instanceof Object || !reducers instanceof Array) throw Error('Can not reduce this type of reducers');
  if (reducers instanceof Object) {
    reducers = Object.values(reducers);
  }
  return (previous, current) => reducers.reduce((p, r) => r(p, current), previous);
}

const getLoadingKey = effectType => {
  return `${effectType}Loading`;
};

const getTypeTokensFromEffectType = effectType => {
  return effectType.split('/');
};

const ERROR_PREFIX = 'GENJI says:';

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
    const _genji = this;
    const rootState = this._states;

    const reducersTree = {};

    // 注册state
    for (let i = 0; i < _genji._models.length; i++) {
      const curModel = _genji._models[i];
      rootState[curModel.namespace] = {
        ...curModel.state
      };
    }

    // 注册reducers
    for (let i = 0; i < _genji._models.length; i++) {
      const curModel = _genji._models[i];
      const tmpReducers = {};
      const reducerExist = key => {
        if (!curModel.reducers) return false;
        return Reflect.ownKeys(curModel.reducers).filter(reducerKey => reducerKey === key).length > 0;
      };
      const effectExist = key => {
        if (!curModel.effects) return false;
        return Reflect.ownKeys(curModel.effects).filter(effectKey => effectKey === key).length > 0;
      };
      Reflect.ownKeys(curModel.reducers).map(key => {
        const reducerFounded = effectExist(key);
        if (reducerFounded) {
          throw new Error(`${ERROR_PREFIX} reducer ${`"${key}"`} conflict with effect ${`"${key}"`}`);
        }
        const oldReducer = curModel.reducers[key];
        const newReducer = (state = rootState[curModel.namespace], action) => {
          if (action.type !== `${curModel.namespace}/${key}`) return state;
          return { ...state, ...oldReducer(state, action) };
        };
        tmpReducers[key] = newReducer;
      });

      if (curModel.effects) {
        Reflect.ownKeys(curModel.effects).map(key => {
          const effectFounded = reducerExist(key);
          if (effectFounded) {
            throw new Error(`${ERROR_PREFIX} reducer ${key} conflict with effect ${key}`);
          }
          _genji._effects.push({
            type: `${curModel.namespace}/${key}`,
            actionCreator: curModel.effects[key]
          });
          const loadingKey = getLoadingKey(key);
          //初始化loading
          if (this.config.injectEffectLoading) {
            rootState[curModel.namespace][loadingKey] = false;
            const newReducer = (state = rootState[curModel.namespace], action) => {
              if (action.type !== `${curModel.namespace}/${loadingKey}`) return state;
              state[loadingKey] = action.payload[loadingKey];
              return { ...state };
            };
            tmpReducers[key] = newReducer;
          }
        });
      }
      reducersTree[curModel.namespace] = tmpReducers;

      const finalReducers = reduceReducers(tmpReducers);
      _genji._reducers[curModel.namespace] = finalReducers;
    }

    // 异步注入ruducer
    const injectReducer = ({ type, reducer }) => {
      const [namespace, reducerName] = getTypeTokensFromEffectType(type);
      const subReducersTree = reducersTree[namespace];
      if (!subReducersTree || subReducersTree.hasOwnProperty(reducerName)) return;
      subReducersTree[reducerName] = reducer;
      _genji._reducers[namespace] = reduceReducers(subReducersTree);
      _genji._store.replaceReducer(combineReducers(_genji._reducers));
    };

    const createReducer = namespace => (state = rootState[namespace], action) => {
      if (!action) return state;
      return {
        ...state,
        ...action.payload
      };
    };

    // effect附加特性
    const effectFeatures = {
      // @todo
      // namespace, funcName参数应该可以不传入
      save: function(updateState, namespace, funcName) {
        const type = `${namespace}/${funcName}Save`;
        injectReducer({ type, reducer: createReducer(namespace) });
        _genji._store.dispatch({ type, payload: updateState });
      }
    };

    const middlewares = [thunk.withExtraArgument(effectFeatures)];
    const enhancers = [];

    const rootReducer = combineReducers(_genji._reducers);
    _genji._store = createStore(rootReducer, rootState, compose(applyMiddleware(...middlewares), ...enhancers));

    //劫持 dispatch
    const oldDispatch = _genji._store.dispatch;
    _genji._store.dispatch = action => {
      let foundedEffect;
      _genji._effects.map(effect => {
        if (effect.type === action.type) {
          foundedEffect = effect;
        }
      });
      if (!foundedEffect) {
        oldDispatch(action);
        return Promise.resolve();
      }
      if (!_genji.config.autoUpdateEffectLoading) {
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
      return oldDispatch(foundedEffect.actionCreator).then(res => {
        oldDispatch(updateLoadingAction(false));
        return Promise.resolve();
      });
    };
  }

  getStore() {
    return this._store;
  }
}

export default Genji;
