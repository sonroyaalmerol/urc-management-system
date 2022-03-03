import React from 'react'
import { HStack } from '@chakra-ui/react'
import Sidebar from './Sidebar'

const menus = [
  {
    name: 'Home',
    url: '/',
  },
  {
    name: 'Researches',
    url: '/researches',
  },
  {
    name: 'Publications',
    url: '/publications',
  }
]

const DashboardLayout = (props) => {
  return (
    <HStack w='100%'>
      <Sidebar menus={menus} />
      {props.children}
    </HStack>
  )
}

export default DashboardLayout