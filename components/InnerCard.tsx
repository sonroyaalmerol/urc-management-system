import React from 'react'

import { Box, BoxProps } from '@chakra-ui/react'
import { useRouter } from 'next/router'

interface InnerCardProps extends BoxProps {
  href?: string
}

const InnerCard: React.FC<InnerCardProps> = (props) => {
  const router = useRouter()
  const divProps = Object.assign({}, props)
  delete divProps.href

  return (
    <Box
      as={props.href ? "a" : undefined}
      href={props.href}
      onClick={props.href ? (e) => {
        e.preventDefault()
        router.push(props.href)
      } : undefined}
      bgColor="brand.cardBackground"
      padding="1rem"
      borderRadius={10}
      transition="background-color 0.05s"
      _hover={props.href ? {
        bgColor: "brand.cardBackgroundHover"
      } : undefined}
      _active={props.href ? {
        bgColor: "brand.cardBackgroundActive"
      } : undefined}
      {...divProps}
    />
  )
}

export default InnerCard
