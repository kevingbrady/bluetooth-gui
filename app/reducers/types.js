import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type deviceStateType = {
  +devices: object
};

export type connectionStateType = {
  +connections: object
};

export type rawDataStateType = {
  +raw_data: object
};

export type Action = {
  +type: string
};

export type GetState = () => counterStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
