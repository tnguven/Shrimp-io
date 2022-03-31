import { Dispatch } from 'react';
import { AxiosError } from 'axios';
import { fetch } from '@/core/fetcher';
import { ShortUrl } from '@/state/types';
import { SubmitFormStateActions, actions } from './submitForm.reducer';

export function makeSubmitUrl(dispatch: Dispatch<SubmitFormStateActions>) {
  return async function submitUrl(url: string) {
    dispatch({ type: actions.SUBMIT_URL_REQUEST });
    try {
      const {
        data: { shortUrl },
      } = await fetch.post<{ shortUrl: ShortUrl }>(`/v1/shorten`, { url });
      dispatch({ type: actions.SUBMIT_URL_SUCCESS, payload: shortUrl });
      return shortUrl;
    } catch (err) {
      const { response } = err as AxiosError<{ error: string }>;
      const message = response?.data?.error || 'Something went wrong. Try again!';
      dispatch({ type: actions.SUBMIT_URL_FAILED, error: new Error(message) });
    }
  };
}
