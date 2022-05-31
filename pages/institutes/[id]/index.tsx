import React from 'react'
import ContentHeader from '../../../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"

import { prisma } from '../../../lib/server/prisma'

import { NextSeo } from 'next-seo'
import { Heading, Spacer, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import { ExtendedInstitute } from '../../../types/profile-card'
import InstituteDetails from '../../../components/institutes/institute/InstituteDetails'
import InternalProjects from '../../../components/institutes/institute/InternalProjects'
import MemoList from '../../../components/dashboard/MemoList'
import Members from '../../../components/institutes/institute/Members'
import IconButton from '../../../components/general/IconButton'
import { AddIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'

interface InstituteProps {

}

const Institute: React.FC<InstituteProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const institute: ExtendedInstitute = JSON.parse(props.institute)
  const router = useRouter()

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
          <Members institute={institute} />
          <InternalProjects institute={institute} />
          <VStack w="full" align="baseline">
            <Wrap w="full" align="center">
              <WrapItem>
                <Heading
                  fontFamily="body"
                  fontSize="xl"
                  my="1rem"
                >
                  Memos
                </Heading>
              </WrapItem>
              <Spacer />
              <WrapItem>
                <IconButton 
                  aria-label="Add Entry"
                  icon={<AddIcon />}
                  padding={0}
                  onClick={() => {
                    router.push(`/institutes/${institute.id}/memo`)
                  }}
                />
              </WrapItem>
            </Wrap>
            <MemoList institute={institute} />
          </VStack>
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
        destination: `/login?redirect=${context.req.url}`,
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
      bridge_projects: {
        include: {
          project: {
            include: {
              bridge_profiles: {
                include: {
                  profile: {
                    include: {
                      user: true
                    }
                  }
                }
              },
            }
          }
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
