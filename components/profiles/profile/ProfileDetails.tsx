import React from 'react'

import { Avatar, Divider, Heading, Spacer, Tag, Text, useToast, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import Card from '../../general/Card'

import EditableText from '../../general/EditableText'
import EditableTextarea from '../../general/EditableTextarea'

import { useForm, SubmitHandler, Controller } from "react-hook-form"

import type { ComponentProps } from '../../../types/profile-card'
import RolesSection from './RolesSection'
import AvatarUploadable from '../../general/AvatarUploadable'
import { useSession } from 'next-auth/react'
import type { Profile } from '@prisma/client'
import IconButton from '../../general/IconButton'
import { CheckIcon, EditIcon } from '@chakra-ui/icons'

const ProfileDetails: React.FC<ComponentProps> = (props) => {
  const profile = props.profile

  const [submitting, setSubmitting] = React.useState(false)

  const { handleSubmit, control } = useForm<Partial<Profile>>({
    defaultValues: profile
  });

  const toast = useToast()

  const onSubmit: SubmitHandler<Partial<Profile>> = async data => {
    setSubmitting(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/profiles/${profile.id}`, { 
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

  const [editing, setEditing] = React.useState(false)

  const session = useSession()

  return (
    <VStack w="full" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Wrap w="full" my="1rem" align="center">
        <WrapItem>
          <Heading
            fontFamily="body"
            fontSize="xl"
          >
            Profile Details
          </Heading>
        </WrapItem>
        { profile.user && (
          <WrapItem>
            <Tag
              bgColor="brand.blue"
              textColor="white"
              borderRadius="20px"
              fontSize="xs"
              fontWeight="bold"
              paddingX="0.8rem"
            >
              Connected to Google Account
            </Tag>
          </WrapItem>
        ) }
        <Spacer />
        <WrapItem>
          <IconButton
            padding={0} 
            aria-label='Edit'
            icon={!editing ? <EditIcon /> : <CheckIcon />}
            onClick={() => setEditing((prev) => !prev)}
            type={!editing ? "submit" : "button"}
            isLoading={submitting}
          />
        </WrapItem>
      </Wrap>
      <Card>
        <VStack spacing={6} align="baseline">
          <Wrap w="full" spacing={10} align="center" justify={{ base: 'center', lg: 'initial' }}>
            <WrapItem>
              <AvatarUploadable
                size="2xl"
                photoId={profile.photo_id}
                profileId={profile.id}
                disabled={session.data.profile.id !== profile.id}
              />
            </WrapItem>
            <WrapItem>
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
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => 
                        <EditableText 
                          editMode={false}
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
                      First Name:
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Controller
                      name="first_name"
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
                      Middle Initial:
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Controller
                      name="middle_initial"
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
                      Last Name:
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Controller
                      name="last_name"
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
                      Titles:
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Controller
                      name="titles"
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
                      Honorific:
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Controller
                      name="honorific"
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
            <WrapItem>
              <RolesSection profile={profile} />
            </WrapItem>
          </Wrap>
        </VStack>
      </Card>
    </VStack>
  )
}

export default ProfileDetails
