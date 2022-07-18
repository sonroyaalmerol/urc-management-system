import React from 'react'
import { VStack, HStack, Heading, Text, Tag, Button, Wrap, WrapItem, Box, Center, Spinner, BoxProps, Avatar, SimpleGrid, useToast, Spacer } from '@chakra-ui/react'

import Card from '../general/Card'

import { format } from 'date-fns'


import { useRouter } from 'next/router'
import type { ExtendedVerificationRequest } from '../../types/profile-card'
import FileDetails from '../general/FileDetails'
import { CheckIcon, DeleteIcon } from '@chakra-ui/icons'
import ButtonWithConfirmation from '../general/ButtonWithConfirmation'
import parseHTML from '../../utils/client/parseHTML'
import ViewMemoButton from './ViewMemoButton'
import { useSession } from 'next-auth/react'
import { roleChecker } from '../../utils/roleChecker'
import { CONFIRMATION_RESEARCHER_INFORMATION, VERIFY_CENTER_NEWS, VERIFY_CENTER_PROJECTS } from '../../utils/permissions'

interface VerificationCardProps extends BoxProps {
  request: ExtendedVerificationRequest,
  afterAction?: (entryId: string) => any
}

const VerificationCard: React.FC<VerificationCardProps> = (props) => {
  const { request } = props

  const divProps = Object.assign({}, props)
  delete divProps.request

  const toast = useToast()

  const [loading, setLoading] = React.useState(false)

  const setVerified = async (verified: boolean) => {
    setLoading(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/verifications/${request.id}`, {
      method: 'POST',
      body: JSON.stringify({ verified })
    }).then((i) => i.json())

    if (res.success) {
      toast({
        title: 'Success!',
        description: `${entry.title} has been marked as ${verified ? 'verified' : 'invalid'}!`,
        status: 'success'
      })

      if (props.afterAction) {
        props.afterAction(request.id)
      }
    }
    setLoading(false)
  }

  const entry = React.useMemo(() => {
    switch (request.type) {
      case 'BOOK_PUBLICATION':
        return {
          humanizedType: 'Book Publication',
          title: request.book_publication.title,
          description: (
            <VStack align="baseline" spacing={0}>
              <Text fontSize="sm"><strong>Publisher</strong>: {request.book_publication.publisher}</Text>
              <Text fontSize="sm"><strong>ISBN</strong>: {request.book_publication.isbn}</Text>
              <Text fontSize="sm"><strong>Date Published</strong>: {format(new Date(request.book_publication.date_published), 'MMM dd, yyyy h:mm a')}</Text>
            </VStack>
          )
        }
      case 'EXTERNAL_RESEARCH':
        return {
          humanizedType: 'External Research',
          title: request.external_research.title,
          description: (
            <VStack align="baseline" spacing={0}>
              <Text fontSize="sm"><strong>Organization</strong>: {request.external_research.organization}</Text>
              <Text fontSize="sm"><strong>Start Duration</strong>: {format(new Date(request.external_research.duration_start), 'MMM dd, yyyy h:mm a')}</Text>
              <Text fontSize="sm"><strong>End Duration</strong>: {format(new Date(request.external_research.duration_end), 'MMM dd, yyyy h:mm a')}</Text>
              <Text fontSize="sm"><strong>Cycle</strong>: {request.external_research.cycle}</Text>
            </VStack>
          )
        }
      case 'JOURNAL_PUBLICATION':
        return {
          humanizedType: 'Journal Publication',
          title: request.journal_publication.title,
          description: (
            <VStack align="baseline" spacing={0}>
              <Text fontSize="sm"><strong>ISSN</strong>: {request.journal_publication.issn}</Text>
              <Text fontSize="sm"><strong>Journal</strong>: {request.journal_publication.journal}</Text>
              <Text fontSize="sm"><strong>Is indexed</strong>: {request.journal_publication.is_indexed ? 'Yes' : 'No'}</Text>
              <Text fontSize="sm"><strong>URL</strong>: {request.journal_publication.url}</Text>
              <Text fontSize="sm"><strong>Date Published</strong>: {format(new Date(request.journal_publication.date_published), 'MMM dd, yyyy h:mm a')}</Text>
            </VStack>
          )
        }
      case 'RESEARCH_DISSEMINATION':
        return {
          humanizedType: 'Research Dissemination',
          title: request.research_dissemination.title,
          description: (
            <VStack align="baseline" spacing={0}>
              <Text fontSize="sm"><strong>Location</strong>: {request.research_dissemination.location}</Text>
              <Text fontSize="sm"><strong>Event Date</strong>: {format(new Date(request.research_dissemination.event_date), 'MMM dd, yyyy h:mm a')}</Text>
              <Text fontSize="sm"><strong>Organization</strong>: {request.research_dissemination.organization}</Text>
              <Text fontSize="sm"><strong>URL</strong>: {request.research_dissemination.url}</Text>
            </VStack>
          )
        }
      case 'RESEARCH_EVENT':
        return {
          humanizedType: 'Research Event',
          title: request.research_event.event_name,
          description: (
            <VStack align="baseline" spacing={0}>
              <Text fontSize="sm"><strong>Start Date</strong>: {format(new Date(request.research_event.start_date), 'MMM dd, yyyy h:mm a')}</Text>
              <Text fontSize="sm"><strong>End Date</strong>: {format(new Date(request.research_event.end_date), 'MMM dd, yyyy h:mm a')}</Text>
              <Text fontSize="sm"><strong>Description</strong>: {request.research_event.description}</Text>
            </VStack>
          )
        }
      case 'RESEARCH_PRESENTATION':
        return {
          humanizedType: 'Research Presentation',
          title: request.research_presentation.title,
          description: (
            <VStack align="baseline" spacing={0}>
              <Text fontSize="sm"><strong>Location</strong>: {request.research_presentation.location}</Text>
              <Text fontSize="sm"><strong>Event Date</strong>: {format(new Date(request.research_presentation.event_date), 'MMM dd, yyyy h:mm a')}</Text>
              <Text fontSize="sm"><strong>Conference</strong>: {request.research_presentation.conference}</Text>
              <Text fontSize="sm"><strong>URL</strong>: {request.research_presentation.url}</Text>
            </VStack>
          )
        }
      case 'INSTITUTE_NEWS':
        return {
          humanizedType: 'Institute News',
          title: request.institute_news.title,
          description: (
            <VStack align="baseline" spacing={0}>
              <Text fontSize="sm"><strong>Institute</strong>: {request.institute_news.institute.short_name ?? request.institute_news.institute.name}</Text>
              <Text fontSize="sm" fontWeight="bold">Content:</Text>
              <VStack align="baseline" spacing={2}>
                <Box fontSize="sm" noOfLines={2}>
                  {parseHTML(request.institute_news.content, { textOnly: true })}
                </Box>
                <ViewMemoButton instituteNews={request.institute_news} />
                <Wrap>
                  { request.institute_news.uploads.map((file) => (
                    <WrapItem key={file.id}>
                      <FileDetails isViewable file={file} />
                    </WrapItem>
                  )) }
                </Wrap>
              </VStack>
            </VStack>
          )
        }
      case 'PROJECT_INSTITUTE':
        return {
          humanizedType: 'Project Institute Assignment',
          title: request.project_institute.project.title,
          description: (
            <VStack align="baseline" spacing={0}>
              <Text fontSize="sm"><strong>Institute</strong>: {request.project_institute.institute.name}</Text>
            </VStack>
          )
        }
    }
  }, [request.type])

  const session = useSession()

  const VerificationTools = () => {
    if (request.type === 'INSTITUTE_NEWS') {
      if (!roleChecker(session.data.profile, VERIFY_CENTER_NEWS)) {
        return <></>
      }
    }

    if (request.type === 'PROJECT_INSTITUTE') {
      if (!roleChecker(session.data.profile, VERIFY_CENTER_PROJECTS)) {
        return <></>
      }
    }

    if (!roleChecker(session.data.profile, CONFIRMATION_RESEARCHER_INFORMATION)) {
      return <></>
    }

    return (
      <SimpleGrid columns={request.status === 'NOT_VERIFIED' ? 2 : 1} mt="1rem" spacing={2}>
        { (request.status === 'INVALID' || request.status === 'NOT_VERIFIED') && (
          <ButtonWithConfirmation
            color="white"
            bgColor="brand.blue"
            borderRadius={10}
            leftIcon={<CheckIcon />}
            _hover={{
              color: 'brand.blue',
              bgColor: 'brand.cardBackground'
            }}
            confirmationMessage={
              `
                Press confirm to mark the request, <u>${entry.title}</u>, as <b>VERIFIED</b>
              `
            }
            onClick={() => { setVerified(true) }}
            isLoading={loading}
          >
            Mark as Verified
          </ButtonWithConfirmation>
        ) }

        { (request.status === 'VERIFIED' || request.status === 'NOT_VERIFIED') && (
          <ButtonWithConfirmation
            color="white"
            bgColor="brand.red"
            borderRadius={10}
            leftIcon={<DeleteIcon />}
            _hover={{
              color: 'brand.red',
              bgColor: 'brand.cardBackground'
            }}
            confirmationMessage={
              `
                Press confirm to mark the request, <u>${entry.title}</u>, as <b>INVALID</b>
              `
            }
            onClick={() => { setVerified(false) }}
            isLoading={loading}
          >
            Mark as Invalid
          </ButtonWithConfirmation>
        ) }
      </SimpleGrid>
    )
  }

  return (
    <Card
      transition="box-shadow 0.05s, background-color 0.1s"
      display='flex'
      flexDir="column"
      {...divProps}
    >
      {/* TODO: Add Cancel Button */}
      <VStack alignItems="flex-start" spacing={2}>
        <Wrap spacing={2}>
          <WrapItem>
            <Heading
              size="md"
              fontFamily="body"
              textAlign="left"
            >
              {entry?.title}
            </Heading>
          </WrapItem>
          <WrapItem>
            <Tag
              bgColor="brand.lightBlue"
              color="white"
              borderRadius={10}
              fontWeight="bold"
            >
              {entry.humanizedType}
            </Tag>
          </WrapItem>
          { request.status === 'VERIFIED' && (
            <WrapItem>
              <Tag
                bgColor="brand.blue"
                color="white"
                borderRadius={10}
                fontWeight="bold"
              >
                Verified
              </Tag>
            </WrapItem>
          ) }
          { request.status === 'INVALID' && (
            <WrapItem>
              <Tag
                bgColor="brand.red"
                color="white"
                borderRadius={10}
                fontWeight="bold"
              >
                Invalid
              </Tag>
            </WrapItem>
          ) }
        </Wrap>
        <HStack spacing={4}>
          <Avatar src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/files/get/${request.profile.photo_id}`} size="sm" />
          <Text 
            as='a'
            fontWeight="bold" 
            fontSize="xs"
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/profiles/${request.profile.id}`}
            target='_blank'
          >
            {request.profile.first_name} {request.profile.last_name}
          </Text>
        </HStack>
        <Text fontStyle="italic" fontSize="xs">
          Request submitted: { format(new Date(request.updated_at), 'MMM dd, yyyy h:mm a') }
        </Text>
        { request.role && (
          <Text fontSize="sm">
            <strong>Role/Position</strong>: {request.role}
          </Text>
        ) }
        {entry.description}
        <Wrap>
          { request.proof_uploads.map((file) => (
            <WrapItem key={file.id}>
              <FileDetails isViewable file={file} />
            </WrapItem>
          )) }
        </Wrap>
      </VStack>
      <Spacer />
      <VerificationTools />
    </Card>
  )
}

export default VerificationCard