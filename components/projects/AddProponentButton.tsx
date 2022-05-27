import React, { useId } from 'react'

import { useDisclosure, Text, Input, VStack, Icon, Flex, Avatar, Box, Center, Spinner, useToast } from '@chakra-ui/react'
import { useForm, Controller, SubmitHandler } from "react-hook-form"

import Button from '../general/Button'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import { MdGroupAdd } from 'react-icons/md'
import type { Profile, ProfileToProjectBridge, Project } from '@prisma/client'
import IconButton from '../general/IconButton'

import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete"
import { useDebounce } from 'use-debounce'
import { useRouter } from 'next/router'
import useUUID from '../../lib/client/useUUID'

interface AddProponentButtonProps {
  projectId: string
}

interface FormFields { 
  email: string,
  role: string
}

const AddProponentButton: React.FC<AddProponentButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { control, handleSubmit, reset, setValue, watch } = useForm<FormFields>();

  const { email } = watch()

  const [profiles, setProfiles] = React.useState<Profile[]>([])
  const [loadingProfiles, setLoadingProfiles] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)

  const [search, setSearch] = React.useState('')
  const [deferredSearch] = useDebounce(search, 500)

  const loadNewEntries = async () => {
    const newEntries = await fetch(
      `/api/management/profiles?${search?.length > 0 ? `&query=${search}` : ''}`
    ).then(res => res.json())
    
    setProfiles(newEntries?.data ?? [])
    setLoadingProfiles(false)
  }

  React.useEffect(() => {
    setLoadingProfiles(true)
    if (deferredSearch === search) {
      setLoadingProfiles(false)
    }
  }, [search])

  React.useEffect(() => {
    loadNewEntries()
  }, [deferredSearch])

  const toast = useToast()
  const key = useUUID()
  const router = useRouter()

  const onSubmit: SubmitHandler<FormFields> = async data => {
    setSubmitting(true)

    const res = await fetch(`/api/management/projects`, {
      method: 'POST',
      body: JSON.stringify({ ...data, mode: 'add-proponent', id: props.projectId })
    }).then((i) => i.json())

    if (res.success) {
      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
      toast({
        title: 'Success!',
        description: 'Successfully added proponent!',
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
    <>
      <IconButton
        aria-label='Add Proponent'
        onClick={onOpen}
        icon={<Icon as={MdGroupAdd} w={6} h={6} />}
      />
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add Proponent</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Proponent Email</Text>
                <AutoComplete 
                  openOnFocus
                  disableFilter
                  onChange={(vals) => {
                    setValue('email', vals)
                  }}
                  value={search}
                >
                  <AutoCompleteInput
                    autoComplete='off'
                    onChange={(e) => {
                      setSearch(e.target.value)
                    }}
                    onBlur={(e) => {
                      if (e.target.value !== email) {
                        e.target.value = ''
                      }
                    }}
                  />
                  <AutoCompleteList>
                    {!loadingProfiles ? profiles.map((profile) => (
                      <AutoCompleteItem
                        key={profile.id}
                        value={profile.email}
                      >
                        {profile.first_name} {profile.last_name} &lt;{profile.email}&gt;
                      </AutoCompleteItem>
                    )) : (
                      <Center marginTop="2rem">
                        <Spinner color="brand.blue" />
                      </Center>
                    )}
                  </AutoCompleteList>
                </AutoComplete>
                <Text fontStyle="italic" fontSize="xs" pl="1rem">
                  Proponent must have their profile added to the system.
                </Text>
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Role Title</Text>
                <Controller
                  name="role"
                  control={control}
                  defaultValue=""
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
    </>
  )
}

export default AddProponentButton