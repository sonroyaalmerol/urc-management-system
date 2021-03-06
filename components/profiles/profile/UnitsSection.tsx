import React from 'react'

import { Center, Heading, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Spinner, Tag, TagCloseButton, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'

import type { ExtendedProfile } from '../../../types/profile-card'
import Button from '../../general/Button'
import { AddIcon } from '@chakra-ui/icons'
import type { Unit } from '@prisma/client'

import { useSession } from 'next-auth/react'
import { roleChecker } from '../../../utils/roleChecker'
import { CONFIRMATION_RESEARCHER_INFORMATION } from '../../../utils/permissions'

interface UnitsSectionProps {
  profile: Partial<ExtendedProfile>
}

const UnitsSection: React.FC<UnitsSectionProps> = (props) => {
  const profile = props.profile
  const { data: { profile: currentProfile } } = useSession()

  const isAllowed = React.useMemo(() => {
    return (roleChecker(currentProfile, CONFIRMATION_RESEARCHER_INFORMATION))
  }, [currentProfile.roles])

  const [unitAdding, setRoleAdding] = React.useState(false)
  const [unitsLoading, setUnitsLoading] = React.useState(true)
  const [units, setUnits] = React.useState<{ parent_name: string, parent_id: string, units: Unit[] }[]>([])
  const [profileUnits, setProfileUnits] = React.useState(profile.units)

  const reloadSession = () => {
    const event = new Event("visibilitychange")
    document.dispatchEvent(event)
  }

  const getUnits = async () => {
    setUnitsLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/units`).then(res => res.json())
    setUnits(res.data)
  }

  const addRole = async (unit: Unit) => {
    setRoleAdding(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/profiles/${profile.id}/units`, {
      method: 'POST',
      body: JSON.stringify({ id: unit.id })
    }).then(res => res.json())

    if (res.success) {
      setProfileUnits((prev) => [...prev.filter((x) => x.id !== unit.id), unit])
      reloadSession()
    }
  }

  const removeRole = async (unit: Unit) => {
    setRoleAdding(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/profiles/${profile.id}/units`, {
      method: 'DELETE',
      body: JSON.stringify({ id: unit.id })
    }).then(res => res.json())

    if (res.success) {
      setProfileUnits((prev) => prev.filter((x) => x.id !== unit.id))
      reloadSession()
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
            Units:
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
                  getUnits().then(() => {
                    setUnitsLoading(false)
                  })
                }}
                isLoading={unitAdding}
              >
                Add Unit
              </MenuButton>
            ) }
            <MenuList overflowY="scroll" maxH="40vh" maxW="95vw">
              { !unitsLoading ? units.map((unit) => (
                <>
                  <MenuGroup key={unit.parent_id} title={unit.parent_name}>
                    { unit.units.map((subunit) => (
                      <MenuItem
                        key={subunit.id}
                        onClick={() => {
                          addRole(subunit).then(() => {
                            setRoleAdding(false)
                          })
                        }}
                      >
                        {subunit.name}
                      </MenuItem>
                    )) }
                  </MenuGroup>
                  <MenuDivider />
                </>
              )) : (
                <Center w="full">
                  <Spinner color="brand.blue" />
                </Center>
              ) }
            </MenuList>
          </Menu>
        </WrapItem>
      </Wrap>
      { profileUnits.map((unit) => (
        <Tag
          key={unit.id}
          borderRadius={20}
        >
          {unit.name}
          { isAllowed && (
            <TagCloseButton
              onClick={() => {
                if (!unitAdding) {
                  removeRole(unit).then(() => {
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

export default UnitsSection
