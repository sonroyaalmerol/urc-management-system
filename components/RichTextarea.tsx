// Import React dependencies.
import { Box, Textarea, TextareaProps } from '@chakra-ui/react'
import React, { useState } from 'react'

import { EditorState, ContentState, convertToRaw } from 'draft-js'

import draftToHtml from 'draftjs-to-html'

import dynamic from 'next/dynamic';
import type { EditorProps } from 'react-draft-wysiwyg'

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
) as unknown as React.FC<EditorProps>

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

const RichTextarea: React.ForwardRefRenderFunction<HTMLTextAreaElement, TextareaProps> = (props, ref) => {
  const contentState = React.useMemo(() => {
    if (props.value && typeof window === 'object') {
      const htmlToDraft = require('html-to-draftjs').default
      const currentState = ContentState.createFromBlockArray(
        htmlToDraft(
          (props.value as string)
            .replace('<b>', '<strong>')
            .replace('</b>', '</strong>')
            .replace('<i>', '<em>')
            .replace('</i>', '</em>')
            .replace('<u>', '<ins>')
            .replace('</u>', '</ins>')
        )
      )
      return currentState
    }

    return ContentState.createFromText('')
  }, [props.value])

  const divProps = Object.assign({}, props)
  delete divProps.value
  delete divProps.onChange
  delete divProps.key
  delete divProps.placeholder

  const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState))

  /* React.useEffect(() => {
    setEditorState(EditorState.createWithContent(contentState))
  }, [contentState]) */

  const textAreaValue = React.useMemo(() => {
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }, [editorState])

  React.useEffect(() => {
    if (props.onChange) {
      props.onChange({ target: { value: textAreaValue } } as any)
    }
  }, [textAreaValue])

  return (
    <Box
      key={props.key}
      w="100%"
      padding={4}
      border="1px"
      borderRadius="10px"
      borderColor="gray.200"
      transition="border-color 0.3s"
      _hover={{
        borderColor: "gray.300"
      }}
    >
      <Editor
        editorState={editorState}
        onEditorStateChange={(editorState: EditorState) => {
          setEditorState(editorState)
        }}
        placeholder={props.placeholder}
        readOnly={props.isReadOnly}
        toolbar={{
          options: [
            'inline',
            'list',
            'textAlign',
            'history'
          ]
        }}
      />
      <Textarea
        hidden
        onChange={() => { }}
        value={textAreaValue}
        ref={ref}
        {...divProps}
      />
    </Box>
  )
}

export default React.forwardRef(RichTextarea)