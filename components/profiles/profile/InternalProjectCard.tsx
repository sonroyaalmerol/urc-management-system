import React from 'react'

import { Box, Heading, HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import InnerCard from '../../InnerCard'
import SmallAvatar from '../../SmallAvatar'

import { format } from 'date-fns'

import parse from '../../../lib/client/parseHTML'
import ApprovalTag from '../../ApprovalTag'
import { ExtendedProject } from '../../../types/profile-card'

const InternalProjectCard: React.FC<{entry: ExtendedProject}> = (props) => {
  const entry = props.entry

  return (
    <InnerCard href={`/projects/${entry?.slug}`} w="full">
      <VStack alignItems="flex-start" spacing={4}>
        <Heading
          size="md"
          fontFamily="body"
          textAlign="left"
        >
          {entry?.title}
        </Heading>
        <Wrap align="center" spacing="2">
          { entry?.bridge_profiles.length > 0 ? entry?.bridge_profiles.map((bridge) => (
            <WrapItem key={bridge.profile.user.id}>
              <SmallAvatar
                {...bridge.profile}
              />
            </WrapItem>
          )) : (
            <>
              { [...entry?.main_proponents, ...entry?.co_proponents].map((proponent, i) => (
                <WrapItem key={`${proponent}-avatar-${i}`}>
                  <SmallAvatar
                    user={{ name: proponent }}
                  />
                </WrapItem>
              )) }
            </>
          ) }
        </Wrap>
        <Text fontStyle="italic" fontSize="sm">
          Last updated: { format(new Date(entry?.updated_at), 'MMM dd, yyyy h:mm a') }
        </Text>
        <Box fontSize="sm" noOfLines={2}>
          {parse(entry?.abstract, { textOnly: true })}
        </Box>
        <HStack>
          <ApprovalTag status={entry?.approved} />
        </HStack>
      </VStack>
    </InnerCard>
  )
}

export default InternalProjectCard
