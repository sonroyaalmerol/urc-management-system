import React from 'react'
import ContentHeader from '../components/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack } from '@chakra-ui/react'
import { usePrisma } from '../lib/client/usePrisma'

import ActivityCard from '../components/dashboard/ActivityCard'
import type { FileUpload, Project, User, Prisma } from '@prisma/client'
interface IndexProps {

}

const Home: React.FC<IndexProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const testUsers: [User] = JSON.parse(props.testUsers)
  const testProject: Project = JSON.parse(props.testProject)

  // const uploadsPrisma = usePrisma('fileUpload')

  return (
    <VStack spacing={5}>
      <ContentHeader>
        Activities Dashboard
      </ContentHeader>
      <ActivityCard
        title={testProject.title}
        action="approved"
        users={testUsers}
        tags={[
          {
            content: 'University Research',
            color: "brand.blue"
          }
        ]}
      />
    </VStack>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  const testUsers = await prisma.user.findMany({
    take: 3
  })

  const testProject = await prisma.project.findFirst()

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { 
      session,
      testUsers: JSON.stringify(testUsers),
      testProject: JSON.stringify(testProject)
    }
  }
}

export default Home
