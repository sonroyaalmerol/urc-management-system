import React, { ReactNode } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useSession } from 'next-auth/react'
// import Head from 'next/head'

interface DashboardLayoutProps {
  children?: ReactNode
}

const menus = [
  {
    name: 'Dashboard',
    url: '/',
  },
  {
    name: 'Projects',
    url: '/projects',
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
        <Sidebar menus={menus} display={{ base: 'none', md: 'initial' }} />
        <VStack maxW="100%" marginLeft={{ base: 0, md: '18.75rem' }}>
          <Navbar menus={menus} display={{ base: 'initial', md: 'none' }} />
          <Box
            w='100%'
            h='100%'
            paddingY={{ base: '0.5rem', md: '2rem' }}
            paddingX={{ base: '0.5rem', md: '2rem' }}
            paddingTop={{ base: '5rem', md: '2rem' }}
          >
            {props.children}
          </Box>
        </VStack>
      </>
    )
  }

  return <>{props.children}</>
}

export default DashboardLayout