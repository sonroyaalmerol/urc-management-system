import React from 'react'
import ContentHeader from '../../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"

import { NextSeo } from 'next-seo'
import { HStack, VStack } from '@chakra-ui/react'
import SearchInput from '../../components/general/SearchInput'
import NewProfileButton from '../../components/profiles/NewProfileButton'
import ProfileList from '../../components/profiles/ProfileList'

interface ProfilesProps {

}

const Profiles: React.FC<ProfilesProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [search, setSearch] = React.useState('')
  const [refreshKey, setRefreshKey] = React.useState(0)

  const refresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <>
      <NextSeo
        title="User Profiles | URC Management System"
      />
      <VStack spacing={5}>
        <ContentHeader>
          User Profiles
        </ContentHeader>
        <VStack spacing={5} w="full">
          <HStack w="full" spacing={8}>
            <SearchInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            />
            <NewProfileButton onSuccess={refresh} />
          </HStack>
          <ProfileList search={search} refreshKey={refreshKey} />
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

export default Profiles
