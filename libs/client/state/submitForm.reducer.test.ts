import { reducer, actions } from './submitForm.reducer';
import { initialSubmitFormState } from './submitForm.context';

describe('submitForm reducer', () => {
  let state = { ...initialSubmitFormState };
  const dummyUrl = {
    url: 'https://test.com',
    id: 'testID',
    shortUrl: 'https://pbid.io/f3x2ab1c',
    urlCode: 'f3x2ab1c',
    createdAt: new Date(),
    expireAt: new Date(),
    clicks: 0,
  };
  beforeEach(() => {
    state = { ...initialSubmitFormState };
  });

  it('should submit a url and create a new one', () => {
    const requestingState = reducer(state, { type: actions.SUBMIT_URL_REQUEST });
    expect(requestingState).toEqual({ loading: true, data: undefined, error: undefined });
    const successState = reducer(requestingState, {
      type: actions.SUBMIT_URL_SUCCESS,
      payload: dummyUrl,
    });
    expect(successState).toEqual({ loading: false, data: dummyUrl, error: undefined });
    expect(reducer(successState, { type: actions.CREATE_NEW_URL })).toEqual({
      loading: false,
      data: undefined,
      error: undefined,
    });
  });

  it('should fail submit after SUBMIT_URL_REQUEST', () => {
    const requestingState = reducer(state, { type: actions.SUBMIT_URL_REQUEST });
    expect(requestingState).toEqual({
      loading: true,
      data: undefined,
      error: undefined,
    });
    expect(
      reducer(requestingState, {
        type: actions.SUBMIT_URL_FAILED,
        error: new Error('something going on'),
      })
    ).toEqual({
      loading: false,
      data: undefined,
      error: new Error('something going on'),
    });
  });
});
