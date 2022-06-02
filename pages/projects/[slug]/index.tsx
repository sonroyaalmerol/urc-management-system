import React from 'react'
import ContentHeader from '../../../components/general/ContentHeader'
import { getSession, useSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack, HStack, Heading, Wrap, WrapItem, Spacer, Select, SimpleGrid } from '@chakra-ui/react'

import { AddIcon } from '@chakra-ui/icons'

import { NextSeo } from 'next-seo'

import { prisma } from '../../../utils/server/prisma'

import type { Project } from '@prisma/client'
import SubmissionList from '../../../components/projects/SubmissionList'
import NewSubmissionButton from '../../../components/projects/NewSubmissionButton'
import EditProjectTitleButton from '../../../components/projects/EditProjectTitleButton'
import AddProponentButton from '../../../components/projects/AddProponentButton'
import Card from '../../../components/general/Card'
import { ExtendedProject } from '../../../types/profile-card'
import InnerProfileCard from '../../../components/projects/InnerProfileCard'
import RemoveProponentButton from '../../../components/projects/RemoveProponentButton'
import Button from '../../../components/general/Button'
import DeliverableList from '../../../components/projects/DeliverableList'
import NewDeliverableButton from '../../../components/projects/NewDeliverableButton'
import ProjectStatusTag from '../../../components/general/ProjectStatusTag'
import AssignInstituteButton from '../../../components/projects/AssignInstituteButton'
import InnerInstituteCard from '../../../components/projects/InnerInstituteCard'
import ProjectDetails from '../../../components/projects/ProjectDetails'
import { memberChecker, roleChecker } from '../../../utils/roleChecker'
import { CHANGE_PROJECT_STATUS, CREATE_PROJECT_CENTER, MANAGING_DELIVERABLES, REVIEW_PROPOSALS } from '../../../utils/permissions'

interface ProjectProps {

}

const Project: React.FC<ProjectProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const project: ExtendedProject = JSON.parse(props.project)

  const [typeFilter, setTypeFilter] = React.useState('')
  const types = React.useMemo(() => {
    if (typeFilter === '') {
      return ['budget', 'full', 'capsule', 'deliverable']
    } else {
      return [typeFilter]
    }
  }, [typeFilter])

  const [statusFilter, setStatusFilter] = React.useState('')
  const status = React.useMemo(() => {
    if (statusFilter === '') {
      return ['approved', 'not_approved', 'not_processed']
    } else {
      return [statusFilter]
    }
  }, [statusFilter])
  
  const session = useSession()

  return (
    <>
      <NextSeo
        title={`${project.title} | URC Management System`}
      />
      <VStack spacing={5}>
        <ContentHeader>
          {project.title}
        </ContentHeader>
        <VStack spacing={8} w="full">
          <ProjectDetails project={project} />

          <Wrap align="center" w="full">
            <WrapItem>
              <Wrap spacing={4} align="center">
                <WrapItem>
                  <Heading
                    fontFamily="body"
                    fontSize="xl"
                  >
                    Proponents
                  </Heading>
                </WrapItem>
              </Wrap>
            </WrapItem>
            <Spacer />
            { (memberChecker(session.data.profile, project.bridge_profiles) || roleChecker(session.data.profile, CHANGE_PROJECT_STATUS)) && (
              <WrapItem>
                <HStack>
                  <AddProponentButton project={project} />
                  <RemoveProponentButton project={project} />
                </HStack>
              </WrapItem>
            ) }
          </Wrap>
          
          <Card>
            <VStack align="baseline">
              <Wrap spacing={4}>
                { project.bridge_profiles.map(({ profile, role_title }) => (
                  <WrapItem key={profile.id}>
                    <InnerProfileCard profile={profile} role={role_title} />
                  </WrapItem>
                )) }
              </Wrap>
            </VStack>
          </Card>

          <Wrap align="center" w="full">
            <WrapItem>
              <Wrap spacing={4} align="center">
                <WrapItem>
                  <Heading
                    fontFamily="body"
                    fontSize="xl"
                  >
                    Institutes/Centers Involved
                  </Heading>
                </WrapItem>
              </Wrap>
            </WrapItem>
            <Spacer />
            { (memberChecker(session.data.profile, project.bridge_profiles) || roleChecker(session.data.profile, CREATE_PROJECT_CENTER)) && (
              <WrapItem>
                <HStack>
                  <AssignInstituteButton project={project} />
                </HStack>
              </WrapItem>
            ) }
          </Wrap>

          <Card>
            <VStack align="baseline">
              <Wrap spacing={4}>
                { project.bridge_institutes.map(({ institute, verified }) => (
                  <WrapItem key={institute.id}>
                    <InnerInstituteCard institute={institute} verified={verified} />
                  </WrapItem>
                )) }
              </Wrap>
            </VStack>
          </Card>

          <Wrap align="center" w="full">
            <WrapItem>
              <Wrap spacing={4} align="center">
                <WrapItem>
                  <Heading
                    fontFamily="body"
                    fontSize="xl"
                  >
                    Deliverables
                  </Heading>
                </WrapItem>
              </Wrap>
            </WrapItem>
            <Spacer />
            <WrapItem>
              <HStack>
                <NewDeliverableButton project={project} />
              </HStack>
            </WrapItem>
          </Wrap>
          <DeliverableList project={project} />

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
                        value={typeFilter}
                        onChange={(e) => { setTypeFilter(e.target.value) }}
                        cursor="pointer"
                      >
                        <option value="capsule">Capsule Proposal</option>
                        <option value="full">Full-blown Proposal</option>
                        <option value="deliverable">Deliverable Submission</option>
                        <option value="budget">Budget Proposal</option>
                      </Select>
                    </WrapItem>
                    <WrapItem>
                      <Select
                        borderColor="brand.blue"
                        color="brand.blue"
                        placeholder="Status"
                        borderRadius={10}
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value) }}
                        _focus={{
                          boxShadow: "none"
                        }}
                        cursor="pointer"
                      >
                        <option value="approved">Approved</option>
                        <option value="not_approved">Not Approved</option>
                        <option value="not_processed">Not yet processed</option>
                      </Select>
                    </WrapItem>
                  </Wrap>
                </WrapItem>
              </Wrap>
            </WrapItem>
            <Spacer />
            { (memberChecker(session.data.profile, project.bridge_profiles)) && (
              <WrapItem>
                <HStack>
                  <NewSubmissionButton
                    project={project}
                  />
                </HStack>
              </WrapItem>
            ) }
          </Wrap>
          <SubmissionList project={project} types={types} status={status} />
        </VStack>
      </VStack>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  const { query: { slug } } = context

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${context.req.url}`,
        permanent: false,
      },
    }
  }

  const project = await prisma.project.findUnique({
    where: {
      slug: slug as string
    },
    include: {
      bridge_profiles: {
        include: {
          profile: true
        }
      },
      bridge_institutes: {
        include: {
          institute: true
        }
      },
      project_status: true,
      units: true
    }
  })

  if (!project) {
    return {
      props: {
        statusCode: 404
      }
    }
  }

  if (
    !memberChecker(session.profile, project.bridge_profiles) &&
    !roleChecker(session.profile, [
      ...REVIEW_PROPOSALS,
      ...MANAGING_DELIVERABLES,
      ...CHANGE_PROJECT_STATUS
    ])
  ) {
    return {
      props: {
        statusCode: 401
      }
    }
  }


  return {
    props: { 
      session,
      project: JSON.stringify(project)
    }
  }
}

export default Project