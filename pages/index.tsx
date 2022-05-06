import React from 'react'
import ContentHeader from '../components/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack } from '@chakra-ui/react'

import ActivityCard from '../components/dashboard/ActivityCard'
interface IndexProps {

}

const Home: React.FC<IndexProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // const { register, handleSubmit } = useForm()
  // const { register: registerMail, handleSubmit: handleSubmitMail } = useForm()
  // const { register: registerDelete, handleSubmit: handleDelete } = useForm()

  /* const toast = useToast()
  
  const onSubmit = (data) => uploadFile(data.file[0])
    .then((res) => toast({ title: 'File upload success!', description: `Uploaded ${res.name}!`, status: 'success' }))
    .catch((err) => toast({ title: 'Error', description: err.message, status: 'error' }))
  const onTestMail = (data) => sendMail(data)
    .then((res) => toast({ title: 'Test mail success!', description: `Sent mail id:${res.id}!`, status: 'success' }))
    .catch((err) => toast({ title: 'Error', description: err.message, status: 'error' }))
  const onDelete = (data) => deleteFile(data.id)
    .then((res) => toast({ title: 'File deletion success!', description: `Deleted ${res.name}!`, status: 'success' }))
    .catch((err) => toast({ title: 'Error', description: err.message, status: 'error' }))

  */

  const testUsers = React.useMemo(() => {
    return JSON.parse(props.testUsers)
  }, [props.testUsers])

  return (
    <VStack spacing={5}>
      <ContentHeader>
        Activities Dashboard
      </ContentHeader>
      <ActivityCard
        title="Roosting Behavior and Roost Site Characterization of Pteropus Vampyrus in Malagos Watershed, Davao City, Philippines"
        action="approved"
        users={testUsers}
        tags={[
          {
            content: 'University Research',
            color: "brand.blue"
          }
        ]}
      />
    </VStack>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  const testUsers = await prisma.user.findMany({
    take: 3
  })

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { 
      session,
      testUsers: JSON.stringify(testUsers)
    }
  }
}

export default Home
