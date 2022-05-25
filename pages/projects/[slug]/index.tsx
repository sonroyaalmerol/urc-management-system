import React from 'react'
import ContentHeader from '../../../components/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack, HStack, Heading, Button, Wrap, WrapItem, Spacer, Select } from '@chakra-ui/react'

import { AddIcon } from '@chakra-ui/icons'

import { NextSeo } from 'next-seo'

import { prisma } from '../../../lib/server/prisma'

import type { Project } from '@prisma/client'
import SubmissionList from '../../../components/projects/SubmissionList'
import { type } from 'os'
import NewSubmissionButton from '../../../components/projects/NewSubmissionButton'

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
                <NewSubmissionButton
                  capsuleUrl={`/projects/${project.slug}/submissions/new/capsule`}
                  fullBlownUrl={`/projects/${project.slug}/submissions/new/full`}
                  budgetUrl={`/projects/${project.slug}/submissions/new/budget`}
                />
              </HStack>
            </WrapItem>
          </Wrap>
          <SubmissionList projectId={project.id} types={types} />
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

  return {
    props: { 
      session,
      project: JSON.stringify(project)
    }
  }
}

export default Project