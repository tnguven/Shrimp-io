import React, { SyntheticEvent, useCallback, useRef } from 'react';

import { useSubmitFormState, useDispatchSubmitForm } from '@/state/submitForm.context';
import { useDispatchUrlList } from '@/state/urlList.context';
import { makeSubmitUrl } from '@/state/submitForm.actions';
import { usePrevious } from '@/hooks/usePrevious';

import TextInput from '@/components/inputs/TextInput';
import { ButtonWithSpinner } from '@/components/buttons/ButtonWithSpinner';

import styles from './ShortUrlForm.module.css';

export function ShortUrlForm() {
  const dispatch = useDispatchSubmitForm();
  const dispatchUrlList = useDispatchUrlList();
  const { error, loading, data } = useSubmitFormState();
  const submitUrl = useCallback(makeSubmitUrl(dispatch), [dispatch]);
  const previousShortUrl = usePrevious(data?.shortUrl);
  const previousLongUrl = usePrevious(data?.url);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetErrorMessage = () => {
    error !== undefined && dispatch({ type: 'RESET_SUBMIT_ERROR' });
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputRef?.current?.value) {
      const result = await submitUrl(inputRef.current.value);
      if (result !== undefined) {
        dispatchUrlList({ type: 'SET_URLS', payload: result });
      }
    }
  };

  const createNewUrl = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    dispatch({ type: 'CREATE_NEW_URL' });
  };
  const hasError = error !== undefined;
  const shortUrl = data ? data.shortUrl : previousShortUrl;
  const longUrl = data ? data.url : previousLongUrl;

  return (
    <div className={styles.container}>
      <div
        data-testid="content_card"
        className={`${styles.content} ${data !== undefined ? styles.showBack : ''}`}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form className={styles.front} onSubmit={handleSubmit}>
          <div className={styles.block}>
            <TextInput
              id="urlInput"
              ref={inputRef}
              placeholder="Enter a long URL"
              label="Enter a long URL to make a shrimpURL"
              errorMessage={error?.message}
              onFocus={resetErrorMessage}
            />
          </div>
          <ButtonWithSpinner type="submit" isLoading={loading} disabled={hasError}>
            Shrimp my URL
          </ButtonWithSpinner>
        </form>
        <div className={styles.back}>
          <div className={styles.block}>
            <TextInput id="longUrl" label="Your long URL" readOnly={true} defaultValue={longUrl} />
          </div>
          <div className={styles.block}>
            <TextInput
              id="generated-shortUrl"
              label="Your short URL"
              readOnly={true}
              defaultValue={shortUrl}
            />
          </div>
          <ButtonWithSpinner type="button" data-testid="create-url" onClick={createNewUrl}>
            Create another Shrimp
          </ButtonWithSpinner>
        </div>
      </div>
    </div>
  );
}
