import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../styles/theme'
import Layout from '../components/Layout'
import { SessionProvider } from 'next-auth/react'
import NextNProgress from 'nextjs-progressbar'

import '@fontsource/montserrat/700.css'
import '@fontsource/open-sans/300.css'
import '@fontsource/open-sans/400.css'
import '@fontsource/open-sans/700.css'

import type { AppProps } from 'next/app'

const MyApp: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <>
      <NextNProgress />
      <SessionProvider session={session}>
        <ChakraProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp