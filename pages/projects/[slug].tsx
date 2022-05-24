import React from 'react'
import ContentHeader from '../../components/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack, HStack, Heading, Text, Tag, Button, Wrap, WrapItem, chakra, Center, Spinner, Avatar, Spacer, Select } from '@chakra-ui/react'

import Card from '../../components/Card'
import SearchInput from '../../components/SearchInput'
import SmallAvatar from '../../components/SmallAvatar'

import { AddIcon } from '@chakra-ui/icons'
import { format } from 'date-fns'

import parse from '../../lib/client/parseHTML'

import { prisma } from '../../lib/server/prisma'

import type { Project, BudgetProposalSubmission, CapsuleProposalSubmission, FullBlownProposalSubmission } from '@prisma/client'
import { usePrisma } from '../../lib/client/usePrisma'

import InfiniteScroll from 'react-infinite-scroller'
import SubmissionCard from '../../components/projects/SubmissionCard'

interface ProjectProps {

}

const Project: React.FC<ProjectProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const project: Project & {
    budget_proposal_submissions: BudgetProposalSubmission[];
    capsule_proposal_submissions: CapsuleProposalSubmission[];
    full_blown_proposal_submissions: FullBlownProposalSubmission[];
  } = JSON.parse(props.project)

  const projectsPrisma = usePrisma('project')

  return (
    <VStack spacing={5}>
      <ContentHeader>
        {project.title}
      </ContentHeader>
      <VStack spacing={5} w="full">
        <Wrap align="center" w="full">
          <WrapItem>
            <Wrap spacing={4} align="center">
              <WrapItem>
                <Heading
                  fontFamily="body"
                  fontSize="xl"
                >
                  Submissions
                </Heading>
              </WrapItem>
              <WrapItem>
                <Wrap align="center">
                  <WrapItem>
                    <Select
                      borderColor="brand.blue"
                      color="brand.blue"
                      placeholder="Submission Types"
                      borderRadius={10}
                      _focus={{
                        boxShadow: "none"
                      }}
                      cursor="pointer"
                    />
                  </WrapItem>
                  <WrapItem>
                    <Select
                      borderColor="brand.blue"
                      color="brand.blue"
                      placeholder="Status"
                      borderRadius={10}
                      _focus={{
                        boxShadow: "none"
                      }}
                      cursor="pointer"
                    />
                  </WrapItem>
                </Wrap>
              </WrapItem>
            </Wrap>
          </WrapItem>
          <Spacer />
          <WrapItem>
            <HStack>
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
                New Submission
              </Button>
            </HStack>
          </WrapItem>
        </Wrap>
        <InfiniteScroll
          element={chakra.div}
          w="full"
          pageStart={0}
          loadMore={() => {}}
          hasMore={false}
          loader={
            <Center marginTop="2rem">
              <Spinner color="brand.blue" />
            </Center>
          }
        >
          <VStack w="full">
            <SubmissionCard />
          </VStack>
        </InfiniteScroll>
      </VStack>
    </VStack>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  const { query: { slug } } = context

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const project = await prisma.project.findUnique({
    where: {
      slug: slug as string
    },
    include: {
      budget_proposal_submissions: true,
      capsule_proposal_submissions: true,
      full_blown_proposal_submissions: true
    }
  })

  return {
    props: { 
      session,
      project: JSON.stringify(project)
    }
  }
}

export default Project