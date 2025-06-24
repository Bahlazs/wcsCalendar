import React from 'react';
import { ThemeProvider, CssBaseline} from '@mui/material';
import Head from 'next/head';
import theme from '@/theme';



export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
