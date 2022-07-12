import React from 'react'

import { Center, Heading, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Spinner, Tag, TagCloseButton, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'

import type { ExtendedProject } from '../../types/profile-card'
import Button from '../general/Button'
import { AddIcon } from '@chakra-ui/icons'
import type { Unit } from '@prisma/client'

import { useSession } from 'next-auth/react'
import { memberChecker, roleChecker } from '../../utils/roleChecker'
import { CHANGE_PROJECT_STATUS } from '../../utils/permissions'

interface UnitsSectionProps {
  project: Partial<ExtendedProject>
}

const UnitsSection: React.FC<UnitsSectionProps> = (props) => {
  const project = props.project
  const { data: { profile: currentProfile } } = useSession()

  const isAllowed = React.useMemo(() => {
    return roleChecker(currentProfile, CHANGE_PROJECT_STATUS) || memberChecker(currentProfile, project.bridge_profiles)
  }, [currentProfile.roles])

  const [unitAdding, setRoleAdding] = React.useState(false)
  const [unitsLoading, setUnitsLoading] = React.useState(true)
  const [units, setUnits] = React.useState<{ parent_name: string, parent_id: string, units: Unit[] }[]>([])
  const [projectUnits, setProjectUnits] = React.useState(project.units ?? [])

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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects/${project.id}/units`, {
      method: 'POST',
      body: JSON.stringify({ id: unit.id })
    }).then(res => res.json())

    if (res.success) {
      setProjectUnits((prev) => [...prev.filter((x) => x.id !== unit.id), unit])
      reloadSession()
    }
  }

  const removeRole = async (unit: Unit) => {
    setRoleAdding(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects/${project.id}/units`, {
      method: 'DELETE',
      body: JSON.stringify({ id: unit.id })
    }).then(res => res.json())

    if (res.success) {
      setProjectUnits((prev) => prev.filter((x) => x.id !== unit.id))
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
      { projectUnits.map((unit) => (
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
