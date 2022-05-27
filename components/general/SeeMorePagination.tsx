import React from 'react'

import { Center, Spinner, Button, Box, BoxProps } from '@chakra-ui/react'

interface SeeMorePaginationProps extends BoxProps {
  loadMore: () => any
  hasMore: boolean
}

const SeeMorePagination: React.FC<SeeMorePaginationProps> = (props) => {
  const [moreLoading, setMoreLoading] = React.useState(false)

  const divProps = Object.assign({}, props)
  delete divProps.loadMore
  delete divProps.hasMore
  delete divProps.hasMore
  delete divProps.children

  const seeMore = async () => {
    setMoreLoading(true)
    await props.loadMore()
    setMoreLoading(false)
  }

  if (props.hasMore) {
    return (
      <Box
        w="full"
        {...divProps}
      >
        { props.children }
        { !moreLoading ? (
          <Button
            w="full"
            bgColor="transparent"
            borderRadius={0}
            color="brand.blue"
            onClick={() => seeMore()}
          >
            See More
          </Button>
        ) : (
          <Center marginTop="2rem" w="full">
            <Spinner color="brand.blue" />
          </Center>
        )}
      </Box>
    )
  }

  return (
    <Box {...divProps}>{ props.children }</Box>
  )
}

export default SeeMorePagination
