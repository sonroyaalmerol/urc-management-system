import React from 'react'

import { useSession } from 'next-auth/react'
import ListTemplate from '../general/templates/ListTemplate'
import type { DownloadCategory } from '@prisma/client'
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
import EditDownloadCategoryButton from './EditDownloadCategoryButton'
import DeleteDownloadCategoryButton from './DeleteDownloadCategoryButton'

interface DownloadCategoriesProps {
  
}

const DownloadCategories: React.FC<DownloadCategoriesProps> = (props) => {
  const [entries, setEntries] = React.useState<DownloadCategory[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/downloads/categories`
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

  const { control, handleSubmit, reset, setValue } = useForm<Partial<DownloadCategory>>();

  const router = useRouter()
  const key = useUUID()
  const toast = useToast()

  const onSubmit: SubmitHandler<Partial<DownloadCategory>> = async data => {
    setSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/downloads/categories`, {
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
      title="Download Categories"
      loading={loading}
      hasMore={false}
      loadMore={() => {}}
      grid={{ base: 1 }}
      onNew={onOpen}
    >
      <Accordion allowToggle>
      { entries.length > 0 ? entries.map((entry) => (
        <AccordionItem key={entry.id}>
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                {entry.title}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <VStack w="full" align="baseline" spacing={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} w="full">
                <EditDownloadCategoryButton category={entry} />
                <DeleteDownloadCategoryButton category={entry} />
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
          <ModalHeader>Add Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <VStack spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Name</Text>
                <Controller
                  name="title"
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

export default DownloadCategories
