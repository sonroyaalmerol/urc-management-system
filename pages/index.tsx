import React from 'react'
import DashboardContentHeader from '../components/DashboardContentHeader'

interface IndexProps {

}

const Home: React.FC<IndexProps> = (props) => {
  return (
    <main>
      <DashboardContentHeader>
        Hello World!
      </DashboardContentHeader>
    </main>
  )
}

export default Home
