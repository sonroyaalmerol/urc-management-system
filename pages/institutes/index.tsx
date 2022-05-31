import React from 'react'
import ContentHeader from '../../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"

import { NextSeo } from 'next-seo'
import { HStack, VStack } from '@chakra-ui/react'
import SearchInput from '../../components/general/SearchInput'
import InstituteList from '../../components/institutes/InstituteList'
import NewInstituteButton from '../../components/institutes/NewInstituteButton'

interface InstitutesProps {

}

const Institutes: React.FC<InstitutesProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [search, setSearch] = React.useState('')

  const [refreshKey, setRefreshKey] = React.useState(0)

  const refresh = () => {
    setRefreshKey(prev => prev + 1)
  }

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
            <NewInstituteButton onSuccess={refresh} /> 
          </HStack>
          <InstituteList search={search} refreshKey={refreshKey} />
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
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/login?redirect=${context.req.url}`,
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}

export default Institutes
