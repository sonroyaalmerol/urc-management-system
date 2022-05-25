import React from 'react'

import { Button as StockButton, ButtonProps } from '@chakra-ui/react'

const Button: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (props, ref) => {
  return (
    <StockButton
      backgroundColor="brand.blue"
      borderRadius={10}
      color="white"
      fontWeight="bold"
      padding="1.5rem"
      _hover={{
        color: "brand.blue",
        backgroundColor: "brand.cardBackground"
      }}
      ref={ref}
      {...props}
    />
  )
}

export default React.forwardRef(Button)