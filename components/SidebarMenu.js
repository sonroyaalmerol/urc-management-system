import React from 'react'
import { Button, Center } from '@chakra-ui/react'

const SidebarMenu = (props) => {
  return (
    <Button w='100%' backgroundColor='transparent' color={props.selected ? 'brand.blue' : 'white'} h="4.375rem" {...props}>
      <Center h="4.375rem">
        {props.children}
      </Center>
    </Button>
  )
}

export default SidebarMenu