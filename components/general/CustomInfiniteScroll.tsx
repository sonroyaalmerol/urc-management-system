import React from 'react'
import { Center, Spinner, chakra, Text } from '@chakra-ui/react'


import InfiniteScroll from 'react-infinite-scroller'

const CustomInfiniteScroll: React.FC<InfiniteScroll> = (props) => {

  return React.Children.count(props.children) > 0 ? (
    <InfiniteScroll
      loader={
        <Center marginTop="2rem" key="infinite-scroll-load">
          <Spinner color="brand.blue" />
        </Center>
      }
      element={chakra.div}
      w="full"
      {...props}
    />
  ) : (
    <Center marginTop="2rem" w="full">
      <Text>No entries found</Text>
    </Center>
  )
}

export default CustomInfiniteScroll
