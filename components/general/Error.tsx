import type { NextPage } from 'next'
import type { ErrorProps } from 'next/error'

import { useRouter } from "next/router";
import Image from "next/image";
import { Center, Heading, VStack } from "@chakra-ui/react";
import Button from './Button';

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  const router = useRouter()

  return (
    <Center marginTop="2rem">
      <VStack>
				<Image src="/error.png" alt="Error Sign" width={200} height={200} />

        <Heading
          as="span"
          variant="h5"
          color="brand.blue"
          sx={{ fontWeight: "bold" }}
        >
          Error {statusCode}
        </Heading>
				<Button onClick={() => router.back()}>
					Go Back
				</Button>
			</VStack>
    </Center>
  )
}

export default Error