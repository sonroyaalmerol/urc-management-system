import React from 'react'

import { Heading, HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import InnerCard from '../../general/InnerCard'
import SmallAvatar from '../../general/SmallAvatar'

import { format } from 'date-fns'

import type { 
  ExtendedBookPublication,
  ExtendedExternalResearch,
  ExtendedJournalPublication,
  ExtendedProfile,
  ExtendedProject,
  ExtendedResearchDissemination,
  ExtendedResearchEvent,
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
    ExtendedResearchEvent |
    ExtendedProfile
  href?: string
  role?: string
  onClick?: () => void
  disabled?: boolean
}

const CardTemplate: React.FC<CardTemplateProps> = (props) => {
  const entry = props.entry

  return (
    <InnerCard href={props.href} onClick={props.onClick} w="full">
      <VStack alignItems="flex-start" spacing={4}>
        <Heading
          size="md"
          fontFamily="body"
          textAlign="left"
        >
          {'title' in entry ? (
            entry?.title
          ) : 'event_name' in entry ? (
            entry.event_name
          ) : (
            `${entry.first_name} ${entry.last_name}`
          )}
        </Heading>
        <Wrap align="center" spacing="2">
          { 'bridge_profiles' in entry ? entry?.bridge_profiles.map((bridge) => (
            <WrapItem key={bridge.profile.id}>
              <SmallAvatar
                {...bridge.profile}
              />
            </WrapItem>
          )) : 'profile' in entry ? (
            <WrapItem>
              <SmallAvatar
                {...entry.profile}
              />
            </WrapItem>
          ) : (
            <WrapItem>
              <SmallAvatar
                {...entry}
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
          ) : 'approved' in entry ? (
            <ApprovalTag status={entry?.approved} />
          ) : null }
        </HStack>
      </VStack>
    </InnerCard>
  )
}

export default CardTemplate
