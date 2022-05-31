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
      as={props.href ? "a" : props.onClick ? "button" : undefined}
      href={`${process.env.NEXT_PUBLIC_BASE_URL}${props.href}`}
      onClick={props.href ? (e) => {
        e.preventDefault()
        router.push(`${process.env.NEXT_PUBLIC_BASE_URL}${props.href}`)
      } : undefined}
      bgColor="brand.cardBackground"
      padding="1rem"
      borderRadius={10}
      transition="background-color 0.05s"
      _hover={props.href || props.onClick ? {
        bgColor: "brand.cardBackgroundHover"
      } : undefined}
      _active={props.href || props.onClick ? {
        bgColor: "brand.cardBackgroundActive"
      } : undefined}
      {...divProps}
    />
  )
}

export default InnerCard
