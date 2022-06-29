import React from 'react'

import { IconButton as StockButton, IconButtonProps } from '@chakra-ui/react'

export interface CustomIconButtonProps extends IconButtonProps {
  variant?: 'default' | 'red'
}

interface Theme {
  backgroundColor: string | undefined,
  color: string,
  _hover: {
    color: string,
    backgroundColor: string
  } | undefined
}

const IconButton: React.ForwardRefRenderFunction<HTMLButtonElement, CustomIconButtonProps> = (props, ref) => {
  const divProps = { ...props }
  delete divProps.variant

  const theme: Theme = React.useMemo(() => {
    const ret = {
      backgroundColor: undefined,
      color: 'brand.blue',
      _hover: undefined
    }

    let variant = props.variant

    if (!variant) variant = 'default'
    
    switch (variant) {
      case 'default':
        ret.backgroundColor = 'brand.blue'
        ret.color = 'white'
        ret._hover = {
          color: 'brand.blue',
          backgroundColor: 'brand.cardBackground'
        }
        break
      case 'red':
        ret.color = 'white'
        ret.backgroundColor = 'brand.red'
        ret._hover = {
          color: 'brand.red',
          backgroundColor: 'brand.cardBackground'
        }
        break
    }

    return ret
  }, [])

  return (
    <StockButton
      {...theme}
      borderRadius={10}
      fontWeight="bold"
      ref={ref}
      {...divProps}
    />
  )
}

export default React.forwardRef(IconButton)