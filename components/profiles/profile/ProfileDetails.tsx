import React from 'react'

import { Avatar, Divider, Heading, HStack, Tag, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import Card from '../../../components/Card'

import type { ComponentProps } from '../../../types/profile-card'

const ProfileDetails: React.FC<ComponentProps> = (props) => {
  const profile = props.profile

  return (
    <Card>
      <VStack spacing={6} align="baseline">
        <Wrap>
          <WrapItem>
            <Heading
              fontFamily="body"
              fontSize="xl"
            >
              Profile Details
            </Heading>
          </WrapItem>
          { profile.user && (
            <WrapItem>
              <Tag
                bgColor="brand.blue"
                textColor="white"
                borderRadius="20px"
                fontSize="xs"
                fontWeight="bold"
                paddingX="0.8rem"
              >
                Connected to Google Account
              </Tag>
            </WrapItem>
          ) }
        </Wrap>
        <Divider />
        <HStack w="full" spacing={10} align="flex-start">
          <Avatar src={`/api/files/get/${profile.photo_id}`} size="2xl" />
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
                  {profile.email}
                </Text>
              </WrapItem>
            </Wrap>
            <Wrap align="baseline">
              <WrapItem>
                <Heading
                  fontFamily="body"
                  fontSize="md"
                >
                  First Name:
                </Heading>
              </WrapItem>
              <WrapItem>
                <Text>
                  {profile.first_name}
                </Text>
              </WrapItem>
            </Wrap>
            <Wrap align="baseline">
              <WrapItem>
                <Heading
                  fontFamily="body"
                  fontSize="md"
                >
                  Middle Initial:
                </Heading>
              </WrapItem>
              <WrapItem>
                <Text>
                  {profile.middle_initial}
                </Text>
              </WrapItem>
            </Wrap>
            <Wrap align="baseline">
              <WrapItem>
                <Heading
                  fontFamily="body"
                  fontSize="md"
                >
                  Last Name:
                </Heading>
              </WrapItem>
              <WrapItem>
                <Text>
                  {profile.last_name}
                </Text>
              </WrapItem>
            </Wrap>
            <Wrap align="baseline">
              <WrapItem>
                <Heading
                  fontFamily="body"
                  fontSize="md"
                >
                  Titles:
                </Heading>
              </WrapItem>
              <WrapItem>
                <Text>
                  {profile.titles}
                </Text>
              </WrapItem>
            </Wrap>
            <Wrap align="baseline">
              <WrapItem>
                <Heading
                  fontFamily="body"
                  fontSize="md"
                >
                  Honorific:
                </Heading>
              </WrapItem>
              <WrapItem>
                <Text>
                  {profile.honorific}
                </Text>
              </WrapItem>
            </Wrap>
          </VStack>
        </HStack>
      </VStack>
    </Card>
  )
}

export default ProfileDetails
