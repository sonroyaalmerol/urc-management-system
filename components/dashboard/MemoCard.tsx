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
  Heading
} from '@chakra-ui/react'

import SmallAvatar from '../general/SmallAvatar'

import parse from '../../lib/client/parseHTML'
import { DownloadIcon } from '@chakra-ui/icons'
import format from 'date-fns/format'
import VerifiedTag from '../general/VerifiedTag'

interface MemoCardProps extends CardProps {
  memo: (InstituteNews & {
    profile: Profile;
    uploads: FileUpload[];
    institute: Institute;
  })
}

const MemoCard: React.FC<MemoCardProps> = (props) => {
  const divProps = Object.assign({}, props)
  delete divProps.memo

  return (
    <Card
      {...divProps}
    >
      <VStack
        align="normal"
        spacing={4}
      >
        <Wrap>
          <WrapItem>
            <Tag
              bgColor="brand.lightBlue"
              textColor="white"
              borderRadius="20px"
              fontSize="xs"
              fontWeight="bold"
              paddingX="0.8rem"
            >
              Memo
            </Tag>
          </WrapItem>
          <WrapItem>
            {
              props.memo.institute ? (
                <Tag
                  bgColor="brand.blue"
                  textColor="white"
                  borderRadius="20px"
                  fontSize="xs"
                  fontWeight="bold"
                  paddingX="0.8rem"
                >
                  {props.memo.institute.short_name}
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
            <VerifiedTag status={props.memo.verified} />
          </WrapItem>
        </Wrap>
        
        <Wrap align="center" spacing="2">
          <WrapItem>
            <SmallAvatar
              {...props.memo.profile}
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
          <Heading fontFamily="body" size="md">
            {props.memo.title}
          </Heading>

          <Text fontSize="xs" fontStyle="italic">
            { format(new Date(props.memo.created_at), 'MMM dd, yyyy h:mm a') }
          </Text>
        </VStack>

        <Box fontSize="sm">
          { parse(props.memo.content) }
        </Box>

        <Wrap>
          {props.memo.uploads.map((upload) => (
            <WrapItem key={upload.id}>
              <Button
                as="a"
                whiteSpace="normal"
                wordBreak="break-word"
                href={`/api/files/get/${upload.id}`}
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