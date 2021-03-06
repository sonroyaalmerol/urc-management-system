import React from 'react'
import { VStack, HStack, Heading, Text, Tag, Button, Wrap, WrapItem, Box, Center, Spinner, BoxProps, Avatar } from '@chakra-ui/react'

import Card from '../general/Card'

import type { Institute } from '@prisma/client'

import { useRouter } from 'next/router'

interface InstituteCardProps extends BoxProps {
  institute: Institute
}

const InstituteCard: React.FC<InstituteCardProps> = (props) => {
  const { institute } = props

  const divProps = Object.assign({}, props)
  delete divProps.institute

  const router = useRouter()

  return (
    <Card
      as="a"
      href={`${process.env.NEXT_PUBLIC_BASE_URL}/institutes/${institute.id}`}
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
        router.push(`/institutes/${institute.id}`)
      }}
      {...divProps}
    >
      <HStack spacing={4} alignItems="flex-start">
        <Avatar src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/files/get/${institute.photo_id}`} />
        <VStack alignItems="flex-start" spacing={1}>
          <Heading
            size="sm"
            fontFamily="body"
            textAlign="left"
          >
            {institute.name} {institute.short_name ? `(${institute.short_name})` : ''}
          </Heading>
          <Text overflowWrap="anywhere">
            {institute.email}
          </Text>
        </VStack>
      </HStack>
    </Card>
  )
}

export default InstituteCard