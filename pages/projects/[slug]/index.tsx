import React from 'react'
import ContentHeader from '../../../components/general/ContentHeader'
import { getSession, useSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack, HStack, Heading, Wrap, WrapItem, Spacer, Select, SimpleGrid } from '@chakra-ui/react'

import { AddIcon } from '@chakra-ui/icons'

import { NextSeo } from 'next-seo'

import { prisma } from '../../../lib/server/prisma'

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
import { roleChecker } from '../../../lib/roleChecker'

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
            { project.bridge_profiles.filter((bridge) => bridge.profile_id === session.data.profile.id).length > 0 || roleChecker(session.data.profile, ['urc_staff', 'urc_chairperson']) && (
              <WrapItem>
                <HStack>
                  <AddProponentButton projectId={project.id} />
                  <RemoveProponentButton projectId={project.id} />
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
            { project.bridge_profiles.filter((bridge) => bridge.profile_id === session.data.profile.id).length > 0 && (
              <WrapItem>
                <HStack>
                  <AssignInstituteButton projectId={project.id} />
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
                <NewDeliverableButton projectSlug={project.slug} />
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
            { project.bridge_profiles.filter((bridge) => bridge.profile_id === session.data.profile.id).length > 0 && (
              <WrapItem>
                <HStack>
                  <NewSubmissionButton
                    capsuleUrl={`/projects/${project.slug}/submissions/new/capsule`}
                    fullBlownUrl={`/projects/${project.slug}/submissions/new/full`}
                    budgetUrl={`/projects/${project.slug}/submissions/new/budget`}
                  />
                </HStack>
              </WrapItem>
            ) }
          </Wrap>
          <SubmissionList projectId={project.id} types={types} status={status} />
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
      project_status: true
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
    project.bridge_profiles.filter((bridge) => bridge.profile_id === session.profile.id).length < 1 &&
    !roleChecker(session.profile, ['urc_chairperson', 'urc_board_members', 'urc_staff'])
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