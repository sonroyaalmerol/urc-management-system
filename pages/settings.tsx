import React from 'react'
import ContentHeader from '../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"

import { NextSeo } from 'next-seo'
import { HStack, VStack } from '@chakra-ui/react'
import SearchInput from '../components/general/SearchInput'

interface SettingsProps {

}

const Settings: React.FC<SettingsProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [search, setSearch] = React.useState('')

  return (
    <>
      <NextSeo
        title="Settings | URC Management System"
      />
      <VStack spacing={5}>
        <ContentHeader>
          Settings
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

export default Settings
