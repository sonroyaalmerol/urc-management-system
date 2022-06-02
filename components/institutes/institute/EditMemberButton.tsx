import React from 'react'

import { useDisclosure, Text, Input, VStack, useToast, Checkbox, Switch } from '@chakra-ui/react'
import { useForm, Controller, SubmitHandler } from "react-hook-form"

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import { AddIcon, EditIcon } from '@chakra-ui/icons'
import type { Institute, ProfileToInstituteBridge } from '@prisma/client'
import IconButton from '../../general/IconButton'
import Button from '../../general/Button'
import { useRouter } from 'next/router'
import useUUID from '../../../lib/client/useUUID'
import DatePicker from '../../general/DatePicker'
import AutoCompleteInput from '../../general/AutoCompleteInput'
import { ExtendedInstitute } from '../../../types/profile-card'
import { useSession } from 'next-auth/react'
import { roleChecker } from '../../../lib/roleChecker'

interface EditMemberButtonProps {
  institute: Partial<ExtendedInstitute>
  currentValue: Partial<ExtendedInstitute> & Partial<ProfileToInstituteBridge>
}

const EditMemberButton: React.FC<EditMemberButtonProps> = (props) => {
  const institute = props.institute

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [submitting, setSubmitting] = React.useState(false)

  const { control, handleSubmit, reset, setValue } = useForm<Partial<ExtendedInstitute> & ProfileToInstituteBridge>();
  const toast = useToast()
  const router = useRouter()
  const key = useUUID()

  const onSubmit: SubmitHandler<Partial<ExtendedInstitute> & ProfileToInstituteBridge> = async data => {
    setSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/institutes/${institute.id}/members`, {
      method: 'POST',
      body: JSON.stringify({...data, email: props.currentValue.email})
    }).then((i) => i.json())

    if (res.success) {
      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
      toast({
        title: 'Success!',
        description: 'Successfully edited membership!',
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

  const session = useSession()

  if (!roleChecker(session.data.profile, ['urc_chairperson', 'urc_staff'])) {
    return <></>
  }
  
  return (
    <>
      <IconButton
        aria-label='Edit Member'
        onClick={onOpen}
        icon={<EditIcon />}
      />
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Edit Membership</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <VStack spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Role Title</Text>
                <Controller
                  name="role_title"
                  control={control}
                  defaultValue={props.currentValue.role_title ?? ''}
                  render={({ field }) => <Input {...field} />}
                />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Start Date</Text>
                <Controller
                  name="start_date"
                  control={control}
                  defaultValue={props.currentValue.start_date ?? new Date()}
                  render={({ field }) => <DatePicker {...field} />}
                />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">End Date</Text>
                <Controller
                  name="end_date"
                  control={control}
                  defaultValue={props.currentValue.end_date ?? null}
                  render={({ field }) => <DatePicker {...field} />}
                />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Controller
                  name="is_head"
                  control={control}
                  defaultValue={props.currentValue.is_head}
                  render={({ field }) => (
                    <Switch 
                      name={field.name} 
                      onBlur={field.onBlur} 
                      onChange={field.onChange}
                      ref={field.ref}
                      isChecked={field.value}
                      marginLeft="1rem"
                    >
                      Center Head
                    </Switch>
                  )}
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

export default EditMemberButton