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
    name: 'Verifications',
    url: '/verifications'
  },
  {
    name: 'Institutes',
    url: '/institutes'
  },
  {
    name: 'Settings',
    url: '/settings',
  }
].map((menu) => {
  const url = process.env.NEXT_PUBLIC_BASE_URL.split('/')
  return {
    name: menu.name,
    url: `${!url[url.length - 1].includes('localhost') ? url[url.length - 1] : ''}${menu.url}`
  }
})

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