import React from 'react'
import ContentHeader from '../../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"

import { prisma } from '../../lib/server/prisma'

import { NextSeo } from 'next-seo'
import { VStack } from '@chakra-ui/react'
import ProfileDetails from '../../components/profiles/profile/ProfileDetails'
import InternalProjects from '../../components/profiles/profile/InternalProjects'
import ExternalResearches from '../../components/profiles/profile/ExternalResearches'
import JournalPublications from '../../components/profiles/profile/JournalPublications'
import BookPublications from '../../components/profiles/profile/BookPublications'
import ResearchDisseminations from '../../components/profiles/profile/ResearchDisseminations'
import ResearchPresentations from '../../components/profiles/profile/ResearchPresentations'
import { ExtendedProfile } from '../../types/profile-card'
import ResearchEvents from '../../components/profiles/profile/ResearchEvents'

interface ProfileProps {

}

const Profile: React.FC<ProfileProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const profile: ExtendedProfile = JSON.parse(props.profile)

  return (
    <>
      <NextSeo
        title={`${profile.first_name ?? profile.email} ${profile.last_name} | URC Management System`}
      />
      <VStack spacing={5}>
        <ContentHeader>
          {profile.first_name ?? profile.email} {profile.last_name}
        </ContentHeader>
        <VStack spacing={5} w="full">
          <ProfileDetails profile={profile} />
          <InternalProjects profile={profile} />
          <ExternalResearches profile={profile} />
          <JournalPublications profile={profile} />
          <BookPublications profile={profile} />
          <ResearchDisseminations profile={profile} />
          <ResearchPresentations profile={profile} />
          <ResearchEvents profile={profile} />
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

  const profile = await prisma.profile.findUnique({
    where: {
      id: id as string
    },
    include: {
      user: true,
      units: true,
      roles: true
    }
  })


  return {
    props: { 
      session,
      profile: JSON.stringify(profile)
    }
  }
}

export default Profile
