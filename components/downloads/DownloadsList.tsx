import React from 'react'

import { useSession } from 'next-auth/react'
import ListTemplate from '../general/templates/ListTemplate'
import { Box, Center, Heading, HStack, Input, Select, Spacer, Text, Textarea, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Deadline, Download, DownloadCategory } from '@prisma/client'
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
import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import IconButtonWithConfirmation from '../general/IconButtonWithConfirmation'
import fetchWithFile from '../../utils/client/fetchWithFile'
import FileUploadButton from '../general/FileUploadButton'
import { ExtendedDownload } from '../../types/profile-card'

interface DownloadsListProps {
  
}

const DownloadsList: React.FC<DownloadsListProps> = (props) => {
  const [entries, setEntries] = React.useState<ExtendedDownload[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [categoryFilter, setCategoryFilter] = React.useState('')

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/downloads?${categoryFilter ? `&category=${categoryFilter}` : ''}${entries.length > 0 && !args?.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
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
  }, [categoryFilter])

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [submitting, setSubmitting] = React.useState(false)

  const { control, handleSubmit, reset, watch, register } = useForm<Partial<ExtendedDownload & { file: FileList, category_id: string }>>();

  const { file } = watch()

  const router = useRouter()
  const toast = useToast()

  const uuid = useUUID()

  const onSubmit: SubmitHandler<Partial<ExtendedDownload & { file: FileList, category_id: string }>> = async data => {
    setSubmitting(true)

    const res = await fetchWithFile(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/downloads`, {...data, id: currentDownload?.id ?? undefined})

    if (res.success) {
      router.push(`/downloads?key=${uuid}`)
      toast({
        title: 'Success!',
        description: 'Successfully added download!',
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

    const res = await fetchWithFile(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/downloads`, { id }, 'DELETE')

    if (res.success) {
      router.push(`/downloads?key=${uuid}`)
      toast({
        title: 'Success!',
        description: 'Successfully deleted download!',
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

  const [categories, setCategories] = React.useState<DownloadCategory[]>([])
  const [currentDownload, setCurrentDownload] = React.useState<ExtendedDownload>(null)

  const getCategories = async () => {
    const tmp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/downloads/categories`).then(res => res.json())
    setCategories(tmp?.data ?? [])
  }

  React.useEffect(() => {
    getCategories()
  }, [])

  return (
    <>
      <ListTemplate
        title="Downloads"
        loading={loading}
        hasMore={entries.length < count}
        loadMore={loadNewEntries}
        onNew={() => {
          setCurrentDownload(null)
          onOpen()
        }}
        grid={entries.length > 0 ? { base: 1, sm: 2, md: 3 } : 1}
        leftComponent={
          <Select
            color="brand.blue"
            borderRadius={10}
            _focus={{
              boxShadow: "none"
            }}
            cursor="pointer"
            value={categoryFilter}
            placeholder="Category"
            onChange={(e) => { setCategoryFilter(e.target.value) }}
          >
            { categories.map((entry) => (
              <option key={entry.id} value={entry.id}>{entry.title}</option>
            ))}
          </Select>
        }
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
                  Uploaded: { format(new Date(entry.created_at), 'MMM dd, yyyy') }
                </Text>
                <Text>{entry.description}</Text>
              </VStack>
              <Spacer />
              <VStack>
                <IconButton
                  aria-label="View"
                  icon={<ViewIcon />}
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/api/files/get/${entry.upload_id}`)}
                />
                <IconButton
                  aria-label="Edit"
                  icon={<EditIcon />}
                  onClick={() => {
                    setCurrentDownload(entry)
                    onOpen()
                  }}
                />
                <IconButtonWithConfirmation 
                  aria-label='Remove'
                  color="white"
                  bgColor="brand.red"
                  borderRadius={10}
                  _hover={{
                    color: 'brand.red',
                    bgColor: 'brand.cardBackground'
                  }}
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
          <ModalHeader>{currentDownload ? 'Edit' : 'New'} Download</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack w="full" spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Title</Text>
                <Controller
                  name="title"
                  control={control}
                  defaultValue={currentDownload?.title ?? ''}
                  render={({ field }) => 
                    <Input {...field}/>
                  }
                />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Description</Text>
                <Controller
                  name="description"
                  control={control}
                  defaultValue={currentDownload?.description ?? ''}
                  render={({ field }) => 
                    <Textarea {...field}/>
                  }
                />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Category</Text>
                <Controller
                  name="category_id"
                  control={control}
                  defaultValue={currentDownload?.categories[0]?.id ?? ''}
                  render={({ field }) => 
                    <Select
                      color="brand.blue"
                      borderRadius={10}
                      _focus={{
                        boxShadow: "none"
                      }}
                      cursor="pointer"
                      {...field}
                    >
                      { categories.map((entry) => (
                        <option key={entry.id} value={entry.id}>{entry.title}</option>
                      ))}
                    </Select>
                  }
                />
              </VStack>
              { currentDownload ? null : (
                <VStack w="full" align="baseline" spacing={1}>
                  <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">File Upload</Text>
                  <FileUploadButton files={file} {...register('file')} />
                </VStack>
              ) }
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

export default DownloadsList
