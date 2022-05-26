import React from 'react'

import { Divider, Heading, VStack, SimpleGrid, Center, Spinner, BoxProps, Text, Wrap, WrapItem, Spacer } from '@chakra-ui/react'
import SeeMorePagination from '../../SeeMorePagination'
import Card from '../../../components/Card'
import { AddIcon } from '@chakra-ui/icons'
import Button from '../../Button'

interface ListTemplateProps extends BoxProps {
  title: string
  loading: boolean
  hasMore: boolean
  loadMore: () => any
  onNew?: () => any
}

const ListTemplate: React.FC<ListTemplateProps> = (props) => {
  const divProps = Object.assign({}, props)
  delete divProps.loading
  delete divProps.hasMore
  delete divProps.loadMore

  return (
    <Card {...divProps} w="full">
      <VStack spacing={6} align="baseline" w="full">
        <Wrap w="full">
          <WrapItem>
            <Heading
              fontFamily="body"
              fontSize="xl"
            >
              {props.title}
            </Heading>
          </WrapItem>
          <Spacer />
          { props.onNew && (
            <WrapItem>
              <Button 
                aria-label="Add Entry"
                leftIcon={<AddIcon />}
                size="xs"
                paddingY={0}
                onClick={props.onNew}
              >
                New
              </Button>
            </WrapItem>
          ) }
        </Wrap>
        <Divider />
        { !props.loading ? (
          React.Children.count(props.children) > 0 ? (
            <SeeMorePagination
              hasMore={props.hasMore}
              loadMore={props.loadMore}
              w="full"
            >
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={2} w="full">
                { props.children }
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

export default ListTemplate
