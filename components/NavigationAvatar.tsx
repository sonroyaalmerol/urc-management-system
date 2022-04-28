import React from 'react'
import { VStack, StackProps, Avatar, Text } from '@chakra-ui/react'

interface NavigationAvatarProps extends StackProps {
  name: string,
  imageUrl: string,
  email: string
}

const NavigationAvatar: React.FC<NavigationAvatarProps> = (props) => {
  const { name, imageUrl, email } = props

  const divProps = Object.assign({}, props)
  delete divProps.name
  delete divProps.imageUrl
  delete divProps.email

  return (
    <VStack spacing={4} {...divProps}>
      <Avatar zIndex={5} size='2xl' name={name} src={imageUrl} />
      <VStack spacing={0}>
        <Text zIndex={5} fontWeight="bold">{name}</Text>
        <Text zIndex={5} fontSize="xs" fontStyle="italic">{email}</Text>
      </VStack>
    </VStack>
  )
}

export default NavigationAvatar