import type { User } from '@prisma/client'
import { 
  Text,
  Avatar,
  HStack,
} from '@chakra-ui/react'

const SmallAvatar: React.FC<Partial<User>> = (props) => {
  return (
    <HStack>
      <Avatar size="xs" src={props.image} />
      <Text fontSize="xs" fontWeight="bold">
        {props.name ?? "University Research Council"}
      </Text>
    </HStack>
  )
}

export default SmallAvatar