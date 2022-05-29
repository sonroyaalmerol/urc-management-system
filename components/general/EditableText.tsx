import { Input, InputProps, Box, BoxProps } from '@chakra-ui/react'
import React from 'react'
import parseHTML from '../../lib/client/parseHTML'

interface EditableTextProps extends InputProps {
  editMode?: boolean
  plainTextStyle?: BoxProps
}

const EditableText: React.ForwardRefRenderFunction<HTMLInputElement, EditableTextProps> = (props, ref) => {
  const divProps = Object.assign({}, props)
  delete divProps?.editMode
  delete divProps?.children
  delete divProps?.plainTextStyle?.children
  return (
    <>
      { props.editMode ? (
        <Input 
          borderRadius={10}
          w="full"
          minH="unset"
          overflow="hidden"
          resize="none"
          ref={ref}
          {...divProps}
        />
      ) : (
        <Box {...props.plainTextStyle}>
          {parseHTML(props.value as string)}
        </Box>
      ) }
    </>
  )
}

export default React.forwardRef(EditableText)