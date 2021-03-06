import React from 'react'
import ContentHeader from '../../../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack } from '@chakra-ui/react'

import { NextSeo } from 'next-seo'

import { prisma } from '../../../utils/server/prisma'

import type { Institute } from '@prisma/client'
import InstituteNewsForm from '../../../components/institutes/forms/InstituteNewsForm'
import { instituteHeadChecker } from '../../../utils/roleChecker'

interface NewMemoProps {

}

const NewMemo: React.FC<NewMemoProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const institute = JSON.parse(props.institute) as Institute

  return (
    <>
      <NextSeo
        title={`New ${institute.short_name ?? institute.name} News | URC Management System`}
      />
      <VStack spacing={5}>
        <ContentHeader>
          {`${institute.short_name ?? institute.name} News`}
        </ContentHeader>
        <VStack spacing={5} w="full">
          <InstituteNewsForm institute={institute} />
        </VStack>
      </VStack>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  const { id } = context.params

  if (!instituteHeadChecker(session.profile, id as string)) {
    return {
      props: {
        statusCode: 401
      }
    }
  }

  const institute = await prisma.institute.findUnique({
    where: {
      id: id as string
    }
  })

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${context.req.url}`,
        permanent: false,
      },
    }
  }

  return {
    props: { 
      session,
      institute: JSON.stringify(institute)
    }
  }
}

export default NewMemo