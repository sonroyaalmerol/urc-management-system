import React, { ReactNode } from 'react'
import { Box, Heading, chakra } from '@chakra-ui/react'

interface DashboardContentHeaderProps {
  children?: ReactNode
}

const DashboardContentHeader: React.FC<DashboardContentHeaderProps> = (props) => {
  return (
    <chakra.main w="100%">
      <Box w='100%' h='7rem' bgImg='url(/header.png)' bgPos="right" bgSize="cover" borderRadius='10px'>
        <Box w='100%' h='100%' bgColor='rgba(0,0,0,0.5)' borderRadius='10px'>
          <Box w='100%' h='100%' color='white' padding='2rem'>
            <Heading size='md'>
              {props.children}
            </Heading>
          </Box>
        </Box>
      </Box>
    </chakra.main>
  )
}

export default DashboardContentHeader
