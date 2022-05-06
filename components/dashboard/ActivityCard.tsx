import Card from '../Card'
import type { CardProps } from '../../types/cardprops'
import { User } from '@prisma/client'
import { 
  Text, 
  VStack,
  Avatar,
  HStack,
  Tag,
  Wrap,
  WrapItem
} from '@chakra-ui/react'

interface ActivityCardProps extends CardProps {
  title: string,
  tags: { content: string, color: string }[],
  users: User[],
  action: string
}

const SmallAvatar: React.FC<User> = (props) => {
  return (
    <HStack>
      <Avatar size="xs" src={props.image} />
      <Text fontSize="xs" fontWeight="bold">
        {props.name}
      </Text>
    </HStack>
  )
}

const ActivityCard: React.FC<ActivityCardProps> = (props) => {
  const divProps = Object.assign({}, props)
  delete divProps.title
  delete divProps.tags
  delete divProps.users
  delete divProps.action

  return (
    <Card
      {...divProps}
    >
      <VStack
        align="normal"
        spacing={4}
      >
        <Wrap>
          { props.tags.map((tag) => (
            <WrapItem key={tag.content}>
              <Tag
                bgColor={tag.color}
                textColor="white"
                borderRadius="20px"
                fontSize="xs"
                fontWeight="bold"
                paddingX="0.8rem"
              >
                {tag.content}
              </Tag>
            </WrapItem>
          )) }
        </Wrap>
        
        <Wrap align="center" spacing="2">
          { props.users.map((user) => (
            <WrapItem key={user.id}>
              <SmallAvatar
                {...user}
              />
            </WrapItem>
          )) }
          <WrapItem as="span">
            <Text fontSize="xs" fontStyle="italic">
              { props.action }
            </Text>
          </WrapItem>
        </Wrap>

        <Text fontWeight="bold">
          {props.title}
        </Text>
      </VStack>
    </Card>
  )
}

export default ActivityCard