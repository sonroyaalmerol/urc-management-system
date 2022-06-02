import Card from '../general/Card'
import type { CardProps } from '../../types/cardprops'
import { InstituteNews, User, FileUpload, Institute, Profile } from '@prisma/client'
import { 
  Text, 
  VStack,
  Tag,
  Wrap,
  WrapItem,
  Box,
  Button,
  Heading,
  Spacer,
  useToast,
  Input
} from '@chakra-ui/react'

import SmallAvatar from '../general/SmallAvatar'

import { useForm, SubmitHandler, Controller } from "react-hook-form"

import parse from '../../lib/client/parseHTML'
import { CheckIcon, DeleteIcon, DownloadIcon, EditIcon } from '@chakra-ui/icons'
import format from 'date-fns/format'
import VerifiedTag from '../general/VerifiedTag'
import IconButton from '../general/IconButton'
import IconButtonWithConfirmation from '../general/IconButtonWithConfirmation'
import React from 'react'
import RichTextarea from '../general/RichTextarea'
import DatePicker from '../general/DatePicker'
import { useRouter } from 'next/router'
import useUUID from '../../lib/client/useUUID'
import { roleChecker } from '../../lib/roleChecker'
import { useSession } from 'next-auth/react'

interface MemoCardProps extends CardProps {
  memo: (InstituteNews & {
    profile: Profile;
    uploads: FileUpload[];
    institute: Institute;
  })
}

const MemoCard: React.FC<MemoCardProps> = (props) => {
  const [memo, setMemo] = React.useState(props.memo)
  const divProps = Object.assign({}, props)
  delete divProps.memo

  const [editing, setEditing] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  const { handleSubmit, control } = useForm<Partial<InstituteNews>>({
    defaultValues: memo
  });

  const toast = useToast()

  const onSubmit: SubmitHandler<Partial<InstituteNews>> = async data => {
    setSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/news`, { 
      method: 'POST',
      body: JSON.stringify(data)
    }).then((i) => i.json())

    setMemo(res.data)

    if (res.success) {
      toast({
        title: 'Success!',
        description: `Successfully modified details!`,
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
  };

  const router = useRouter()
  const key = useUUID()

  const onDelete = async () => {
    setSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/news`, {
      method: 'DELETE',
      body: JSON.stringify({ id: memo.id })
    }).then((i) => i.json())

    if (res.success) {
      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
      toast({
        title: 'Success!',
        description: 'Successfully deleted news!',
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
  };

  const session = useSession()

  return (
    <Card
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      {...divProps}
    >
      <VStack
        align="normal"
        spacing={4}
      >
        <Wrap align="center">
          <WrapItem>
            <Tag
              bgColor="brand.lightBlue"
              textColor="white"
              borderRadius="20px"
              fontSize="xs"
              fontWeight="bold"
              paddingX="0.8rem"
            >
              News & Updates
            </Tag>
          </WrapItem>
          <WrapItem>
            {
              memo.institute ? (
                <Tag
                  bgColor="brand.blue"
                  textColor="white"
                  borderRadius="20px"
                  fontSize="xs"
                  fontWeight="bold"
                  paddingX="0.8rem"
                >
                  {memo.institute.short_name}
                </Tag>
              ) : (
                <Tag
                  bgColor="brand.blue"
                  textColor="white"
                  borderRadius="20px"
                  fontSize="xs"
                  fontWeight="bold"
                  paddingX="0.8rem"
                >
                  URC
                </Tag>
              )
            }
          </WrapItem>
          <WrapItem>
            <VerifiedTag status={memo.verified} />
          </WrapItem>
          <Spacer />
          { (roleChecker(session.data.profile, ['urc_chairperson', 'urc_staff'])) && (
            <>
              <WrapItem>
                <IconButtonWithConfirmation 
                  aria-label='Remove News'
                  color="white"
                  bgColor="brand.red"
                  _hover={{
                    color: 'brand.red',
                    bgColor: 'brand.cardBackground'
                  }}
                  confirmationMessage={`
                    You are about to delete ${memo.title}. Do you want to proceed?
                  `}
                  isLoading={submitting}
                  icon={<DeleteIcon />}
                  onClick={() => {
                    onDelete()
                  }}
                />
              </WrapItem>
              <WrapItem>
                <IconButton
                  padding={0} 
                  aria-label='Edit News'
                  icon={!editing ? <EditIcon /> : <CheckIcon />}
                  onClick={() => setEditing((prev) => !prev)}
                  type={!editing ? "submit" : "button"}
                  isLoading={submitting}
                />
              </WrapItem>
            </>
          ) }
        </Wrap>
        
        <Wrap align="center" spacing="2">
          <WrapItem>
            <SmallAvatar
              {...memo.profile}
            />
          </WrapItem>
          <WrapItem as="span">
            <Text fontSize="xs" fontStyle="italic">
              posted
            </Text>
          </WrapItem>
        </Wrap>
        
        <VStack
          align="normal"
          spacing={2}
        >
          { editing ? (
            <Controller
              name="title"
              control={control}
              render={({ field }) => 
                <Input
                  {...field}
                />
              }
            />
          ) : (
            <Heading fontFamily="body" size="md">
              {memo.title}
            </Heading>
          ) }
          
          { editing ? (
            <Controller
              name="created_at"
              control={control}
              render={({ field }) => 
                <DatePicker
                  withTime={true}
                  {...field}
                />
              }
            />
          ) : (
            <Text fontSize="xs" fontStyle="italic">
              { format(new Date(memo.created_at), 'MMM dd, yyyy h:mm a') }
            </Text>
          ) }
        </VStack>
        { editing ? (
          <Controller
            name="content"
            control={control}
            render={({ field }) => 
              <RichTextarea
                {...field}
              />
            }
          />
        ) : (
          <Box fontSize="sm">
            { parse(memo.content) }
          </Box>
        ) }

        <Wrap>
          {memo.uploads.map((upload) => (
            <WrapItem key={upload.id}>
              <Button
                as="a"
                whiteSpace="normal"
                wordBreak="break-word"
                href={`${process.env.NEXT_PUBLIC_BASE_URL}/api/files/get/${upload.id}`}
                target="_blank"
                leftIcon={<DownloadIcon />}
              >
                {upload.name}
              </Button>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>
    </Card>
  )
}

export default MemoCard