import { Container } from '@chakra-ui/react'
import type { CardProps } from '../types/cardprops'

const Card: React.FC<CardProps> = (props) => {
  return (
    <Container
      maxW='100vw'
      margin='0'
      boxShadow="-5px 5px 40px -15px"
      borderRadius="10px"
      padding="1.5rem"
      {...props}
    >
      { props.children }
    </Container>
  )
}

export default Card

export type { CardProps }