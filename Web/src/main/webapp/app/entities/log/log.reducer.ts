import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ILog, defaultValue } from 'app/shared/model/log.model';

export const ACTION_TYPES = {
  FETCH_LOG_LIST: 'log/FETCH_LOG_LIST',
  FETCH_LOG: 'log/FETCH_LOG',
  CREATE_LOG: 'log/CREATE_LOG',
  UPDATE_LOG: 'log/UPDATE_LOG',
  PARTIAL_UPDATE_LOG: 'log/PARTIAL_UPDATE_LOG',
  DELETE_LOG: 'log/DELETE_LOG',
  RESET: 'log/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ILog>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type LogState = Readonly<typeof initialState>;

// Reducer

export default (state: LogState = initialState, action): LogState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_LOG_LIST):
    case REQUEST(ACTION_TYPES.FETCH_LOG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_LOG):
    case REQUEST(ACTION_TYPES.UPDATE_LOG):
    case REQUEST(ACTION_TYPES.DELETE_LOG):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_LOG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_LOG_LIST):
    case FAILURE(ACTION_TYPES.FETCH_LOG):
    case FAILURE(ACTION_TYPES.CREATE_LOG):
    case FAILURE(ACTION_TYPES.UPDATE_LOG):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_LOG):
    case FAILURE(ACTION_TYPES.DELETE_LOG):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_LOG_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_LOG):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_LOG):
    case SUCCESS(ACTION_TYPES.UPDATE_LOG):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_LOG):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_LOG):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/logs';

// Actions

export const getEntities: ICrudGetAllAction<ILog> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_LOG_LIST,
  payload: axios.get<ILog>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<ILog> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_LOG,
    payload: axios.get<ILog>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ILog> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_LOG,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ILog> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_LOG,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<ILog> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_LOG,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ILog> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_LOG,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
