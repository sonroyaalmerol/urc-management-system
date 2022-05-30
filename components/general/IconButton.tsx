import React from 'react'

import { IconButton as StockButton, IconButtonProps } from '@chakra-ui/react'

const IconButton: React.ForwardRefRenderFunction<HTMLButtonElement, IconButtonProps> = (props, ref) => {
  return (
    <StockButton
      backgroundColor={!props.variant ? "brand.blue" : undefined}
      borderRadius={10}
      color={!props.variant ? "white" : "brand.blue"}
      fontWeight="bold"
      _hover={!props.variant ? {
        color: "brand.blue",
        backgroundColor: "brand.cardBackground"
      }: undefined}
      ref={ref}
      {...props}
    />
  )
}

export default React.forwardRef(IconButton)