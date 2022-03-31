import { Dispatch } from 'react';
import { AxiosError } from 'axios';
import { fetch } from '@/core/fetcher';
import { ShortUrl } from '@/state/types';
import { UrlListStateActions, actions } from './urlList.reducer';

export function makeGetShortUrls(dispatch: Dispatch<UrlListStateActions>) {
  return async function getShortUrls({ limit, lastId }: { limit: number; lastId?: string }) {
    dispatch({ type: actions.FETCH_URLS_REQUEST });
    try {
      const {
        data: { shortUrls },
      } = await fetch.get<{ shortUrls: ShortUrl[] }>(
        `/v1/shorten?limit=${limit}${lastId ? `&${lastId}` : ''}`
      );
      dispatch({ type: actions.FETCH_URLS_SUCCESS, payload: shortUrls });
    } catch (err) {
      const { response } = err as AxiosError<{ error: string }>;
      const message = response?.data?.error || 'something went wrong!';
      dispatch({ type: actions.FETCH_URLS_FAILED, error: new Error(message) });
    }
  };
}

export function makeDeleteUrl(dispatch: Dispatch<UrlListStateActions>) {
  return async function deleteUrl(id: string) {
    dispatch({ type: actions.DELETE_URL_REQUEST, payload: id });
    try {
      await fetch.delete<{ message: string }>(`/v1/shorten`, { data: { id } });
      dispatch({ type: actions.DELETE_URL_SUCCESS, payload: id });
    } catch (err) {
      const { response } = err as AxiosError<{ error: string }>;
      const message = response?.data?.error || 'something went wrong!';
      dispatch({ type: actions.DELETE_URL_FAILED, error: new Error(message), payload: id });
    }
  };
}

export function makeDeleteAllUrls(dispatch: Dispatch<UrlListStateActions>) {
  return async function deleteAllUrls() {
    dispatch({ type: actions.DELETE_ALL_URL_REQUEST, payload: 'all' });
    try {
      await fetch.delete<{ message: string }>(`/v1/shorten`, { data: { cleanAll: true } });
      dispatch({ type: actions.DELETE_ALL_URL_SUCCESS });
    } catch (err) {
      const { response } = err as AxiosError<{ error: string }>;
      const message = response?.data?.error || 'something went wrong!';
      dispatch({ type: actions.DELETE_ALL_URL_FAILED, error: new Error(message), payload: 'all' });
    }
  };
}
