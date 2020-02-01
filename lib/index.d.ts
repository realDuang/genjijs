export declare type Indexable<T extends {}> = {
  [key: string]: T;
};

export interface GenjiAction {
  type: string;
  payload: Object;
}

export interface GenjiOperations {
  dispatch?: Function;
  getState?: Function;
  pick: GenjiPick;
  save: GenjiSave;
}

export declare type GenjiSave = (updateState: Object, assignNamespace?: string) => void;
export declare type GenjiPick = (stateKey?: string[] | string, assignNamespace?: string) => unknown;

export declare type GenjiDispatch = (action: { type: string; payload?: Object }) => Promise<unknown>;
export declare type GenjiActionCreator = (action: GenjiAction, operations: GenjiOperations) => unknown;
export declare type GenjiActionCreatorObj = {
  type: string;
  actionCreator: GenjiActionCreator;
};
export declare type GenjiReducer = (state: unknown, action: GenjiAction) => {};
export interface GenjiActionCreators {
  [key: string]: GenjiActionCreator;
}
export interface GenjiCommonReducers {
  [key: string]: Function;
}
export interface GenjiModel {
  namespace: string;
  state: {
    [key: string]: unknown;
  };
  actionCreators: GenjiActionCreators;
  reducers?: GenjiCommonReducers;
}
export interface States {
  [key: string]: unknown;
}
export interface GenjiConfig {
  injectAsyncLoading?: boolean;
  autoUpdateAsyncLoading?: boolean;
}
declare class Genji {
  _models: GenjiModel[];
  _store: Object;
  _states: States;
  _reducers: GenjiCommonReducers;
  _actionCreatorObjs: GenjiActionCreatorObj[];
  config: GenjiConfig;
  _reducersTree: {
    [key: string]: GenjiReducer;
  };
  constructor(config?: {});
  model<T>(model: GenjiModel): { [key in keyof T]?: string };
  start(): void;
  getStore(): Object;
}
export default Genji;
