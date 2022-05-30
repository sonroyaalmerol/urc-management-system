import React from 'react'
import { VStack, HStack, Heading, Text, BoxProps, Avatar, Spacer } from '@chakra-ui/react'


import type { Profile, User } from '@prisma/client'

import { useRouter } from 'next/router'
import InnerCard from '../../general/InnerCard'
import IconButton from '../../general/IconButton'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'

interface MemberCardProps extends BoxProps {
  profile: (Profile & {
    user: User;
  })
  role: string
}

const MemberCard: React.FC<MemberCardProps> = (props) => {
  const { profile } = props

  const divProps = Object.assign({}, props)
  delete divProps.profile

  const router = useRouter()

  return (
    <InnerCard
      {...divProps}
    >
      <HStack spacing={8} alignItems="center">
        <HStack spacing={4} alignItems="flex-start">
          <Avatar
            as="a"
            href={`/profiles/${profile.id}`}
            src={`/api/files/get/${profile.photo_id}`}
            onClick={(e) => {
              e.preventDefault()
              router.push(`/profiles/${profile.id}`)
            }}
          />
          <VStack alignItems="flex-start" spacing={1}>
            <Heading
              size="sm"
              fontFamily="body"
              textAlign="left"
            >
              {profile.first_name} {profile.middle_initial} {profile.last_name}
            </Heading>
            <Text>
              {profile.email}
            </Text>
            <Text fontSize="sm" fontStyle="italic">
              {props.role}
            </Text>
          </VStack>
        </HStack>
        <Spacer />
        <VStack>
          <IconButton 
            aria-label='Edit Position'
            icon={<EditIcon />}
          />
          <IconButton 
            aria-label='Remove Member'
            icon={<DeleteIcon />}
            backgroundColor="brand.red"
            borderRadius={10}
            color="white"
            fontWeight="bold"
            _hover={{
              color: "brand.red",
              backgroundColor: "brand.cardBackground"
            }}
          />
        </VStack>
      </HStack>
    </InnerCard>
  )
}

export default MemberCard