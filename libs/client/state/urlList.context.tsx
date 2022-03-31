import { useReducer, useContext, createContext, Dispatch, ReactNode } from 'react';
import { ShortUrl } from './types';
import { UrlListStateActions, reducer } from './urlList.reducer';

export interface UrlListContext {
  loading: boolean;
  deleting: string[];
  data: ShortUrl[];
  error: undefined | Error;
}

export const initialUrlListState = {
  loading: false,
  deleting: [],
  data: [],
  error: undefined,
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const initialDispatchState = () => {};

const UrlListStateContext = createContext<UrlListContext>(initialUrlListState);

const UrlListStateDispatchContext =
  createContext<Dispatch<UrlListStateActions>>(initialDispatchState);

export const UrlListStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialUrlListState);
  return (
    <UrlListStateDispatchContext.Provider value={dispatch}>
      <UrlListStateContext.Provider value={state}>{children}</UrlListStateContext.Provider>
    </UrlListStateDispatchContext.Provider>
  );
};

export const useUrlListState = () => useContext(UrlListStateContext);
export const useDispatchUrlList = () => useContext(UrlListStateDispatchContext);
