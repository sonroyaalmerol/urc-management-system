import React from 'react'
import ContentHeader from '../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"

import { NextSeo } from 'next-seo'
import { VStack } from '@chakra-ui/react'
import DownloadsList from '../components/downloads/DownloadsList'

interface DownloadsProps {

}

const Downloads: React.FC<DownloadsProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <NextSeo
        title="Downloads | URC Management System"
      />
      <VStack spacing={5}>
        <ContentHeader>
          Downloads
        </ContentHeader>
        <VStack spacing={5} w="full">
          <DownloadsList />
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
        destination: `/login?redirect=${context.req.url}`,
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}

export default Downloads
