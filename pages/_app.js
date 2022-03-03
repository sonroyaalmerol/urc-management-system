import { ChakraProvider } from '@chakra-ui/react'
import theme from '../styles/theme'
import DashboardLayout from '../components/DashboardLayout'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <DashboardLayout>
        <Component {...pageProps} />
      </DashboardLayout>
    </ChakraProvider>
  )
}

export default MyApp