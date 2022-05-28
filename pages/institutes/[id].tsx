import React from 'react'
import ContentHeader from '../../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"

import { prisma } from '../../lib/server/prisma'

import { NextSeo } from 'next-seo'
import { VStack } from '@chakra-ui/react'
import { ExtendedInstitute } from '../../types/profile-card'
import InstituteDetails from '../../components/institutes/institute/InstituteDetails'

interface InstituteProps {

}

const Institute: React.FC<InstituteProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const institute: ExtendedInstitute = JSON.parse(props.institute)

  return (
    <>
      <NextSeo
        title={`${institute.name ?? institute.email} ${institute.short_name ? `(${institute.short_name})` : ''} | URC Management System`}
      />
      <VStack spacing={5}>
        <ContentHeader>
          {institute.name ?? institute.email} {institute.short_name ? `(${institute.short_name})` : ''}
        </ContentHeader>
        <VStack spacing={5} w="full">
          <InstituteDetails institute={institute} />
        </VStack>
      </VStack>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  const { query: { id } } = context

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const institute = await prisma.institute.findUnique({
    where: {
      id: id as string
    },
    include: {
      bridge_profiles: {
        include: {
          profile: true
        }
      },
      institute_news: true
    }
  })


  return {
    props: { 
      session,
      institute: JSON.stringify(institute)
    }
  }
}

export default Institute
