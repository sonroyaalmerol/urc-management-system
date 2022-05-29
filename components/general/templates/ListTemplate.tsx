import React from 'react'

import { Divider, Heading, VStack, SimpleGrid, Center, Spinner, BoxProps, Text, Wrap, WrapItem, Spacer } from '@chakra-ui/react'
import SeeMorePagination from '../../general/SeeMorePagination'
import Card from '../../general/Card'
import { AddIcon } from '@chakra-ui/icons'
import Button from '../../general/Button'

import { useSession } from 'next-auth/react'
import IconButton from '../IconButton'

interface ListTemplateProps extends BoxProps {
  title: string
  loading: boolean
  hasMore: boolean
  loadMore: () => any
  onNew?: () => any
  profileId?: string
}

const ListTemplate: React.FC<ListTemplateProps> = (props) => {
  const { data: { profile: currentProfile } } = useSession()

  const divProps = Object.assign({}, props)
  delete divProps.loading
  delete divProps.hasMore
  delete divProps.loadMore

  return (
    <VStack w="full">
      <Wrap w="full" my="1rem" align="center">
        <WrapItem>
          <Heading
            fontFamily="body"
            fontSize="xl"
          >
            {props.title}
          </Heading>
        </WrapItem>
        <Spacer />
        { ('profileId' in props && currentProfile.id === props.profileId) && (
          <WrapItem>
            <IconButton 
              aria-label="Add Entry"
              icon={<AddIcon />}
              padding={0}
              onClick={props.onNew}
            />
          </WrapItem>
        ) }
      </Wrap>
      <Card {...divProps} w="full">
        <VStack spacing={6} align="baseline" w="full">
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
    </VStack>
  )
}

export default ListTemplate
