import React from 'react'

import { Avatar, Divider, Heading, Tag, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import Card from '../../general/Card'

import type { ComponentProps } from '../../../types/profile-card'
import AvatarUploadable from '../../general/AvatarUploadable'

const InstituteDetails: React.FC<ComponentProps> = (props) => {
  const institute = props.institute

  return (
    <Card>
      <VStack spacing={6} align="baseline">
        <Wrap>
          <WrapItem>
            <Heading
              fontFamily="body"
              fontSize="xl"
            >
              Institute Details
            </Heading>
          </WrapItem>
        </Wrap>
        <Divider />
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
            </VStack>
          </WrapItem>
        </Wrap>
      </VStack>
    </Card>
  )
}

export default InstituteDetails
