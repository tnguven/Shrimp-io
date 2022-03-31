import { useReducer, useContext, createContext, Dispatch, ReactNode } from 'react';
import { reducer, SubmitFormStateActions } from './submitForm.reducer';
import { ShortUrl } from './types';

export interface SubmitFormContext {
  loading: boolean;
  data: undefined | ShortUrl;
  error: undefined | Error;
}

export const initialSubmitFormState = {
  loading: false,
  data: undefined,
  error: undefined,
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const initialDispatchState = () => {};

const SubmitFormStateContext = createContext<SubmitFormContext>(initialSubmitFormState);

const SubmitFormStateDispatchContext =
  createContext<Dispatch<SubmitFormStateActions>>(initialDispatchState);

export const SubmitUrlStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialSubmitFormState);
  return (
    <SubmitFormStateDispatchContext.Provider value={dispatch}>
      <SubmitFormStateContext.Provider value={state}>{children}</SubmitFormStateContext.Provider>
    </SubmitFormStateDispatchContext.Provider>
  );
};

export const useSubmitFormState = () => useContext(SubmitFormStateContext);
export const useDispatchSubmitForm = () => useContext(SubmitFormStateDispatchContext);
