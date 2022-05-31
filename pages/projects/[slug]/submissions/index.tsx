import React from 'react'
import { getSession } from 'next-auth/react'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"


const Index: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => (<></>)

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  const { query: { slug } } = context

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${context.req.url}`,
        permanent: false,
      },
    }
  }

  return {
    redirect: {
      destination: `${context.query.redirect ?? `/projects/${slug}`}`,
      permanent: false
    }
  }
}

export default Index