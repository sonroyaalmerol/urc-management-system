import React from 'react'
import { VStack, Heading, Wrap, WrapItem, Text, Box, InputProps } from '@chakra-ui/react'

import Button from './Button'

import { AttachmentIcon } from '@chakra-ui/icons'

import formatBytes from '../../lib/formatBytes'
import FileDetails from './FileDetails'

interface FileUploadButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  file: FileList,
  disabled?: boolean
}

const FileUploadButton: React.ForwardRefRenderFunction<HTMLInputElement, FileUploadButtonProps> = (props, ref) => {
  const { file } = props

  const divProps = Object.assign({}, props)
  delete divProps.file

  return (
    <VStack w="full" align="baseline" spacing={2}>
      { file?.length > 0 && (
        <FileDetails file={file[0]} />
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