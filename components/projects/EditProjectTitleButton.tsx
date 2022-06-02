import React from 'react'

import { useDisclosure, Text, Input, VStack, useToast, Select } from '@chakra-ui/react'
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

import { EditIcon } from '@chakra-ui/icons'
import type { Project, ProjectStatus } from '@prisma/client'
import IconButton from '../general/IconButton'
import { useRouter } from 'next/router'
import { roleChecker } from '../../lib/roleChecker'
import { useSession } from 'next-auth/react'

interface EditProjectTitleButtonProps {
  projectId: string,
  currentTitle: string,
  currentStatus: string
}

const EditProjectTitleButton: React.FC<EditProjectTitleButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [submitting, setSubmitting] = React.useState(false)
  const [statusList, setStatusList] = React.useState<ProjectStatus[]>([])

  const { control, handleSubmit, reset } = useForm<Partial<Project>>();
  const router = useRouter()
  const toast = useToast()

  const onSubmit: SubmitHandler<Partial<Project>> = async data => {
    setSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects`, {
      method: 'POST',
      body: JSON.stringify({...data, mode: 'update', id: props.projectId})
    }).then((i) => i.json())

    if (res.success) {
      router.push(`/projects/${res.data.slug}`)
      toast({
        title: 'Success!',
        description: 'Successfully updated project!',
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

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects/status`).then((i) => i.json()).then((res) => setStatusList(res.data))
  }, [])

  const session = useSession()

  if (!(roleChecker(session.data.profile, ['researcher']))) {
    return <></>
  }

  return (
    <>
      <IconButton
        aria-label='Edit Project'
        onClick={onOpen}
        icon={<EditIcon />}
      />
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Update Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Project Title</Text>
                <Controller
                  name="title"
                  control={control}
                  defaultValue={props.currentTitle}
                  render={({ field }) => <Input {...field} />}
                />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Status</Text>
                <Controller
                  name="project_status_id"
                  control={control}
                  defaultValue={props.currentStatus}
                  render={({ field }) => (
                    <Select {...field}>
                      { statusList.map((status) => (
                        <option key={status.id} value={status.id}>{status.comment}</option>
                      )) }
                    </Select>
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

export default EditProjectTitleButton