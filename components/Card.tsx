import { Box } from '@chakra-ui/react'
import type { CardProps } from '../types/cardprops'

const Card: React.FC<CardProps> = (props) => {
  return (
    <Box
      w="full"
      margin='0'
      boxShadow="-5px 5px 30px -20px"
      borderRadius="10px"
      padding="1.5rem"
      {...props}
    >
      { props.children }
    </Box>
  )
}

export default Card

export type { CardProps }