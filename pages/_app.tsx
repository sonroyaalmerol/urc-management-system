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

import '../styles/richTextArea.css'

import type { AppProps } from 'next/app'
import { NextSeo } from 'next-seo'

const MyApp: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <>
      <NextSeo 
        description="The University Research Council (URC) is mandated to promote, encourage and celebrate research and publication in the University. It is a collegial body of seven researching peers who are appointed by the University President."
      />
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