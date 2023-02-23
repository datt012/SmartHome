import axios from 'axios';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IRoom, defaultValue } from 'app/shared/model/room.model';

export const ACTION_TYPES = {
  FETCH_ROOM_LIST: 'room/FETCH_ROOM_LIST',
  FETCH_ROOM: 'room/FETCH_ROOM',
  CREATE_ROOM: 'room/CREATE_ROOM',
  UPDATE_ROOM: 'room/UPDATE_ROOM',
  PARTIAL_UPDATE_ROOM: 'room/PARTIAL_UPDATE_ROOM',
  DELETE_ROOM: 'room/DELETE_ROOM',
  RESET: 'room/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IRoom>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type RoomState = Readonly<typeof initialState>;

// Reducer

export default (state: RoomState = initialState, action): RoomState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_ROOM_LIST):
    case REQUEST(ACTION_TYPES.FETCH_ROOM):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_ROOM):
    case REQUEST(ACTION_TYPES.UPDATE_ROOM):
    case REQUEST(ACTION_TYPES.DELETE_ROOM):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_ROOM):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_ROOM_LIST):
    case FAILURE(ACTION_TYPES.FETCH_ROOM):
    case FAILURE(ACTION_TYPES.CREATE_ROOM):
    case FAILURE(ACTION_TYPES.UPDATE_ROOM):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_ROOM):
    case FAILURE(ACTION_TYPES.DELETE_ROOM):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_ROOM_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_ROOM):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_ROOM):
    case SUCCESS(ACTION_TYPES.UPDATE_ROOM):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_ROOM):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_ROOM):
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

const apiUrl = 'api/rooms';

// Actions

export const getEntities = (page?: number, size?: number, sort?: string, homeId?: string) => ({
  type: ACTION_TYPES.FETCH_ROOM_LIST,
  payload: axios.get<IRoom>(`${apiUrl}?homeId=${homeId}`),
});

export const getEntity = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_ROOM,
    payload: axios.get<IRoom>(requestUrl),
  };
};

export const createEntity = (entity, homeId?: string) => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_ROOM,
    payload: axios.post(`${apiUrl}?homeId=${homeId}`, cleanEntity(entity)),
  });
  dispatch(getEntities(undefined, undefined, undefined, homeId));
  return result;
};

export const updateEntity = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_ROOM,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_ROOM,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity = (id: string, homeId?: string) => async dispatch => {
  const requestUrl = `${apiUrl}/${id}?homeId=${homeId}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_ROOM,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities(undefined, undefined, undefined, homeId));
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
