export declare type Indexable<T extends {}> = T & {
    [key: string]: any;
};
export interface GenjiAction {
    type: string;
    payload: any;
}
export interface GenjiOperations {
    dispatch?: Function;
    getState?: Function;
    pick: Function;
    save: Function;
}
export declare type GenjiDispatch = ({}: {
    type: string;
    payload?: any;
}) => Promise<any>;
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
    state: unknown;
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
    _store: any;
    _states: States;
    _reducers: GenjiCommonReducers;
    _actionCreatorObjs: GenjiActionCreatorObj[];
    config: GenjiConfig;
    _reducersTree: {
        [key: string]: GenjiReducer;
    };
    constructor(config?: {});
    model<T>(model: GenjiModel): { [key in keyof T]?: string; };
    start(): void;
    getStore(): any;
}
export default Genji;
