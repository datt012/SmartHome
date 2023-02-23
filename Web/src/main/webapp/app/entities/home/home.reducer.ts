import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IHome, defaultValue } from 'app/shared/model/home.model';

export const ACTION_TYPES = {
  FETCH_HOME_LIST: 'home/FETCH_HOME_LIST',
  FETCH_HOME: 'home/FETCH_HOME',
  CREATE_HOME: 'home/CREATE_HOME',
  UPDATE_HOME: 'home/UPDATE_HOME',
  PARTIAL_UPDATE_HOME: 'home/PARTIAL_UPDATE_HOME',
  DELETE_HOME: 'home/DELETE_HOME',
  RESET: 'home/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IHome>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type HomeState = Readonly<typeof initialState>;

// Reducer

export default (state: HomeState = initialState, action): HomeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_HOME_LIST):
    case REQUEST(ACTION_TYPES.FETCH_HOME):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_HOME):
    case REQUEST(ACTION_TYPES.UPDATE_HOME):
    case REQUEST(ACTION_TYPES.DELETE_HOME):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_HOME):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_HOME_LIST):
    case FAILURE(ACTION_TYPES.FETCH_HOME):
    case FAILURE(ACTION_TYPES.CREATE_HOME):
    case FAILURE(ACTION_TYPES.UPDATE_HOME):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_HOME):
    case FAILURE(ACTION_TYPES.DELETE_HOME):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_HOME_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_HOME):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_HOME):
    case SUCCESS(ACTION_TYPES.UPDATE_HOME):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_HOME):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_HOME):
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

const apiUrl = 'api/homes';

// Actions

export const getEntities: ICrudGetAllAction<IHome> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_HOME_LIST,
  payload: axios.get<IHome>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IHome> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_HOME,
    payload: axios.get<IHome>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IHome> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_HOME,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IHome> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_HOME,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IHome> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_HOME,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IHome> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_HOME,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
