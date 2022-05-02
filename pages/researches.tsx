import React from 'react'
import DashboardContentHeader from '../components/DashboardContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"

interface ResearchesProps {

}

const Researches: React.FC<ResearchesProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <DashboardContentHeader>
      Hello Researches!
    </DashboardContentHeader>
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

export default Researches