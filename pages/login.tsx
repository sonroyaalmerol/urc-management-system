import { getProviders, signIn, getSession, getCsrfToken } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { Button, Center, VStack, Text, chakra } from '@chakra-ui/react'

interface LoginProps {

}

const Login: React.FC<LoginProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { providers } = props

  return (
    <>
      <Center h="100vh">
        <VStack spacing={12}>
          <chakra.img src="/urc_header_blue.png" w={{ base: '80vw', md: '40vw' }} />
          {Object.values(providers).map((provider) => {
            return (
              <Button key={provider.id} onClick={() => signIn(provider.id)}>Sign in with {provider.name}</Button>
            )
          })}
          <VStack spacing={0}>
            <Text>Powered by</Text>
            <chakra.img src="/ARISEn_Logo.png" w={{ base: '30vw', md: '10vw' }} />
          </VStack>
        </VStack>
      </Center>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context
  const session = await getSession({ req })

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      providers: await getProviders(),
      csrfToken: await getCsrfToken({ req })
    }
  }
}

export default Login