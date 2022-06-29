import React from 'react'

import { useDisclosure, VStack, useToast } from '@chakra-ui/react'
import { useForm, SubmitHandler } from "react-hook-form"

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

import { AddIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import useUUID from '../../utils/client/useUUID'
import { useSession } from 'next-auth/react'
import { roleChecker } from '../../utils/roleChecker'
import { MANAGING_DELIVERABLES } from '../../utils/permissions'
import { ExtendedProject } from '../../types/profile-card'
import FileUploadButton from '../general/FileUploadButton'
import fetchWithFile from '../../utils/client/fetchWithFile'

interface NewRelatedFileButtonProps {
  project: Partial<ExtendedProject>
}

const NewRelatedFileButton: React.FC<NewRelatedFileButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [submitting, setSubmitting] = React.useState(false)

  const { handleSubmit, watch, register } = useForm<Partial<{ file: FileList }>>();
  const router = useRouter()
  const toast = useToast()

  const uuid = useUUID()


  const { file } = watch()

  const onSubmit: SubmitHandler<Partial<{ file: FileList }>> = async data => {
    setSubmitting(true)

    console.log(data)
    const res = await fetchWithFile(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects/${props.project.slug}/related_files`, data)

    if (res.success) {
      router.push(`/projects/${props.project.slug}?key=${uuid}`)
      toast({
        title: 'Success!',
        description: 'Successfully uploaded related file!',
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

  const session = useSession()

  if (!roleChecker(session.data.profile, MANAGING_DELIVERABLES)) {
    return <></>
  }

  return (
    <>
      <Button
        aria-label='New Deliverable'
        onClick={onOpen}
        leftIcon={<AddIcon />}
      >
        New Related File
      </Button>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>New Related File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack w="full" spacing={4}>
              <FileUploadButton files={file} {...register('file')} />
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

export default NewRelatedFileButton