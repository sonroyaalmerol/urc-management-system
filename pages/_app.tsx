import { ChakraProvider } from '@chakra-ui/react'
import theme from '../styles/theme'
import DashboardLayout from '../components/DashboardLayout'
import { SessionProvider } from 'next-auth/react'
import NextNProgress from 'nextjs-progressbar'

import type { AppProps } from 'next/app'

const MyApp: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <>
      <NextNProgress />
      <SessionProvider session={session}>
        <ChakraProvider theme={theme}>
          <DashboardLayout>
            <Component {...pageProps} />
          </DashboardLayout>
        </ChakraProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp