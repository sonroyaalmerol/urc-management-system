import React from 'react'
import { VStack, HStack, Heading, Wrap, WrapItem, Spacer, useToast, Box, Select } from '@chakra-ui/react'

import type { ExtendedProject } from '../../types/profile-card'
import ProjectStatusTag from '../general/ProjectStatusTag'
import EditProjectTitleButton from './EditProjectTitleButton'
import Card from '../general/Card'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import IconButton from '../general/IconButton'
import { CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import EditableText from '../general/EditableText'
import EditableTextarea from '../general/EditableTextarea'
import { ProjectStatus } from '@prisma/client'
import { memberChecker, roleChecker } from '../../utils/roleChecker'
import { CHANGE_PROJECT_STATUS } from '../../utils/permissions'
import UnitsSection from './UnitsSection'
import { useRouter } from 'next/router'
import ResearchAreaSection from './ResearchAreaSection'
import IconButtonWithConfirmation from '../general/IconButtonWithConfirmation'

interface ProjectDetailsProps {
  project: ExtendedProject
}

const ProjectDetails: React.FC<ProjectDetailsProps> = (props) => {
  const [project, setProject] = React.useState(props.project)

  const [submitting, setSubmitting] = React.useState(false)
  const [statusList, setStatusList] = React.useState<ProjectStatus[]>([])

  const { handleSubmit, control } = useForm<ExtendedProject>({
    defaultValues: project
  });

  const toast = useToast()
  const router = useRouter()

  const onSubmit: SubmitHandler<ExtendedProject> = async data => {
    setSubmitting(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects`, { 
      method: 'POST',
      body: JSON.stringify({...data, mode: 'update', id: project.id})
    }).then((i) => i.json())

    if (res.success) {
      if (res.data.slug !== project.slug) {
        router.replace(`/projects/${res.data.slug}`)
      } else {
        setProject(res.data)
      }

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

  const onDelete = async () => {
    setSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects`, {
      method: 'POST',
      body: JSON.stringify({mode: 'delete', id: project.id})
    }).then((i) => i.json())

    if (res.success) {
      router.replace(`/projects`)
      toast({
        title: 'Success!',
        description: 'Successfully deleted project!',
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
        
        {(roleChecker(session.data.profile, CHANGE_PROJECT_STATUS) || memberChecker(session.data.profile, props.project.bridge_profiles)) && (
          <WrapItem>
            <HStack>
              <IconButton 
                aria-label="Edit Project Details"
                icon={!editing ? <EditIcon /> : <CheckIcon />}
                onClick={() => setEditing((prev) => !prev)}
                type={!editing ? "submit" : "button"}
                isLoading={submitting}
              />
              <IconButtonWithConfirmation 
                aria-label='Delete Project'
                color="white"
                bgColor="brand.red"
                _hover={{
                  color: 'brand.red',
                  bgColor: 'brand.cardBackground'
                }}
                confirmationMessage={`
                  You are about to delete ${props.project.title}. Do you want to proceed?
                `}
                isLoading={submitting}
                icon={<DeleteIcon />}
                onClick={() => {
                  onDelete()
                }}
              />
            </HStack>
          </WrapItem>
        )}
      </Wrap>

      <Card>
        <VStack align="baseline">
          <Wrap spacingX={8}>
            <WrapItem>
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
                    { !editing || !roleChecker(session.data.profile, CHANGE_PROJECT_STATUS) ? (
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
              </VStack>
            </WrapItem>
            <WrapItem>
              <UnitsSection project={project} />
            </WrapItem>
            <WrapItem>
              <ResearchAreaSection project={project} />
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