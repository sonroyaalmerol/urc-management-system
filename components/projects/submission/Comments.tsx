import React from 'react'
import { VStack, Heading, Text, HStack, Avatar, Wrap, WrapItem, Tag, Textarea, useToast, SimpleGrid } from '@chakra-ui/react'

import Button from '../../general/Button'


import type { Comment, Profile, Project, FileUpload } from '@prisma/client'
import Card from '../../general/Card'

import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { ExtendedSubmission } from '../../../types/profile-card'
import { useSession } from 'next-auth/react'


interface CommentsProps {
  submission: ExtendedSubmission
}

const Comments: React.FC<CommentsProps> = (props) => {
  const { control, handleSubmit, reset } = useForm<Partial<Comment>>();

  const [comments, setComments] = React.useState(props.submission.comments)
  const [submitting, setSubmitting] = React.useState(false)

  const session = useSession()

  const onSubmit: SubmitHandler<Partial<Comment>> = async data => {
    setSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/submissions/${props.submission.id}/comments`, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then((i) => i.json())

    if (!res.error) {
      setComments((curr) => [res.data, ...curr])
    }

    setSubmitting(false)
    reset()
  };

  return (
    <VStack align="baseline" w="full" spacing={4}>
      <Heading fontFamily="body" fontSize="lg">
        Comments
      </Heading>
      <Card>
        <VStack align="baseline" spacing={6}>
          <HStack as="form" onSubmit={handleSubmit(onSubmit)} spacing={4} w="full" align="flex-start">
            <Avatar src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/files/get/${session.data.profile.photo_id}`} />
            <VStack align="end" spacing={1} w="full">
              <Controller
                name="content"
                control={control}
                defaultValue={""}
                render={({ field }) => <Textarea {...field} />}
              />
              <Button type="submit" isLoading={submitting}>Comment</Button>
            </VStack>
          </HStack>

          { comments?.map((comment) => (
            <HStack key={comment.id} spacing={4} w="full" align="flex-start">
              <Avatar 
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/files/get/${comment.profile.photo_id}`}
                as="a"
                href={`${process.env.NEXT_PUBLIC_BASE_URL}/profiles/${comment.profile.id}`}
              />
              <VStack align="baseline" spacing={1} w="full">
                <Heading 
                  fontFamily="body" 
                  fontSize="md" 
                  color="brand.blue"
                  as="a"
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/profiles/${comment.profile.id}`}
                >
                  {comment.profile.first_name} {comment.profile.last_name}
                </Heading>
                <Text>{comment.content}</Text>
              </VStack>
            </HStack>
          )) }

        </VStack>
      </Card>
    </VStack>
  )
}

export default Comments