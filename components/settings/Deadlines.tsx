import React from 'react'

import { useSession } from 'next-auth/react'
import ListTemplate from '../general/templates/ListTemplate'
import { Box, Center, Heading, HStack, Input, Spacer, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Deadline } from '@prisma/client'
import { useRouter } from 'next/router'
import useUUID from '../../utils/client/useUUID'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import DatePicker from '../general/DatePicker'
import Button from '../general/Button'
import { format } from 'date-fns'
import IconButton from '../general/IconButton'
import { DeleteIcon } from '@chakra-ui/icons'
import IconButtonWithConfirmation from '../general/IconButtonWithConfirmation'

interface DeadlinesProps {
  
}

const Deadlines: React.FC<DeadlinesProps> = (props) => {
  const [entries, setEntries] = React.useState<Deadline[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/deadlines`
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

  const { control, handleSubmit, reset } = useForm<Partial<Deadline>>();
  const router = useRouter()
  const toast = useToast()

  const uuid = useUUID()

  const onSubmit: SubmitHandler<Partial<Deadline>> = async data => {
    setSubmitting(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/deadlines`, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then((i) => i.json())

    if (res.success) {
      router.push(`/settings?key=${uuid}`)
      toast({
        title: 'Success!',
        description: 'Successfully added deadline!',
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
    onClose()
  };

  const onDelete = async id => {
    setSubmitting(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/deadlines`, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    }).then((i) => i.json())

    if (res.success) {
      router.push(`/settings?key=${uuid}`)
      toast({
        title: 'Success!',
        description: 'Successfully deleted deadline!',
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
  }

  return (
    <>
      <ListTemplate
        title="Deadlines"
        loading={loading}
        hasMore={false}
        loadMore={() => {}}
        onNew={onOpen}
        grid={entries.length > 0 ? { base: 1, sm: 2, md: 3 } : 1}
      >
        { entries.length > 0 ? entries.map((entry) => (
          <Box
            key={entry.id}
            padding="1rem"
            bgColor="brand.cardBackground"
            borderRadius={10}
          >
            <HStack w="full">
              <VStack align="baseline">
                <Heading fontFamily="body" fontSize="md">{entry.title}</Heading>
                <Text fontSize="xs" fontStyle="italic">
                  { format(new Date(entry.date), 'MMM dd, yyyy') }
                </Text>
              </VStack>
              <Spacer />
              <VStack>
                <IconButtonWithConfirmation 
                  aria-label='Remove'
                  variant='red'
                  confirmationMessage={`
                    You are about to delete ${entry.title}. Do you want to proceed?
                  `}
                  onClick={() => {
                    onDelete(entry.id)
                  }}
                  icon={<DeleteIcon />}
                />
              </VStack>
            </HStack>
          </Box>
        )) : (
          <Center marginTop="2rem" w="full">
            <Text>No entries found</Text>
          </Center>
        ) }
      </ListTemplate>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>New Deadline</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack w="full" spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Title</Text>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => 
                    <Input {...field}/>
                  }
                />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Date</Text>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => 
                    <DatePicker {...field} />
                  }
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
    </>
  )
}

export default Deadlines
