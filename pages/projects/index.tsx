import React from 'react'
import ContentHeader from '../../components/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack, HStack, Heading, Text, Tag, Button, Wrap, WrapItem, Box, Center, Spinner } from '@chakra-ui/react'

import Card from '../../components/Card'
import SearchInput from '../../components/SearchInput'
import SmallAvatar from '../../components/SmallAvatar'

import { AddIcon } from '@chakra-ui/icons'
import { format } from 'date-fns'

import parse from '../../lib/client/parseHTML'

import type { Project, UserToProjectBridge, User } from '@prisma/client'
import { usePrisma } from '../../lib/client/usePrisma'

import InfiniteScroll from 'react-infinite-scroller'

import { useRouter } from 'next/router'
import ProjectCard from '../../components/projects/ProjectCard'

interface ProjectsProps {

}

const Projects: React.FC<ProjectsProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const propsProjects: (Project & {
    bridge_users: (UserToProjectBridge & {
        user: User;
    })[];
  })[] = JSON.parse(props.projects)

  const projectsPrisma = usePrisma('project')
  const router = useRouter()

  const [projects, setProjects] = React.useState(propsProjects)
  const onLoadNewProject = async () => {
    const newProjects = (await projectsPrisma.findMany({
      take: 5,
      skip: 1,
      include: {
        bridge_users: {
          include: {
            user: true
          }
        }
      },
      cursor: {
        id: projects[projects.length - 1].id
      },
      orderBy: [
        {
          updated_at: 'desc'
        }
      ]
    })) as (Project & {
      bridge_users: (UserToProjectBridge & {
          user: User;
      })[];
    })[]

    setProjects((currProjects) => [...currProjects, ...newProjects])
  }

  return (
    <VStack spacing={5}>
      <ContentHeader>
        Projects
      </ContentHeader>
      <VStack spacing={5} w="full">
        <HStack w="full" spacing={8}>
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
        <InfiniteScroll
          pageStart={0}
          loadMore={onLoadNewProject}
          hasMore={projects.length < props.projectCount}
          loader={
            <Center marginTop="2rem">
              <Spinner color="brand.blue" />
            </Center>
          }
        >
          <VStack w="full">
            { projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            )) }
          </VStack>
        </InfiniteScroll>
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

  const [projectCount, projects] = await prisma.$transaction([
    prisma.project.count(),
    prisma.project.findMany({
      include: {
        bridge_users: {
          include: {
            user: true
          }
        }
      },
      take: 5,
      orderBy: [
        {
          updated_at: 'desc'
        }
      ]
    })
  ])

  return {
    props: { 
      session,
      projectCount,
      projects: JSON.stringify(projects)
    }
  }
}

export default Projects