import React from 'react'
import { Box, BoxProps, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react'
interface DeadlinesProps extends BoxProps {

}

const Deadlines: React.FC<DeadlinesProps> = (props) => {

  return (
    <Box
      backgroundColor="brand.cardBackground"
      borderRadius={10}
      padding="1.5rem"
      w="100%"
      {...props}
    >
      <VStack w="100%" spacing={6} alignItems="baseline">
        <Heading
          color="brand.blue"
          size="md"
          fontFamily="body"
        >
          Deadlines
        </Heading>
        <SimpleGrid
          columns={2}
          spacingX={8}
          spacingY={6}
          w="100%"
        >
          <Text>Call for Proposal 1</Text>
          <Text color="brand.blue">May 28</Text>

          <Text>Long deadline 2</Text>
          <Text color="brand.blue">June 1</Text>

          <Text>Call for Proposal 1</Text>
          <Text color="brand.blue">May 28</Text>
        </SimpleGrid>
      </VStack>
    </Box>
  )
}

export default Deadlines
