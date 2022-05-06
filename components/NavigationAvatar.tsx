import React from 'react'
import { VStack, StackProps, Avatar, Text, HStack, Button } from '@chakra-ui/react'
import { useSession, signOut } from 'next-auth/react'

interface NavigationAvatarProps extends StackProps {
  avatarSize?: "small" | "large"
}

const NavigationAvatar: React.FC<NavigationAvatarProps> = (props) => {
  const { data: session } = useSession()

  const divProps = Object.assign({}, props)
  delete divProps.avatarSize

  if (props.avatarSize === 'small') {
    return (
      <HStack spacing={4} {...divProps}>
        <Avatar zIndex={5} size={props.avatarSize === 'small' ? 'lg' : '2xl'} name={session.user.name} src={session.user.image} />
        <VStack spacing={1}>
          <VStack spacing={0}>
            <Text zIndex={5} fontWeight="bold">{session.user.name}</Text>
            <Text zIndex={5} fontSize="xs" fontStyle="italic">{session.user.email}</Text>
          </VStack>
          <Button color="white" variant="link" fontSize="xs" onClick={() => signOut()}>Log Out</Button>
        </VStack>
      </HStack>
    )
  }
  return (
    <VStack spacing={4} {...divProps}>
      <Avatar zIndex={5} size={'2xl'} name={session.user.name} src={session.user.image} />
      <VStack spacing={0}>
        <Text zIndex={5} fontWeight="bold">{session.user.name}</Text>
        <Text zIndex={5} fontSize="xs" fontStyle="italic">{session.user.email}</Text>
      </VStack>
    </VStack>
  )
}

export default NavigationAvatar