import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

const ERROR_PREFIX = 'GENJI says:';

function reduceReducers(reducers) {
  if (!(reducers instanceof Object || Array)) throw Error(`${ERROR_PREFIX} Can not reduce this type of reducers`);
  if (reducers instanceof Object) {
    reducers = Object.values(reducers);
  }
  return (previous, current) => reducers.reduce((p, r) => r(p, current), previous);
}

function getTypeTokensFromActionType(actionType) {
  const [namespace, funcName] = actionType.split('/');
  return {
    namespace,
    funcName
  };
}

function currying(fn, ...outerArgs) {
  return function(...innerArgs) {
    return fn.apply(this, [...outerArgs, ...innerArgs]);
  };
}

class Genji {
  constructor(config = {}) {
    this._models = [];
    this._store = {};
    this._states = {};
    this._reducers = {};
    this._effects = [];
    this.config = config;
    this._reducersTree = {};
  }

  model(model) {
    if (!model.namespace) {
      throw new Error(`${ERROR_PREFIX} namespace should be defined`);
    }
    if (this._models.find(m => m.namespace === model.namespace)) {
      throw new Error(`${ERROR_PREFIX} namespace "${model.namespace}" should be unique`);
    }
    this._models.push(model);

    const types = {};
    Object.keys(model.reducers || {}).map(key => (types[key] = `${model.namespace}/${key}`));
    Object.keys(model.effects || {}).map(key => (types[key] = `${model.namespace}/${key}`));
    return types;
  }

  start() {
    const _genji = this;
    const rootState = this._states;

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
      tmpReducers['$$save'] = createReducer(curModel.namespace);

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
          //初始化loading
          if (this.config.injectEffectLoading) {
            const loadingKey = `${key}Loading`;
            rootState[curModel.namespace][loadingKey] = false;
            const newReducer = (state = rootState[curModel.namespace], action) => {
              if (action.type !== `${curModel.namespace}/$$${key}Loading`) return state;
              state[loadingKey] = action.payload[loadingKey];
              return { ...state };
            };
            tmpReducers[key] = newReducer;
          }
        });
      }
      _genji._reducersTree[curModel.namespace] = tmpReducers;

      const finalReducers = reduceReducers(tmpReducers);
      _genji._reducers[curModel.namespace] = finalReducers;
    }

    // 创建新的reducer
    function createReducer(namespace) {
      return function(state = rootState[namespace], action) {
        if (!action) return state;
        const { namespace: actionNamespace } = getTypeTokensFromActionType(action.type);
        if (namespace !== actionNamespace) return state;

        return {
          ...state,
          ...action.payload
        };
      };
    }

    // effects附加特性
    const effectFeatures = {
      save: function(namespace, funcName, updateState, assignNamespace) {
        let curNamespace = namespace;
        if (assignNamespace && typeof assignNamespace === 'string') {
          const curModel = _genji._models.find(model => model.namespace === assignNamespace);
          if (!curModel) {
            throw new Error(
              `${ERROR_PREFIX} ${funcName} ERROR: namespace '${assignNamespace}' assigning in 'save' function is not exist`
            );
          }
          if (curModel.namespace === curNamespace) {
            console.warn(
              `${ERROR_PREFIX} ${funcName} WARNING: namespace '${assignNamespace}' assigning in 'save' function is unnecessary`
            );
          }
          curNamespace = assignNamespace;
        }
        const type = `${curNamespace}/$$save`;
        _genji._store.dispatch({ type, payload: updateState });
      },

      pick: function(namespace, funcName, stateKey, assignNamespace) {
        let curNamespace = namespace;
        if (assignNamespace && typeof assignNamespace === 'string') {
          const curModel = _genji._models.find(model => model.namespace === assignNamespace);
          if (!curModel) {
            throw new Error(
              `${ERROR_PREFIX} ${funcName} ERROR: namespace '${assignNamespace}' assigning in 'pick' function is not exist`
            );
          }
          if (curModel.namespace === curNamespace) {
            console.warn(
              `${ERROR_PREFIX} ${funcName} WARNING: namespace '${assignNamespace}' assigning in 'pick' function is unnecessary`
            );
          }
          curNamespace = assignNamespace;
        }
        const rootState = _genji.getStore().getState();
        return rootState[curNamespace][stateKey];
      }
    };

    const middlewares = [thunk.withExtraArgument(effectFeatures)];
    const enhancers = [];

    const rootReducer = combineReducers(_genji._reducers);
    _genji._store = createStore(rootReducer, rootState, compose(applyMiddleware(...middlewares), ...enhancers));

    //劫持 dispatch
    const oldDispatch = _genji._store.dispatch;
    const newDispatch = action => {
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
      const genjiActionCreator = foundedEffect.actionCreator;

      // 劫持effects附加特性
      const { namespace, funcName } = getTypeTokensFromActionType(action.type);
      const thunkActionCreator = async (dispatch, getState, { save, pick }) => {
        const newSave = currying(save, namespace, funcName);
        const newPick = currying(pick, namespace, funcName);
        return genjiActionCreator(action, { dispatch, getState, save: newSave, pick: newPick });
      };

      // 注入更新loading操作
      if (!_genji.config.autoUpdateEffectLoading) {
        return oldDispatch(thunkActionCreator);
      }
      const loadingKey = `${funcName}Loading`;
      const updateLoadingAction = toggle => ({
        type: `${namespace}/$$${funcName}Loading`,
        payload: {
          [loadingKey]: toggle
        }
      });
      oldDispatch(updateLoadingAction(true));
      return oldDispatch(thunkActionCreator).then(() => {
        oldDispatch(updateLoadingAction(false));
        return Promise.resolve();
      });
    };
    _genji._store.dispatch = newDispatch;
  }

  getStore() {
    return this._store;
  }
}

export default Genji;
