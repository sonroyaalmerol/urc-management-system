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
  Checkbox,
} from '@chakra-ui/react'
import Button from '../../general/Button'
import AutoCompleteInput from '../../general/AutoCompleteInput'
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import useUUID from '../../../lib/client/useUUID'
import { Institute, ProfileToInstituteBridge } from '@prisma/client'
import DatePicker from '../../general/DatePicker'


const Members: React.FC<ComponentProps> = (props) => {
  const institute = props.institute

  const { control, handleSubmit, reset, setValue, watch } = useForm<Institute & ProfileToInstituteBridge>();

  const [entries, setEntries] = React.useState<ExtendedProfile[]>([])
  const [submitting, setSubmitting] = React.useState(false)

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const toast = useToast()
  const key = useUUID()

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/institutes/${institute.id}/members?${entries.length > 0 && !args?.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
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

  const onSubmit: SubmitHandler<Institute & ProfileToInstituteBridge> = async data => {
    setSubmitting(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/institutes/${institute.id}/members`, {
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

  React.useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen])

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
          startDate={entry.bridge_institutes?.filter((i) => i.institute_id === institute.id)[0].start_date}
          endDate={entry.bridge_institutes?.filter((i) => i.institute_id === institute.id)[0].end_date}
          institute={institute}
          isHead={entry.bridge_institutes?.filter((i) => i.institute_id === institute.id)[0].is_head}
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
                  api={`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/profiles`}
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
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Start Date</Text>
                <Controller
                  name="start_date"
                  control={control}
                  defaultValue={new Date()}
                  render={({ field }) => <DatePicker {...field} />}
                />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">End Date</Text>
                <Controller
                  name="end_date"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => <DatePicker {...field} />}
                />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Controller
                  name="is_head"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox 
                      name={field.name} 
                      onBlur={field.onBlur} 
                      onChange={field.onChange}
                      ref={field.ref}
                      checked={field.value}
                      marginLeft="1rem"
                    >
                      Center Head
                    </Checkbox>
                  )}
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
                  isLoading={submitting}
                >
                  Cancel
                </Button>
              </WrapItem>
              <WrapItem>
                <Button type="submit" isLoading={submitting}>
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
