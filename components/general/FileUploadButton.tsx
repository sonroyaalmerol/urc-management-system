import React from 'react'
import { VStack, Wrap, WrapItem, Text, Box } from '@chakra-ui/react'

import Button from './Button'

import FileDetails from './FileDetails'

interface FileUploadButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  files: FileList,
  disabled?: boolean
}

const fileListToArray = (files: FileList) => {
  const fileArray: File[] = []

  for (let i = 0; i < files?.length ?? 0; i++) {
    fileArray.push(files.item(i))
  }

  return fileArray
}

const FileUploadButton: React.ForwardRefRenderFunction<HTMLInputElement, FileUploadButtonProps> = (props, ref) => {
  const { files } = props

  const divProps = Object.assign({}, props)
  delete divProps.files

  return (
    <VStack w="full" align="baseline" spacing={2}>
      <Wrap>
        { fileListToArray(files).map((file) => (
          <WrapItem key={file.name}>
            <FileDetails file={file} />
          </WrapItem>
        )) }
      </Wrap>
      <Box>
        <input
          type="file"
          style={{ display: 'none' }}
          id="upload-button-file"
          multiple={true}
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