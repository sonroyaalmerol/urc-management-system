import React from 'react'

import { IconButton as StockButton, IconButtonProps } from '@chakra-ui/react'

const IconButton: React.ForwardRefRenderFunction<HTMLButtonElement, IconButtonProps> = (props, ref) => {
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

export default React.forwardRef(IconButton)