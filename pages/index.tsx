import React from 'react'
import DashboardContentHeader from '../components/DashboardContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { useForm } from 'react-hook-form'

interface IndexProps {

}

const Home: React.FC<IndexProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const onSubmit = async data => {
    const formData = new FormData();
    formData.append("file", data.file[0]);

    const res = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
    }).then((res) => res.json());
    alert(JSON.stringify(res.data));
  }

  return (
    <main>
      <DashboardContentHeader>
        Hello World! This website is currently under construction!
      </DashboardContentHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("file")} type="file" multiple={false}/>
        <button>Submit</button>
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
