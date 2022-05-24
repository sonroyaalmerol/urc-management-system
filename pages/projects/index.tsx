import React from 'react'
import ContentHeader from '../../components/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack, HStack, chakra, Button, Center, Spinner } from '@chakra-ui/react'

import SearchInput from '../../components/SearchInput'

import { prisma } from '../../lib/server/prisma'

import type { Project, UserToProjectBridge, User } from '@prisma/client'
import { usePrisma } from '../../lib/client/usePrisma'
import { useDebounce } from 'use-debounce'

import InfiniteScroll from 'react-infinite-scroller'

import ProjectCard from '../../components/projects/ProjectCard'
import NewProjectButton from '../../components/projects/NewProjectButton'

interface ProjectsProps {

}

const Projects: React.FC<ProjectsProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const propsProjects: (Project & {
    bridge_users: (UserToProjectBridge & {
        user: User;
    })[];
  })[] = JSON.parse(props.projects)
  
  const [search, setSearch] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [count, setCount] = React.useState(props.projectCount)
  const [deferredSearch] = useDebounce(search, 500)

  const projectsPrisma = usePrisma('project')

  const [projects, setProjects] = React.useState(propsProjects)

  React.useEffect(() => {
    setLoading(true)
  }, [search])
  React.useEffect(() => {
    getProjects(true).then(([newProjects, count]) => {
      setProjects(newProjects)
      setCount(count as number)
      setLoading(false)
    })
  }, [deferredSearch])

  const getProjects: (isNew: boolean) => Promise<[(Project & {
    bridge_users: (UserToProjectBridge & {
        user: User;
    })[];
  })[], number]> = async (isNew) => {
    const whereQuery = deferredSearch.trim().length > 0 ? {
      OR: [
        {
          title: {
            search: deferredSearch.split(' ').filter(s => s.trim().length > 0).join(' & ')
          }
        },
        {
          keywords: {
            has: deferredSearch
          }
        },
        {
          abstract: {
            search: deferredSearch.split(' ').filter(s => s.trim().length > 0).join(' & ')
          }
        }
      ]
    } : undefined

    return await Promise.all<[any, any]>([
      projectsPrisma.findMany({
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
          id: projects[projects.length - 1].id
        },
        orderBy: [
          {
            updated_at: 'desc'
          }
        ],
        where: whereQuery
      }),
      projectsPrisma.count({
        where: whereQuery
      })
    ])
  }

  const onLoadNewProject = async () => {
    const [newProjects] = await getProjects(false)
    setProjects((currProjects) => [...currProjects, ...newProjects])
  }

  return (
    <VStack spacing={5}>
      <ContentHeader>
        Projects
      </ContentHeader>
      <VStack spacing={5} w="full">
        <HStack w="full" spacing={8}>
          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
          />
          <NewProjectButton />
        </HStack>
        { !loading ? (
          <InfiniteScroll
            pageStart={0}
            loadMore={onLoadNewProject}
            hasMore={projects.length < count}
            loader={
              <Center marginTop="2rem">
                <Spinner color="brand.blue" />
              </Center>
            }
            element={chakra.div}
            w="full"
          >
            <VStack w="full">
              { projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              )) }
            </VStack>
          </InfiniteScroll>
        ) : (
          <Center marginTop="2rem">
            <Spinner color="brand.blue" />
          </Center>
        ) }
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