import React from 'react'

import { Center, Divider, Heading, Spinner, SimpleGrid, VStack, Button } from '@chakra-ui/react'
import Card from '../../../components/Card'

import type { ComponentProps, ExtendedProject } from '../../../types/profile-card'
import InternalProjectCard from './InternalProjectCard'
import SeeMorePagination from '../../SeeMorePagination'

const InternalProjects: React.FC<ComponentProps> = (props) => {
  const profile = props.profile

  const [entries, setEntries] = React.useState<ExtendedProject[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const onLoadNewMemo = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `/api/management/profiles/${profile.id}/projects?${entries.length > 0 && !args?.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
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
    onLoadNewMemo()
  }, [])

  return (
    <Card>
      <VStack spacing={6} align="baseline">
        <Heading
          fontFamily="body"
          fontSize="xl"
        >
          Internal Projects
        </Heading>
        <Divider />
        { !loading ? (
          <SeeMorePagination
            hasMore={entries.length < count}
            loadMore={onLoadNewMemo}
          >
            <SimpleGrid columns={{ base: 1, lg: 2 }}>
              { entries.map((entry) => (
                <InternalProjectCard key={entry.id} entry={entry} />
              )) }
            </SimpleGrid>
          </SeeMorePagination>
        ) : (
          <Center marginTop="2rem" w="full">
            <Spinner color="brand.blue" />
          </Center>
        ) }
      </VStack>
    </Card>
  )
}

export default InternalProjects
