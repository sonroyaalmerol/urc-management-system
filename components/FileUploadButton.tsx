import React from 'react'
import { VStack, Heading, Wrap, WrapItem, Text, Box, InputProps } from '@chakra-ui/react'

import Button from './Button'

import { AttachmentIcon } from '@chakra-ui/icons'

import formatBytes from '../lib/formatBytes'

interface FileUploadButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  file: FileList,
  disabled?: boolean
}

const FileUploadButton: React.ForwardRefRenderFunction<HTMLInputElement, FileUploadButtonProps> = (props, ref) => {
  const { file } = props

  const divProps = Object.assign({}, props)
  delete divProps.file

  return (
    <VStack w="100%" align="baseline" spacing={2}>
      { file?.length > 0 && (
        <Box
          backgroundColor="brand.cardBackground"
          borderRadius={10}
          padding="1rem"
          w="100%"
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
                  {file[0].name}
                </Heading>
                <Text
                  color="brand.blue"
                  fontSize="sm"
                >
                  { formatBytes(file[0].size) }
                </Text>
              </VStack>
            </WrapItem>
          </Wrap>
        </Box>
      ) }
      <Box>
        <input
          type="file"
          style={{ display: 'none' }}
          id="upload-button-file"
          multiple={false}
          ref={ref}
          {...divProps}
        />
        <label htmlFor="upload-button-file">
          <Wrap align="center" spacing={4} display={props.disabled ? 'none' : 'block'}>
            <WrapItem>
              <Button cursor="pointer" as="span">Upload File</Button>
            </WrapItem>
            <WrapItem>
              <Text
                fontStyle="italic"
                fontSize="sm"
                color="brand.blue"
              >
                After uploading, click the Submit button to complete the submission.
              </Text>
            </WrapItem>
          </Wrap>
        </label>
      </Box>
    </VStack>
  )
}
export default React.forwardRef(FileUploadButton)