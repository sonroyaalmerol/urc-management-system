import React from 'react'

import { useSession } from 'next-auth/react'
import ListTemplate from '../general/templates/ListTemplate'
import type { Unit } from '@prisma/client'
import { Box, HStack, Input, SimpleGrid, Spacer, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react'
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

interface UnitsProps {
  
}

const Units: React.FC<UnitsProps> = (props) => {
  const [entries, setEntries] = React.useState<{ parent_name: string, parent_id: string, units: Unit[] }[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/units`
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

  const { control, handleSubmit, reset, setValue } = useForm<Partial<Unit>>();

  const router = useRouter()
  const key = useUUID()
  const toast = useToast()

  const onSubmit: SubmitHandler<Partial<Unit>> = async data => {
    setSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/units`, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then((i) => i.json())

    if (res.success) {
      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
      toast({
        title: 'Success!',
        description: 'Successfully added unit!',
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
      title="Units"
      loading={loading}
      hasMore={false}
      loadMore={() => {}}
      grid={{ base: 1 }}
      onNew={onOpen}
    >
      <Accordion allowToggle>
      { entries.map((entry) => (
        <AccordionItem key={entry.parent_id}>
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                {entry.parent_name}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <VStack w="full" align="baseline" spacing={4}>
              <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={2} w="full">
                <AddSubunitButton parentUnitId={entry.parent_id} />
                <EditUnitButton isParent unitId={entry.parent_id} unitName={entry.parent_name} />
                <DeleteUnitButton isParent unitId={entry.parent_id} unitName={entry.parent_name} />
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} w="full">
              { entry.units.map((unit) => (
                <HStack 
                  key={unit.id} 
                  w="full" 
                  spacing={4} 
                  bgColor="brand.cardBackground"
                  borderRadius={10}
                  padding="0.5rem"
                  paddingX="1rem"
                >
                  <Text>{unit.name}</Text>
                  <Spacer />
                  <HStack>
                    <EditUnitButton unitId={unit.id} unitName={unit.name} />
                    <DeleteUnitButton unitId={unit.id} unitName={unit.name} />
                  </HStack>
                </HStack>
              )) }
              </SimpleGrid>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      )) }
      </Accordion>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add Unit</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <VStack spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Name</Text>
                <Controller
                  name="name"
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

export default Units
