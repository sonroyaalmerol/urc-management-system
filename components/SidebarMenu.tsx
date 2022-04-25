import React from 'react'
import { Button, ButtonProps, Center } from '@chakra-ui/react'

interface SidebarMenuProps extends ButtonProps {
  selected?: boolean
}

const SidebarMenu: React.FC<SidebarMenuProps> = (props) => {
  return (
    <Button w='100%' backgroundColor='transparent' color={props.selected ? 'brand.blue' : 'white'} h="4.375rem" {...props}>
      <Center h="4.375rem">
        {props.children}
      </Center>
    </Button>
  )
}

export default SidebarMenu