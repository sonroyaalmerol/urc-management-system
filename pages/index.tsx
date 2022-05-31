import React from 'react'
import { getSession } from 'next-auth/react'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"


const Index: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => (<></>)

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        permanent: false,
      },
    }
  }

  return {
    redirect: {
      destination: `${process.env.NEXT_PUBLIC_BASE_URL}${context.query.redirect ?? '/dashboard'}`,
      permanent: false
    }
  }
}

export default Index