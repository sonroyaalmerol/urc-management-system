import React from 'react'
import { HStack, Box } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import Head from 'next/head'

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
    <>
      <Head></Head>
      <HStack w='100vw' align='top'>
        <Sidebar menus={menus} />
        <Box w='100%' h='100%' paddingY='2rem' paddingX='6rem'>
          {props.children}
        </Box>
      </HStack>
    </>
  )
}

export default DashboardLayout