import { reducer, actions } from './urlList.reducer';
import { initialUrlListState } from './urlList.context';

describe('submitForm reducer', () => {
  let state = { ...initialUrlListState };
  const dummyUrl = {
    url: 'https://test.com',
    id: 'testID',
    shortUrl: 'https://pbid.io/f3x2ab1c',
    urlCode: 'f3x2ab1c',
    createdAt: new Date(),
    expireAt: new Date(),
    clicks: 0,
  };
  const dummyUrl2 = {
    url: 'https://test.com/2',
    id: 'testID2',
    shortUrl: 'https://pbid.io/f3x2ab1b',
    urlCode: 'f3x2ab1b',
    createdAt: new Date(),
    expireAt: new Date(),
    clicks: 0,
  };

  beforeEach(() => {
    state = { ...initialUrlListState };
  });

  describe('happy path', () => {
    it('should fetch and set the state with response data after FETCH_URLS_REQUEST', () => {
      const requestingState = reducer(state, { type: actions.FETCH_URLS_REQUEST });
      expect(requestingState).toEqual({ loading: true, deleting: [], data: [], error: undefined });
      const successState = reducer(requestingState, {
        type: actions.FETCH_URLS_SUCCESS,
        payload: [dummyUrl],
      });
      expect(successState).toEqual({
        loading: false,
        deleting: [],
        data: [dummyUrl],
        error: undefined,
      });
      expect(
        reducer(successState, {
          type: actions.SET_URLS,
          payload: dummyUrl2,
        })
      ).toEqual({
        loading: false,
        deleting: [],
        data: [dummyUrl2, dummyUrl],
        error: undefined,
      });
    });

    it('should delete single url from state after DELETE_URL_REQUEST', () => {
      const deleteRequestState = reducer(
        { ...state, data: [dummyUrl2, dummyUrl], deleting: ['testID2'] },
        {
          type: actions.DELETE_URL_REQUEST,
          payload: 'testID',
        }
      );
      expect(deleteRequestState).toEqual({
        loading: false,
        deleting: ['testID', 'testID2'],
        data: [dummyUrl2, dummyUrl],
        error: undefined,
      });
      expect(
        reducer(deleteRequestState, {
          type: actions.DELETE_URL_SUCCESS,
          payload: 'testID',
        })
      ).toEqual({
        loading: false,
        deleting: ['testID2'],
        data: [dummyUrl2],
        error: undefined,
      });
    });

    it('should clear all url from state DELETE_ALL_URL_REQUEST', () => {
      const deleteRequestState = reducer(
        { ...state, data: [dummyUrl2, dummyUrl] },
        {
          type: actions.DELETE_ALL_URL_REQUEST,
          payload: 'all',
        }
      );
      expect(deleteRequestState).toEqual({
        loading: false,
        deleting: ['all'],
        data: [dummyUrl2, dummyUrl],
        error: undefined,
      });
      expect(
        reducer(deleteRequestState, {
          type: actions.DELETE_ALL_URL_SUCCESS,
        })
      ).toEqual({
        loading: false,
        deleting: [],
        data: [],
        error: undefined,
      });
    });
  });

  describe('unhappy path', () => {
    it('should update state with error after FETCH_URLS_FAILED', () => {
      const requestingState = reducer(state, { type: actions.FETCH_URLS_REQUEST });
      expect(requestingState).toEqual({ loading: true, deleting: [], data: [], error: undefined });
      expect(
        reducer(requestingState, {
          type: actions.FETCH_URLS_FAILED,
          error: new Error('something went wrong'),
        })
      ).toEqual({
        loading: false,
        deleting: [],
        data: [],
        error: new Error('something went wrong'),
      });
    });

    it('should update state with error after DELETE_URL_FAILED', () => {
      const deleteRequestState = reducer(
        { ...state, data: [dummyUrl2, dummyUrl], deleting: ['testID2'] },
        {
          type: actions.DELETE_URL_REQUEST,
          payload: 'testID',
        }
      );
      expect(deleteRequestState).toEqual({
        loading: false,
        deleting: ['testID', 'testID2'],
        data: [dummyUrl2, dummyUrl],
        error: undefined,
      });
      expect(
        reducer(deleteRequestState, {
          type: actions.DELETE_URL_FAILED,
          payload: 'testID',
          error: new Error('something went wrong'),
        })
      ).toEqual({
        loading: false,
        deleting: ['testID2'],
        data: [dummyUrl2, dummyUrl],
        error: new Error('something went wrong'),
      });
    });

    it('should update state with error after DELETE_ALL_URL_FAILED', () => {
      const deleteRequestState = reducer(
        { ...state, data: [dummyUrl2, dummyUrl] },
        {
          type: actions.DELETE_ALL_URL_REQUEST,
          payload: 'all',
        }
      );
      expect(deleteRequestState).toEqual({
        loading: false,
        deleting: ['all'],
        data: [dummyUrl2, dummyUrl],
        error: undefined,
      });
      expect(
        reducer(deleteRequestState, {
          type: actions.DELETE_ALL_URL_FAILED,
          payload: 'all',
          error: new Error('something went wrong'),
        })
      ).toEqual({
        loading: false,
        deleting: [],
        data: [dummyUrl2, dummyUrl],
        error: new Error('something went wrong'),
      });
    });
  });
});
