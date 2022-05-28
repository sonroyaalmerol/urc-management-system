import React from 'react'
import ContentHeader from '../../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"

import { NextSeo } from 'next-seo'
import { HStack, VStack } from '@chakra-ui/react'
import SearchInput from '../../components/general/SearchInput'
import InstituteList from '../../components/institutes/InstituteList'

interface InstitutesProps {

}

const Institutes: React.FC<InstitutesProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [search, setSearch] = React.useState('')

  return (
    <>
      <NextSeo
        title="Institutes | URC Management System"
      />
      <VStack spacing={5}>
        <ContentHeader>
          Institutes
        </ContentHeader>
        <VStack spacing={5} w="full">
          <HStack w="full" spacing={8}>
            <SearchInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            />
          </HStack>
          <InstituteList search={search} />
        </VStack>
      </VStack>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}

export default Institutes
