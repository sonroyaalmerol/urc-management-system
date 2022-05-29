import React from 'react'
import { Center, Spinner, chakra, VStack, SimpleGrid, Text } from '@chakra-ui/react'

import type { Deliverable, Project } from '@prisma/client'

import { useDebounce } from 'use-debounce'

import InfiniteScroll from 'react-infinite-scroller'
import DeliverableCard from './DeliverableCard'
import SeeMorePagination from '../general/SeeMorePagination'
import Card from '../general/Card'

interface DeliverableListProps {
  project: Project
}

const DeliverableList: React.FC<DeliverableListProps> = (props) => {
  const [entries, setEntries] = React.useState<Deliverable[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `/api/management/projects/${props.project.id}/deliverables?${entries.length > 0 && !args.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
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
    loadNewEntries({ reset: true })
  }, [])
  return (
    <Card w="full">
      <VStack spacing={6} align="baseline" w="full">
        { !loading? (
          entries.length > 0 ? (
            <SeeMorePagination
              loadMore={loadNewEntries}
              hasMore={entries.length < count}
              w="full"
            >
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={2} w="full">
                { entries.map((deliverable) => (
                  <DeliverableCard key={deliverable.id} deliverable={deliverable} projectSlug={props.project.slug} />
                )) }
              </SimpleGrid>
            </SeeMorePagination>
          ) : (
            <Center marginTop="2rem" w="full">
              <Text>No entries found</Text>
            </Center>
          )
        ) : (
          <Center marginTop="2rem" w="full">
            <Spinner color="brand.blue" />
          </Center>
        )}
      </VStack>
    </Card>
  )
}

export default DeliverableList
