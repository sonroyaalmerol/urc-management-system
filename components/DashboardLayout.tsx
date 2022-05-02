import React, { ReactNode } from 'react'
import { HStack, Box, VStack } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useSession } from 'next-auth/react'
// import Head from 'next/head'

interface DashboardLayoutProps {
  children?: ReactNode
}

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

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  const { status } = useSession()

  if (status === 'authenticated') {
    return (
      <>
        {/*<Head></Head>*/}
        <HStack w='100vw' align='top' spacing={{ base: 0, md: '0.5rem' }}>
          <Sidebar menus={menus} display={{ base: 'none', md: 'initial' }} />
          <VStack w='100vw'>
            <Navbar menus={menus} display={{ base: 'initial', md: 'none' }} />
            <Box
              w='100%'
              h='100%'
              paddingY={{ base: '0.5rem', md: '2rem'}}
              paddingX={{ base: '1.5rem', md: '2rem'}}
              paddingTop={{ base: '5rem', md: '2rem' }}
            >
              {props.children}
            </Box>
          </VStack>
        </HStack>
      </>
    )
  }

  return <>{props.children}</>
}

export default DashboardLayout