import React from 'react'
import ContentHeader from '../components/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"

import { NextSeo } from 'next-seo'

interface PublicationsProps {

}

const Publications: React.FC<PublicationsProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <NextSeo
        title="Publications | URC Management System"
      />
      <ContentHeader>
        Hello Publications!
      </ContentHeader>
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

export default Publications
