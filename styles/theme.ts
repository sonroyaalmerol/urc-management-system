// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react'

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    blue: '#1A2B75',
    yellow: '#D99C00',
    red: '#C20000',
    lightBlue: '#1673FF',
    cardBackground: '#F0F1F2'
  },
}

const theme = extendTheme({ 
  colors,
  fonts: {
    heading: 'Montserrat, sans-serif',
    body: 'Open Sans, sans-serif',
  },
  styles: {
    global: {
      'html, body': {
        color: 'black',
        background: 'white',
      },
    },
  },
  components: { 
    Button: { 
      baseStyle: {
        _focus: { 
          boxShadow: 'none' 
        }
      } 
    } 
  }
})

export default theme;