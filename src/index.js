import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

const ERROR_PREFIX = 'GENJI says:';

function reduceReducers(reducers) {
  if (
    Object.prototype.toString.call(reducers) !== '[object Array]' &&
    Object.prototype.toString.call(reducers) !== '[object Object]'
  )
    throw Error(`${ERROR_PREFIX} Can not reduce this type of reducers`);
  if (Object.prototype.toString.call(reducers) === '[object Object]') {
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
    this._actionCreatorObjs = [];
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
    Object.keys(model.actionCreators || {}).map(key => (types[key] = `${model.namespace}/${key}`));
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
      const tmpReducers = {
        // 为每个 model 默认注入 '$$save' reducer
        $$save: createReducer(curModel.namespace)
      };

      const reducerExist = key => {
        if (!curModel.reducers) return false;
        return Reflect.ownKeys(curModel.reducers).some(reducerKey => reducerKey === key);
      };
      const actionCreatorsExist = key => {
        if (!curModel.actionCreators) return false;
        return Reflect.ownKeys(curModel.actionCreators).some(actionCreatorsKey => actionCreatorsKey === key);
      };

      if (curModel.reducers) {
        Reflect.ownKeys(curModel.reducers).map(reducerName => {
          const reducerNameFounded = actionCreatorsExist(reducerName);
          if (reducerNameFounded) {
            throw new Error(`${ERROR_PREFIX} function name ${`"${reducerName}"`} are both in reducer & actionCreator.`);
          }
          const oldReducer = curModel.reducers[reducerName];
          const newReducer = (state = rootState[curModel.namespace], action) => {
            if (action.type !== `${curModel.namespace}/${reducerName}`) return state;
            return { ...state, ...oldReducer(state, action) };
          };
          tmpReducers[reducerName] = newReducer;
        });
      }

      if (curModel.actionCreators) {
        Reflect.ownKeys(curModel.actionCreators).map(actionCreatorName => {
          const actionCreatorNameFounded = reducerExist(actionCreatorName);
          if (actionCreatorNameFounded) {
            throw new Error(
              `${ERROR_PREFIX} function name ${`"${actionCreatorName}"`} are both in reducer & actionCreator.`
            );
          }
          _genji._actionCreatorObjs.push({
            type: `${curModel.namespace}/${actionCreatorName}`,
            actionCreator: curModel.actionCreators[actionCreatorName]
          });
          // 注入操作 loading 的 reducer
          if (this.config.injectAsyncLoading) {
            const loadingKey = `${actionCreatorName}Loading`;
            rootState[curModel.namespace][loadingKey] = false;
            const newReducer = (state = rootState[curModel.namespace], action) => {
              if (action.type !== `${curModel.namespace}/$$${actionCreatorName}Loading`) return state;
              state[loadingKey] = action.payload[loadingKey];
              return { ...state };
            };
            tmpReducers[actionCreatorName] = newReducer;
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

    // actionCreator附加特性
    const actionCreatorFeatures = {
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
        if (!stateKey) {
          return rootState[curNamespace];
        } else if (typeof stateKey === 'string') {
          return rootState[curNamespace][stateKey];
        } else if (Array.isArray(stateKey)) {
          const res = {};
          stateKey.forEach(key => {
            if (typeof key === 'string') {
              res[key] = rootState[curNamespace][key];
            }
          });
          return res;
        } else {
          return undefined;
        }
      }
    };

    const middlewares = [thunk.withExtraArgument(actionCreatorFeatures)];
    const enhancers = [];

    const rootReducer = combineReducers(_genji._reducers);
    _genji._store = createStore(rootReducer, rootState, compose(applyMiddleware(...middlewares), ...enhancers));

    //劫持 dispatch
    const oldDispatch = _genji._store.dispatch;
    const newDispatch = action => {
      let foundedActionCreatorObj;
      _genji._actionCreatorObjs.map(actionCreatorObj => {
        if (actionCreatorObj.type === action.type) {
          foundedActionCreatorObj = actionCreatorObj;
        }
      });
      if (!foundedActionCreatorObj) {
        oldDispatch(action);
        return Promise.resolve();
      }
      const genjiActionCreator = foundedActionCreatorObj.actionCreator;

      // 劫持actionCreator附加特性
      const { namespace, funcName } = getTypeTokensFromActionType(action.type);
      const thunkActionCreator = async (dispatch, getState, { save, pick }) => {
        const newSave = currying(save, namespace, funcName);
        const newPick = currying(pick, namespace, funcName);
        return genjiActionCreator(action, { getState, save: newSave, pick: newPick });
      };

      // 注入更新loading操作
      if (!_genji.config.autoUpdateAsyncLoading) {
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
