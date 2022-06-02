import React from 'react'
import { VStack, HStack, Heading, Text, Tag, Button, Wrap, WrapItem, Box, Center, Spinner, BoxProps } from '@chakra-ui/react'

import Card from '../../components/general/Card'
import SmallAvatar from '../../components/general/SmallAvatar'

import { format } from 'date-fns'

import parse from '../../utils/client/parseHTML'

import type { Project, ProfileToProjectBridge, Profile, User, ProjectStatus } from '@prisma/client'

import { useRouter } from 'next/router'
import ApprovalTag from '../general/ApprovalTag'
import ProjectStatusTag from '../general/ProjectStatusTag'

interface ProjectCardProps extends BoxProps {
  project: (Project & {
    bridge_profiles: (ProfileToProjectBridge & {
        profile: Profile & {
            user: User;
        };
    })[];
    project_status: ProjectStatus;
  })
}

const ProjectCard: React.FC<ProjectCardProps> = (props) => {
  const { project } = props

  const divProps = Object.assign({}, props)
  delete divProps.project

  const router = useRouter()

  return (
    <Card
      as="a"
      href={`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${project.slug}`}
      transition="box-shadow 0.05s, background-color 0.1s"
      _hover={{
        backgroundColor: "brand.cardBackground",
        boxShadow: "-5px 5px 30px -20px"
      }}
      _active={{
        boxShadow: "-5px 5px 20px -20px"
      }}
      onClick={(e) => {
        e.preventDefault()
        router.push(`/projects/${project.slug}`)
      }}
      {...divProps}
    >
      <VStack alignItems="flex-start" spacing={4}>
        <Heading
          size="md"
          fontFamily="body"
          textAlign="left"
        >
          {project.title}
        </Heading>
        <Wrap align="center" spacing="2">
          { project.bridge_profiles.length > 0 ? project.bridge_profiles.map((bridge) => (
            <WrapItem key={bridge.profile.id}>
              <SmallAvatar
                {...bridge.profile}
              />
            </WrapItem>
          )) : (
            <>
              { [...project.main_proponents, ...project.co_proponents].map((proponent, i) => (
                <WrapItem key={`${proponent}-avatar-${i}`}>
                  <SmallAvatar
                    user={{ name: proponent }}
                  />
                </WrapItem>
              )) }
            </>
          ) }
        </Wrap>
        <Text fontStyle="italic" fontSize="sm">
          Last updated: { format(new Date(project.updated_at), 'MMM dd, yyyy h:mm a') }
        </Text>
        <Box fontSize="sm" noOfLines={2}>
          {parse(project.abstract, { textOnly: true })}
        </Box>
        <HStack>
          <ProjectStatusTag projectStatus={project.project_status} />
        </HStack>
      </VStack>
    </Card>
  )
}

export default ProjectCard