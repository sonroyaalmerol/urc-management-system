import React from 'react'
import ContentHeader from '../components/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { Center, HStack, Spinner, VStack, chakra } from '@chakra-ui/react'
import { usePrisma } from '../lib/client/usePrisma'

import MemoCard from '../components/dashboard/MemoCard'
import type { InstituteNews, User, FileUpload, Institute } from '@prisma/client'
import Deadlines from '../components/Deadlines'

import InfiniteScroll from 'react-infinite-scroller'

interface MemosProps {
  memos: (InstituteNews & {
    user: User;
    uploads: FileUpload[];
    institute: Institute;
  })[],
  loadMore: () => Promise<void>,
  max: Number
}

const Memos: React.FC<MemosProps> = (props) => {
  return (
    <>
      <InfiniteScroll
        pageStart={0}
        loadMore={props.loadMore}
        hasMore={props.memos.length < props.max}
        loader={
          <Center marginTop="2rem" key="infinite-scroll-load">
            <Spinner color="brand.blue" />
          </Center>
        }
        element={chakra.div}
        w="full"
      >
        { props.memos.map((memo) => (
          <MemoCard
            key={memo.id}
            memo={memo}
          />
        )) }
      </InfiniteScroll>
    </>
  )
}

interface IndexProps {

}

const Home: React.FC<IndexProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const propsMemos: (InstituteNews & {
    user: User;
    uploads: FileUpload[];
    institute: Institute;
  })[] = JSON.parse(props.memos)

  const newsPrisma = usePrisma('instituteNews')

  const [memos, setMemos] = React.useState(propsMemos)

  const onLoadNewMemo = async () => {
    const newMemos = (await newsPrisma.findMany({
      take: 5,
      skip: 1,
      cursor: {
        id: memos[memos.length - 1].id
      },
      include: {
        uploads: true,
        user: true,
        institute: true,
      }
    })) as (InstituteNews & {
      user: User;
      uploads: FileUpload[];
      institute: Institute;
    })[]

    setMemos((currMemos) => [...currMemos, ...newMemos])
  }

  return (
    <VStack spacing={5}>
      <ContentHeader>
        Dashboard
      </ContentHeader>

      {/* Mobile view */}
      <VStack w="full" display={{ base: 'initial', xl: 'none' }}>
        <Deadlines />
        <Memos memos={memos} loadMore={onLoadNewMemo} max={props.memoCount} />
      </VStack>
      
      {/* Desktop view */}
      <HStack spacing={8} alignItems="flex-start" w="full" display={{ base: 'none', xl: 'flex' }}>
        <VStack spacing={5} w="75%">
          <Memos memos={memos} loadMore={onLoadNewMemo} max={props.memoCount} />
        </VStack>
        <VStack w="25%" spacing={5}>
          <Deadlines />
        </VStack>
      </HStack>
    </VStack>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  const [memoCount, memos] = await prisma.$transaction([
    prisma.instituteNews.count(),
    prisma.instituteNews.findMany({
      include: {
        uploads: true,
        user: true,
        institute: true,
      },
      take: 5
    })
  ])

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${context.req.url}`,
        permanent: false,
      },
    }
  }

  return {
    props: { 
      session,
      memoCount: memoCount,
      memos: JSON.stringify(memos)
    }
  }
}

export default Home
