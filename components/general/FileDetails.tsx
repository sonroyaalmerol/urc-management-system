import React from 'react'
import { VStack, Heading, Wrap, WrapItem, Text, Box, BoxProps } from '@chakra-ui/react'


import { AttachmentIcon } from '@chakra-ui/icons'

import formatBytes from '../../lib/formatBytes'
import type { FileUpload } from '@prisma/client'

interface FileDetailsProps extends BoxProps {
  file: File | FileUpload,
  isViewable?: boolean
}

const FileDetails: React.ForwardRefRenderFunction<HTMLDivElement, FileDetailsProps> = (props, ref) => {
  const { file } = props

  const divProps = Object.assign({}, props)
  delete divProps.file
  delete divProps.isViewable

  return (
    <Box
      as={props.isViewable ? "a" : undefined}
      backgroundColor="brand.cardBackground"
      borderRadius={10}
      padding="1rem"
      w="full"
      bgColor="brand.cardBackground"
      transition="background-color 0.05s"
      _hover={props.isViewable ? {
        bgColor: "brand.cardBackgroundHover"
      } : undefined}
      _active={props.isViewable ? {
        bgColor: "brand.cardBackgroundActive"
      } : undefined}
      href={props.isViewable && "id" in file ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/files/get/${file.id}` : undefined}
      target={props.isViewable ? "_blank" : undefined}
      {...divProps}
    >
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
    </Box>
  )
}
export default React.forwardRef(FileDetails)