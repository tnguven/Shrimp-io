import { ShortUrl } from '@/state/types';
import { SubmitFormContext } from 'state/submitForm.context';

export type SubmitFormStateActions =
  | { type: 'CREATE_NEW_URL' }
  | { type: 'SUBMIT_URL_REQUEST' }
  | { type: 'SUBMIT_URL_SUCCESS'; payload: ShortUrl }
  | { type: 'SUBMIT_URL_FAILED'; error: Error }
  | { type: 'RESET_SUBMIT_ERROR' };

export const actions = <const>{
  CREATE_NEW_URL: 'CREATE_NEW_URL',
  SUBMIT_URL_REQUEST: 'SUBMIT_URL_REQUEST',
  SUBMIT_URL_SUCCESS: 'SUBMIT_URL_SUCCESS',
  SUBMIT_URL_FAILED: 'SUBMIT_URL_FAILED',
  RESET_SUBMIT_ERROR: 'RESET_SUBMIT_ERROR',
};

export const reducer = (state: SubmitFormContext, action: SubmitFormStateActions) => {
  switch (action.type) {
    case actions.CREATE_NEW_URL:
      return { loading: false, data: undefined, error: undefined };

    case actions.SUBMIT_URL_REQUEST:
      return { ...state, loading: true };

    case actions.SUBMIT_URL_SUCCESS:
      return { ...state, data: action.payload, loading: false, error: undefined };

    case actions.SUBMIT_URL_FAILED:
      return { ...state, loading: false, error: action.error };

    case actions.RESET_SUBMIT_ERROR:
      return { ...state, loading: false, error: undefined };

    default:
      return state;
  }
};
