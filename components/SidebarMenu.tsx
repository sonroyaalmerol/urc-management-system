import React, { LegacyRef } from 'react'
import { Button, ButtonProps, Center } from '@chakra-ui/react'

interface SidebarMenuProps extends ButtonProps {
  selected?: boolean,
  ref?: LegacyRef<HTMLButtonElement>,
  setCurrentPosition?: any
}

const SidebarMenu: React.FC<SidebarMenuProps> = (props) => {
  return (
    <Button 
      w='100%'
      backgroundColor='transparent'
      color={props.selected ? 'brand.blue' : 'white'}
      h="4.375rem"
      ref={el => {
        if (!el) return;
        const observer = new ResizeObserver(() => {
          const currentPosition = {
            offsetTop: el.offsetTop,
            offsetBottom: window.innerHeight - (el.offsetTop + el.offsetHeight)
          }
          
          if (props.setCurrentPosition) {
            props.setCurrentPosition(currentPosition)
          }
        })
        if (props.selected) {
          observer.observe(el)
        } else {
          observer.unobserve(el)
        }
      }}
      {...props}
    >
      <Center h="4.375rem">
        {props.children}
      </Center>
    </Button>
  )
}

export default SidebarMenu