import React from 'react'
import DashboardContentHeader from '../components/DashboardContentHeader'

interface PublicationsProps {

}

const Publications: React.FC<PublicationsProps> = (props) => {
  return (
    <DashboardContentHeader>
      Hello Publications!
    </DashboardContentHeader>
  )
}

export default Publications
