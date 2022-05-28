import React from 'react'

import { Heading, HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import InnerCard from '../../general/InnerCard'
import SmallAvatar from '../../general/SmallAvatar'

import { format } from 'date-fns'

import type { 
  ExtendedBookPublication,
  ExtendedExternalResearch,
  ExtendedJournalPublication,
  ExtendedProject,
  ExtendedResearchDissemination,
  ExtendedResearchEventAttendance,
  ExtendedResearchPresentation
} from '../../../types/profile-card'

import VerifiedTag from '../../general/VerifiedTag'
import ApprovalTag from '../../general/ApprovalTag'

interface CardTemplateProps {
  entry: ExtendedBookPublication |
    ExtendedExternalResearch |
    ExtendedJournalPublication |
    ExtendedResearchDissemination |
    ExtendedResearchPresentation |
    ExtendedProject |
    ExtendedResearchEventAttendance
  href?: string
  role?: string
}

const CardTemplate: React.FC<CardTemplateProps> = (props) => {
  const entry = props.entry

  return (
    <InnerCard href={props.href} w="full">
      <VStack alignItems="flex-start" spacing={4}>
        <Heading
          size="md"
          fontFamily="body"
          textAlign="left"
        >
          {'title' in entry ? entry?.title : entry.event_name}
        </Heading>
        <Wrap align="center" spacing="2">
          { 'bridge_profiles' in entry ? entry?.bridge_profiles.map((bridge) => (
            <WrapItem key={bridge.profile.id}>
              <SmallAvatar
                {...bridge.profile}
              />
            </WrapItem>
          )) : (
            <WrapItem key={entry.profile.id}>
              <SmallAvatar
                {...entry.profile}
              />
            </WrapItem>
          ) }
        </Wrap>
        { props.role ? (
          <Text fontSize="sm">
            <strong>Role</strong>: {props.role}
          </Text>
        ) : null }
        <Text fontStyle="italic" fontSize="sm">
          Last updated: { format(new Date(entry?.updated_at), 'MMM dd, yyyy h:mm a') }
        </Text>
        <HStack>
          { "verified" in entry ? (
            <VerifiedTag status={entry?.verified} />
          ) : (
            <ApprovalTag status={entry?.approved} />
          ) }
        </HStack>
      </VStack>
    </InnerCard>
  )
}

export default CardTemplate
