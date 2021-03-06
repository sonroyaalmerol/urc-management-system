import { Box, BoxProps, Textarea, TextareaProps, TextProps } from '@chakra-ui/react'
import React from 'react'
import ResizeTextarea from "react-textarea-autosize"
import parseHTML from '../../utils/client/parseHTML'
import RichTextarea from './RichTextarea'

interface EditableTextareaProps extends TextareaProps {
  editMode?: boolean
  plainTextStyle?: BoxProps
  rich?: boolean
}

const EditableTextarea: React.ForwardRefRenderFunction<HTMLTextAreaElement, EditableTextareaProps> = (props, ref) => {
  const divProps = Object.assign({}, props)
  delete divProps?.editMode
  delete divProps?.children
  delete divProps?.plainTextStyle?.children
  delete divProps?.rich

  return (
    <>
      { props.editMode ? (
        props.rich ? (
          <RichTextarea
            w="full"
            ref={ref}
            {...divProps}
          />
        ) : (
          <Textarea 
            minH="unset"
            overflow="hidden"
            borderRadius={10}
            w="full"
            resize="none"
            minRows={1}
            size="sm"
            ref={ref}
            as={ResizeTextarea}
            {...divProps}
          />
        )
      ) : (
        <Box {...props.plainTextStyle}>
          {parseHTML(props.value as string)}
        </Box>
      ) }
    </>
  )
}

export default React.forwardRef(EditableTextarea)