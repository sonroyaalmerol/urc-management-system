import React from 'react'

import { useSession } from 'next-auth/react'
import ListTemplate from '../general/templates/ListTemplate'

interface DeadlinesProps {
  
}

const Deadlines: React.FC<DeadlinesProps> = (props) => {
  return (
    <ListTemplate
      title="Deadlines"
      loading={false}
      hasMore={false}
      loadMore={() => {}}
    >
      
    </ListTemplate>
  )
}

export default Deadlines
