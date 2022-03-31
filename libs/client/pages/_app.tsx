import '../styles/global.css';
import { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';

import { SubmitUrlStateProvider } from '@/state/submitForm.context';
import { UrlListStateProvider } from '@/state/urlList.context';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UrlListStateProvider>
      <SubmitUrlStateProvider>
        <Component {...pageProps} />
        <Toaster position="top-right" toastOptions={{ duration: 1600 }} />
      </SubmitUrlStateProvider>
    </UrlListStateProvider>
  );
}
