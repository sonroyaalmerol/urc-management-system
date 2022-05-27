import React from 'react'
import { Center, Spinner, chakra, VStack } from '@chakra-ui/react'

import type { ProfileToProjectBridge, Profile, User, Project } from '@prisma/client'

import { useDebounce } from 'use-debounce'

import InfiniteScroll from 'react-infinite-scroller'
import ProjectCard from './VerificationCard'

interface ProjectListProps {
  search?: string
}

const ProjectList: React.FC<ProjectListProps> = (props) => {
  const [entries, setEntries] = React.useState<(Project & {
    bridge_profiles: (ProfileToProjectBridge & {
        profile: Profile & {
            user: User;
        };
    })[];
  })[]>([])

  const [deferredSearch] = useDebounce(props.search, 500)
  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `/api/management/projects?${props.search.length > 0 ? `&query=${props.search}` : ''}${entries.length > 0 && !args.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
    ).then(res => res.json())
    setCount(newEntries?.totalCount ?? 0)
    
    if (args.reset) {
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
  }, [props.search])

  React.useEffect(() => {
    loadNewEntries({ reset: true })
  }, [deferredSearch])
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
          <VStack w="full">
            { entries.map((project) => (
              <ProjectCard key={project.id} project={project} />
            )) }
          </VStack>
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
