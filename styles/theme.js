// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react'

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
    blue: '#1A2B75'
  },
}

const theme = extendTheme({ 
  colors,
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