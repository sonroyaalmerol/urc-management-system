import React from 'react'

import { Avatar, Divider, Heading, Tag, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import Card from '../../general/Card'

import type { ComponentProps } from '../../../types/profile-card'
import AvatarUploadable from '../../general/AvatarUploadable'

const InstituteDetails: React.FC<ComponentProps> = (props) => {
  const institute = props.institute

  return (
    <VStack w="full">
      <Wrap w="full" my="1rem">
        <WrapItem>
          <Heading
            fontFamily="body"
            fontSize="xl"
          >
            Institute Details
          </Heading>
        </WrapItem>
      </Wrap>
      <Card>
        <VStack spacing={6} align="baseline">
          <Wrap w="full" spacing={10} align="center" justify={{ base: 'center', lg: 'initial' }}>
            <WrapItem>
              <AvatarUploadable
                size="2xl"
                photoId={institute.photo_id}
                instituteId={institute.id}
              />
            </WrapItem>
            <WrapItem>
              <VStack align="baseline">
                <Wrap align="baseline">
                  <WrapItem>
                    <Heading
                      fontFamily="body"
                      fontSize="md"
                    >
                      Email:
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Text>
                      {institute.email}
                    </Text>
                  </WrapItem>
                </Wrap>
                <Wrap align="baseline">
                  <WrapItem>
                    <Heading
                      fontFamily="body"
                      fontSize="md"
                    >
                      Address:
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Text>
                      {institute.address}
                    </Text>
                  </WrapItem>
                </Wrap>
                <Wrap align="baseline">
                  <WrapItem>
                    <Heading
                      fontFamily="body"
                      fontSize="md"
                    >
                      Contact Number:
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Text>
                      {institute.contact_number}
                    </Text>
                  </WrapItem>
                </Wrap>
                <Wrap align="baseline">
                  <WrapItem>
                    <Heading
                      fontFamily="body"
                      fontSize="md"
                    >
                      Research Areas:
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Text>
                      {institute.research_areas}
                    </Text>
                  </WrapItem>
                </Wrap>
              </VStack>
            </WrapItem>
          </Wrap>
          <Wrap align="baseline">
            <WrapItem>
              <Text fontSize="sm">
                {institute.description}
              </Text>
            </WrapItem>
          </Wrap>
        </VStack>
      </Card>
    </VStack>
  )
}

export default InstituteDetails
