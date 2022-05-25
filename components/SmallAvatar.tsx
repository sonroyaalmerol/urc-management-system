import type { User, Profile } from '@prisma/client'
import { 
  Text,
  Avatar,
  HStack,
} from '@chakra-ui/react'

const SmallAvatar: React.FC<Partial<Profile & {
  user?: Partial<User>;
}>> = (props) => {
  return (
    <HStack>
      <Avatar size="xs" src={props.photo_id ? `/api/files/get/${props.photo_id}` : undefined} />
      <Text fontSize="xs" fontWeight="bold">
        {props.user?.name ?? "University Research Council"}
      </Text>
    </HStack>
  )
}

export default SmallAvatar