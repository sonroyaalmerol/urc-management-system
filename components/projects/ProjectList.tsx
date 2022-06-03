import React from 'react'
import { Center, Spinner, chakra, VStack, SimpleGrid } from '@chakra-ui/react'

import type { ProfileToProjectBridge, Profile, User, Project, ProjectStatus } from '@prisma/client'

import { useDebounce } from 'use-debounce'

import InfiniteScroll from 'react-infinite-scroller'
import ProjectCard from './ProjectCard'

interface ProjectListProps {
  search?: string
  refreshKey?: number
}

const ProjectList: React.FC<ProjectListProps> = (props) => {
  const [entries, setEntries] = React.useState<(Project & {
    bridge_profiles: (ProfileToProjectBridge & {
        profile: Profile & {
            user: User;
        };
    })[];
    project_status: ProjectStatus;
  })[]>([])

  const [deferredSearch] = useDebounce(props.search, 500)
  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects?${props.search.length > 0 ? `&query=${props.search}` : ''}${entries.length > 0 && !args?.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
    ).then(res => res.json())
    setCount(newEntries?.totalCount ?? 0)
    
    if (args?.reset) {
      setEntries(newEntries?.data ?? [])
    } else {
      setEntries((currEntries) => {
        return [...currEntries, ...(newEntries?.data.filter((memo) => !currEntries.find((currEntry) => currEntry.id === memo.id)) ?? []) ]
      })
    }
    setLoading(false)
  }

  React.useEffect(() => {
    setLoading(true)
    if (deferredSearch === props.search) {
      setLoading(false)
    }
  }, [props.search])

  React.useEffect(() => {
    loadNewEntries({ reset: true })
  }, [deferredSearch, props.refreshKey])

  React.useEffect(() => {
    setLoading(true)
  }, [props.refreshKey])

  return (
    <>
      { !loading ? (
        <InfiniteScroll
          pageStart={0}
          loadMore={loadNewEntries}
          hasMore={entries.length < count}
          loader={
            <Center marginTop="2rem" key="infinite-scroll-load">
              <Spinner color="brand.blue" />
            </Center>
          }
          element={chakra.div}
          w="full"
        >
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4} w="full">
            { entries.map((project) => (
              <ProjectCard key={project.id} project={project} />
            )) }
          </SimpleGrid>
        </InfiniteScroll>
      ) : (
        <Center marginTop="2rem">
          <Spinner color="brand.blue" />
        </Center>
      ) }
    </>
  )
}

export default ProjectList
