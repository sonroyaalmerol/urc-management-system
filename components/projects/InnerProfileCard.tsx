import React from 'react'
import { VStack, HStack, Heading, Text, BoxProps, Avatar } from '@chakra-ui/react'


import type { Profile, User } from '@prisma/client'

import { useRouter } from 'next/router'
import InnerCard from '../general/InnerCard'

interface InnerProfileCardProps extends BoxProps {
  profile: (Profile & {
    user: User;
  })
  role: string
}

const InnerProfileCard: React.FC<InnerProfileCardProps> = (props) => {
  const { profile } = props

  const divProps = Object.assign({}, props)
  delete divProps.profile

  const router = useRouter()

  return (
    <InnerCard
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
          <Text fontSize="sm" fontStyle="italic">
            {props.role}
          </Text>
        </VStack>
      </HStack>
    </InnerCard>
  )
}

export default InnerProfileCard