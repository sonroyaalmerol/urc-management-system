import React from 'react'

import { useSession } from 'next-auth/react'
import ListTemplate from '../general/templates/ListTemplate'
import type { ResearchThrust, Unit, UniversityMission } from '@prisma/client'
import { Box, Center, HStack, Input, SimpleGrid, Spacer, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { useForm, Controller, SubmitHandler } from "react-hook-form"

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import IconButton from '../general/IconButton'
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import Button from '../general/Button'
import AddSubunitButton from './AddSubunitButton'
import EditUnitButton from './EditUnitButton'
import DeleteUnitButton from './DeleteUnitButton'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import useUUID from '../../utils/client/useUUID'
import AddResearchThrustButton from './AddResearchThrustButton'
import EditResearchThrustButton from './EditResearchThrustButton'
import DeleteResearchThrustButton from './DeleteResearchThrustButton'
import EditUniversityMissionButton from './EditUniversityMissionButton'
import DeleteUniversityMissionButton from './DeleteUniversityMissionButton'

interface UniversityMissionsProps {
  
}

const UniversityMissions: React.FC<UniversityMissionsProps> = (props) => {
  const [entries, setEntries] = React.useState<(UniversityMission & { research_thrusts: ResearchThrust[] })[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/university_missions`
    ).then(res => res.json())
    setCount(newEntries?.totalCount ?? 0)
    
    if (args?.reset) {
      setEntries(newEntries?.data ?? [])
    }

    setLoading(false)
  }

  React.useEffect(() => {
    setLoading(true)
    loadNewEntries({ reset: true })
  }, [])

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [submitting, setSubmitting] = React.useState(false)

  const { control, handleSubmit, reset, setValue } = useForm<Partial<UniversityMission>>();

  const router = useRouter()
  const key = useUUID()
  const toast = useToast()

  const onSubmit: SubmitHandler<Partial<Unit>> = async data => {
    setSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/university_missions`, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then((i) => i.json())

    if (res.success) {
      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
      toast({
        title: 'Success!',
        description: 'Successfully added University Mission!',
        status: 'success'
      })
    } else {
      toast({
        title: 'Error!',
        description: res.error,
        status: 'error'
      })
    }
    setSubmitting(false)
    reset()
    onClose()
  };

  return (
    <ListTemplate
      title="University Missions"
      loading={loading}
      hasMore={false}
      loadMore={() => {}}
      grid={{ base: 1 }}
      onNew={onOpen}
    >
      <Accordion allowToggle>
      { entries.length > 0 ? entries.map((entry) => (
        <AccordionItem key={entry.id} border="none">
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                {entry.description}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <VStack w="full" align="baseline" spacing={4}>
              <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={2} w="full">
                <AddResearchThrustButton universityMissionId={entry.id} />
                <EditUniversityMissionButton universityMissionId={entry.id} universityMissionDescription={entry.description} />
                <DeleteUniversityMissionButton universityMissionId={entry.id} universityMissionDescription={entry.description} />
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} w="full">
              { entry.research_thrusts.map((researchThrust) => (
                <HStack 
                  key={researchThrust.id} 
                  w="full" 
                  spacing={4} 
                  bgColor="brand.cardBackground"
                  borderRadius={10}
                  padding="0.5rem"
                  paddingX="1rem"
                >
                  <Text>{researchThrust.description}</Text>
                  <Spacer />
                  <HStack>
                    <EditResearchThrustButton
                      universityMissionId={entry.id} 
                      researchThrustId={researchThrust.id} 
                      researchThrustDescription={researchThrust.description} 
                    />
                    <DeleteResearchThrustButton 
                      universityMissionId={entry.id} 
                      researchThrustId={researchThrust.id} 
                      researchThrustDescription={researchThrust.description} 
                    />
                  </HStack>
                </HStack>
              )) }
              </SimpleGrid>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      )) : (
        <Center marginTop="2rem" w="full">
          <Text>No entries found</Text>
        </Center>
      ) }
      </Accordion>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add University Mission</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <VStack spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Description</Text>
                <Controller
                  name="description"
                  control={control}
                  defaultValue={''}
                  render={({ field }) => <Input {...field} />}
                />
              </VStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button isLoading={submitting} colorScheme='blue' mr={3} type="submit">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ListTemplate>
  )
}

export default UniversityMissions
