import React from 'react'
import { VStack, HStack, Heading, Text, BoxProps, Avatar, Spacer, Wrap, WrapItem } from '@chakra-ui/react'


import type { Deliverable } from '@prisma/client'

import { useRouter } from 'next/router'
import InnerCard from '../general/InnerCard'
import { format } from 'date-fns'
import DoneTag from '../general/DoneTag'

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
      href={!deliverable.done ? `${process.env.NEXT_PUBLIC_BASE_URL}/projects/${props.projectSlug}/submissions/new/deliverable?deliverable_id=${deliverable.id}` : undefined}
      transition="box-shadow 0.05s, background-color 0.1s"
      _hover={!deliverable.done ? {
        backgroundColor: "brand.cardBackground",
        boxShadow: "-5px 5px 30px -20px"
      } : undefined}
      _active={!deliverable.done ? {
        boxShadow: "-5px 5px 20px -20px"
      } : undefined}
      onClick={(e) => {
        e.preventDefault()
        if (!deliverable.done) {
          router.push(`/projects/${props.projectSlug}/submissions/new/deliverable?deliverable_id=${deliverable.id}`)
        }
      }}
      {...divProps}
    >
      <VStack alignItems="flex-start" spacing={1} h="full">
        <Wrap spacing={2}>
          <WrapItem>
            <Heading
              size="sm"
              fontFamily="body"
              textAlign="left"
              textDecor={deliverable.done ? "line-through" : undefined}
            >
              {deliverable.title}
            </Heading>
          </WrapItem>
          <WrapItem>
            <DoneTag status={deliverable.done} />
          </WrapItem>
        </Wrap>
        <Text overflowWrap="anywhere" textDecor={deliverable.done ? "line-through" : undefined}>
          {deliverable.description}
        </Text>
        <Spacer />
        <Text fontSize="sm" fontStyle="italic" textDecor={deliverable.done ? "line-through" : undefined}>
          Deadline: {format(new Date(deliverable.deadline), 'MMM dd, yyyy')}
        </Text>
      </VStack>
    </InnerCard>
  )
}

export default DeliverableCard