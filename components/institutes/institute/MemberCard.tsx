import React from 'react'
import { VStack, HStack, Heading, Text, BoxProps, Avatar, Spacer, useToast } from '@chakra-ui/react'


import type { Institute, Profile, User } from '@prisma/client'

import { useRouter } from 'next/router'
import InnerCard from '../../general/InnerCard'
import IconButton from '../../general/IconButton'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { format } from 'date-fns'
import EditMemberButton from './EditMemberButton'
import { ExtendedInstitute } from '../../../types/profile-card'
import IconButtonWithConfirmation from '../../general/IconButtonWithConfirmation'
import useUUID from '../../../lib/client/useUUID'
import { roleChecker } from '../../../lib/roleChecker'
import { useSession } from 'next-auth/react'

interface MemberCardProps extends BoxProps {
  profile: (Profile & {
    user: User;
  })
  role: string,
  startDate: Date,
  endDate?: Date,
  institute: Partial<ExtendedInstitute>,
  isHead: boolean
}

const MemberCard: React.FC<MemberCardProps> = (props) => {
  const { profile } = props

  const divProps = Object.assign({}, props)
  delete divProps.profile

  const router = useRouter()
  const toast = useToast()
  const key = useUUID()

  const onDelete = async data => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/institutes/${props.institute.id}/members`, {
      method: 'DELETE',
      body: JSON.stringify(data)
    }).then((i) => i.json())

    if (res.success) {
      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
      toast({
        title: 'Success!',
        description: 'Successfully deleted member!',
        status: 'success'
      })
    } else {
      toast({
        title: 'Error!',
        description: res.error,
        status: 'error'
      })
    }
  };

  const session = useSession()

  return (
    <InnerCard
      {...divProps}
    >
      <HStack spacing={8} alignItems="center">
        <HStack spacing={4} alignItems="flex-start">
          <Avatar
            as="a"
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/profiles/${profile.id}`}
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/files/get/${profile.photo_id}`}
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
              {props.role} ({format(new Date(props.startDate), 'MMM dd, yyyy')} - {props.endDate ? format(new Date(props.endDate), 'MMM dd, yyyy') : 'present'})
            </Text>
          </VStack>
        </HStack>
        <Spacer />
        { (roleChecker(session.data.profile, ['urc_chairperson', 'urc_staff'])) && (
          <VStack>
            <EditMemberButton
              institute={props.institute}
              currentValue={{
                email: profile.email,
                role_title: props.role,
                start_date: props.startDate ? new Date(props.startDate) : null,
                end_date: props.endDate ? new Date(props.endDate) : null,
                is_head: props.isHead
              }}
            />
            <IconButtonWithConfirmation 
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
              confirmationMessage={
                `Remove ${profile.first_name}'s membership?`
              }
              onClick={() => {
                onDelete({ email: profile.email })
              }}
            />
          </VStack>
        ) }
      </HStack>
    </InnerCard>
  )
}

export default MemberCard