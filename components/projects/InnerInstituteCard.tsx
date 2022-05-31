import React from 'react'
import { VStack, HStack, Heading, Text, BoxProps, Avatar } from '@chakra-ui/react'


import type { Institute } from '@prisma/client'

import { useRouter } from 'next/router'
import InnerCard from '../general/InnerCard'
import VerifiedTag from '../general/VerifiedTag'

interface InnerInstituteCardProps extends BoxProps {
  institute: Institute
  verified?: boolean
}

const InnerInstituteCard: React.FC<InnerInstituteCardProps> = (props) => {
  const { institute } = props

  const divProps = Object.assign({}, props)
  delete divProps.institute

  const router = useRouter()

  return (
    <InnerCard
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
        router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/institutes/${institute.id}`)
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
          <Text>
            {institute.email}
          </Text>
          <VerifiedTag status={props.verified} />
        </VStack>
      </HStack>
    </InnerCard>
  )
}

export default InnerInstituteCard