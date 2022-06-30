import React, { ReactNode } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useSession } from 'next-auth/react'
import { ASSIGN_CENTER_HEAD, CHANGE_PROJECT_STATUS, CONFIRMATION_RESEARCHER_INFORMATION, CREATE_CENTER_NEWS, CREATE_PROJECT, CREATE_PROJECT_CENTER, MANAGING_DELIVERABLES, MODIFY_RESEARCHER_PROFILE, REVIEW_PROPOSALS, SETTING_DEADLINES, SETTING_DOWNLOADS, SETTING_UNITS, UPDATE_CENTER_INFO, VERIFY_CENTER_NEWS, VERIFY_CENTER_PROJECTS } from '../../utils/permissions'
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
      url: '/verifications',
    },
    {
      name: 'Institutes',
      url: '/institutes',
    },
    {
      name: 'Downloads',
      url: '/downloads',
      allowedRoles: [
        ...SETTING_DOWNLOADS
      ],
    },
    {
      name: 'Settings',
      url: '/settings',
      allowedRoles: [
        ...SETTING_DOWNLOADS,
        ...SETTING_UNITS,
        ...SETTING_DEADLINES
      ],
    }
  ].filter((menu) => (menu.allowedRoles?.filter((allowedRole) => data?.profile.roles.filter((role) => role.id === allowedRole).length > 0).length) ?? 1 > 0)

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