import React from 'react'

import { Center, Heading, Menu, MenuButton, MenuItem, MenuList, Spinner, Tag, TagCloseButton, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'

import type { ExtendedProfile } from '../../../types/profile-card'
import Button from '../../general/Button'
import { AddIcon } from '@chakra-ui/icons'
import type { UserRole } from '@prisma/client'

import { useSession } from 'next-auth/react'
import { MODIFY_ROLES } from '../../../lib/permissions'
import { roleChecker } from '../../../lib/roleChecker'

interface RolesSection {
  profile: Partial<ExtendedProfile>
}

const RolesSection: React.FC<RolesSection> = (props) => {
  const profile = props.profile
  const { data: { profile: currentProfile } } = useSession()

  const isAllowed = React.useMemo(() => {
    return (roleChecker(currentProfile, ['urc_chairperson', 'urc_staff']))
  }, [currentProfile.roles])

  const [roleAdding, setRoleAdding] = React.useState(false)
  const [rolesLoading, setRolesLoading] = React.useState(true)
  const [tmpRoles, setRoles] = React.useState<UserRole[]>([])
  const [profileRoles, setProfileRoles] = React.useState(profile.roles)

  const roles = React.useMemo(() => {
    if (profileRoles.length === 0) {
      return tmpRoles
    }

    if (profileRoles.filter(role => role.id === 'researcher').length < 1) {
      return tmpRoles.filter((role) => role.id === 'researcher')
    }

    return tmpRoles.filter(({ id }) => profileRoles.filter(role => role.id === id).length < 1)
  }, [tmpRoles, profileRoles])

  const getRoles = async () => {
    setRolesLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/roles`).then(res => res.json())
    setRoles(res.data)
  }

  const addRole = async (role: UserRole) => {
    setRoleAdding(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/profiles/${profile.id}/roles`, {
      method: 'POST',
      body: JSON.stringify({ id: role.id })
    }).then(res => res.json())

    if (res.success) {
      setProfileRoles((prev) => [...prev.filter((x) => x.id !== role.id), role])
    }
  }

  const removeRole = async (role: UserRole) => {
    setRoleAdding(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/profiles/${profile.id}/roles`, {
      method: 'DELETE',
      body: JSON.stringify({ id: role.id })
    }).then(res => res.json())

    if (res.success) {
      setProfileRoles((prev) => prev.filter((x) => x.id !== role.id))
    }
  }

  return (
    <VStack align="baseline" spacing={2}>
      <Wrap align="center">
        <WrapItem>
          <Heading
            fontFamily="body"
            fontSize="md"
          >
            Roles:
          </Heading>
        </WrapItem>
        <WrapItem>
          <Menu>
            { isAllowed && (
              <MenuButton
                as={Button}
                padding={2}
                size="xs"
                leftIcon={<AddIcon />}
                onClick={() => {
                  getRoles().then(() => {
                    setRolesLoading(false)
                  })
                }}
                isLoading={roleAdding}
              >
                Add Role
              </MenuButton>
            ) }
            <MenuList>
              { !rolesLoading ? roles.map((role) => (
                <MenuItem
                  key={role.id}
                  onClick={() => {
                    addRole(role).then(() => {
                      setRoleAdding(false)
                    })
                  }}
                >
                  {role.comment}
                </MenuItem>
              )) : (
                <Center w="full">
                  <Spinner color="brand.blue" />
                </Center>
              ) }
            </MenuList>
          </Menu>
        </WrapItem>
      </Wrap>
      { profileRoles.map((role) => (
        <Tag
          key={role.id}
          borderRadius={20}
        >
          {role.comment}
          { isAllowed && (
            <TagCloseButton
              onClick={() => {
                if (!roleAdding) {
                  removeRole(role).then(() => {
                    setRoleAdding(false)
                  })
                }
              }}
            />
          ) }
        </Tag>
      )) }
    </VStack>
  )
}

export default RolesSection
