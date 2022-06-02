import React, { ReactNode } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useSession } from 'next-auth/react'
// import Head from 'next/head'

interface DashboardLayoutProps {
  children?: ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  const { status, data } = useSession()

  const menus = [
    {
      name: 'Dashboard',
      url: '/dashboard',
      allowedRoles: [
        'urc_chairperson',
        'urc_executive_secretary',
        'urc_staff',
        'urc_board_member',
        'researcher'
      ],
    },
    {
      name: 'Projects',
      url: '/projects',
      allowedRoles: [
        'urc_chairperson',
        'urc_executive_secretary',
        'urc_staff',
        'urc_board_member',
        'researcher'
      ],
    },
    {
      name: 'Profiles',
      url: '/profiles',
      allowedRoles: [
        'urc_chairperson',
        'urc_executive_secretary',
        'urc_staff',
        'urc_board_member',
        'researcher'
      ],
    },
    {
      name: 'Verifications',
      url: '/verifications',
      allowedRoles: [
        'urc_chairperson',
        'urc_staff',
        'urc_board_member',
      ],
    },
    {
      name: 'Institutes',
      url: '/institutes',
      allowedRoles: [
        'urc_chairperson',
        'urc_executive_secretary',
        'urc_staff',
        'urc_board_member',
        'researcher'
      ],
    },
    {
      name: 'Downloads',
      url: '/downloads',
      allowedRoles: [
        'urc_chairperson',
        'urc_executive_secretary',
        'urc_staff',
        'urc_board_member',
      ],
    },
    {
      name: 'Settings',
      url: '/settings',
      allowedRoles: [
        'urc_chairperson',
        'urc_staff',
      ],
    }
  ].filter((menu) => menu.allowedRoles.filter((allowedRole) => data?.profile.roles.filter((role) => role.id === allowedRole).length > 0).length > 0)

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