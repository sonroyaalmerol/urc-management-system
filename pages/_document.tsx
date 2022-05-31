import { Html, Head, Main, NextScript } from 'next/document'
import type { DocumentProps } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'
import theme from '../styles/theme'

const Document: React.FC<DocumentProps> = (props) => {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="icon" href={`${process.env.NEXT_PUBLIC_BASE_URL}/addu-logo-blue.png`} type="image/x-icon" />
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document