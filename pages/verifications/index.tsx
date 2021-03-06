import React from 'react'
import ContentHeader from '../../components/general/ContentHeader'
import { getSession, useSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack, HStack, Heading, Wrap, WrapItem, Spacer, Select } from '@chakra-ui/react'

import { NextSeo } from 'next-seo'

import NewVerificationButton from '../../components/verifications/NewVerificationButton'
import VerificationList from '../../components/verifications/VerificationList'
import { roleChecker } from '../../utils/roleChecker'
import { CONFIRMATION_RESEARCHER_INFORMATION, VERIFY_CENTER_NEWS, VERIFY_CENTER_PROJECTS } from '../../utils/permissions'

interface VerificationsProps {

}

const Verifications: React.FC<VerificationsProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // const project: Project = JSON.parse(props.project)
  const session = useSession()

  const TYPE_OPTIONS = [
    {
      name: 'External Research',
      value: 'external_research'
    },
    {
      name: 'Journal Publication',
      value: 'journal_publication'
    },
    {
      name: 'Book Publication',
      value: 'book_publication'
    },
    {
      name: 'Research Dissemination',
      value: 'research_dissemination'
    },
    {
      name: 'Research Presentation',
      value: 'research_presentation'
    },
    {
      name: 'Research Event',
      value: 'research_event'
    },
    {
      name: 'Institute News',
      value: 'institute_news'
    },
    {
      name: 'Project',
      value: 'project_institute'
    },
  ].filter((option) => {
    if (option.value.toUpperCase() === 'INSTITUTE_NEWS') {
      return roleChecker(session.data.profile, VERIFY_CENTER_NEWS)
    }

    if (option.value.toUpperCase() === 'PROJECT_INSTITUTE') {
      return roleChecker(session.data.profile, VERIFY_CENTER_PROJECTS)
    }

    return roleChecker(session.data.profile, CONFIRMATION_RESEARCHER_INFORMATION)
  })

  const [typeFilter, setTypeFilter] = React.useState('')
  const types = React.useMemo(() => {
    if (typeFilter === '') {
      return [
        'external_research',
        'journal_publication',
        'book_publication',
        'research_dissemination',
        'research_presentation',
        'research_event',
        'institute_news',
        'project_institute'
      ]
    } else {
      return [typeFilter]
    }
  }, [typeFilter])

  const [statusFilter, setStatusFilter] = React.useState(
    roleChecker(session.data.profile, ['researcher'], { exact: true }) ? '' : 'not_verified'
  )
  const status = React.useMemo(() => {
    if (statusFilter === '') {
      return ['verified', 'invalid', 'not_verified']
    } else {
      return [statusFilter]
    }
  }, [statusFilter])

  return (
    <>
      <NextSeo
        title="Verifications | URC Management System"
      />
      <VStack spacing={5}>
        <ContentHeader>
          Verifications (External Projects, Publications, Presentations)
        </ContentHeader>
        <Wrap align="center" w="full">
          <WrapItem>
            <Wrap spacing={4} align="center">
              <WrapItem>
                <Heading
                  fontFamily="body"
                  fontSize="xl"
                >
                  Verification Requests
                </Heading>
              </WrapItem>
              <WrapItem>
                <Wrap align="center">
                  <WrapItem>
                    <Select
                      borderColor="brand.blue"
                      color="brand.blue"
                      placeholder="Submission Types"
                      borderRadius={10}
                      _focus={{
                        boxShadow: "none"
                      }}
                      value={typeFilter}
                      onChange={(e) => { setTypeFilter(e.target.value) }}
                      cursor="pointer"
                    >
                      { TYPE_OPTIONS.map((option) => (
                        <option value={option.value} key={option.value}>{option.name}</option>
                      )) }
                    </Select>
                  </WrapItem>
                  <WrapItem>
                    <Select
                      borderColor="brand.blue"
                      color="brand.blue"
                      placeholder="Status"
                      borderRadius={10}
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value) }}
                      _focus={{
                        boxShadow: "none"
                      }}
                      cursor="pointer"
                    >
                      <option value="verified">Verified</option>
                      <option value="invalid">Invalid</option>
                      <option value="not_verified">Not Verified</option>
                    </Select>
                  </WrapItem>
                </Wrap>
              </WrapItem>
            </Wrap>
          </WrapItem>
          <Spacer />
          <WrapItem>
            <HStack>
              <NewVerificationButton />
            </HStack>
          </WrapItem>
        </Wrap>
        <VerificationList types={types} status={status} />
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

export default Verifications