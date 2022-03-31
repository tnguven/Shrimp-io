import React, { ReactNode } from 'react';
import { fetch } from '@/core/fetcher';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen } from '@testing-library/react';

import { SubmitUrlStateProvider } from '@/state/submitForm.context';
import { UrlListStateProvider } from '@/state/urlList.context';
import { ShortUrlForm } from './ShortUrlForm';

describe('ShortUrlForm', () => {
  const mockAxios = new MockAdapter(fetch);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <UrlListStateProvider>
      <SubmitUrlStateProvider>{children}</SubmitUrlStateProvider>
    </UrlListStateProvider>
  );

  afterEach(() => {
    mockAxios.reset();
  });

  it('render correctly', () => {
    render(<ShortUrlForm />, { wrapper });
    expect(screen.getByText(/Enter a long URL to make a shrimpURL/)).toBeInTheDocument();
    expect(screen.getByText(/Shrimp my URL/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter a long URL/)).toBeInTheDocument();
    expect(screen.getByText(/Your long URL/)).toBeInTheDocument();
    expect(screen.getByText(/Your short URL/)).toBeInTheDocument();
    expect(screen.getByText(/Create another Shrimp/)).toBeInTheDocument();
  });

  it('enter invalid url and submit', async () => {
    render(<ShortUrlForm />, { wrapper });
    const elInput = screen.getByPlaceholderText<HTMLInputElement>(/Enter a long URL/);

    fireEvent.click(elInput);
    fireEvent.change(elInput, { target: { value: 'invalid.url' } });
    expect(elInput.value).toBe('invalid.url');

    mockAxios.onPost('http://127.0.0.1:80/v1/shorten', { url: 'invalid.url' }).networkErrorOnce();

    const elSubmitBnt = screen.getByText(/Shrimp my URL/);
    fireEvent.click(elSubmitBnt);
    const errorMessage = await screen.findByText(/Something went wrong. Try again!/);
    expect(errorMessage.textContent).toBe('Something went wrong. Try again!');
  });
});
