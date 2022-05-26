import React from 'react'
import { VStack, HStack, Heading, Text, Tag, Button, Wrap, WrapItem, Box, Center, Spinner, BoxProps, Avatar } from '@chakra-ui/react'

import Card from '../../components/Card'
import SmallAvatar from '../../components/SmallAvatar'

import { format } from 'date-fns'

import parse from '../../lib/client/parseHTML'

import type { Profile, User } from '@prisma/client'

import { useRouter } from 'next/router'

interface ProfileCardProps extends BoxProps {
  profile: (Profile & {
    user: User;
  })
}

const ProfileCard: React.FC<ProfileCardProps> = (props) => {
  const { profile } = props

  const divProps = Object.assign({}, props)
  delete divProps.profile

  const router = useRouter()

  return (
    <Card
      as="a"
      href={`/profiles/${profile.id}`}
      transition="box-shadow 0.05s, background-color 0.1s"
      _hover={{
        backgroundColor: "brand.cardBackground",
        boxShadow: "-5px 5px 30px -20px"
      }}
      _active={{
        boxShadow: "-5px 5px 20px -20px"
      }}
      onClick={(e) => {
        e.preventDefault()
        router.push(`/profiles/${profile.id}`)
      }}
      {...divProps}
    >
      <HStack spacing={4} alignItems="flex-start">
        <Avatar src={`/api/files/get/${profile.photo_id}`} />
        <VStack alignItems="flex-start" spacing={1}>
          <Heading
            size="sm"
            fontFamily="body"
            textAlign="left"
          >
            {profile.email}
          </Heading>
          <Text>
            {profile.first_name} {profile.middle_initial} {profile.last_name}
          </Text>
        </VStack>
      </HStack>
    </Card>
  )
}

export default ProfileCard