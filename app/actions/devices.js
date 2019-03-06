// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const FETCH_DEVICES = 'FETCH_DEVICES';
export const DELETE_DEVICES = 'DELETE_DEVICES';

export const FETCH_CONNECTIONS = 'FETCH_CONNECTIONS';
export const DELETE_CONNECTIONS = 'DELETE_CONNECTIONS';

export const FETCH_RAW_DATA = 'FETCH_RAW_DATA';
export const DELETE_RAW_DATA = 'DELETE_RAW_DATA';

export const PUSH_TABLE_DATA = 'PUSH_TABLE_DATA';
export const ROW_SELECTION = 'ROW_SELECTION';



export function getDevices(){
  return { type: FETCH_DEVICES }
};

export function deleteDevices(){
  return {type: DELETE_DEVICES }
};

export function getConnections(){
  return { type: FETCH_CONNECTIONS }
};

export function deleteConnections(){
  return {type: DELETE_CONNECTIONS }
}

export function getRawData(){
  return { type: FETCH_RAW_DATA }
};

export function deleteRawData(){
    return {type: DELETE_RAW_DATA }
};

export function setRowSelection(value){
  return {type: ROW_SELECTION, value: value}
}
