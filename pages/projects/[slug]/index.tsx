import React from 'react'
import ContentHeader from '../../../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack, HStack, Heading, Wrap, WrapItem, Spacer, Select } from '@chakra-ui/react'

import { AddIcon } from '@chakra-ui/icons'

import { NextSeo } from 'next-seo'

import { prisma } from '../../../lib/server/prisma'

import type { Project } from '@prisma/client'
import SubmissionList from '../../../components/projects/SubmissionList'
import NewSubmissionButton from '../../../components/projects/NewSubmissionButton'
import EditProjectTitleButton from '../../../components/projects/EditProjectTitleButton'
import AddProponentButton from '../../../components/projects/AddProponentButton'

interface ProjectProps {

}

const Project: React.FC<ProjectProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const project: Project = JSON.parse(props.project)

  const [typeFilter, setTypeFilter] = React.useState('')
  const types = React.useMemo(() => {
    if (typeFilter === '') {
      return ['budget', 'full', 'capsule']
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

  return (
    <>
      <NextSeo
        title={`${project.title} | URC Management System`}
      />
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
                        value={typeFilter}
                        onChange={(e) => { setTypeFilter(e.target.value) }}
                        cursor="pointer"
                      >
                        <option value="capsule">Capsule Proposal</option>
                        <option value="full">Full-blown Proposal</option>
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
            <WrapItem>
              <HStack>
                <EditProjectTitleButton projectId={project.id} currentTitle={project.title} />
                <AddProponentButton />
                <NewSubmissionButton
                  capsuleUrl={`/projects/${project.slug}/submissions/new/capsule`}
                  fullBlownUrl={`/projects/${project.slug}/submissions/new/full`}
                  budgetUrl={`/projects/${project.slug}/submissions/new/budget`}
                />
              </HStack>
            </WrapItem>
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
        destination: '/login',
        permanent: false,
      },
    }
  }

  const project = await prisma.project.findUnique({
    where: {
      slug: slug as string
    }
  })

  if (!project) {
    return {
      props: {
        statusCode: 404
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