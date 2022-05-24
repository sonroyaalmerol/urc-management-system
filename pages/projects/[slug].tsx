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

import type { Project, BudgetProposalSubmission, CapsuleProposalSubmission, FullBlownProposalSubmission, FileUpload } from '@prisma/client'
import { usePrisma } from '../../lib/client/usePrisma'

import InfiniteScroll from 'react-infinite-scroller'
import SubmissionCard from '../../components/projects/SubmissionCard'

interface ProjectProps {

}

const Project: React.FC<ProjectProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const project: Project & {
    budget_proposal_submissions: (BudgetProposalSubmission & {
      file_upload: FileUpload;
    })[];
    capsule_proposal_submissions: CapsuleProposalSubmission[];
    full_blown_proposal_submissions: (FullBlownProposalSubmission & {
      file_upload: FileUpload;
    })[];
  } = JSON.parse(props.project)

  const [budgetProposalSubmissions, setBudgetProposalSubmissions] = React.useState(project.budget_proposal_submissions)
  const [capsuleProposalSubmissions, setCapsuleProposalSubmissions] = React.useState(project.capsule_proposal_submissions)
  const [fullBlownProposalSubmissions, setFullBlownProposalSubmissions] = React.useState(project.full_blown_proposal_submissions)

  const submissions = React.useMemo(() => {
    return [
      ...budgetProposalSubmissions.map((submission) => ({
        type: 'budget', ...submission
      })),
      ...capsuleProposalSubmissions.map((submission) => ({
        type: 'capsule', ...submission
      })),
      ...fullBlownProposalSubmissions.map((submission) => ({
        type: 'full', ...submission
      })),
    ].sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })
  }, [budgetProposalSubmissions, capsuleProposalSubmissions, fullBlownProposalSubmissions])

  const budgetProposalPrisma = usePrisma('budgetProposalSubmission')
  const capsuleProposalPrisma = usePrisma('capsuleProposalSubmission')
  const fullBlownProposalPrisma = usePrisma('fullBlownProposalSubmission')

  const getBudgetSubmissions: (isNew: boolean) => Promise<[(BudgetProposalSubmission & {
    file_upload: FileUpload;
  })[], number]> = async (isNew) => {

    return await Promise.all<[any, any]>([
      budgetProposalPrisma.findMany({
        take: 5,
        skip: isNew ? undefined : 1,
        include: {
          bridge_users: {
            include: {
              user: true
            }
          }
        },
        cursor: isNew ? undefined : {
          id: budgetProposalSubmissions[budgetProposalSubmissions.length - 1].id
        },
        orderBy: [
          {
            updated_at: 'desc'
          }
        ],
        where: {
          project_id: project.id
        }
      }),
      budgetProposalPrisma.count({
        where: {
          project_id: project.id
        }
      })
    ])
  }

  const getCapsuleSubmissions: (isNew: boolean) => Promise<[CapsuleProposalSubmission[], number]> = async (isNew) => {

    return await Promise.all<[any, any]>([
      capsuleProposalPrisma.findMany({
        take: 5,
        skip: isNew ? undefined : 1,
        include: {
          bridge_users: {
            include: {
              user: true
            }
          }
        },
        cursor: isNew ? undefined : {
          id: capsuleProposalSubmissions[capsuleProposalSubmissions.length - 1].id
        },
        orderBy: [
          {
            updated_at: 'desc'
          }
        ],
        where: {
          project_id: project.id
        }
      }),
      capsuleProposalPrisma.count({
        where: {
          project_id: project.id
        }
      })
    ])
  }

  const getFullBlownSubmissions: (isNew: boolean) => Promise<[(FullBlownProposalSubmission & {
    file_upload: FileUpload;
  })[], number]> = async (isNew) => {

    return await Promise.all<[any, any]>([
      fullBlownProposalPrisma.findMany({
        take: 5,
        skip: isNew ? undefined : 1,
        include: {
          bridge_users: {
            include: {
              user: true
            }
          }
        },
        cursor: isNew ? undefined : {
          id: fullBlownProposalSubmissions[fullBlownProposalSubmissions.length - 1].id
        },
        orderBy: [
          {
            updated_at: 'desc'
          }
        ],
        where: {
          project_id: project.id
        }
      }),
      fullBlownProposalPrisma.count({
        where: {
          project_id: project.id
        }
      })
    ])
  }

  const onLoadNewSubmissions = async () => {
    const [[newBudget], [newCapsule], [newFullBlown]] = await Promise.all([
      getBudgetSubmissions(false),
      getCapsuleSubmissions(false),
      getFullBlownSubmissions(false)
    ])

    setBudgetProposalSubmissions((curr) => [...curr, ...newBudget])
    setCapsuleProposalSubmissions((curr) => [...curr, ...newCapsule])
    setFullBlownProposalSubmissions((curr) => [...curr, ...newFullBlown])
  }

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
          loadMore={onLoadNewSubmissions}
          hasMore={
            budgetProposalSubmissions.length < props.budgetProposalCount ||
            capsuleProposalSubmissions.length < props.capsuleProposalCount ||
            fullBlownProposalSubmissions.length < props.fullBlownProposalCount
          }
          loader={
            <Center marginTop="2rem">
              <Spinner color="brand.blue" />
            </Center>
          }
        >
          <VStack w="full">
            { submissions.map((_submission) => {
              const submission = Object.assign({}, _submission)
              delete submission.type

              if (_submission.type === 'budget') {
                return (
                  <SubmissionCard budgetProposal={submission} />
                )
              } else if (_submission.type === 'capsule') {
                return (
                  <SubmissionCard capsuleProposal={submission} />
                )
              } else if (_submission.type === 'full') {
                return (
                  <SubmissionCard fullBlownProposal={submission} />
                )
              } else {
                return <></>
              }
            }) }
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
      budget_proposal_submissions: {
        take: 5,
        include: {
          file_upload: true
        }
      },
      capsule_proposal_submissions: {
        take: 5
      },
      full_blown_proposal_submissions: {
        take: 5,
        include: {
          file_upload: true
        }
      }
    }
  })

  const [budgetProposalCount, capsuleProposalCount, fullBlownProposalCount] = await prisma.$transaction([
    prisma.budgetProposalSubmission.count({
      where: {
        project_id: project.id
      }
    }),
    prisma.capsuleProposalSubmission.count({
      where: {
        project_id: project.id
      }
    }),
    prisma.fullBlownProposalSubmission.count({
      where: {
        project_id: project.id
      }
    })
  ])

  return {
    props: { 
      session,
      project: JSON.stringify(project),
      budgetProposalCount,
      capsuleProposalCount,
      fullBlownProposalCount
    }
  }
}

export default Project