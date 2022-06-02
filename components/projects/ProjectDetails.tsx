import React from 'react'
import { VStack, HStack, Heading, Wrap, WrapItem, Spacer, useToast, Box, Select } from '@chakra-ui/react'

import type { ExtendedProject } from '../../types/profile-card'
import ProjectStatusTag from '../general/ProjectStatusTag'
import EditProjectTitleButton from './EditProjectTitleButton'
import Card from '../general/Card'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import IconButton from '../general/IconButton'
import { CheckIcon, EditIcon } from '@chakra-ui/icons'
import EditableText from '../general/EditableText'
import EditableTextarea from '../general/EditableTextarea'
import { ProjectStatus } from '@prisma/client'
import { roleChecker } from '../../lib/roleChecker'

interface ProjectDetailsProps {
  project: ExtendedProject
}

const ProjectDetails: React.FC<ProjectDetailsProps> = (props) => {
  const project: ExtendedProject = props.project

  const [submitting, setSubmitting] = React.useState(false)
  const [statusList, setStatusList] = React.useState<ProjectStatus[]>([])

  const { handleSubmit, control } = useForm<ExtendedProject>({
    defaultValues: project
  });

  const toast = useToast()

  const onSubmit: SubmitHandler<ExtendedProject> = async data => {
    setSubmitting(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects`, { 
      method: 'POST',
      body: JSON.stringify({...data, mode: 'update', id: project.id})
    }).then((i) => i.json())

    if (res.success) {
      toast({
        title: 'Success!',
        description: `Successfully modified details!`,
        status: 'success'
      })
    } else {
      toast({
        title: 'Error!',
        description: res.error,
        status: 'error'
      })
    }

    setSubmitting(false)
  };

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects/status`).then((i) => i.json()).then((res) => setStatusList(res.data))
  }, [])

  const [editing, setEditing] = React.useState(false)

  const session = useSession()

  return (
    <VStack spacing={6} w="full" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Wrap align="center" w="full">
        <WrapItem>
          <Wrap spacing={4} align="center">
            <WrapItem>
              <Heading
                fontFamily="body"
                fontSize="xl"
              >
                Project Details
              </Heading>
            </WrapItem>
          </Wrap>
        </WrapItem>
        <Spacer />
        
        {(project.bridge_profiles.filter((bridge) => bridge.profile_id === session.data.profile.id).length > 0 || roleChecker(session.data.profile, ['urc_staff', 'urc_chairperson'])) && (
          <WrapItem>
            <HStack>
              <IconButton 
                aria-label="Edit Project Details"
                icon={!editing ? <EditIcon /> : <CheckIcon />}
                onClick={() => setEditing((prev) => !prev)}
                type={!editing ? "submit" : "button"}
                isLoading={submitting}
              />
            </HStack>
          </WrapItem>
        )}
      </Wrap>

      <Card>
        <VStack align="baseline">
          <Wrap align="center">
            <WrapItem>
              <Heading
                fontFamily="body"
                fontSize="md"
              >Title:</Heading>
            </WrapItem>
            <WrapItem>
              <Controller
                name="title"
                control={control}
                render={({ field }) => 
                  <EditableText 
                    editMode={editing}
                    {...field}
                  />
                }
              />
            </WrapItem>
          </Wrap>
          <Wrap align="center">
            <WrapItem>
              <Heading
                fontFamily="body"
                fontSize="md"
              >Status:</Heading>
            </WrapItem>
            <WrapItem>
              { !editing ? (
                <ProjectStatusTag projectStatus={project.project_status} />
              ) : (
                <Controller
                  name="project_status_id"
                  control={control}
                  defaultValue={project.project_status.id}
                  render={({ field }) => (
                    <Select {...field}>
                      { statusList.map((status) => (
                        <option key={status.id} value={status.id}>{status.comment}</option>
                      )) }
                    </Select>
                  )}
                />
              ) }
            </WrapItem>
          </Wrap>
          <Heading
            fontFamily="body"
            fontSize="md"
          >Description/Abstract:</Heading>
          <Controller
            name="abstract"
            control={control}
            render={({ field }) => 
              <EditableTextarea 
                editMode={editing}
                rich
                plainTextStyle={{ fontSize: 'sm' }}
                {...field}
              />
            }
          />
        </VStack>
      </Card>
    </VStack>
  )
}

export default ProjectDetails