import React from 'react'
import ContentHeader from '../../components/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"

import { NextSeo } from 'next-seo'
import { Avatar, Divider, Heading, HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import { BookPublication, ExternalResearch, Institute, JournalPublication, Profile, ProfileToBookPublicationBridge, ProfileToExternalResearchBridge, ProfileToInstituteBridge, ProfileToJournalPublicationBridge, ProfileToProjectBridge, ProfileToResearchDisseminationBridge, ProfileToResearchPresentationBridge, Project, ResearchDissemination, ResearchPresentation, Unit, User } from '@prisma/client'
import Card from '../../components/Card'

interface ProfileProps {

}

const Profile: React.FC<ProfileProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const profile: Profile & {
    user: User;
    units: Unit[];
    bridge_institutes: (ProfileToInstituteBridge & {
      institute: Institute;
    })[];
    bridge_projects: (ProfileToProjectBridge & {
      project: Project;
    })[];
    bridge_external_researches: (ProfileToExternalResearchBridge & {
      external_research: ExternalResearch;
    })[];
    bridge_journal_publications: (ProfileToJournalPublicationBridge & {
      journal_publication: JournalPublication;
    })[];
    bridge_book_publications: (ProfileToBookPublicationBridge & {
      book_publication: BookPublication;
    })[];
    bridge_research_disseminations: (ProfileToResearchDisseminationBridge & {
      research_dissemination: ResearchDissemination;
    })[];
    bridge_research_presentations: (ProfileToResearchPresentationBridge & {
      presentation: ResearchPresentation;
    })[];
  } = JSON.parse(props.profile)

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
          <Card>
            <VStack spacing={6} align="baseline">
              <Heading
                fontFamily="body"
                fontSize="xl"
              >
                Profile Details
              </Heading>
              <Divider />
              <HStack w="full" spacing={10} align="flex-start">
                <Avatar src={`/api/files/get/${profile.photo_id}`} size="2xl" />
                <VStack align="baseline">
                  <Wrap align="baseline">
                    <WrapItem>
                      <Heading
                        fontFamily="body"
                        fontSize="md"
                      >
                        Email:
                      </Heading>
                    </WrapItem>
                    <WrapItem>
                      <Text>
                        {profile.email}
                      </Text>
                    </WrapItem>
                  </Wrap>
                  <Wrap align="baseline">
                    <WrapItem>
                      <Heading
                        fontFamily="body"
                        fontSize="md"
                      >
                        First Name:
                      </Heading>
                    </WrapItem>
                    <WrapItem>
                      <Text>
                        {profile.first_name}
                      </Text>
                    </WrapItem>
                  </Wrap>
                  <Wrap align="baseline">
                    <WrapItem>
                      <Heading
                        fontFamily="body"
                        fontSize="md"
                      >
                        Middle Initial:
                      </Heading>
                    </WrapItem>
                    <WrapItem>
                      <Text>
                        {profile.middle_initial}
                      </Text>
                    </WrapItem>
                  </Wrap>
                  <Wrap align="baseline">
                    <WrapItem>
                      <Heading
                        fontFamily="body"
                        fontSize="md"
                      >
                        Last Name:
                      </Heading>
                    </WrapItem>
                    <WrapItem>
                      <Text>
                        {profile.last_name}
                      </Text>
                    </WrapItem>
                  </Wrap>
                  <Wrap align="baseline">
                    <WrapItem>
                      <Heading
                        fontFamily="body"
                        fontSize="md"
                      >
                        Titles:
                      </Heading>
                    </WrapItem>
                    <WrapItem>
                      <Text>
                        {profile.titles}
                      </Text>
                    </WrapItem>
                  </Wrap>
                  <Wrap align="baseline">
                    <WrapItem>
                      <Heading
                        fontFamily="body"
                        fontSize="md"
                      >
                        Honorific:
                      </Heading>
                    </WrapItem>
                    <WrapItem>
                      <Text>
                        {profile.honorific}
                      </Text>
                    </WrapItem>
                  </Wrap>
                </VStack>
              </HStack>
            </VStack>
          </Card>
          <Card>
            <VStack spacing={6} align="baseline">
              <Heading
                fontFamily="body"
                fontSize="xl"
              >
                Internal Projects
              </Heading>
              <Divider />
            </VStack>
          </Card>
          <Card>
            <VStack spacing={6} align="baseline">
              <Heading
                fontFamily="body"
                fontSize="xl"
              >
                External Researches
              </Heading>
              <Divider />
            </VStack>
          </Card>
          <Card>
            <VStack spacing={6} align="baseline">
              <Heading
                fontFamily="body"
                fontSize="xl"
              >
                Journal Publications
              </Heading>
              <Divider />
            </VStack>
          </Card>
          <Card>
            <VStack spacing={6} align="baseline">
              <Heading
                fontFamily="body"
                fontSize="xl"
              >
                Book Publications
              </Heading>
              <Divider />
            </VStack>
          </Card>
          <Card>
            <VStack spacing={6} align="baseline">
              <Heading
                fontFamily="body"
                fontSize="xl"
              >
                Research Disseminations
              </Heading>
              <Divider />
            </VStack>
          </Card>
          <Card>
            <VStack spacing={6} align="baseline">
              <Heading
                fontFamily="body"
                fontSize="xl"
              >
                Research Presentations
              </Heading>
              <Divider />
            </VStack>
          </Card>
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

  const profile = await prisma.profile.findUnique({
    where: {
      id: id as string
    },
    include: {
      user: true,
      units: true,
      bridge_institutes: {
        include: {
          institute: true
        }
      },
      bridge_projects: {
        include: {
          project: true
        }
      },
      bridge_external_researches: {
        include: {
          external_research: true
        }
      },
      bridge_journal_publications: {
        include: {
          journal_publication: true
        }
      },
      bridge_book_publications: {
        include: {
          book_publication: true
        }
      },
      bridge_research_disseminations: {
        include: {
          research_dissemination: true
        }
      },
      bridge_research_presentations: {
        include: {
          research_presentation: true
        }
      }
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
