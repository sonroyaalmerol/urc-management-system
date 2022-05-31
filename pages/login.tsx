import React from 'react'
import { getProviders, signIn, getSession, getCsrfToken } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { Button, Center, VStack, Text, chakra, Container, useToast } from '@chakra-ui/react'

import { NextSeo } from 'next-seo'

interface LoginProps {

}

const Login: React.FC<LoginProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const toast = useToast()
  const error = (props as any)?.error ?? null

  React.useEffect(() => {
    if (error) {
      if (error === 'invalid_email') {
        toast({
          position: 'bottom',
          title: 'Email not whitelisted!',
          description: 'Profile not found! Ask an administrator to add your AdDU email to the system.',
          status: 'error',
          isClosable: true
        })
      }
    }
  }, [error])

  return (
    <>
      <NextSeo
        title="Login | URC Management System"
      />
      <Center h="100vh">
        <VStack spacing={12}>
          <VStack spacing={0}>
            <chakra.img src="/urc_header_blue.png" w={{ base: '80vw', md: '40vw' }} />
            <Text fontSize="md" color="brand.blue">Management System for Council and Researchers</Text>
          </VStack>
          <VStack spacing={2}>
            <Text fontSize="sm" fontWeight="bold" color="brand.blue">AdDU Google Mail</Text>
            <Button
              leftIcon={
                <Container padding={0.5} backgroundColor="white" borderRadius={100}>
                  <chakra.img src={`${process.env.NEXT_PUBLIC_BASE_URL}/google.png`} w="16px" />
                </Container>
              }
              onClick={() => signIn('google')}
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
            <chakra.img src={`${process.env.NEXT_PUBLIC_BASE_URL}/ARISEn_Logo.png`} w={{ base: '30vw', md: '10vw' }} />
          </VStack>
        </VStack>
      </Center>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, query } = context
  const session = await getSession({ req })

  if (session) {
    return {
      redirect: {
        destination: query.redirect ?? '/dashboard',
        permanent: false
      }
    }
  }

  return {
    props: {
      error: query?.error ?? null,
      providers: await getProviders(),
      csrfToken: await getCsrfToken({ req })
    }
  }
}

export default Login