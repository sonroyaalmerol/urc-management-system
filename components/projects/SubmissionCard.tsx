import React from 'react'
import { VStack, HStack, Avatar, Text, Tag, Button, Wrap, WrapItem, Box, Center, Spinner, BoxProps } from '@chakra-ui/react'

import Card from '../Card'

import type { Project, UserToProjectBridge, User } from '@prisma/client'

import { useRouter } from 'next/router'

interface SubmissionCardProps extends BoxProps {
  submission?: (Project & {
    bridge_users: (UserToProjectBridge & {
        user: User;
    })[];
  })
}

const SubmissionCard: React.FC<SubmissionCardProps> = (props) => {
  const { submission } = props

  const divProps = Object.assign({}, props)
  delete divProps.submission

  const router = useRouter()

  return (
    <Card
      as="a"
      href={`/projects/testsubmissionid`}
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
      }}
    >
      <VStack w="full" alignItems="flex-start" spacing={4}>
        <HStack spacing={4} align="flex-start">
          <Avatar size="sm" />
          <VStack align="flex-start">
            <Wrap>
              <WrapItem>
                <Text
                  fontWeight="bold"
                  color="brand.blue"
                >
                  Jazzie
                </Text>
              </WrapItem>
              <WrapItem>
                <Text fontStyle="italic">
                  submitted a Budget Proposal
                </Text>
              </WrapItem>
              <WrapItem>
                <Tag>for approval</Tag>
              </WrapItem>
            </Wrap>
            <Text fontStyle="italic" color="brand.blue">
              May 17, 2022 at 4:42 pm
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Card>
  )
}

export default SubmissionCard