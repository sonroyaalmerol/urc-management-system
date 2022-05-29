import React from 'react'
import { VStack, HStack, Heading, Text, BoxProps, Avatar, Spacer } from '@chakra-ui/react'


import type { Deliverable } from '@prisma/client'

import { useRouter } from 'next/router'
import InnerCard from '../general/InnerCard'
import { format } from 'date-fns'

interface DeliverableCardProps extends BoxProps {
  deliverable: Deliverable,
  projectSlug: string
}

const DeliverableCard: React.FC<DeliverableCardProps> = (props) => {
  const { deliverable } = props

  const divProps = Object.assign({}, props)
  delete divProps.deliverable

  const router = useRouter()

  return (
    <InnerCard
      as="a"
      href={`/projects/${props.projectSlug}/submissions/new/deliverable?deliverable_id=${deliverable.id}`}
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
        router.push(`/projects/${props.projectSlug}/submissions/new/deliverable?deliverable_id=${deliverable.id}`)
      }}
      {...divProps}
    >
      <VStack alignItems="flex-start" spacing={1} h="full">
        <Heading
          size="sm"
          fontFamily="body"
          textAlign="left"
        >
          {deliverable.title}
        </Heading>
        <Text overflowWrap="anywhere">
          {deliverable.description}
        </Text>
        <Spacer />
        <Text fontSize="sm" fontStyle="italic">
          Deadline: {format(new Date(deliverable.deadline), 'MMM dd, yyyy')}
        </Text>
      </VStack>
    </InnerCard>
  )
}

export default DeliverableCard