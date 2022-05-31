import type { User, Profile } from '@prisma/client'
import { 
  Text,
  Avatar,
  HStack,
} from '@chakra-ui/react'

const nameGenerator = ({ first_name, middle_initial, last_name }) => {
  let tmp = ''
  if (middle_initial) {
    tmp = `${first_name ?? ''} ${middle_initial ?? ''} ${last_name ?? ''}`
  }

  tmp = `${first_name ?? ''} ${last_name ?? ''}`.trim()

  if (tmp.length > 0) {
    return tmp
  }
  return null
}

const SmallAvatar: React.FC<Partial<Profile & {
  user?: Partial<User>;
}>> = (props) => {
  return (
    <HStack>
      <Avatar size="xs" src={props.photo_id ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/files/get/${props.photo_id}` : undefined} />
      <Text fontSize="xs" fontWeight="bold">
        {nameGenerator({ 
          first_name: props.first_name, 
          middle_initial: props.middle_initial, 
          last_name: props.last_name 
        }) ?? "University Research Council"}
      </Text>
    </HStack>
  )
}

export default SmallAvatar