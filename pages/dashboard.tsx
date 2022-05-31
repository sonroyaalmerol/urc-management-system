import React from 'react'
import ContentHeader from '../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { HStack, VStack  } from '@chakra-ui/react'
import Deadlines from '../components/general/Deadlines'

import MemoList from '../components/dashboard/MemoList'

import { NextSeo } from 'next-seo'
interface IndexProps {

}

const Home: React.FC<IndexProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <NextSeo
        title="Dashboard | URC Management System"
      />
      <VStack spacing={5}>
        <ContentHeader>
          Dashboard
        </ContentHeader>
        {/* Mobile view */}
        <VStack w="full" display={{ base: 'initial', xl: 'none' }}>
          <Deadlines />
          <MemoList />
        </VStack>
        
        {/* Desktop view */}
        <HStack spacing={8} alignItems="flex-start" w="full" display={{ base: 'none', xl: 'flex' }}>
          <VStack spacing={5} w="75%">
            <MemoList />
          </VStack>
          <VStack w="25%" spacing={5}>
            <Deadlines />
          </VStack>
        </HStack>
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
    props: { 
      session
    }
  }
}

export default Home
