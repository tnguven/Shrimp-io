import { ShortUrl } from '@/state/types';
import { UrlListContext } from 'state/urlList.context';

export type UrlListStateActions =
  | { type: 'FETCH_URLS_REQUEST' }
  | { type: 'FETCH_URLS_SUCCESS'; payload: ShortUrl[] }
  | { type: 'SET_URLS'; payload: ShortUrl }
  | { type: 'FETCH_URLS_FAILED'; error: Error }
  | { type: 'DELETE_ALL_URL_REQUEST'; payload: 'all' }
  | { type: 'DELETE_ALL_URL_SUCCESS' }
  | { type: 'DELETE_ALL_URL_FAILED'; error: Error; payload: 'all' }
  | { type: 'DELETE_URL_REQUEST'; payload: string }
  | { type: 'DELETE_URL_SUCCESS'; payload: string }
  | { type: 'DELETE_URL_FAILED'; error: Error; payload: string };

export const actions = <const>{
  FETCH_URLS_REQUEST: 'FETCH_URLS_REQUEST',
  FETCH_URLS_SUCCESS: 'FETCH_URLS_SUCCESS',
  SET_URLS: 'SET_URLS',
  FETCH_URLS_FAILED: 'FETCH_URLS_FAILED',
  DELETE_ALL_URL_REQUEST: 'DELETE_ALL_URL_REQUEST',
  DELETE_ALL_URL_SUCCESS: 'DELETE_ALL_URL_SUCCESS',
  DELETE_ALL_URL_FAILED: 'DELETE_ALL_URL_FAILED',
  DELETE_URL_REQUEST: 'DELETE_URL_REQUEST',
  DELETE_URL_SUCCESS: 'DELETE_URL_SUCCESS',
  DELETE_URL_FAILED: 'DELETE_URL_FAILED',
};

const filterDeletedId = (deletedId: string) => (id: string) => deletedId !== id;

const mergeByFilter = (payload: ShortUrl, state: ShortUrl[]) => {
  const indexOfExistingUrl = state.findIndex(({ id }) => id === payload.id);
  if (indexOfExistingUrl === -1) {
    return [payload, ...state];
  } else {
    return [payload, ...state.filter((_, i) => i !== indexOfExistingUrl)];
  }
};

export const reducer = (state: UrlListContext, action: UrlListStateActions) => {
  switch (action.type) {
    case actions.FETCH_URLS_REQUEST:
      return { ...state, loading: true };

    case actions.FETCH_URLS_SUCCESS:
      return { ...state, data: [...action.payload, ...state.data], loading: false };

    case actions.FETCH_URLS_FAILED:
      return { ...state, error: action.error, loading: false };

    case actions.SET_URLS:
      return {
        ...state,
        data: mergeByFilter(action.payload, state.data),
        loading: false,
      };

    case actions.DELETE_ALL_URL_REQUEST:
    case actions.DELETE_URL_REQUEST:
      return { ...state, deleting: [action.payload, ...state.deleting] };

    case actions.DELETE_URL_SUCCESS:
      return {
        ...state,
        data: state.data.filter(({ id }) => id !== action.payload),
        deleting: state.deleting.filter(filterDeletedId(action.payload)),
      };

    case actions.DELETE_ALL_URL_FAILED:
    case actions.DELETE_URL_FAILED:
      return {
        ...state,
        deleting: state.deleting.filter(filterDeletedId(action.payload)),
        error: action.error,
      };

    case actions.DELETE_ALL_URL_SUCCESS:
      return { ...state, data: [], deleting: [] };

    default:
      return state;
  }
};
