import React from 'react'
import { Box, BoxProps, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import type { Deadline } from '@prisma/client'
import { format } from 'date-fns'
interface DeadlinesProps extends BoxProps {

}

const Deadlines: React.FC<DeadlinesProps> = (props) => {
  const [deadlines, setDeadlines] = React.useState<Deadline[]>([])
  
  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async () => {
    const newMemos = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/deadlines`
    ).then(res => res.json())
    setCount(newMemos?.totalCount ?? 0)

    setDeadlines((currMemos) => {
      return currMemos
    })
    setLoading(false)
  }

  React.useEffect(() => {
    loadNewEntries()
  }, [])

  return (
    <Box
      backgroundColor="brand.cardBackground"
      borderRadius={10}
      padding="1.5rem"
      w="full"
      {...props}
    >
      <VStack w="full" spacing={6} alignItems="baseline">
        <Heading
          color="brand.blue"
          size="md"
          fontFamily="body"
        >
          Deadlines
        </Heading>
        <SimpleGrid
          columns={deadlines.length > 0 ? 2 : 1}
          spacingX={8}
          spacingY={6}
          w="full"
        >
          { deadlines.length > 0 ? deadlines.map((deadline) => (
            <>
              <Text key={`title-${deadline.id}`}>{deadline.title}</Text>
              <Text key={`date-${deadline.id}`} color="brand.blue">{ format(new Date(deadline.date), 'MMMM dd') }</Text>
            </>
          )) : (
            <Text>No deadlines found</Text>
          ) }
        </SimpleGrid>
      </VStack>
    </Box>
  )
}

export default Deadlines
