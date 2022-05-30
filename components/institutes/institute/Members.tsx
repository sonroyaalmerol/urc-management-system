import React from 'react'

import ListTemplate from '../../general/templates/ListTemplate'

import type { ComponentProps, ExtendedProfile } from '../../../types/profile-card'
import CardTemplate from '../../general/templates/CardTemplate'
import { useRouter } from 'next/router'
import MemberCard from './MemberCard'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Wrap,
  WrapItem,
  VStack,
  Text,
  Input,
  useToast,
} from '@chakra-ui/react'
import Button from '../../general/Button'
import AutoCompleteInput from '../../general/AutoCompleteInput'
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import useUUID from '../../../lib/client/useUUID'

interface FormFields { 
  email: string,
  role_title: string
}

const Members: React.FC<ComponentProps> = (props) => {
  const institute = props.institute

  const { control, handleSubmit, reset, setValue, watch } = useForm<FormFields>();

  const [entries, setEntries] = React.useState<ExtendedProfile[]>([])
  const [submitting, setSubmitting] = React.useState(false)

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const toast = useToast()
  const key = useUUID()

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `/api/management/institutes/${institute.id}/members?${entries.length > 0 && !args?.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
    ).then(res => res.json())
    setCount(newEntries?.totalCount ?? 0)
    
    if (args?.reset) {
      setEntries(newEntries?.data ?? [])
    } else {
      setEntries((currEntries) => {
        return [...currEntries, ...(newEntries?.data.filter((memo) => !currEntries.find((currEntry) => currEntry.id === memo.id)) ?? []) ]
      })
    }
    setLoading(false)
  }

  const onSubmit: SubmitHandler<FormFields> = async data => {
    setSubmitting(true)

    const res = await fetch(`/api/management/institutes/${institute.id}/members`, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then((i) => i.json())

    if (res.success) {
      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
      toast({
        title: 'Success!',
        description: 'Successfully added member!',
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

  React.useEffect(() => {
    setLoading(true)
    loadNewEntries()
  }, [])

  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <ListTemplate
      title="Members"
      loading={loading}
      hasMore={entries.length < count}
      loadMore={loadNewEntries}
      onNew={onOpen}
    >
      { entries.map((entry) => (
        <MemberCard
          key={entry.id}
          profile={entry}
          role={entry.bridge_institutes?.filter((i) => i.institute_id === institute.id)[0].role_title}
        />
      )) }
      <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add Member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Member Email</Text>
                <AutoCompleteInput
                  api="/api/management/profiles"
                  name="email"
                  primaryDisplayName="first_name"
                  secondaryDisplayName="last_name"
                  formSetValue={setValue}
                />
                <Text fontStyle="italic" fontSize="xs" pl="1rem">
                  Proponent must have their profile added to the system.
                </Text>
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Role Title</Text>
                <Controller
                  name="role_title"
                  control={control}
                  defaultValue=""
                  render={({ field }) => <Input {...field} />}
                />
              </VStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Wrap spacing={2}>
              <WrapItem>
                <Button
                  bgColor="white"
                  color="brand.red"
                  _hover={{
                    bgColor: 'brand.cardBackground',
                    color:'brand.red'
                  }}
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </WrapItem>
              <WrapItem>
                <Button type="submit">
                  Proceed
                </Button>
              </WrapItem>
            </Wrap>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ListTemplate>
  )
}

export default Members
