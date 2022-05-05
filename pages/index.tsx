import React from 'react'
import DashboardContentHeader from '../components/DashboardContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { useForm } from 'react-hook-form'
import sendMail from '../lib/client/send-mail'
import uploadFile from '../lib/client/upload-file'
import deleteFile from '../lib/client/delete-file'
interface IndexProps {

}

const Home: React.FC<IndexProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { register, handleSubmit } = useForm()
  const { register: registerMail, handleSubmit: handleSubmitMail } = useForm()
  const { register: registerDelete, handleSubmit: handleDelete } = useForm()
  
  const onSubmit = (data) => uploadFile(data.file[0])
  const onTestMail = (data) => sendMail(data)
  const onDelete = (data) => deleteFile(data.id)

  return (
    <main>
      <DashboardContentHeader>
        Hello World! This website is currently under construction! Testing123
      </DashboardContentHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("file")} type="file" multiple={false}/>
        <button>Submit</button>
      </form>
      <br/>
      <form onSubmit={handleSubmitMail(onTestMail)}>
        <input placeholder='to' {...registerMail("to")} type="text" />
        <input placeholder='subject' {...registerMail("subject")} type="text" />
        <input placeholder='content' {...registerMail("content")} type="text" />
        <button>Send Test Mail</button>
      </form>
      <br/>
      <form onSubmit={handleDelete(onDelete)}>
        <input placeholder='file id' {...registerDelete("id")} type="text" />
        <button>Delete file</button>
      </form>
    </main>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}

export default Home
