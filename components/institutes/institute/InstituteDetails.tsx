import React from 'react'

import { Avatar, Divider, Heading, Spacer, Tag, Text, useToast, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import Card from '../../general/Card'

import type { ComponentProps } from '../../../types/profile-card'
import AvatarUploadable from '../../general/AvatarUploadable'
import IconButton from '../../general/IconButton'
import { CheckIcon, EditIcon } from '@chakra-ui/icons'
import EditableText from '../../general/EditableText'
import EditableTextarea from '../../general/EditableTextarea'

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import type { Institute } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { roleChecker } from '../../../utils/roleChecker'
import { UPDATE_CENTER_INFO } from '../../../utils/permissions'

const InstituteDetails: React.FC<ComponentProps> = (props) => {
  const institute = props.institute
  const [submitting, setSubmitting] = React.useState(false)

  const toast = useToast()

  const { handleSubmit, control } = useForm<Partial<Institute>>({
    defaultValues: institute
  });

  const onSubmit: SubmitHandler<Partial<Institute>> = async data => {
    setSubmitting(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/institutes/${institute.id}`, { 
      method: 'POST',
      body: JSON.stringify(data)
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

  const session = useSession()
  const [editing, setEditing] = React.useState(false)

  return (
    <VStack w="full" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Wrap w="full" my="1rem" align="center">
        <WrapItem>
          <Heading
            fontFamily="body"
            fontSize="xl"
          >
            Institute Details
          </Heading>
        </WrapItem>
        <Spacer />
        <WrapItem>
          { (roleChecker(session.data.profile, UPDATE_CENTER_INFO)) && (
            <IconButton
              padding={0} 
              aria-label='Edit'
              icon={!editing ? <EditIcon /> : <CheckIcon />}
              onClick={() => setEditing((prev) => !prev)}
              type={!editing ? "submit" : "button"}
              isLoading={submitting}
            />
          ) }
        </WrapItem>
      </Wrap>
      <Card>
        <VStack spacing={6} align="baseline">
          <Wrap w="full" spacing={10} align="center" justify={{ base: 'center', lg: 'initial' }}>
            <WrapItem>
              <AvatarUploadable
                size="2xl"
                photoId={institute.photo_id}
                instituteId={institute.id}
                disabled={!roleChecker(session.data.profile, UPDATE_CENTER_INFO)}
              />
            </WrapItem>
            <WrapItem>
              <VStack align="baseline">
                <Wrap align="baseline" w="full">
                  <WrapItem>
                    <Heading
                      fontFamily="body"
                      fontSize="md"
                    >
                      Name:
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Controller
                      name="name"
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
                <Wrap align="baseline" w="full">
                  <WrapItem>
                    <Heading
                      fontFamily="body"
                      fontSize="md"
                    >
                      Short Name:
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Controller
                      name="short_name"
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
                <Wrap align="baseline" w="full">
                  <WrapItem>
                    <Heading
                      fontFamily="body"
                      fontSize="md"
                    >
                      Email:
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Controller
                      name="email"
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
                <Wrap align="baseline">
                  <WrapItem>
                    <Heading
                      fontFamily="body"
                      fontSize="md"
                    >
                      Address:
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Controller
                      name="address"
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
                <Wrap align="baseline">
                  <WrapItem>
                    <Heading
                      fontFamily="body"
                      fontSize="md"
                    >
                      Contact Number:
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Controller
                      name="contact_number"
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
                <Wrap align="baseline">
                  <WrapItem>
                    <Heading
                      fontFamily="body"
                      fontSize="md"
                    >
                      Research Areas:
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Controller
                      name="research_areas"
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
              </VStack>
            </WrapItem>
          </Wrap>
          <Wrap align="baseline" w="full">
            <WrapItem w="full">
              <Controller
                name="description"
                control={control}
                render={({ field }) => 
                  <EditableTextarea 
                    editMode={editing}  
                    plainTextStyle={{
                      fontSize: 'sm'
                    }}
                    {...field} 
                  />
                }
              />
            </WrapItem>
          </Wrap>
        </VStack>
      </Card>
    </VStack>
  )
}

export default InstituteDetails
