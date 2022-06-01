import React from 'react'
import { VStack, StackProps, Avatar, Text, HStack, Button } from '@chakra-ui/react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

interface NavigationAvatarProps extends StackProps {
  avatarSize?: "small" | "large"
}

const NavigationAvatar: React.FC<NavigationAvatarProps> = (props) => {
  const { data: session } = useSession()

  const divProps = Object.assign({}, props)
  delete divProps.avatarSize

  const router = useRouter()

  if (props.avatarSize === 'small') {
    return (
      <HStack spacing={4} {...divProps}>
        <Avatar
          as="a"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/profiles/${session.profile.id}`}
          onClick={(e) => {
            e.preventDefault()
            router.push(`/profiles/${session.profile.id}`)
          }}
          zIndex={5}
          size={props.avatarSize === 'small' ? 'lg' : '2xl'}
          name={`${session.profile.first_name} ${session.profile.middle_initial} ${session.profile.last_name}`}
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/files/get/${session.profile.photo_id}`}
        />
        <VStack spacing={1}>
          <VStack spacing={0}>
            <Text zIndex={5} fontWeight="bold" textAlign="center">{session.profile.first_name} {session.profile.middle_initial} {session.profile.last_name}</Text>
            <Text zIndex={5} fontSize="xs" fontStyle="italic" textAlign="center">{session.user.email}</Text>
          </VStack>
          <Button color="white" variant="link" fontSize="xs" onClick={() => signOut()}>Log Out</Button>
        </VStack>
      </HStack>
    )
  }
  return (
    <VStack spacing={4} {...divProps}>
      <Avatar
        as="a"
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/profiles/${session.profile.id}`}
        onClick={(e) => {
          e.preventDefault()
          router.push(`/profiles/${session.profile.id}`)
        }}
        zIndex={5}
        size={'2xl'}
        name={`${session.profile.first_name} ${session.profile.middle_initial} ${session.profile.last_name}`}
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/files/get/${session.profile.photo_id}`}
      />
      <VStack spacing={0}>
        <Text zIndex={5} fontWeight="bold" textAlign="center">{session.profile.first_name} {session.profile.middle_initial} {session.profile.last_name}</Text>
        <Text zIndex={5} fontSize="xs" fontStyle="italic" textAlign="center">{session.user.email}</Text>
      </VStack>
    </VStack>
  )
}

export default NavigationAvatar