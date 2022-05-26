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
    url: '/dashboard',
  },
  {
    name: 'Projects',
    url: '/projects',
  },
  {
    name: 'Profiles',
    url: '/profiles',
  },
  {
    name: 'Settings',
    url: '/settings',
  }
]

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  const { status } = useSession()

  if (status === 'authenticated') {
    return (
      <>
        {/*<Head></Head>*/}
        <Sidebar menus={menus} display={{ base: 'none', md: 'initial' }} />
        <VStack maxW="full" marginLeft={{ base: 0, md: '18.75rem' }}>
          <Navbar menus={menus} display={{ base: 'initial', md: 'none' }} />
          <Box
            w="full"
            h="full"
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