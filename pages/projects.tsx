import React from 'react'
import ContentHeader from '../components/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack, HStack, Heading, Text, Tag, Button } from '@chakra-ui/react'

import Deadlines from '../components/Deadlines'
import Card from '../components/Card'
import SearchInput from '../components/SearchInput'
import { AddIcon } from '@chakra-ui/icons'

interface ProjectsProps {

}

const Projects: React.FC<ProjectsProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <VStack spacing={5}>
      <ContentHeader>
        Projects
      </ContentHeader>
      <VStack spacing={5} w="100%">
        <HStack w="100%" spacing={8}>
          <SearchInput />
          <Button
            backgroundColor="brand.blue"
            borderRadius={10}
            color="white"
            fontWeight="bold"
            padding="1.5rem"
            _hover={{
              color: "brand.blue",
              backgroundColor: "brand.cardBackground"
            }}
            leftIcon={<AddIcon />}
          >
            New
          </Button>
        </HStack>
        <VStack w="100%">
          <Card
            as="a"
            href="/projects"
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
            <VStack alignItems="flex-start" spacing={4}>
              <Heading
                size="md"
                fontFamily="body"
                textAlign="left"
              >
                Roosting Behavior and Roost Site Characterization of Pteropus Vampyrus in Malagos Watershed, Davao City, Philippines
              </Heading>
              <Text fontStyle="italic">
                Last updated: May 11, 2022
              </Text>
              <HStack>
                <Tag
                  bgColor="brand.red"
                  textColor="white"
                  borderRadius="20px"
                  fontSize="xs"
                  fontWeight="bold"
                  paddingX="0.8rem"
                >
                  for approval
                </Tag>
              </HStack>
            </VStack>
          </Card>
        </VStack>
      </VStack>
    </VStack>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}

export default Projects