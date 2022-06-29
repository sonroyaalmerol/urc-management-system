import React from 'react'
import { VStack, Heading, Wrap, WrapItem, Text, Box, BoxProps, HStack, useToast, Spacer } from '@chakra-ui/react'


import { AttachmentIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons'

import formatBytes from '../../utils/formatBytes'
import type { FileUpload } from '@prisma/client'
import IconButton from './IconButton'
import { useRouter } from 'next/router'
import useUUID from '../../utils/client/useUUID'
import IconButtonWithConfirmation from './IconButtonWithConfirmation'

interface FileDetailsProps extends BoxProps {
  file: File | FileUpload,
  isViewable?: boolean,
  isRemovable?: boolean
}

const FileDetails: React.ForwardRefRenderFunction<HTMLDivElement, FileDetailsProps> = (props, ref) => {
  const { file } = props

  const divProps = Object.assign({}, props)
  delete divProps.file
  delete divProps.isViewable

  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const uuid = useUUID()

  const toast = useToast()

  const onDelete = async () => {
    setLoading(true)

    if ('id' in file) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/files/${file.id}`, {
        method: 'DELETE'
      }).then((i) => i.json())

      if (res.success) {
        router.push({
          pathname: router.asPath.split('?')[0],
          query: {
            key: uuid
          }
        })
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
    }
    
    setLoading(false)
  };

  return (
    <Box
      backgroundColor="brand.cardBackground"
      borderRadius={10}
      padding="1rem"
      w="full"
      bgColor="brand.cardBackground"
      transition="background-color 0.05s"
      {...divProps}
    >
      <HStack spacing={4}>
        <Wrap align="center" spacing={4}>
          <WrapItem>
            <AttachmentIcon fontSize="2xl" color="brand.blue" />
          </WrapItem>
          <WrapItem>
            <VStack spacing={0} align="baseline">
              <Heading
                fontFamily="body"
                fontSize="sm"
              >
                {file?.name}
              </Heading>
              <Text
                color="brand.blue"
                fontSize="sm"
              >
                { formatBytes(file?.size ?? 0) }
              </Text>
            </VStack>
          </WrapItem>
        </Wrap>
        <Spacer />
        <VStack>
          { props.isViewable && "id" in file ? (
            <IconButton
              aria-label="View File"
              icon={<ViewIcon />}
              isLoading={loading}
              onClick={() => {
                window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/api/files/get/${file.id}`, '_blank')
              }}
            />
          ) : null }
          { props.isRemovable && "id" in file ? (
            <IconButtonWithConfirmation
              aria-label="Delete File"
              icon={<DeleteIcon />}
              variant='red'
              isLoading={loading}
              confirmationMessage={
                `Remove ${file.name} from related files?`
              }
              onClick={() => {
                onDelete()
              }}
            />
          ) : null }
        </VStack>
      </HStack>
    </Box>
  )
}
export default React.forwardRef(FileDetails)