import React from 'react'

import { Heading, HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import InnerCard from '../../InnerCard'
import SmallAvatar from '../../SmallAvatar'

import { format } from 'date-fns'

import { ExtendedResearchDissemination } from '../../../types/profile-card'
import VerifiedTag from '../../VerifiedTag'

const ResearchDisseminationCard: React.FC<{entry: ExtendedResearchDissemination}> = (props) => {
  const entry = props.entry

  return (
    <InnerCard href={`/entrys/${entry?.slug}`} w="full">
      <VStack alignItems="flex-start" spacing={4}>
        <Heading
          size="md"
          fontFamily="body"
          textAlign="left"
        >
          {entry?.title}
        </Heading>
        <Wrap align="center" spacing="2">
          { entry?.bridge_profiles.map((bridge) => (
            <WrapItem key={bridge.profile.user.id}>
              <SmallAvatar
                {...bridge.profile}
              />
            </WrapItem>
          )) }
        </Wrap>
        <Text fontStyle="italic" fontSize="sm">
          Last updated: { format(new Date(entry?.updated_at), 'MMM dd, yyyy h:mm a') }
        </Text>
        <HStack>
          <VerifiedTag status={entry?.verified} />
        </HStack>
      </VStack>
    </InnerCard>
  )
}

export default ResearchDisseminationCard
