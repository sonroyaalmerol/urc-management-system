import React from 'react'

import { Center, Heading, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Tag, TagCloseButton, Text, useDisclosure, VStack, Wrap, WrapItem } from '@chakra-ui/react'

import type { ExtendedInstitute, ExtendedProfile, ExtendedProject } from '../../../types/profile-card'
import Button from '../../general/Button'
import { AddIcon } from '@chakra-ui/icons'
import type { ResearchArea, Unit } from '@prisma/client'

import { useSession } from 'next-auth/react'
import { roleChecker } from '../../../utils/roleChecker'
import { CONFIRMATION_RESEARCHER_INFORMATION, UPDATE_CENTER_INFO } from '../../../utils/permissions'
import AutoCompleteInput from '../../general/AutoCompleteInput'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

interface ResearchAreaSectionProps {
  institute: Partial<ExtendedInstitute>
}

const ResearchAreaSection: React.FC<ResearchAreaSectionProps> = (props) => {
  const institute = props.institute
  const { data: { profile: currentProfile } } = useSession()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { control, handleSubmit, reset, setValue, watch } = useForm<ResearchArea>();

  const isAllowed = React.useMemo(() => {
    return (roleChecker(currentProfile, UPDATE_CENTER_INFO))
  }, [currentProfile.roles])

  const [researchAreaAdding, setResearchAreaAdding] = React.useState(false)

  const [researchAreas, setResearchAreas] = React.useState(institute.research_areas ?? [])

  const reloadSession = () => {
    const event = new Event("visibilitychange")
    document.dispatchEvent(event)
  }

  const onSubmit: SubmitHandler<ResearchArea> = async (data) => {
    setResearchAreaAdding(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/institutes/${institute.id}/research_areas`, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => res.json())

    if (res.success) {
      setResearchAreas((prev) => [...prev.filter((x) => x.id !== data.id), data])
      reloadSession()
      onClose()
    }

    setResearchAreaAdding(false)
  }

  const removeResearchArea = async (researchArea: ResearchArea) => {
    setResearchAreaAdding(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/institutes/${institute.id}/research_areas`, {
      method: 'DELETE',
      body: JSON.stringify({ id: researchArea.id })
    }).then(res => res.json())

    if (res.success) {
      setResearchAreas((prev) => prev.filter((x) => x.id !== researchArea.id))
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
            Research Areas:
          </Heading>
        </WrapItem>
        <WrapItem>
          { isAllowed && (
            <Button
              padding={2}
              size="xs"
              leftIcon={<AddIcon />}
              onClick={onOpen}
              isLoading={researchAreaAdding}
            >
              Add Research Area
            </Button>
          ) }
        </WrapItem>
      </Wrap>
      { researchAreas.map((researchArea) => (
        <Tag
          key={researchArea.field}
          borderRadius={20}
        >
          {researchArea.field}
          { isAllowed && (
            <TagCloseButton
              onClick={() => {
                if (!researchAreaAdding) {
                  removeResearchArea(researchArea).then(() => {
                    setResearchAreaAdding(false)
                  })
                }
              }}
            />
          ) }
        </Tag>
      )) }
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add Research Area</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Area</Text>
                <AutoCompleteInput
                  api={`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/research_areas`}
                  name="field"
                  primaryDisplayName="field"
                  formSetValue={setValue}
                  disableClearIfNotExists={true}
                  disableSecondValue={true}
                />
                <Text fontStyle="italic" fontSize="xs" pl="1rem">
                  Research Area will be created if it does not exist yet.
                </Text>
              </VStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button isLoading={researchAreaAdding} colorScheme='blue' mr={3} type="submit">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

export default ResearchAreaSection
