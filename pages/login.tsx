import { getProviders, signIn, getSession, getCsrfToken } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { Button, Center, VStack, Text, chakra, Container } from '@chakra-ui/react'

interface LoginProps {

}

const Login: React.FC<LoginProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { providers } = props

  return (
    <>
      <Center h="100vh">
        <VStack spacing={12}>
          <VStack spacing={0}>
            <chakra.img src="/urc_header_blue.png" w={{ base: '80vw', md: '40vw' }} />
            <Text fontSize="md" color="brand.blue">Management System for Council and Researchers</Text>
          </VStack>
          <VStack spacing={2}>
            <Text fontSize="sm" fontWeight="bold" color="brand.blue">AdDU {providers.google.name} Mail</Text>
            <Button
              leftIcon={
                <Container padding={0.5} backgroundColor="white" borderRadius={100}>
                  <chakra.img src="/google.png" w="16px" />
                </Container>
              }
              onClick={() => signIn(providers.google.id)}
              color="white"
              bgColor="brand.blue"
              padding="1.5rem"
              paddingX="2rem"
              borderRadius="20px"
            >
              Sign in
            </Button>
          </VStack>
          <VStack spacing={0}>
            <Text color="rgb(160, 160, 160)">Powered by</Text>
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