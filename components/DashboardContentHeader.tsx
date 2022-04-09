import React from 'react'
import { Box } from '@chakra-ui/react'

const DashboardContentHeader: React.FC = (props) => {
  return (
    <main>
      <Box w='100%' h='11.25rem' bgImg='url(/header.png)' borderRadius='2rem'>
        <Box w='100%' h='100%' bgColor='rgba(0,0,0,0.5)' borderRadius='2rem'>
          <Box w='100%' h='100%' color='white' padding='2rem'>
            {props.children}
          </Box>
        </Box>
      </Box>
    </main>
  )
}

export default DashboardContentHeader
