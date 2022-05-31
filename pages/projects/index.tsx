import React from 'react'
import ContentHeader from '../../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack, HStack } from '@chakra-ui/react'

import SearchInput from '../../components/general/SearchInput'

import { NextSeo } from 'next-seo'

import NewProjectButton from '../../components/projects/NewProjectButton'
import ProjectList from '../../components/projects/ProjectList'

interface ProjectsProps {

}

const Projects: React.FC<ProjectsProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [search, setSearch] = React.useState('')
  const [refreshKey, setRefreshKey] = React.useState(0)

  const refresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <>
      <NextSeo
        title="Projects | URC Management System"
      />
      <VStack spacing={5}>
        <ContentHeader>
          Projects
        </ContentHeader>
        <VStack spacing={5} w="full">
          <HStack w="full" spacing={8}>
            <SearchInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            />
            <NewProjectButton onSuccess={refresh} />
          </HStack>
          <ProjectList search={search} refreshKey={refreshKey} />
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
    props: { 
      session
    }
  }
}

export default Projects